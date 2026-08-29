from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime

# Profile & Onboarding
class ProfileAnalyzeRequest(BaseModel):
    natural_language_input: str = Field(..., description="Conversational text from learner onboarding step 1")

class ExtractedSkill(BaseModel):
    name: str
    level: str = "Beginner" # Beginner, Intermediate, Advanced

class ProfileExtractResponse(BaseModel):
    target_role: str = "AI Engineer"
    experience_level: str = "Beginner"
    skills: List[ExtractedSkill] = []
    interests: List[str] = []
    weekly_hours: int = 8
    timeline_months: int = 6
    learning_preference: str = "Project Based"
    extracted_summary: str = ""

class ProfileUpdateRequest(BaseModel):
    target_career_id: str
    experience_level: str = "Beginner"
    weekly_hours: int = 8
    timeline_months: int = 6
    learning_preference: str = "Project Based"
    skills: List[ExtractedSkill] = []

class LearnerProfileSchema(BaseModel):
    id: str
    user_id: str
    target_career_id: Optional[str] = None
    experience_level: str
    weekly_hours: int
    timeline_months: int
    learning_preference: str
    readiness_score: float
    updated_at: datetime

    class Config:
        from_attributes = True

# Skills & Knowledge Base
class SkillSchema(BaseModel):
    id: str
    name: str
    category: str
    description: Optional[str] = None
    difficulty: str
    prerequisite_ids: List[str] = []

    class Config:
        from_attributes = True

class LearnerSkillStatusSchema(BaseModel):
    skill_id: str
    name: str
    category: str
    proficiency: str
    confidence: str
    status: str # MASTERED, DEVELOPING, MISSING, LOCKED, RECOMMENDED
    evidence: Optional[str] = None

class SkillGapAnalysisResponse(BaseModel):
    target_career: str
    readiness_score: float
    mastered: List[LearnerSkillStatusSchema] = []
    developing: List[LearnerSkillStatusSchema] = []
    missing: List[LearnerSkillStatusSchema] = []
    locked: List[LearnerSkillStatusSchema] = []
    recommended: List[LearnerSkillStatusSchema] = []

# Career Knowledge Base
class CareerSchema(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    category: str
    required_skills_count: int = 0

    class Config:
        from_attributes = True

class CareerDetailSchema(CareerSchema):
    required_skills: List[Dict[str, Any]] = []

# Resources & Projects
class ResourceSchema(BaseModel):
    id: str
    skill_id: str
    title: str
    provider: str
    type: str
    difficulty: str
    duration_minutes: int
    url: Optional[str] = None
    why_this: Optional[str] = None

    class Config:
        from_attributes = True

class ProjectSchema(BaseModel):
    id: str
    skill_id: str
    title: str
    objective: str
    difficulty: str
    estimated_hours: int
    deliverables: List[str] = []
    portfolio_value: Optional[str] = None

    class Config:
        from_attributes = True

# Roadmap & Path
class PathStepSchema(BaseModel):
    id: str
    skill_id: str
    skill_name: str
    phase_number: int
    phase_title: str
    step_order: int
    status: str # COMPLETED, IN_PROGRESS, PENDING, LOCKED
    estimated_minutes: int
    difficulty: str
    reason: Optional[str] = None
    resources: List[ResourceSchema] = []
    project: Optional[ProjectSchema] = None
    assessment_id: Optional[str] = None

class LearningPathSchema(BaseModel):
    id: str
    profile_id: str
    career_id: str
    career_title: str
    total_steps: int
    completed_steps: int
    is_active: bool
    steps: List[PathStepSchema] = []

# Next Best Action
class NextBestActionSchema(BaseModel):
    skill_id: str
    skill_name: str
    title: str
    action_type: str # Resource, Project, Assessment
    estimated_minutes: int
    why_now: str
    cta_label: str
    item_id: str

# Assessments & Feedback
class QuestionOption(BaseModel):
    index: int
    text: str

class QuestionSchema(BaseModel):
    id: str
    question_text: str
    options: List[str]

class AssessmentDetailSchema(BaseModel):
    id: str
    skill_id: str
    skill_name: str
    title: str
    description: Optional[str] = None
    questions: List[QuestionSchema] = []

class AssessmentEvaluateRequest(BaseModel):
    assessment_id: str
    answers: Dict[str, int] # question_id -> selected_option_index

class AssessmentEvaluateResponse(BaseModel):
    result_id: str
    score_percentage: float
    passed: bool
    weak_skills: List[str]
    strong_skills: List[str]
    recommendation: str

class FeedbackSubmitRequest(BaseModel):
    skill_id: str
    sentiment: str # Struggling, Need Practice, Comfortable, Confident, Too Easy
    comment: Optional[str] = None

class FeedbackSubmitResponse(BaseModel):
    status: str
    message: str
    path_updated: bool

# What-If Career Simulator
class SimulateCareerRequest(BaseModel):
    target_career_id: str

class SimulateCareerResponse(BaseModel):
    current_career_id: str
    target_career_id: str
    target_career_title: str
    skill_overlap_percentage: float
    shared_skills: List[str]
    new_skills_required: List[str]
    estimated_additional_weeks: int
    recommended_projects: List[str]

class CareerComparisonRequest(BaseModel):
    career_id_a: str
    career_id_b: str

class CareerComparisonResponse(BaseModel):
    career_a: CareerSchema
    career_b: CareerSchema
    readiness_a: float
    readiness_b: float
    effort_weeks_a: int
    effort_weeks_b: int
    shared_skills: List[str]

# Copilot & Chat
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    suggested_actions: List[str] = []

# Dashboard Overview
class DashboardResponse(BaseModel):
    profile: LearnerProfileSchema
    target_career: CareerSchema
    readiness_score: float
    next_best_action: NextBestActionSchema
    milestones_completed: int
    milestones_total: int
    skill_gaps: SkillGapAnalysisResponse
    ai_insight: str
