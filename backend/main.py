import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.config import settings
from backend.database.session import engine, Base, SessionLocal
from backend.seed.seed_loader import init_seed_database

from backend.api.auth_router import router as auth_router
from backend.api.profile_router import router as profile_router
from backend.api.career_router import router as career_router
from backend.api.roadmap_router import router as roadmap_router
from backend.api.skill_router import router as skill_router
from backend.api.assessment_router import router as assessment_router
from backend.api.chat_router import router as chat_router
from backend.api.dashboard_router import router as dashboard_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pathfinder.main")

# Initialize Database Schema Tables
Base.metadata.create_all(bind=engine)

# Seed Database
db = SessionLocal()
try:
    init_seed_database(db)
finally:
    db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="PathFinder AI — AI-Powered Career Navigation & Adaptive Learning SaaS API"
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(career_router)
app.include_router(roadmap_router)
app.include_router(skill_router)
app.include_router(assessment_router)
app.include_router(chat_router)
app.include_router(dashboard_router)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Rule 5: No raw stack traces to users. Catch unhandled errors cleanly."""
    logger.error(f"Global unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Application Error",
            "message": "PathFinder AI encountered a temporary issue. Offline recommendation fallback active.",
            "status": "degraded"
        }
    )

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "mode": "production"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
