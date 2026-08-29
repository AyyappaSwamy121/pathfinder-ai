from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.schemas.pydantic_models import ChatRequest, ChatResponse
from backend.services.copilot_engine import CopilotEngine
from backend.seed.seed_data import DEMO_PROFILE_ID

router = APIRouter(prefix="/api/chat", tags=["AI Copilot"])

@router.post("", response_model=ChatResponse)
def copilot_chat(req: ChatRequest, db: Session = Depends(get_db)):
    """Grounded AI Copilot conversation endpoint."""
    res = CopilotEngine.answer_query(db, DEMO_PROFILE_ID, req.message)
    return res
