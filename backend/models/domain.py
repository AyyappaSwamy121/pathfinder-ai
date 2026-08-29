import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from backend.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="user", uselist=False)

class LearnerProfile(Base):
    __tablename__ = "learner_profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    target_career_id = Column(String, ForeignKey("careers.id"), nullable=True)
    experience_level = Column(String, default="Beginner") # Beginner, Intermediate, Advanced
    weekly_hours = Column(Integer, default=8)
    timeline_months = Column(Integer, default=6)
    learning_preference = Column(String, default="Project Based") # Project Based, Video, Reading, Mixed
    raw_onboarding_input = Column(Text, nullable=True)
    readiness_score = Column(Float, default=0.0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profile")
    target_career = relationship("Career")
    learner_skills = relationship("LearnerSkill", back_populates="profile", cascade="all, delete-orphan")
    learning_paths = relationship("LearningPath", back_populates="profile", cascade="all, delete-orphan")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, nullable=False) # Programming, Math & Stats, ML, Web, Cloud, Security
    description = Column(Text, nullable=True)
    difficulty = Column(String, default="Intermediate") # Beginner, Intermediate, Advanced

    prerequisites = relationship("SkillPrerequisite", foreign_keys="[SkillPrerequisite.skill_id]", back_populates="skill")
    required_for = relationship("SkillPrerequisite", foreign_keys="[SkillPrerequisite.prerequisite_id]", back_populates="prerequisite")
    resources = relationship("Resource", back_populates="skill")
    projects = relationship("Project", back_populates="skill")

class SkillPrerequisite(Base):
    __tablename__ = "skill_prerequisites"

    id = Column(String, primary_key=True, index=True)
    skill_id = Column(String, ForeignKey("skills.id"), nullable=False)
    prerequisite_id = Column(String, ForeignKey("skills.id"), nullable=False)
    relationship_type = Column(String, default="prerequisite") # prerequisite, related, specialization, optional

    skill = relationship("Skill", foreign_keys=[skill_id], back_populates="prerequisites")
    prerequisite = relationship("Skill", foreign_keys=[prerequisite_id], back_populates="required_for")

class Career(Base):
    __tablename__ = "careers"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String, default="Briefcase")
    category = Column(String, default="Engineering")

    required_skills = relationship("CareerSkill", back_populates="career", cascade="all, delete-orphan")

class CareerSkill(Base):
    __tablename__ = "career_skills"

    id = Column(String, primary_key=True, index=True)
    career_id = Column(String, ForeignKey("careers.id"), nullable=False)
    skill_id = Column(String, ForeignKey("skills.id"), nullable=False)
    required_proficiency = Column(String, default="Intermediate") # Beginner, Intermediate, Advanced
    importance_weight = Column(Float, default=1.0)

    career = relationship("Career", back_populates="required_skills")
    skill = relationship("Skill")

class LearnerSkill(Base):
    __tablename__ = "learner_skills"

    id = Column(String, primary_key=True, index=True)
    profile_id = Column(String, ForeignKey("learner_profiles.id"), nullable=False)
    skill_id = Column(String, ForeignKey("skills.id"), nullable=False)
    proficiency = Column(String, default="Beginner") # Beginner, Intermediate, Advanced
    confidence = Column(String, default="Medium") # Low, Medium, High
    status = Column(String, default="DEVELOPING") # MASTERED, DEVELOPING, MISSING, LOCKED, RECOMMENDED
    evidence = Column(Text, nullable=True)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="learner_skills")
    skill = relationship("Skill")

class Resource(Base):
    __tablename__ = "resources"

    id = Column(String, primary_key=True, index=True)
    skill_id = Column(String, ForeignKey("skills.id"), nullable=False)
    title = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    type = Column(String, nullable=False) # Course, Tutorial, Documentation, Video, Article, Project
    difficulty = Column(String, default="Beginner")
    duration_minutes = Column(Integer, default=60)
    url = Column(String, nullable=True)
    why_this = Column(Text, nullable=True)

    skill = relationship("Skill", back_populates="resources")

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    skill_id = Column(String, ForeignKey("skills.id"), nullable=False)
    title = Column(String, nullable=False)
    objective = Column(Text, nullable=False)
    difficulty = Column(String, default="Intermediate")
    estimated_hours = Column(Integer, default=10)
    deliverables = Column(JSON, default=list) # List of deliverable bullet points
    portfolio_value = Column(Text, nullable=True)

    skill = relationship("Skill", back_populates="projects")

class LearningPath(Base):
    __tablename__ = "learning_paths"

    id = Column(String, primary_key=True, index=True)
    profile_id = Column(String, ForeignKey("learner_profiles.id"), nullable=False)
    career_id = Column(String, ForeignKey("careers.id"), nullable=False)
    title = Column(String, nullable=False)
    total_steps = Column(Integer, default=0)
    completed_steps = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="learning_paths")
    career = relationship("Career")
    steps = relationship("PathStep", back_populates="path", order_by="PathStep.step_order", cascade="all, delete-orphan")

class PathStep(Base):
    __tablename__ = "path_steps"

    id = Column(String, primary_key=True, index=True)
    path_id = Column(String, ForeignKey("learning_paths.id"), nullable=False)
    skill_id = Column(String, ForeignKey("skills.id"), nullable=False)
    phase_number = Column(Integer, default=1)
    phase_title = Column(String, default="Phase 1: Foundations")
    step_order = Column(Integer, nullable=False)
    status = Column(String, default="PENDING") # COMPLETED, IN_PROGRESS, PENDING, LOCKED
    estimated_minutes = Column(Integer, default=120)
    difficulty = Column(String, default="Intermediate")
    reason = Column(Text, nullable=True) # Explainable AI reason

    path = relationship("LearningPath", back_populates="steps")
    skill = relationship("Skill")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String, primary_key=True, index=True)
    skill_id = Column(String, ForeignKey("skills.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    skill = relationship("Skill")
    questions = relationship("AssessmentQuestion", back_populates="assessment", cascade="all, delete-orphan")

class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"

    id = Column(String, primary_key=True, index=True)
    assessment_id = Column(String, ForeignKey("assessments.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    options = Column(JSON, nullable=False) # list of 4 strings
    correct_option_index = Column(Integer, nullable=False)
    explanation = Column(Text, nullable=True)

    assessment = relationship("Assessment", back_populates="questions")

class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(String, primary_key=True, index=True)
    profile_id = Column(String, ForeignKey("learner_profiles.id"), nullable=False)
    assessment_id = Column(String, ForeignKey("assessments.id"), nullable=False)
    score_percentage = Column(Float, nullable=False)
    passed = Column(Boolean, default=False)
    weak_skills = Column(JSON, default=list)
    strong_skills = Column(JSON, default=list)
    taken_at = Column(DateTime, default=datetime.datetime.utcnow)

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String, primary_key=True, index=True)
    profile_id = Column(String, ForeignKey("learner_profiles.id"), nullable=False)
    skill_id = Column(String, ForeignKey("skills.id"), nullable=False)
    sentiment = Column(String, nullable=False) # Struggling, Need Practice, Comfortable, Confident, Too Easy
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, index=True)
    profile_id = Column(String, ForeignKey("learner_profiles.id"), nullable=False)
    sender = Column(String, nullable=False) # user, ai
    message = Column(Text, nullable=False)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
