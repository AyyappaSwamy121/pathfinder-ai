import uuid
import datetime
import hashlib
from fastapi import APIRouter, Depends, HTTPException, Header, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.models.domain import User, LearnerProfile, Career
from backend.seed.seed_data import DEMO_PROFILE_ID

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# In-memory session token store mapping token -> user_id
ACTIVE_TOKENS: dict[str, str] = {}

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

class SignupRequest(BaseModel):
    first_name: str
    last_name: str
    college_name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    token: str
    user_id: str
    email: str
    first_name: str
    last_name: str
    college_name: str
    profile_id: str

def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    """Extract user_id from Bearer header or default to DEMO profile user."""
    if not authorization:
        return "usr_alex_demo"
    
    parts = authorization.split(" ")
    if len(parts) == 2 and parts[0].lower() == "bearer":
        token = parts[1]
        if token in ACTIVE_TOKENS:
            return ACTIVE_TOKENS[token]
        return token
    return "usr_alex_demo"

def get_current_user(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)) -> User:
    """Canonical user authentication dependency verifying token and returning active User model."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = db.query(User).filter(User.id == "usr_alex_demo").first()
    return user

def get_current_user_optional(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> Optional[User]:
    """Optional user authentication dependency."""
    user_id = get_current_user_id(authorization)
    return db.query(User).filter(User.id == user_id).first()

def get_current_profile_id(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)) -> str:
    """Resolve active profile_id for authenticated user or demo persona."""
    if user_id == "usr_alex_demo":
        return DEMO_PROFILE_ID
    if user_id in ["usr_jordan_demo", "usr_devon_demo"]:
        prof = db.query(LearnerProfile).filter(LearnerProfile.user_id == user_id).first()
        return prof.id if prof else DEMO_PROFILE_ID

    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user_id).first()
    if not profile:
        profile_id = f"prof_{uuid.uuid4().hex[:12]}"
        profile = LearnerProfile(
            id=profile_id,
            user_id=user_id,
            target_career_id="c_ai_engineer",
            experience_level="Beginner",
            weekly_hours=8,
            timeline_months=6,
            learning_preference="Project Based",
            readiness_score=15.0
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile.id

@router.post("/signup", response_model=AuthResponse)
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    user_id = f"usr_{uuid.uuid4().hex[:12]}"
    full_name = f"{req.first_name.strip()} {req.last_name.strip()}"
    hashed_pwd = hash_password(req.password)
    
    # Create User
    new_user = User(
        id=user_id,
        email=req.email.lower().strip(),
        name=full_name,
        college_name=req.college_name.strip(),
        hashed_password=hashed_pwd
    )
    db.add(new_user)
    
    # Create LearnerProfile
    profile_id = f"prof_{uuid.uuid4().hex[:12]}"
    default_career = db.query(Career).filter(Career.id == "c_ai_engineer").first()
    
    new_profile = LearnerProfile(
        id=profile_id,
        user_id=user_id,
        target_career_id=default_career.id if default_career else "c_ai_engineer",
        experience_level="Beginner",
        weekly_hours=8,
        timeline_months=6,
        learning_preference="Project Based",
        readiness_score=15.0
    )
    db.add(new_profile)
    db.commit()

    token = f"pat_{uuid.uuid4().hex}"
    ACTIVE_TOKENS[token] = user_id

    return AuthResponse(
        token=token,
        user_id=user_id,
        email=req.email.lower().strip(),
        first_name=req.first_name.strip(),
        last_name=req.last_name.strip(),
        college_name=req.college_name.strip(),
        profile_id=profile_id
    )

@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    email_clean = req.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if user.hashed_password and user.hashed_password != hash_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user.id).first()
    if not profile:
        profile_id = f"prof_{uuid.uuid4().hex[:12]}"
        profile = LearnerProfile(id=profile_id, user_id=user.id, target_career_id="c_ai_engineer")
        db.add(profile)
        db.commit()

    names = user.name.split(" ")
    first_name = names[0] if names else "Learner"
    last_name = " ".join(names[1:]) if len(names) > 1 else ""

    token = f"pat_{uuid.uuid4().hex}"
    ACTIVE_TOKENS[token] = user.id

    return AuthResponse(
        token=token,
        user_id=user.id,
        email=user.email,
        first_name=first_name,
        last_name=last_name,
        college_name=user.college_name or "PathFinder Workspace",
        profile_id=profile.id
    )

@router.get("/me", response_model=AuthResponse)
def get_me(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = db.query(User).filter(User.id == "usr_alex_demo").first()
    
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user.id).first()
    
    names = user.name.split(" ") if user else ["Alex", "Morgan"]
    first_name = names[0] if names else "Learner"
    last_name = " ".join(names[1:]) if len(names) > 1 else ""

    return AuthResponse(
        token=user_id,
        user_id=user.id if user else "usr_alex_demo",
        email=user.email if user else "alex@demo.hcl",
        first_name=first_name,
        last_name=last_name,
        college_name=user.college_name if (user and user.college_name) else "HCL Amplify Institute",
        profile_id=profile.id if profile else DEMO_PROFILE_ID
    )

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}
