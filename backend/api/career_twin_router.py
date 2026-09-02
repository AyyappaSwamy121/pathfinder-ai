from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.schemas.pydantic_models import (
    CareerTwinSimulateRequest, CareerTwinSimulateResponse,
    CareerTwinExplainRequest, CareerTwinExplainResponse
)
from backend.services.career_twin_engine import CareerTwinEngine
from backend.api.auth_router import get_current_profile_id

router = APIRouter(prefix="/api/career-twin", tags=["Career Twin"])

@router.post("/simulate", response_model=CareerTwinSimulateResponse)
def simulate_career_twin(
    req: CareerTwinSimulateRequest,
    db: Session = Depends(get_db),
    profile_id: str = Depends(get_current_profile_id)
):
    """
    Career Twin Intelligent Transition Simulator.
    Simulates transition from current learner state to target career.
    Computes 3 optimized paths (Fastest, Balanced, Portfolio-First),
    prerequisite backcasting, transparent Learning ROI, and transition DAG nodes.
    """
    try:
        res = CareerTwinEngine.simulate_transition(
            db=db,
            profile_id=profile_id,
            target_career_id=req.target_career_id,
            weekly_hours=req.weekly_hours or 8,
            target_timeline_months=req.target_timeline_months or 6,
            priority_mode=req.priority_mode or "BALANCED"
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Career Twin simulation failed: {str(e)}")

@router.post("/explain", response_model=CareerTwinExplainResponse)
def explain_career_twin(
    req: CareerTwinExplainRequest,
    db: Session = Depends(get_db),
    profile_id: str = Depends(get_current_profile_id)
):
    """
    Grounded AI Explanation for Career Twin Scenarios.
    Explains paths, tradeoffs, workload changes, and highest-leverage actions.
    """
    try:
        res = CareerTwinEngine.explain_scenario(
            db=db,
            profile_id=profile_id,
            target_career_id=req.target_career_id,
            question=req.question,
            selected_path_id=req.selected_path_id or "balanced",
            weekly_hours=req.weekly_hours or 8
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Career Twin explanation failed: {str(e)}")
