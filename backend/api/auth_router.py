import hashlib
import hmac
import secrets
import json
import base64
import time
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Header, Request, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.models.domain import User, LearnerProfile
from backend.seed.seed_data import DEMO_PROFILE_ID, DEMO_USER_ID

SECRET_KEY = "pathfinder_secret_key_super_secure_key"

router = APIRouter(prefix="/api/auth", tags=["Auth"])

# Pydantic Schemas
class SignupRequest(BaseModel):
    first_name: str
    last_name: str
    college_name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    college_name: str
    name: str
    is_onboarded: bool
    profile_id: str

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

def hash_password(password: str, salt: Optional[str] = None) -> str:
    if not salt:
        salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return f"{salt}${hashed.hex()}"

def verify_password(password: str, password_hash: str) -> bool:
    if not password_hash or "$" not in password_hash:
        return False
    salt, hashed_hex = password_hash.split("$", 1)
    new_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return hmac.compare_digest(new_hash.hex(), hashed_hex)

def create_access_token(user_id: str, profile_id: str) -> str:
    payload = {
        "sub": user_id,
        "pid": profile_id,
        "exp": int(time.time()) + 86400 * 30 # 30 days
    }
    raw = base64.b64encode(json.dumps(payload).encode()).decode()
    sig = hmac.new(SECRET_KEY.encode(), raw.encode(), hashlib.sha256).hexdigest()
    return f"{raw}.{sig}"

def decode_token(token: str) -> Optional[dict]:
    try:
        if "." not in token:
            return None
        raw, sig = token.split(".", 1)
        expected_sig = hmac.new(SECRET_KEY.encode(), raw.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected_sig):
            return None
        payload = json.loads(base64.b64decode(raw.encode()).decode())
        if payload.get("exp", 0) < time.time():
            return None
        return payload
    except Exception:
        return None

def get_current_user_optional(
    authorization: Optional[str] = Header(None),
    x_demo_profile_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> tuple[Optional[User], str]:
    """
    Returns (User, profile_id).
    If Authorization header is present, decodes user.
    If not, falls back to x-demo-profile-id or DEMO_PROFILE_ID.
    """
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
        payload = decode_token(token)
        if payload:
            user_id = payload.get("sub")
            user = db.query(User).filter(User.id == user_id).first()
            if user and user.profile:
                return user, user.profile.id
    
    # Fallback to demo profile / specified demo persona
    profile_id = x_demo_profile_id or DEMO_PROFILE_ID
    demo_user = db.query(User).filter(User.id == DEMO_USER_ID).first()
    return demo_user, profile_id

@router.post("/signup", response_model=AuthTokenResponse)
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    # Check if email exists
    existing = db.query(User).filter(User.email.ilike(req.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")

    user_id = f"usr_{uuid.uuid4().hex[:10]}"
    profile_id = f"prof_{uuid.uuid4().hex[:10]}"
    full_name = f"{req.first_name.strip()} {req.last_name.strip()}"

    pw_hash = hash_password(req.password)

    user = User(
        id=user_id,
        email=req.email.lower().strip(),
        name=full_name,
        first_name=req.first_name.strip(),
        last_name=req.last_name.strip(),
        college_name=req.college_name.strip(),
        password_hash=pw_hash,
        is_onboarded=False
    )
    db.add(user)

    # Create associated learner profile
    profile = LearnerProfile(
        id=profile_id,
        user_id=user_id,
        experience_level="Beginner",
        weekly_hours=8,
        timeline_months=6,
        learning_preference="Project Based"
    )
    db.add(profile)
    db.commit()

    token = create_access_token(user_id, profile_id)

    user_resp = UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        college_name=user.college_name,
        name=user.name,
        is_onboarded=user.is_onboarded,
        profile_id=profile.id
    )

    return AuthTokenResponse(access_token=token, user=user_resp)

@router.post("/login", response_model=AuthTokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email.ilike(req.email.strip())).first()
    if not user or not verify_password(req.password, user.password_hash or ""):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.profile:
        profile_id = f"prof_{uuid.uuid4().hex[:10]}"
        profile = LearnerProfile(id=profile_id, user_id=user.id)
        db.add(profile)
        db.commit()
    else:
        profile_id = user.profile.id

    token = create_access_token(user.id, profile_id)

    user_resp = UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name or user.name.split(" ")[0],
        last_name=user.last_name or (user.name.split(" ")[1] if " " in user.name else ""),
        college_name=user.college_name or "University",
        name=user.name,
        is_onboarded=user.is_onboarded if user.is_onboarded is not None else True,
        profile_id=profile_id
    )

    return AuthTokenResponse(access_token=token, user=user_resp)

@router.get("/me", response_model=UserResponse)
def get_me(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(" ", 1)[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile_id = user.profile.id if user.profile else DEMO_PROFILE_ID

    return UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name or user.name.split(" ")[0],
        last_name=user.last_name or (user.name.split(" ")[1] if " " in user.name else ""),
        college_name=user.college_name or "University",
        name=user.name,
        is_onboarded=user.is_onboarded if user.is_onboarded is not None else True,
        profile_id=profile_id
    )

@router.post("/logout")
def logout():
    return {"status": "success", "message": "Logged out successfully"}
