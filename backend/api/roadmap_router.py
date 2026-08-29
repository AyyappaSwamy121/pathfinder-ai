from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.schemas.pydantic_models import LearningPathSchema, PathStepSchema, ResourceSchema, ProjectSchema
from backend.models.domain import LearningPath, PathStep, Skill, Career, Resource, Project, Assessment
from backend.services.roadmap_engine import RoadmapEngine
from backend.seed.seed_data import DEMO_PROFILE_ID

router = APIRouter(prefix="/api/paths", tags=["Roadmap"])

@router.get("/current", response_model=LearningPathSchema)
def get_current_path(db: Session = Depends(get_db)):
    """Fetch current active learning roadmap path for demo user."""
    path = db.query(LearningPath).filter(
        LearningPath.profile_id == DEMO_PROFILE_ID,
        LearningPath.is_active == True
    ).first()

    if not path:
        # Generate default path
        path = RoadmapEngine.generate_roadmap(db, DEMO_PROFILE_ID)

    career = db.query(Career).filter(Career.id == path.career_id).first()
    steps_query = db.query(PathStep).filter(PathStep.path_id == path.id).order_by(PathStep.step_order).all()

    formatted_steps = []
    for step in steps_query:
        skill = db.query(Skill).filter(Skill.id == step.skill_id).first()
        res_list = db.query(Resource).filter(Resource.skill_id == step.skill_id).all()
        proj = db.query(Project).filter(Project.skill_id == step.skill_id).first()
        asm = db.query(Assessment).filter(Assessment.skill_id == step.skill_id).first()

        resources_schema = [
            ResourceSchema.from_orm(r) for r in res_list
        ]
        project_schema = ProjectSchema.from_orm(proj) if proj else None

        formatted_steps.append(
            PathStepSchema(
                id=step.id,
                skill_id=step.skill_id,
                skill_name=skill.name if skill else step.skill_id,
                phase_number=step.phase_number,
                phase_title=step.phase_title,
                step_order=step.step_order,
                status=step.status,
                estimated_minutes=step.estimated_minutes,
                difficulty=step.difficulty,
                reason=step.reason,
                resources=resources_schema,
                project=project_schema,
                assessment_id=asm.id if asm else None
            )
        )

    return LearningPathSchema(
        id=path.id,
        profile_id=path.profile_id,
        career_id=path.career_id,
        career_title=career.title if career else "Target Career",
        total_steps=path.total_steps,
        completed_steps=path.completed_steps,
        is_active=path.is_active,
        steps=formatted_steps
    )

@router.post("/generate", response_model=LearningPathSchema)
def generate_path(db: Session = Depends(get_db)):
    """Regenerate learning path topologically."""
    path = RoadmapEngine.generate_roadmap(db, DEMO_PROFILE_ID)
    return get_current_path(db)
