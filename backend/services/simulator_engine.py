from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.models.domain import (
    LearnerProfile, Career, CareerSkill, LearnerSkill, Skill, Project
)

class SimulatorEngine:

    @staticmethod
    def simulate_career_transition(db: Session, profile_id: str, target_career_id: str) -> Dict[str, Any]:
        """
        What-If Career Simulator Engine.
        Compares learner's current skills against a prospective career target.
        Calculates skill overlap %, shared skills, missing skills, and estimated additional learning effort weeks.
        """
        profile = db.query(LearnerProfile).filter(LearnerProfile.id == profile_id).first()
        current_career_id = profile.target_career_id or "c_ai_engineer"

        target_career = db.query(Career).filter(Career.id == target_career_id).first()
        if not target_career:
            raise ValueError("Target career not found")

        # Learner's current mastered or developing skills
        learner_skills = db.query(LearnerSkill).filter(
            LearnerSkill.profile_id == profile_id,
            LearnerSkill.status.in_(["MASTERED", "DEVELOPING"])
        ).all()
        learner_skill_ids = set(ls.skill_id for ls in learner_skills)

        # Prospective target career skills
        target_skills_query = db.query(CareerSkill).filter(CareerSkill.career_id == target_career_id).all()
        target_skill_ids = set(cs.skill_id for cs in target_skills_query)

        shared_skill_ids = learner_skill_ids.intersection(target_skill_ids)
        new_required_ids = target_skill_ids.difference(learner_skill_ids)

        overlap_pct = (len(shared_skill_ids) / len(target_skill_ids) * 100) if target_skill_ids else 0.0

        shared_names = [
            db.query(Skill).filter(Skill.id == sid).first().name
            for sid in shared_skill_ids
            if db.query(Skill).filter(Skill.id == sid).first()
        ]

        new_skill_names = [
            db.query(Skill).filter(Skill.id == sid).first().name
            for sid in new_required_ids
            if db.query(Skill).filter(Skill.id == sid).first()
        ]

        # Estimate effort weeks based on weekly hours
        hours_per_week = profile.weekly_hours or 8
        total_missing_hours = len(new_required_ids) * 12 # avg 12 hours per skill
        est_weeks = max(2, round(total_missing_hours / hours_per_week))

        # Recommended projects for transition
        rec_projects = []
        for sid in new_required_ids:
            proj = db.query(Project).filter(Project.skill_id == sid).first()
            if proj:
                rec_projects.append(proj.title)
        if not rec_projects:
            rec_projects = ["Capstone Portfolio Project"]

        return {
            "current_career_id": current_career_id,
            "target_career_id": target_career_id,
            "target_career_title": target_career.title,
            "skill_overlap_percentage": round(overlap_pct, 1),
            "shared_skills": shared_names,
            "new_skills_required": new_skill_names,
            "estimated_additional_weeks": est_weeks,
            "recommended_projects": rec_projects[:3]
        }
