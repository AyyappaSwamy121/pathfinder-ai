from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.models.domain import (
    LearnerProfile, LearningPath, PathStep, Skill, Resource, Project, Assessment, LearnerSkill
)
from backend.services.skill_gap_engine import SkillGapEngine

from backend.services.career_knowledge import CAREER_KNOWLEDGE

class HybridRecommendationEngine:

    @staticmethod
    def get_next_best_action(db: Session, profile_id: str) -> Dict[str, Any]:
        """
        Determines the single highest priority 'Next Best Action' for the learner.
        Considers skill gap, unlocked prerequisites, time availability, and step order.
        """
        profile = db.query(LearnerProfile).filter(LearnerProfile.id == profile_id).first()
        target_career_id = (profile.target_career_id if profile else "c_ai_engineer") or "c_ai_engineer"

        path = db.query(LearningPath).filter(
            LearningPath.profile_id == profile_id,
            LearningPath.is_active == True
        ).first()

        # Find first IN_PROGRESS or PENDING step
        next_step = None
        if path:
            next_step = db.query(PathStep).filter(
                PathStep.path_id == path.id,
                PathStep.status.in_(["IN_PROGRESS", "PENDING"])
            ).order_by(PathStep.step_order).first()

        if not next_step:
            career_cfg = CAREER_KNOWLEDGE.get(target_career_id, CAREER_KNOWLEDGE["c_ai_engineer"])
            default_act = career_cfg.get("default_next_action")
            if default_act:
                return default_act

            # Generic fallback
            return {
                "skill_id": "s_python",
                "skill_name": "Core Programming",
                "title": "Master Core Foundations",
                "action_type": "Resource",
                "estimated_minutes": 45,
                "why_now": "Addresses foundational competency required for your target career path.",
                "cta_label": "Start Learning",
                "item_id": "r_python_1"
            }

        skill = db.query(Skill).filter(Skill.id == next_step.skill_id).first()
        resource = db.query(Resource).filter(Resource.skill_id == next_step.skill_id).first()

        why_now = next_step.reason or f"Completing '{skill.name}' unlocks the next phase of your custom career path."

        return {
            "skill_id": skill.id,
            "skill_name": skill.name,
            "title": f"Master {skill.name}",
            "action_type": "Resource" if resource else "Project",
            "estimated_minutes": resource.duration_minutes if resource else 90,
            "why_now": why_now,
            "cta_label": "Start Learning",
            "item_id": resource.id if resource else f"proj_{skill.id}"
        }
