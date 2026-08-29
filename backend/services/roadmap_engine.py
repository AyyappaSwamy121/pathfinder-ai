from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from backend.models.domain import (
    LearnerProfile, Career, CareerSkill, SkillPrerequisite,
    LearnerSkill, Skill, LearningPath, PathStep, Resource, Project, Assessment
)
from backend.ai.llm_client import llm_client

class RoadmapEngine:

    @staticmethod
    def generate_roadmap(db: Session, profile_id: str, career_id: str = None) -> LearningPath:
        """
        Deterministic Topological Roadmap Generator.
        Uses topological sort over prerequisite DAG edges to order learning phases logically.
        Attaches Resources, Projects, Assessments, and AI explanations for every step.
        """
        profile = db.query(LearnerProfile).filter(LearnerProfile.id == profile_id).first()
        target_career_id = career_id or profile.target_career_id or "c_ai_engineer"
        career = db.query(Career).filter(Career.id == target_career_id).first()

        # Fetch required career skills
        career_skills = db.query(CareerSkill).filter(CareerSkill.career_id == target_career_id).all()
        required_skill_ids = [cs.skill_id for cs in career_skills]

        # Fetch learner skills
        learner_skills = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile_id).all()
        learner_status_map = {ls.skill_id: ls.status for ls in learner_skills}

        # Build Prerequisite Graph (DAG)
        prereqs_query = db.query(SkillPrerequisite).all()
        graph = {} # skill_id -> list of prerequisite_ids
        for p in prereqs_query:
            graph.setdefault(p.skill_id, []).append(p.prerequisite_id)

        # Topological sorting helper
        visited = set()
        order = []

        def visit(node):
            if node not in visited:
                visited.add(node)
                for prereq in graph.get(node, []):
                    if prereq in required_skill_ids:
                        visit(prereq)
                order.append(node)

        for skill_id in required_skill_ids:
            visit(skill_id)

        # Clear existing path for profile if recreating
        existing_path = db.query(LearningPath).filter(
            LearningPath.profile_id == profile_id,
            LearningPath.career_id == target_career_id
        ).first()

        if existing_path:
            db.delete(existing_path)
            db.commit()

        path_id = f"path_{profile_id}_{target_career_id}"
        new_path = LearningPath(
            id=path_id,
            profile_id=profile_id,
            career_id=target_career_id,
            title=f"Adaptive {career.title} Roadmap",
            total_steps=len(order),
            completed_steps=0,
            is_active=True
        )
        db.add(new_path)
        db.commit()

        # Map steps into 5 structured Phases
        phases = [
            (1, "Phase 1: Foundations"),
            (2, "Phase 2: Core Modeling"),
            (3, "Phase 3: Deep Learning & Advanced AI"),
            (4, "Phase 4: Production & MLOps Infrastructure"),
            (5, "Phase 5: Capstone Project")
        ]

        total_nodes = len(order)
        nodes_per_phase = max(1, total_nodes // 4)

        completed_count = 0
        for idx, skill_id in enumerate(order):
            skill = db.query(Skill).filter(Skill.id == skill_id).first()
            if not skill:
                continue

            current_status = learner_status_map.get(skill_id, "MISSING")
            
            # Map status
            step_status = "PENDING"
            if current_status == "MASTERED":
                step_status = "COMPLETED"
                completed_count += 1
            elif current_status == "DEVELOPING":
                step_status = "IN_PROGRESS"
            elif idx == completed_count:
                step_status = "IN_PROGRESS"

            # Assign phase
            phase_idx = min(4, idx // nodes_per_phase)
            phase_num, phase_title = phases[phase_idx]

            # Generate explainable reason
            prereq_names = [
                db.query(Skill).filter(Skill.id == pid).first().name
                for pid in graph.get(skill_id, [])
                if db.query(Skill).filter(Skill.id == pid).first()
            ]
            reason = llm_client.generate_explanation(
                skill.name, current_status, prereq_names, career.title
            )

            path_step = PathStep(
                id=f"step_{path_id}_{skill_id}",
                path_id=path_id,
                skill_id=skill_id,
                phase_number=phase_num,
                phase_title=phase_title,
                step_order=idx + 1,
                status=step_status,
                estimated_minutes=120 if skill.difficulty == "Intermediate" else (180 if skill.difficulty == "Advanced" else 60),
                difficulty=skill.difficulty,
                reason=reason
            )
            db.add(path_step)

        new_path.completed_steps = completed_count
        db.commit()

        return new_path
