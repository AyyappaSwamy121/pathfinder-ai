from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.schemas.pydantic_models import (
    CareerSchema, CareerDetailSchema, SimulateCareerRequest, SimulateCareerResponse,
    CareerComparisonRequest, CareerComparisonResponse
)
from backend.models.domain import Career, CareerSkill, Skill
from backend.services.simulator_engine import SimulatorEngine
from backend.api.auth_router import get_current_profile_id

from backend.api.auth_router import get_current_user_optional
from backend.models.domain import User

router = APIRouter(prefix="/api/careers", tags=["Careers"])

@router.get("", response_model=List[CareerSchema])
def get_all_careers(db: Session = Depends(get_db)):
    """Fetch all careers in the career knowledge base."""
    careers = db.query(Career).all()
    result = []
    for c in careers:
        count = db.query(CareerSkill).filter(CareerSkill.career_id == c.id).count()
        result.append(
            CareerSchema(
                id=c.id,
                title=c.title,
                description=c.description,
                icon=c.icon,
                category=c.category,
                required_skills_count=count
            )
        )
    return result

@router.get("/{career_id}", response_model=CareerDetailSchema)
def get_career_detail(career_id: str, db: Session = Depends(get_db)):
    """Fetch details for a specific career target."""
    career = db.query(Career).filter(Career.id == career_id).first()
    if not career:
        raise HTTPException(status_code=404, detail="Career not found")

    skills_query = db.query(CareerSkill).filter(CareerSkill.career_id == career_id).all()
    req_skills = []
    for cs in skills_query:
        skill = db.query(Skill).filter(Skill.id == cs.skill_id).first()
        if skill:
            req_skills.append({
                "skill_id": skill.id,
                "name": skill.name,
                "category": skill.category,
                "required_proficiency": cs.required_proficiency,
                "importance_weight": cs.importance_weight
            })

    return CareerDetailSchema(
        id=career.id,
        title=career.title,
        description=career.description,
        icon=career.icon,
        category=career.category,
        required_skills_count=len(req_skills),
        required_skills=req_skills
    )

@router.post("/simulate", response_model=SimulateCareerResponse)
def simulate_career(
    req: SimulateCareerRequest,
    db: Session = Depends(get_db),
    profile_id: str = Depends(get_current_profile_id)
):
    """What-if Career Simulator endpoint."""
    res = SimulatorEngine.simulate_career_transition(db, profile_id, req.target_career_id)
    return res

@router.post("/compare", response_model=CareerComparisonResponse)
def compare_careers(
    req: CareerComparisonRequest,
    db: Session = Depends(get_db),
    profile_id: str = Depends(get_current_profile_id)
):
    """Compare two career targets side by side."""
    user, profile_id = user_and_pid
    ca = db.query(Career).filter(Career.id == req.career_id_a).first()
    cb = db.query(Career).filter(Career.id == req.career_id_b).first()
    if not ca or not cb:
        raise HTTPException(status_code=404, detail="One or both careers not found")

    res_a = SimulatorEngine.simulate_career_transition(db, profile_id, req.career_id_a)
    res_b = SimulatorEngine.simulate_career_transition(db, profile_id, req.career_id_b)

    shared = list(set(res_a["shared_skills"]).intersection(set(res_b["shared_skills"])))

    return CareerComparisonResponse(
        career_a=CareerSchema(id=ca.id, title=ca.title, description=ca.description, icon=ca.icon, category=ca.category),
        career_b=CareerSchema(id=cb.id, title=cb.title, description=cb.description, icon=cb.icon, category=cb.category),
        readiness_a=res_a["skill_overlap_percentage"],
        readiness_b=res_b["skill_overlap_percentage"],
        effort_weeks_a=res_a["estimated_additional_weeks"],
        effort_weeks_b=res_b["estimated_additional_weeks"],
        shared_skills=shared
    )
