from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from backend.models.domain import LearnerProfile, Career, CareerSkill, SkillPrerequisite, LearnerSkill, Skill

class SkillGapEngine:

    @staticmethod
    def analyze_gaps(db: Session, profile_id: str, career_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Deterministic Skill Gap Analysis.
        Compares learner profile skills against career required skills.
        Determines state for each skill: MASTERED, DEVELOPING, MISSING, LOCKED, RECOMMENDED.
        """
        profile = db.query(LearnerProfile).filter(LearnerProfile.id == profile_id).first()
        if not profile:
            raise ValueError("Learner profile not found")

        target_career_id = career_id or profile.target_career_id or "c_ai_engineer"
        career = db.query(Career).filter(Career.id == target_career_id).first()
        if not career:
            raise ValueError("Target career not found")

        # Map of learner's skills
        learner_skills_query = db.query(LearnerSkill).filter(LearnerSkill.profile_id == profile_id).all()
        learner_skill_map = {ls.skill_id: ls for ls in learner_skills_query}

        # Career required skills
        career_skills = db.query(CareerSkill).filter(CareerSkill.career_id == target_career_id).all()
        
        # Skill prerequisite map (skill_id -> list of prerequisite_ids)
        prereqs_query = db.query(SkillPrerequisite).all()
        prereq_map = {}
        for p in prereqs_query:
            prereq_map.setdefault(p.skill_id, []).append(p.prerequisite_id)

        mastered = []
        developing = []
        missing = []
        locked = []
        recommended = []

        total_required = len(career_skills)
        if total_required == 0:
            total_required = 1

        mastered_count = 0
        developing_count = 0
        prereq_satisfied_count = 0
        total_prereqs_checked = 0

        for cs in career_skills:
            skill = db.query(Skill).filter(Skill.id == cs.skill_id).first()
            if not skill:
                continue

            ls = learner_skill_map.get(cs.skill_id)
            prereqs = prereq_map.get(cs.skill_id, [])

            # Check if all prerequisites are mastered or developing
            all_prereqs_met = True
            for pr_id in prereqs:
                total_prereqs_checked += 1
                pr_ls = learner_skill_map.get(pr_id)
                if pr_ls and pr_ls.status in ["MASTERED", "DEVELOPING"]:
                    prereq_satisfied_count += 1
                else:
                    all_prereqs_met = False

            item = {
                "skill_id": skill.id,
                "name": skill.name,
                "category": skill.category,
                "proficiency": ls.proficiency if ls else "None",
                "confidence": ls.confidence if ls else "Low",
                "evidence": ls.evidence if ls else None
            }

            if ls and ls.status == "MASTERED":
                item["status"] = "MASTERED"
                mastered.append(item)
                mastered_count += 1
            elif ls and ls.status == "DEVELOPING":
                item["status"] = "DEVELOPING"
                developing.append(item)
                developing_count += 0.5
            elif not all_prereqs_met:
                item["status"] = "LOCKED"
                locked.append(item)
            else:
                item["status"] = "MISSING"
                missing.append(item)

        # Flag first available missing skill with all prerequisites met as RECOMMENDED
        if missing:
            missing[0]["status"] = "RECOMMENDED"
            recommended.append(missing[0])

        # Compute Readiness Score Formula
        # (0.5 * mastered_ratio + 0.3 * developing_contribution + 0.2 * prerequisite_completion) * 100
        mastered_ratio = mastered_count / total_required
        developing_contrib = (len(developing) * 0.5) / total_required
        prereq_ratio = (prereq_satisfied_count / total_prereqs_checked) if total_prereqs_checked > 0 else 1.0

        readiness_score = round(
            (0.5 * mastered_ratio + 0.3 * developing_contrib + 0.2 * prereq_ratio) * 100, 1
        )
        readiness_score = max(5.0, min(98.0, readiness_score))

        # Update profile readiness score in DB
        profile.readiness_score = readiness_score
        db.commit()

        return {
            "target_career": career.title,
            "readiness_score": readiness_score,
            "mastered": mastered,
            "developing": developing,
            "missing": missing,
            "locked": locked,
            "recommended": recommended
        }
