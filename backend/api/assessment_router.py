from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.schemas.pydantic_models import (
    AssessmentDetailSchema, QuestionSchema, AssessmentEvaluateRequest, AssessmentEvaluateResponse,
    FeedbackSubmitRequest, FeedbackSubmitResponse
)
from backend.models.domain import Assessment, Skill
from backend.services.adaptive_engine import AdaptiveLearningEngine
from backend.seed.seed_data import DEMO_PROFILE_ID

router = APIRouter(tags=["Assessments & Feedback"])

@router.get("/api/assessment/{assessment_id}", response_model=AssessmentDetailSchema)
def get_assessment(assessment_id: str, db: Session = Depends(get_db)):
    """Fetch assessment detail with multiple choice questions."""
    asm = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not asm:
        # Fallback to first available assessment if not found
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
def evaluate_assessment(req: AssessmentEvaluateRequest, db: Session = Depends(get_db)):
    """Submit assessment answers and receive score, feedback, and adaptive roadmap updates."""
    res = AdaptiveLearningEngine.process_assessment_result(
        db, DEMO_PROFILE_ID, req.assessment_id, req.answers
    )
    return res

@router.post("/api/feedback", response_model=FeedbackSubmitResponse)
def submit_feedback(req: FeedbackSubmitRequest, db: Session = Depends(get_db)):
    """Submit 5-tier confidence feedback (Struggling, Need Practice, Comfortable, Confident, Too Easy)."""
    res = AdaptiveLearningEngine.process_feedback(
        db, DEMO_PROFILE_ID, req.skill_id, req.sentiment, req.comment
    )
    return res
