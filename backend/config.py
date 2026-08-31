import os
from pydantic_settings import BaseSettings

def get_origins() -> list:
    origins_env = os.getenv("ALLOWED_ORIGINS") or os.getenv("FRONTEND_URL")
    if origins_env:
        return [o.strip() for o in origins_env.split(",") if o.strip()]
    return [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ]

class Settings(BaseSettings):
    PROJECT_NAME: str = "PathFinder AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./pathfinder.db")
    
    # AI Provider configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    AI_MODEL: str = os.getenv("AI_MODEL", "gpt-4o-mini")
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")
    
    # CORS
    ALLOWED_ORIGINS: list = get_origins()

    class Config:
        case_sensitive = True

settings = Settings()
