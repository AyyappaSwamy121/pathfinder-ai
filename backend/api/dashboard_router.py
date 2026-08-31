from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.schemas.pydantic_models import DashboardResponse, CareerSchema, LearnerProfileSchema, NextBestActionSchema
from backend.models.domain import LearnerProfile, Career, LearningPath, PathStep
from backend.services.skill_gap_engine import SkillGapEngine
from backend.services.recommendation_engine import HybridRecommendationEngine
from backend.services.roadmap_engine import RoadmapEngine
from backend.seed.seed_data import DEMO_PROFILE_ID

from backend.api.auth_router import get_current_user_optional
from backend.models.domain import User

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    user_and_pid: tuple[User, str] = Depends(get_current_user_optional)
):
    """Fetch complete learner dashboard data including readiness, next best action, gaps, and roadmap stats."""
    user, profile_id = user_and_pid
    profile = db.query(LearnerProfile).filter(LearnerProfile.id == profile_id).first()
    if not profile:
        profile = LearnerProfile(id=profile_id, user_id=user.id if user else DEMO_PROFILE_ID)
        db.add(profile)
        db.commit()

    target_career_id = profile.target_career_id or "c_ai_engineer"
    career = db.query(Career).filter(Career.id == target_career_id).first()
    if not career:
        career = db.query(Career).filter(Career.id == "c_ai_engineer").first()

    # Gap Analysis
    gaps = SkillGapEngine.analyze_gaps(db, profile_id)

    # Next Best Action
    next_action = HybridRecommendationEngine.get_next_best_action(db, profile_id)

    # Roadmap Progress
    path = db.query(LearningPath).filter(
        LearningPath.profile_id == profile_id,
        LearningPath.is_active == True
    ).first()

    if not path:
        path = RoadmapEngine.generate_roadmap(db, profile_id)

    completed_cnt = db.query(PathStep).filter(PathStep.path_id == path.id, PathStep.status == "COMPLETED").count()
    total_cnt = db.query(PathStep).filter(PathStep.path_id == path.id).count()

    career_title = career.title if career else "AI Engineer"
    ai_insight = f"Your next milestone '{next_action['skill_name']}' is unlocked and addresses a critical requirement for your target goal as an {career_title}."

    return DashboardResponse(
        profile=LearnerProfileSchema.from_orm(profile),
        target_career=CareerSchema(
            id=career.id if career else "c_ai_engineer",
            title=career.title if career else "AI Engineer",
            description=career.description if career else "Build AI systems",
            icon=career.icon if career else "Cpu",
            category=career.category if career else "Engineering"
        ),
        readiness_score=profile.readiness_score,
        next_best_action=NextBestActionSchema(
            skill_id=next_action["skill_id"],
            skill_name=next_action["skill_name"],
            title=next_action["title"],
            action_type=next_action["action_type"],
            estimated_minutes=next_action["estimated_minutes"],
            why_now=next_action["why_now"],
            cta_label=next_action["cta_label"],
            item_id=next_action["item_id"]
        ),
        milestones_completed=completed_cnt,
        milestones_total=total_cnt,
        skill_gaps=gaps,
        ai_insight=ai_insight
    )
