from typing import Dict, Any
from sqlalchemy.orm import Session
from backend.models.domain import LearnerProfile, Career, ChatMessage
from backend.services.skill_gap_engine import SkillGapEngine
from backend.services.recommendation_engine import HybridRecommendationEngine
from backend.ai.llm_client import llm_client

class CopilotEngine:

    @staticmethod
    def answer_query(db: Session, profile_id: str, user_message: str) -> Dict[str, Any]:
        """
        RAG-Lite Grounded Copilot.
        Assembles live profile, readiness, gaps, and next action, then invokes LLM Client.
        """
        profile = db.query(LearnerProfile).filter(LearnerProfile.id == profile_id).first()
        career = db.query(Career).filter(Career.id == profile.target_career_id).first() if profile else None

        gaps = SkillGapEngine.analyze_gaps(db, profile_id)
        next_action = HybridRecommendationEngine.get_next_best_action(db, profile_id)

        context = {
            "target_career": career.title if career else "AI Engineer",
            "readiness_score": gaps.get("readiness_score", 64.0),
            "missing_skills": [s["name"] for s in gaps.get("missing", [])],
            "next_action": next_action
        }

        # Save user message
        msg_user = ChatMessage(
            id=f"msg_u_{profile_id}_{int(db.query(ChatMessage).count() + 1)}",
            profile_id=profile_id,
            sender="user",
            message=user_message
        )
        db.add(msg_user)
        db.commit()

        # Call AI LLM Client
        response_data = llm_client.copilot_chat(user_message, context)

        # Save AI reply
        msg_ai = ChatMessage(
            id=f"msg_ai_{profile_id}_{int(db.query(ChatMessage).count() + 1)}",
            profile_id=profile_id,
            sender="ai",
            message=response_data["reply"]
        )
        db.add(msg_ai)
        db.commit()

        return response_data
