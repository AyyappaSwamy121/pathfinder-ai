from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.schemas.pydantic_models import (
    ProfileAnalyzeRequest, ProfileExtractResponse, ProfileUpdateRequest, LearnerProfileSchema
)
from backend.models.domain import LearnerProfile, LearnerSkill, Skill, User
from backend.ai.llm_client import llm_client
from backend.services.skill_gap_engine import SkillGapEngine
from backend.services.roadmap_engine import RoadmapEngine
from backend.api.auth_router import get_current_profile_id, get_current_user_id

from backend.api.auth_router import get_current_user_optional

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.post("/analyze", response_model=ProfileExtractResponse)
def analyze_profile(req: ProfileAnalyzeRequest):
    """Layer 1: NLP Profile Extraction from conversational onboarding text."""
    if not req.natural_language_input.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty")
    
    extracted = llm_client.parse_learner_profile(req.natural_language_input)
    return extracted

@router.get("/current", response_model=LearnerProfileSchema)
def get_current_profile(
    db: Session = Depends(get_db),
    profile_id: str = Depends(get_current_profile_id)
):
    """Fetch current authenticated learner profile."""
    profile = db.query(LearnerProfile).filter(LearnerProfile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Learner profile not found")
    return profile

@router.post("/update")
def update_profile(
    req: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    profile_id: str = Depends(get_current_profile_id),
    user_id: str = Depends(get_current_user_id)
):
    """Update profile preferences, target career, and extracted skills."""
    profile = db.query(LearnerProfile).filter(LearnerProfile.id == profile_id).first()
    if not profile:
        profile = LearnerProfile(id=profile_id, user_id=user_id)
        db.add(profile)

    profile.target_career_id = req.target_career_id
    profile.experience_level = req.experience_level
    profile.weekly_hours = req.weekly_hours
    profile.timeline_months = req.timeline_months
    profile.learning_preference = req.learning_preference



    # Sync skills
    for item in req.skills:
        skill_obj = db.query(Skill).filter(Skill.name.ilike(f"%{item.name}%")).first()
        if skill_obj:
            ls = db.query(LearnerSkill).filter(
                LearnerSkill.profile_id == profile_id,
                LearnerSkill.skill_id == skill_obj.id
            ).first()
            if not ls:
                ls = LearnerSkill(
                    id=f"ls_{profile_id}_{skill_obj.id}",
                    profile_id=profile_id,
                    skill_id=skill_obj.id
                )
                db.add(ls)
            ls.proficiency = item.level
            ls.status = "MASTERED" if item.level in ["Intermediate", "Advanced"] else "DEVELOPING"
            ls.confidence = "High" if item.level == "Advanced" else "Medium"

    db.commit()

    # Trigger gap analysis and roadmap generation
    SkillGapEngine.analyze_gaps(db, profile_id)
    RoadmapEngine.generate_roadmap(db, profile_id)

    return {"status": "success", "message": "Profile updated and path generated successfully"}
