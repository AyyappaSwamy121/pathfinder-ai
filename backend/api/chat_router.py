from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.schemas.pydantic_models import ChatRequest, ChatResponse
from backend.services.copilot_engine import CopilotEngine
from backend.api.auth_router import get_current_profile_id

from backend.api.auth_router import get_current_user_optional
from backend.models.domain import User

router = APIRouter(prefix="/api/chat", tags=["AI Copilot"])

@router.post("", response_model=ChatResponse)
def copilot_chat(
    req: ChatRequest,
    db: Session = Depends(get_db),
    profile_id: str = Depends(get_current_profile_id)
):
    """Grounded AI Copilot conversation endpoint."""
    res = CopilotEngine.answer_query(db, profile_id, req.message)
    return res
