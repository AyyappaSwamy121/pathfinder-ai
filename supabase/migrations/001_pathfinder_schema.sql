-- ============================================================================
-- PATHFINDER AI — SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Migration Version: 001_pathfinder_schema.sql
-- Description: Clean, idempotent schema migration for Supabase SQL Editor
-- ============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop legacy table constraints if present to eliminate UUID vs VARCHAR column mismatches
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.feedback CASCADE;
DROP TABLE IF EXISTS public.assessment_results CASCADE;
DROP TABLE IF EXISTS public.assessment_questions CASCADE;
DROP TABLE IF EXISTS public.assessments CASCADE;
DROP TABLE IF EXISTS public.path_steps CASCADE;
DROP TABLE IF EXISTS public.learning_paths CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.resources CASCADE;
DROP TABLE IF EXISTS public.learner_skills CASCADE;
DROP TABLE IF EXISTS public.career_skills CASCADE;
DROP TABLE IF EXISTS public.skill_prerequisites CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;
DROP TABLE IF EXISTS public.learner_profiles CASCADE;
DROP TABLE IF EXISTS public.careers CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Profiles Table (Linked to Supabase Auth auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Careers Knowledge Base Table
CREATE TABLE public.careers (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100) DEFAULT 'Briefcase',
    category VARCHAR(100) DEFAULT 'Engineering'
);

-- 3. Learner Profiles Table (Linked to Supabase Auth auth.users)
CREATE TABLE public.learner_profiles (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_career_id VARCHAR(255) REFERENCES public.careers(id) ON DELETE SET NULL,
    experience_level VARCHAR(50) DEFAULT 'Beginner',
    weekly_hours INTEGER DEFAULT 8,
    timeline_months INTEGER DEFAULT 6,
    learning_preference VARCHAR(100) DEFAULT 'Project Based',
    raw_onboarding_input TEXT,
    readiness_score DOUBLE PRECISION DEFAULT 15.0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Skills Knowledge Base Table
CREATE TABLE public.skills (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty VARCHAR(50) DEFAULT 'Intermediate'
);

-- 5. Skill Prerequisites Graph Edges Table
CREATE TABLE public.skill_prerequisites (
    id VARCHAR(255) PRIMARY KEY,
    skill_id VARCHAR(255) NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    prerequisite_id VARCHAR(255) NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) DEFAULT 'prerequisite'
);

-- 6. Career Skills Mapping Table
CREATE TABLE public.career_skills (
    id VARCHAR(255) PRIMARY KEY,
    career_id VARCHAR(255) NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
    skill_id VARCHAR(255) NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    required_proficiency VARCHAR(50) DEFAULT 'Intermediate',
    importance_weight DOUBLE PRECISION DEFAULT 1.0
);

-- 7. Learner Skill Competencies State Table
CREATE TABLE public.learner_skills (
    id VARCHAR(255) PRIMARY KEY,
    profile_id VARCHAR(255) NOT NULL REFERENCES public.learner_profiles(id) ON DELETE CASCADE,
    skill_id VARCHAR(255) NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency VARCHAR(50) DEFAULT 'Beginner',
    confidence VARCHAR(50) DEFAULT 'Medium',
    status VARCHAR(50) DEFAULT 'DEVELOPING',
    evidence TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Learning Resources Table
CREATE TABLE public.resources (
    id VARCHAR(255) PRIMARY KEY,
    skill_id VARCHAR(255) NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'Beginner',
    duration_minutes INTEGER DEFAULT 60,
    url TEXT,
    why_this TEXT
);

-- 9. Projects Table
CREATE TABLE public.projects (
    id VARCHAR(255) PRIMARY KEY,
    skill_id VARCHAR(255) NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    objective TEXT NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'Intermediate',
    estimated_hours INTEGER DEFAULT 10,
    deliverables JSONB DEFAULT '[]'::jsonb,
    portfolio_value TEXT
);

-- 10. Learning Paths Table
CREATE TABLE public.learning_paths (
    id VARCHAR(255) PRIMARY KEY,
    profile_id VARCHAR(255) NOT NULL REFERENCES public.learner_profiles(id) ON DELETE CASCADE,
    career_id VARCHAR(255) NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    total_steps INTEGER DEFAULT 0,
    completed_steps INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Path Steps Table
CREATE TABLE public.path_steps (
    id VARCHAR(255) PRIMARY KEY,
    path_id VARCHAR(255) NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    skill_id VARCHAR(255) NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    phase_number INTEGER DEFAULT 1,
    phase_title VARCHAR(255) DEFAULT 'Phase 1: Foundations',
    step_order INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    estimated_minutes INTEGER DEFAULT 120,
    difficulty VARCHAR(50) DEFAULT 'Intermediate',
    reason TEXT
);

-- 12. Micro-Assessments Table
CREATE TABLE public.assessments (
    id VARCHAR(255) PRIMARY KEY,
    skill_id VARCHAR(255) NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT
);

-- 13. Assessment Questions Table
CREATE TABLE public.assessment_questions (
    id VARCHAR(255) PRIMARY KEY,
    assessment_id VARCHAR(255) NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option_index INTEGER NOT NULL,
    explanation TEXT
);

-- 14. Assessment Results Table
CREATE TABLE public.assessment_results (
    id VARCHAR(255) PRIMARY KEY,
    profile_id VARCHAR(255) NOT NULL REFERENCES public.learner_profiles(id) ON DELETE CASCADE,
    assessment_id VARCHAR(255) NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    score_percentage DOUBLE PRECISION NOT NULL,
    passed BOOLEAN DEFAULT FALSE,
    weak_skills JSONB DEFAULT '[]'::jsonb,
    strong_skills JSONB DEFAULT '[]'::jsonb,
    taken_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Learner Feedback Table
CREATE TABLE public.feedback (
    id VARCHAR(255) PRIMARY KEY,
    profile_id VARCHAR(255) NOT NULL REFERENCES public.learner_profiles(id) ON DELETE CASCADE,
    skill_id VARCHAR(255) NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    sentiment VARCHAR(50) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Chat Messages Table
CREATE TABLE public.chat_messages (
    id VARCHAR(255) PRIMARY KEY,
    profile_id VARCHAR(255) NOT NULL REFERENCES public.learner_profiles(id) ON DELETE CASCADE,
    sender VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    metadata_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- AUTO-PROFILE TRIGGER FOR SUPABASE AUTH SIGNUP
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, college_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'Student'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', 'Learner'),
        COALESCE(NEW.raw_user_meta_data->>'college_name', 'HCL Amplify Institute')
    )
    ON CONFLICT (id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        college_name = EXCLUDED.college_name;

    INSERT INTO public.learner_profiles (id, user_id, target_career_id, readiness_score)
    VALUES (
        'prof_' || SUBSTRING(NEW.id::text FROM 1 FOR 12),
        NEW.id,
        'c_ai_engineer',
        15.0
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learner_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policy
DROP POLICY IF EXISTS "Users access own profile" ON public.profiles;
CREATE POLICY "Users access own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- Learner Profiles Policy
DROP POLICY IF EXISTS "Users access own learner profile" ON public.learner_profiles;
CREATE POLICY "Users access own learner profile" ON public.learner_profiles
    FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- Learner Skills Policy
DROP POLICY IF EXISTS "Users access own learner skills" ON public.learner_skills;
CREATE POLICY "Users access own learner skills" ON public.learner_skills
    FOR ALL USING (
        profile_id IN (SELECT id FROM public.learner_profiles WHERE auth.uid() = user_id OR user_id IS NULL)
    );

-- Learning Paths Policy
DROP POLICY IF EXISTS "Users access own learning paths" ON public.learning_paths;
CREATE POLICY "Users access own learning paths" ON public.learning_paths
    FOR ALL USING (
        profile_id IN (SELECT id FROM public.learner_profiles WHERE auth.uid() = user_id OR user_id IS NULL)
    );
