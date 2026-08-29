from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.schemas.pydantic_models import (
    ProfileAnalyzeRequest, ProfileExtractResponse, ProfileUpdateRequest, LearnerProfileSchema
)
from backend.models.domain import LearnerProfile, LearnerSkill, Skill, User
from backend.ai.llm_client import llm_client
from backend.seed.seed_data import DEMO_PROFILE_ID, DEMO_USER_ID
from backend.services.skill_gap_engine import SkillGapEngine
from backend.services.roadmap_engine import RoadmapEngine

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.post("/analyze", response_model=ProfileExtractResponse)
def analyze_profile(req: ProfileAnalyzeRequest):
    """Layer 1: NLP Profile Extraction from conversational onboarding text."""
    if not req.natural_language_input.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty")
    
    extracted = llm_client.parse_learner_profile(req.natural_language_input)
    return extracted

@router.get("/current", response_model=LearnerProfileSchema)
def get_current_profile(db: Session = Depends(get_db)):
    """Fetch current demo learner profile."""
    profile = db.query(LearnerProfile).filter(LearnerProfile.id == DEMO_PROFILE_ID).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Demo profile not found")
    return profile

@router.post("/update")
def update_profile(req: ProfileUpdateRequest, db: Session = Depends(get_db)):
    """Update profile preferences, target career, and extracted skills."""
    profile = db.query(LearnerProfile).filter(LearnerProfile.id == DEMO_PROFILE_ID).first()
    if not profile:
        profile = LearnerProfile(id=DEMO_PROFILE_ID, user_id=DEMO_USER_ID)
        db.add(profile)

    profile.target_career_id = req.target_career_id
    profile.experience_level = req.experience_level
    profile.weekly_hours = req.weekly_hours
    profile.timeline_months = req.timeline_months
    profile.learning_preference = req.learning_preference

    # Sync skills
    for item in req.skills:
        # Find matching skill
        skill_obj = db.query(Skill).filter(Skill.name.ilike(f"%{item.name}%")).first()
        if skill_obj:
            ls = db.query(LearnerSkill).filter(
                LearnerSkill.profile_id == DEMO_PROFILE_ID,
                LearnerSkill.skill_id == skill_obj.id
            ).first()
            if not ls:
                ls = LearnerSkill(
                    id=f"ls_{DEMO_PROFILE_ID}_{skill_obj.id}",
                    profile_id=DEMO_PROFILE_ID,
                    skill_id=skill_obj.id
                )
                db.add(ls)
            ls.proficiency = item.level
            ls.status = "MASTERED" if item.level in ["Intermediate", "Advanced"] else "DEVELOPING"
            ls.confidence = "High" if item.level == "Advanced" else "Medium"

    db.commit()

    # Trigger gap analysis and roadmap generation
    SkillGapEngine.analyze_gaps(db, DEMO_PROFILE_ID)
    RoadmapEngine.generate_roadmap(db, DEMO_PROFILE_ID)

    return {"status": "success", "message": "Profile updated and path generated successfully"}
