from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.schemas.pydantic_models import ChatRequest, ChatResponse
from backend.services.copilot_engine import CopilotEngine
from backend.seed.seed_data import DEMO_PROFILE_ID

from backend.api.auth_router import get_current_user_optional
from backend.models.domain import User

router = APIRouter(prefix="/api/chat", tags=["AI Copilot"])

@router.post("", response_model=ChatResponse)
def copilot_chat(
    req: ChatRequest,
    db: Session = Depends(get_db),
    user_and_pid: tuple[User, str] = Depends(get_current_user_optional)
):
    """Grounded AI Copilot conversation endpoint."""
    user, profile_id = user_and_pid
    res = CopilotEngine.answer_query(db, profile_id, req.message)
    return res
