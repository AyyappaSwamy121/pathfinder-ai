-- ============================================================================
-- PATHFINDER AI — SUPABASE PRODUCTION DATABASE MIGRATION SCRIPT
-- File: supabase/migrations/001_initial_schema.sql
-- Description: Idempotent PostgreSQL schema with RLS policies, trigger-based 
--              profile creation, and seed knowledge base.
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  college_name TEXT,
  target_career_id TEXT DEFAULT 'c_ai_engineer',
  experience_level TEXT DEFAULT 'Beginner',
  weekly_hours INT DEFAULT 8,
  timeline_months INT DEFAULT 6,
  learning_preference TEXT DEFAULT 'Project Based',
  raw_onboarding_input TEXT,
  readiness_score FLOAT DEFAULT 15.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for updated_at on profiles
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- 4. AUTOMATIC PROFILE CREATION TRIGGER FOR SUPABASE AUTH
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, college_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Student'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Learner'),
    COALESCE(NEW.raw_user_meta_data->>'college_name', 'University')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, public.profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.profiles.last_name),
    college_name = COALESCE(EXCLUDED.college_name, public.profiles.college_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. KNOWLEDGE BASE TABLES (Careers, Skills, Prerequisites, Career Skills)
CREATE TABLE IF NOT EXISTS public.careers (
  id TEXT PRIMARY KEY,
  title TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'Briefcase',
  category TEXT DEFAULT 'Engineering',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  difficulty TEXT DEFAULT 'Intermediate',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skill_prerequisites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id TEXT REFERENCES public.skills(id) ON DELETE CASCADE,
  prerequisite_id TEXT REFERENCES public.skills(id) ON DELETE CASCADE,
  relationship_type TEXT DEFAULT 'prerequisite',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.career_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id TEXT REFERENCES public.careers(id) ON DELETE CASCADE,
  skill_id TEXT REFERENCES public.skills(id) ON DELETE CASCADE,
  required_proficiency TEXT DEFAULT 'Intermediate',
  importance_weight FLOAT DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LEARNER WORKSPACE TABLES
CREATE TABLE IF NOT EXISTS public.learner_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency TEXT DEFAULT 'Beginner',
  confidence TEXT DEFAULT 'Medium',
  status TEXT DEFAULT 'DEVELOPING',
  evidence TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_skill UNIQUE (user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  career_id TEXT NOT NULL REFERENCES public.careers(id),
  title TEXT NOT NULL,
  total_steps INT DEFAULT 0,
  completed_steps INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.path_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL REFERENCES public.skills(id),
  phase_number INT DEFAULT 1,
  phase_title TEXT DEFAULT 'Phase 1: Foundations',
  step_order INT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  estimated_minutes INT DEFAULT 120,
  difficulty TEXT DEFAULT 'Intermediate',
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. LEARNING CONTENT & ASSESSMENTS
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY,
  skill_id TEXT NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  type TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Beginner',
  duration_minutes INT DEFAULT 60,
  url TEXT,
  why_this TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  skill_id TEXT NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  objective TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Intermediate',
  estimated_hours INT DEFAULT 10,
  deliverables JSONB DEFAULT '[]'::jsonb,
  portfolio_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessments (
  id TEXT PRIMARY KEY,
  skill_id TEXT NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessment_questions (
  id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option_index INT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assessment_id TEXT NOT NULL REFERENCES public.assessments(id),
  score_percentage FLOAT NOT NULL,
  passed BOOLEAN DEFAULT FALSE,
  weak_skills JSONB DEFAULT '[]'::jsonb,
  strong_skills JSONB DEFAULT '[]'::jsonb,
  taken_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL REFERENCES public.skills(id),
  sentiment TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) ENFORCEMENT
-- ============================================================================

-- Enable RLS on User-Owned Tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learner_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.path_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Enable RLS on Reference Knowledge Base Tables (Read-only for users)
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR USER TABLES (auth.uid() enforcement)

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Learner Skills
DROP POLICY IF EXISTS "Users manage own learner skills" ON public.learner_skills;
CREATE POLICY "Users manage own learner skills" ON public.learner_skills FOR ALL USING (auth.uid() = user_id);

-- Learning Paths
DROP POLICY IF EXISTS "Users manage own learning paths" ON public.learning_paths;
CREATE POLICY "Users manage own learning paths" ON public.learning_paths FOR ALL USING (auth.uid() = user_id);

-- Path Steps
DROP POLICY IF EXISTS "Users manage own path steps" ON public.path_steps;
CREATE POLICY "Users manage own path steps" ON public.path_steps FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.learning_paths
    WHERE public.learning_paths.id = public.path_steps.path_id
    AND public.learning_paths.user_id = auth.uid()
  )
);

-- Assessment Results
DROP POLICY IF EXISTS "Users manage own assessment results" ON public.assessment_results;
CREATE POLICY "Users manage own assessment results" ON public.assessment_results FOR ALL USING (auth.uid() = user_id);

-- Feedback
DROP POLICY IF EXISTS "Users manage own feedback" ON public.feedback;
CREATE POLICY "Users manage own feedback" ON public.feedback FOR ALL USING (auth.uid() = user_id);

-- Chat Messages
DROP POLICY IF EXISTS "Users manage own chat messages" ON public.chat_messages;
CREATE POLICY "Users manage own chat messages" ON public.chat_messages FOR ALL USING (auth.uid() = user_id);

-- RLS POLICIES FOR REFERENCE TABLES (Public Select Allowed)
DROP POLICY IF EXISTS "Public read access careers" ON public.careers;
CREATE POLICY "Public read access careers" ON public.careers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access skills" ON public.skills;
CREATE POLICY "Public read access skills" ON public.skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access skill_prerequisites" ON public.skill_prerequisites;
CREATE POLICY "Public read access skill_prerequisites" ON public.skill_prerequisites FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access career_skills" ON public.career_skills;
CREATE POLICY "Public read access career_skills" ON public.career_skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access resources" ON public.resources;
CREATE POLICY "Public read access resources" ON public.resources FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access projects" ON public.projects;
CREATE POLICY "Public read access projects" ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access assessments" ON public.assessments;
CREATE POLICY "Public read access assessments" ON public.assessments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access assessment_questions" ON public.assessment_questions;
CREATE POLICY "Public read access assessment_questions" ON public.assessment_questions FOR SELECT USING (true);

-- ============================================================================
-- 9. PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_learner_skills_user ON public.learner_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_learner_skills_profile ON public.learner_skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_user ON public.learning_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_profile ON public.learning_paths(profile_id);
CREATE INDEX IF NOT EXISTS idx_path_steps_path ON public.path_steps(path_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_user ON public.assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON public.chat_messages(user_id);
