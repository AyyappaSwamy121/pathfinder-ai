-- ============================================================================
-- PATHFINDER AI — SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Migration Version: 001_pathfinder_schema.sql
-- Description: Complete schema for PathFinder AI Career Intelligence SaaS
-- Compatible with Supabase PostgreSQL SQL Editor
-- ============================================================================

-- Enable UUID Extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    college_name VARCHAR(255),
    hashed_password VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Careers Knowledge Base Table
CREATE TABLE IF NOT EXISTS careers (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100) DEFAULT 'Briefcase',
    category VARCHAR(100) DEFAULT 'Engineering'
);

-- 3. Learner Profiles Table
CREATE TABLE IF NOT EXISTS learner_profiles (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_career_id VARCHAR(255) REFERENCES careers(id) ON DELETE SET NULL,
    experience_level VARCHAR(50) DEFAULT 'Beginner',
    weekly_hours INTEGER DEFAULT 8,
    timeline_months INTEGER DEFAULT 6,
    learning_preference VARCHAR(100) DEFAULT 'Project Based',
    raw_onboarding_input TEXT,
    readiness_score DOUBLE PRECISION DEFAULT 0.0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Skills Knowledge Base Table
CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty VARCHAR(50) DEFAULT 'Intermediate'
);

-- 5. Skill Prerequisites Graph Edges Table
CREATE TABLE IF NOT EXISTS skill_prerequisites (
    id VARCHAR(255) PRIMARY KEY,
    skill_id VARCHAR(255) NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    prerequisite_id VARCHAR(255) NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) DEFAULT 'prerequisite'
);

-- 6. Career Skills Mapping Table
CREATE TABLE IF NOT EXISTS career_skills (
    id VARCHAR(255) PRIMARY KEY,
    career_id VARCHAR(255) NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    skill_id VARCHAR(255) NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    required_proficiency VARCHAR(50) DEFAULT 'Intermediate',
    importance_weight DOUBLE PRECISION DEFAULT 1.0
);

-- 7. Learner Skill Competencies State Table
CREATE TABLE IF NOT EXISTS learner_skills (
    id VARCHAR(255) PRIMARY KEY,
    profile_id VARCHAR(255) NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
    skill_id VARCHAR(255) NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency VARCHAR(50) DEFAULT 'Beginner',
    confidence VARCHAR(50) DEFAULT 'Medium',
    status VARCHAR(50) DEFAULT 'DEVELOPING',
    evidence TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Learning Resources Table
CREATE TABLE IF NOT EXISTS resources (
    id VARCHAR(255) PRIMARY KEY,
    skill_id VARCHAR(255) NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'Beginner',
    duration_minutes INTEGER DEFAULT 60,
    url TEXT,
    why_this TEXT
);

-- 9. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(255) PRIMARY KEY,
    skill_id VARCHAR(255) NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    objective TEXT NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'Intermediate',
    estimated_hours INTEGER DEFAULT 10,
    deliverables JSONB DEFAULT '[]'::jsonb,
    portfolio_value TEXT
);

-- 10. Learning Paths Table
CREATE TABLE IF NOT EXISTS learning_paths (
    id VARCHAR(255) PRIMARY KEY,
    profile_id VARCHAR(255) NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
    career_id VARCHAR(255) NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    total_steps INTEGER DEFAULT 0,
    completed_steps INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Path Steps Table
CREATE TABLE IF NOT EXISTS path_steps (
    id VARCHAR(255) PRIMARY KEY,
    path_id VARCHAR(255) NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    skill_id VARCHAR(255) NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    phase_number INTEGER DEFAULT 1,
    phase_title VARCHAR(255) DEFAULT 'Phase 1: Foundations',
    step_order INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    estimated_minutes INTEGER DEFAULT 120,
    difficulty VARCHAR(50) DEFAULT 'Intermediate',
    reason TEXT
);

-- 12. Micro-Assessments Table
CREATE TABLE IF NOT EXISTS assessments (
    id VARCHAR(255) PRIMARY KEY,
    skill_id VARCHAR(255) NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT
);

-- 13. Assessment Questions Table
CREATE TABLE IF NOT EXISTS assessment_questions (
    id VARCHAR(255) PRIMARY KEY,
    assessment_id VARCHAR(255) NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option_index INTEGER NOT NULL,
    explanation TEXT
);

-- 14. Assessment Results Table
CREATE TABLE IF NOT EXISTS assessment_results (
    id VARCHAR(255) PRIMARY KEY,
    profile_id VARCHAR(255) NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
    assessment_id VARCHAR(255) NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    score_percentage DOUBLE PRECISION NOT NULL,
    passed BOOLEAN DEFAULT FALSE,
    weak_skills JSONB DEFAULT '[]'::jsonb,
    strong_skills JSONB DEFAULT '[]'::jsonb,
    taken_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Learner Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
    id VARCHAR(255) PRIMARY KEY,
    profile_id VARCHAR(255) NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
    skill_id VARCHAR(255) NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    sentiment VARCHAR(50) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id VARCHAR(255) PRIMARY KEY,
    profile_id VARCHAR(255) NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
    sender VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    metadata_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_learner_profiles_user_id ON learner_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_learner_skills_profile_id ON learner_skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_profile_id ON learning_paths(profile_id);
CREATE INDEX IF NOT EXISTS idx_path_steps_path_id ON path_steps(path_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_profile_id ON assessment_results(profile_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_profile_id ON chat_messages(profile_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE learner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Learner Profiles Policy
CREATE POLICY "Users access own learner profile" ON learner_profiles
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

-- Learner Skills Policy
CREATE POLICY "Users access own learner skills" ON learner_skills
    FOR ALL USING (
        profile_id IN (SELECT id FROM learner_profiles WHERE auth.uid()::text = user_id OR user_id LIKE 'usr_%')
    );

-- Learning Paths Policy
CREATE POLICY "Users access own learning paths" ON learning_paths
    FOR ALL USING (
        profile_id IN (SELECT id FROM learner_profiles WHERE auth.uid()::text = user_id OR user_id LIKE 'usr_%')
    );
