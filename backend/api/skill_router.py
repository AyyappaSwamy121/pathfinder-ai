from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.schemas.pydantic_models import SkillSchema, SkillGapAnalysisResponse
from backend.models.domain import Skill, SkillPrerequisite
from backend.services.skill_gap_engine import SkillGapEngine
from backend.seed.seed_data import DEMO_PROFILE_ID

router = APIRouter(prefix="/api/skills", tags=["Skills & Knowledge Graph"])

@router.get("", response_model=List[SkillSchema])
def get_all_skills(db: Session = Depends(get_db)):
    """Fetch all skills in the knowledge graph."""
    skills = db.query(Skill).all()
    prereqs = db.query(SkillPrerequisite).all()
    prereq_map = {}
    for p in prereqs:
        prereq_map.setdefault(p.skill_id, []).append(p.prerequisite_id)

    res = []
    for s in skills:
        res.append(
            SkillSchema(
                id=s.id,
                name=s.name,
                category=s.category,
                description=s.description,
                difficulty=s.difficulty,
                prerequisite_ids=prereq_map.get(s.id, [])
            )
        )
    return res

@router.get("/gaps", response_model=SkillGapAnalysisResponse)
def get_skill_gaps(db: Session = Depends(get_db)):
    """Analyze skill gaps for the demo learner."""
    analysis = SkillGapEngine.analyze_gaps(db, DEMO_PROFILE_ID)
    return analysis
