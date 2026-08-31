from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.schemas.pydantic_models import (
    AssessmentDetailSchema, QuestionSchema, AssessmentEvaluateRequest, AssessmentEvaluateResponse,
    FeedbackSubmitRequest, FeedbackSubmitResponse
)
from backend.models.domain import Assessment, Skill
from backend.services.adaptive_engine import AdaptiveLearningEngine
from backend.api.auth_router import get_current_profile_id

from backend.api.auth_router import get_current_user_optional
from backend.models.domain import User

router = APIRouter(tags=["Assessments & Feedback"])

@router.get("/api/assessment/{assessment_id}", response_model=AssessmentDetailSchema)
def get_assessment(assessment_id: str, db: Session = Depends(get_db)):
    """Fetch assessment detail with multiple choice questions."""
    asm = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not asm:
        asm = db.query(Assessment).first()
        if not asm:
            raise HTTPException(status_code=404, detail="No assessment found")

    skill = db.query(Skill).filter(Skill.id == asm.skill_id).first()
    questions_schema = [
        QuestionSchema(
            id=q.id,
            question_text=q.question_text,
            options=q.options
        )
        for q in asm.questions
    ]

    return AssessmentDetailSchema(
        id=asm.id,
        skill_id=asm.skill_id,
        skill_name=skill.name if skill else asm.skill_id,
        title=asm.title,
        description=asm.description,
        questions=questions_schema
    )

@router.post("/api/assessment/evaluate", response_model=AssessmentEvaluateResponse)
def evaluate_assessment(
    req: AssessmentEvaluateRequest,
    db: Session = Depends(get_db),
    profile_id: str = Depends(get_current_profile_id)
):
    """Submit assessment answers and receive score, feedback, and adaptive roadmap updates."""
    user, profile_id = user_and_pid
    res = AdaptiveLearningEngine.process_assessment_result(
        db, profile_id, req.assessment_id, req.answers
    )
    return res

@router.post("/api/feedback", response_model=FeedbackSubmitResponse)
def submit_feedback(
    req: FeedbackSubmitRequest,
    db: Session = Depends(get_db),
    profile_id: str = Depends(get_current_profile_id)
):
    """Submit 5-tier confidence feedback (Struggling, Need Practice, Comfortable, Confident, Too Easy)."""
    user, profile_id = user_and_pid
    res = AdaptiveLearningEngine.process_feedback(
        db, profile_id, req.skill_id, req.sentiment, req.comment
    )
    return res
