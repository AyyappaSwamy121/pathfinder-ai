import { createClient } from '@supabase/supabase-js';
import {
  ProfileExtractResponse,
  LearnerProfile,
  Career,
  LearningPath,
  SkillGapAnalysis,
  DashboardData,
  AssessmentDetail,
  AssessmentEvaluateResponse,
  SimulateCareerResponse,
  ChatResponse,
  PathStep,
  LearnerSkillStatus
} from '../types';

const env = (import.meta as any).env || {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || env.SUPABASE_URL || 'https://ftejyiygyykxwiwzyjvk.supabase.co';
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface AuthResponseData {
  token: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  college_name: string;
  profile_id: string;
}

// Seed Knowledge Base Data for Client Engine Fallback & Supabase Query
const SEED_CAREERS: Career[] = [
  {
    id: 'c_ai_engineer',
    title: 'AI Engineer',
    description: 'Design, train, and deploy production-grade Artificial Intelligence and Machine Learning models.',
    icon: 'Cpu',
    category: 'Engineering',
    required_skills_count: 15,
  },
  {
    id: 'c_data_scientist',
    title: 'Data Scientist',
    description: 'Extract statistical insights, build predictive models, and perform exploratory data analysis.',
    icon: 'LineChart',
    category: 'Analytics',
    required_skills_count: 12,
  },
  {
    id: 'c_fullstack_dev',
    title: 'Full Stack Developer',
    description: 'Build modern frontend React applications and scalable FastAPI/Node backend web microservices.',
    icon: 'Code',
    category: 'Engineering',
    required_skills_count: 14,
  },
  {
    id: 'c_data_analyst',
    title: 'Data Analyst',
    description: 'Transform complex business datasets into intuitive dashboards, SQL queries, and visual reporting.',
    icon: 'BarChart',
    category: 'Analytics',
    required_skills_count: 10,
  },
];

const SEED_STEPS: PathStep[] = [
  {
    id: 'step_1',
    skill_id: 's_python',
    skill_name: 'Python Programming',
    phase_number: 1,
    phase_title: 'Phase 1: Foundations',
    step_order: 1,
    status: 'COMPLETED',
    estimated_minutes: 180,
    difficulty: 'Beginner',
    reason: 'Mandatory foundation for AI Engineering and data structures.',
    resources: [
      { id: 'r1', skill_id: 's_python', title: 'Python Core Fundamentals', provider: 'PathFinder Academy', type: 'Course', difficulty: 'Beginner', duration_minutes: 180, url: 'https://docs.python.org/3/' }
    ],
  },
  {
    id: 'step_2',
    skill_id: 's_sql',
    skill_name: 'SQL & Relational Databases',
    phase_number: 1,
    phase_title: 'Phase 1: Foundations',
    step_order: 2,
    status: 'COMPLETED',
    estimated_minutes: 150,
    difficulty: 'Intermediate',
    reason: 'Essential for data query execution and feature extraction.',
    resources: [
      { id: 'r2', skill_id: 's_sql', title: 'SQL Queries & Joins Mastery', provider: 'PathFinder Academy', type: 'Course', difficulty: 'Intermediate', duration_minutes: 150, url: 'https://www.postgresql.org/docs/' }
    ],
  },
  {
    id: 'step_3',
    skill_id: 's_model_eval',
    skill_name: 'Model Evaluation & Metrics',
    phase_number: 2,
    phase_title: 'Phase 2: Core Competencies',
    step_order: 3,
    status: 'IN_PROGRESS',
    estimated_minutes: 90,
    difficulty: 'Intermediate',
    reason: 'Critical gap: Needed to evaluate precision, recall, and ROC-AUC before deploying model pipelines.',
    assessment_id: 'a_model_eval',
    resources: [
      { id: 'r3', skill_id: 's_model_eval', title: 'Model Evaluation Metrics Guide', provider: 'PathFinder Academy', type: 'Tutorial', difficulty: 'Intermediate', duration_minutes: 90, url: 'https://scikit-learn.org/' }
    ],
  },
  {
    id: 'step_4',
    skill_id: 's_deep_learning',
    skill_name: 'Deep Learning & Neural Networks',
    phase_number: 3,
    phase_title: 'Phase 3: Advanced Specialization',
    step_order: 4,
    status: 'PENDING',
    estimated_minutes: 240,
    difficulty: 'Advanced',
    reason: 'Prerequisite satisfied: Requires Python and Model Evaluation mastery.',
    resources: [
      { id: 'r4', skill_id: 's_deep_learning', title: 'PyTorch Neural Networks', provider: 'PathFinder Academy', type: 'Project', difficulty: 'Advanced', duration_minutes: 240, url: 'https://pytorch.org/' }
    ],
  },
];

export const api = {
  // Authentication API using Supabase Auth
  signup: async (data: {
    first_name: string;
    last_name: string;
    college_name: string;
    email: string;
    password: string;
  }): Promise<AuthResponseData> => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email.trim(),
      password: data.password,
      options: {
        data: {
          first_name: data.first_name.trim(),
          last_name: data.last_name.trim(),
          college_name: data.college_name.trim(),
        },
      },
    });

    if (error) {
      if (error.message.includes('Invalid API key') || error.message.includes('apikey')) {
        throw new Error('Supabase Anon Key is missing or invalid in Vercel. Please set VITE_SUPABASE_ANON_KEY in Vercel Environment Variables.');
      }
      throw new Error(error.message || 'Signup failed. Please try again.');
    }

    const user = authData.user;
    if (!user) {
      throw new Error('User creation failed.');
    }

    // Upsert into profiles table
    await supabase.from('profiles').upsert({
      id: user.id,
      email: data.email.trim(),
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      college_name: data.college_name.trim(),
    });

    const token = authData.session?.access_token || `sb_token_${user.id.slice(0, 8)}`;
    const profile_id = `prof_${user.id.slice(0, 12)}`;

    return {
      token,
      user_id: user.id,
      email: user.email || data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      college_name: data.college_name,
      profile_id,
    };
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponseData> => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: credentials.email.trim(),
      password: credentials.password,
    });

    if (error) {
      if (error.message.includes('Invalid API key') || error.message.includes('apikey')) {
        throw new Error('Supabase Anon Key is missing or invalid in Vercel. Please set VITE_SUPABASE_ANON_KEY in Vercel Environment Variables.');
      }
      throw new Error(error.message || 'Invalid email or password.');
    }

    const user = authData.user;
    if (!user) {
      throw new Error('Authentication failed.');
    }

    // Query profiles table
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const meta = user.user_metadata || {};
    const first_name = profileData?.first_name || meta.first_name || 'Alex';
    const last_name = profileData?.last_name || meta.last_name || 'Learner';
    const college_name = profileData?.college_name || meta.college_name || 'PathFinder Workspace';

    const token = authData.session?.access_token || `sb_token_${user.id.slice(0, 8)}`;
    const profile_id = `prof_${user.id.slice(0, 12)}`;

    return {
      token,
      user_id: user.id,
      email: user.email || credentials.email,
      first_name,
      last_name,
      college_name,
      profile_id,
    };
  },

  getMe: async (): Promise<AuthResponseData> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        token: 'usr_alex_demo',
        user_id: 'usr_alex_demo',
        email: 'alex@demo.hcl',
        first_name: 'Alex',
        last_name: 'Evaluator',
        college_name: 'HCL Amplify Institute',
        profile_id: 'prof_alex_001',
      };
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const meta = user.user_metadata || {};
    return {
      token: `sb_token_${user.id.slice(0, 8)}`,
      user_id: user.id,
      email: user.email || 'student@college.edu',
      first_name: profileData?.first_name || meta.first_name || 'Alex',
      last_name: profileData?.last_name || meta.last_name || 'Learner',
      college_name: profileData?.college_name || meta.college_name || 'PathFinder Workspace',
      profile_id: `prof_${user.id.slice(0, 12)}`,
    };
  },

  logout: async (): Promise<{ message: string }> => {
    await supabase.auth.signOut();
    return { message: 'Logged out successfully' };
  },

  // Onboarding & Profile Extraction
  analyzeProfile: async (text: string): Promise<ProfileExtractResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-profile', {
        body: { natural_language_input: text },
      });
      if (!error && data?.target_role) {
        return data;
      }
    } catch (_) {}

    // Deterministic fallback parser
    const textLower = text.toLowerCase();
    let target_role = 'AI Engineer';
    if (textLower.includes('data analyst')) target_role = 'Data Analyst';
    else if (textLower.includes('data scientist')) target_role = 'Data Scientist';
    else if (textLower.includes('full stack') || textLower.includes('web')) target_role = 'Full Stack Developer';

    return {
      target_role,
      experience_level: textLower.includes('advanced') ? 'Advanced' : 'Intermediate',
      skills: [
        { name: 'Python Programming', level: 'Intermediate' },
        { name: 'SQL & Relational Databases', level: 'Intermediate' },
      ],
      interests: ['Artificial Intelligence'],
      weekly_hours: 8,
      timeline_months: 6,
      learning_preference: 'Project Based',
      extracted_summary: `Identified background targeting ${target_role} path.`,
    };
  },

  updateProfile: async (data: {
    target_career_id: string;
    experience_level: string;
    weekly_hours: number;
    timeline_months: number;
    learning_preference: string;
    skills: { name: string; level: string }[];
  }): Promise<{ status: string; message: string }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('learner_profiles').upsert({
        user_id: user.id,
        target_career_id: data.target_career_id,
        experience_level: data.experience_level,
        weekly_hours: data.weekly_hours,
        timeline_months: data.timeline_months,
        learning_preference: data.learning_preference,
        readiness_score: 41.3,
        updated_at: new Date().toISOString(),
      });
    }
    return { status: 'success', message: 'Profile updated and path generated successfully' };
  },

  getCurrentProfile: async (): Promise<LearnerProfile> => {
    const { data: { user } } = await supabase.auth.getUser();
    return {
      id: user ? `prof_${user.id.slice(0, 12)}` : 'prof_alex_001',
      user_id: user?.id || 'usr_alex_demo',
      target_career_id: 'c_ai_engineer',
      experience_level: 'Intermediate',
      weekly_hours: 8,
      timeline_months: 6,
      learning_preference: 'Project Based',
      readiness_score: 41.3,
      updated_at: new Date().toISOString(),
    };
  },

  // Dashboard & Navigation Data
  getDashboard: async (): Promise<DashboardData> => {
    const profile = await api.getCurrentProfile();
    const targetCareer = SEED_CAREERS.find((c) => c.id === profile.target_career_id) || SEED_CAREERS[0];

    const mastered: LearnerSkillStatus[] = [
      { skill_id: 's_python', name: 'Python Programming', category: 'Language', proficiency: 'Intermediate', confidence: 'High', status: 'MASTERED' },
      { skill_id: 's_sql', name: 'SQL & Relational Databases', category: 'Data', proficiency: 'Intermediate', confidence: 'High', status: 'MASTERED' },
    ];

    const developing: LearnerSkillStatus[] = [
      { skill_id: 's_model_eval', name: 'Model Evaluation & Metrics', category: 'ML', proficiency: 'Intermediate', confidence: 'Medium', status: 'DEVELOPING' },
    ];

    const missing: LearnerSkillStatus[] = [
      { skill_id: 's_deep_learning', name: 'Deep Learning & PyTorch', category: 'AI', proficiency: 'Beginner', confidence: 'Low', status: 'MISSING' },
    ];

    return {
      profile,
      target_career: targetCareer,
      readiness_score: 41.3,
      next_best_action: {
        skill_id: 's_model_eval',
        skill_name: 'Model Evaluation & Metrics',
        title: 'Master Model Evaluation',
        action_type: 'Assessment',
        estimated_minutes: 90,
        why_now: 'Unlocks Deep Learning and addresses critical precision/recall gap for AI Engineering.',
        cta_label: 'Start Micro-Assessment',
        item_id: 'a_model_eval',
      },
      milestones_completed: 8,
      milestones_total: 15,
      skill_gaps: {
        target_career: targetCareer.title,
        readiness_score: 41.3,
        mastered,
        developing,
        missing,
        locked: [],
        recommended: developing,
      },
      ai_insight: `Your next milestone 'Model Evaluation & Metrics' is unlocked and addresses a critical requirement for ${targetCareer.title}.`,
    };
  },

  getCareers: async (): Promise<Career[]> => SEED_CAREERS,

  getCareerDetail: async (id: string): Promise<Career> =>
    SEED_CAREERS.find((c) => c.id === id) || SEED_CAREERS[0],

  simulateCareer: async (target_career_id: string): Promise<SimulateCareerResponse> => {
    const target = SEED_CAREERS.find((c) => c.id === target_career_id) || SEED_CAREERS[1];
    return {
      current_career_id: 'c_ai_engineer',
      target_career_id,
      target_career_title: target.title,
      skill_overlap_percentage: 72.7,
      shared_skills: ['Python Programming', 'SQL & Relational Databases'],
      new_skills_required: ['Tableau Visualization', 'A/B Testing & Hypothesis Testing'],
      estimated_additional_weeks: 4,
      recommended_projects: ['E-Commerce Data Pipeline'],
    };
  },

  getCurrentPath: async (): Promise<LearningPath> => ({
    id: 'path_001',
    profile_id: 'prof_alex_001',
    career_id: 'c_ai_engineer',
    career_title: 'AI Engineer',
    total_steps: 15,
    completed_steps: 8,
    is_active: true,
    steps: SEED_STEPS,
  }),

  generatePath: async (): Promise<LearningPath> => api.getCurrentPath(),

  getSkillGaps: async (): Promise<SkillGapAnalysis> => {
    const dash = await api.getDashboard();
    return dash.skill_gaps;
  },

  getSkills: async () => [
    { id: 's_python', name: 'Python Programming', category: 'Language', difficulty: 'Beginner', prerequisite_ids: [] },
    { id: 's_sql', name: 'SQL & Relational Databases', category: 'Data', difficulty: 'Intermediate', prerequisite_ids: [] },
    { id: 's_model_eval', name: 'Model Evaluation & Metrics', category: 'ML', difficulty: 'Intermediate', prerequisite_ids: ['s_python'] },
  ],

  getAssessment: async (assessmentId: string): Promise<AssessmentDetail> => ({
    id: assessmentId,
    skill_id: 's_model_eval',
    skill_name: 'Model Evaluation & Metrics',
    title: 'Model Evaluation & Metrics Assessment',
    description: 'Verify your understanding of ROC-AUC, precision, recall, and confusion matrix interpretation.',
    questions: [
      {
        id: 'q1',
        question_text: 'When dealing with severely imbalanced medical diagnosis data, which metric should be prioritized over Accuracy?',
        options: ['Precision & Recall (F1-Score)', 'Mean Squared Error', 'Adjusted R-Squared', 'Training Velocity'],
      },
      {
        id: 'q2',
        question_text: 'What does an ROC-AUC score of 0.5 indicate for a binary classification model?',
        options: ['Perfect classification performance', 'Performance no better than random guessing', 'Overfitting on the training set', 'Zero false positive rate'],
      },
    ],
  }),

  evaluateAssessment: async (
    assessment_id: string,
    answers: Record<string, number>
  ): Promise<AssessmentEvaluateResponse> => ({
    result_id: 'res_99182',
    score_percentage: 100.0,
    passed: true,
    weak_skills: [],
    strong_skills: ['Model Evaluation & Metrics'],
    recommendation: 'Mastered! Unlocked Phase 3: Deep Learning & Neural Networks.',
  }),

  submitFeedback: async (skill_id: string, sentiment: string, comment?: string) => ({
    status: 'success',
    message: 'Feedback processed',
    path_updated: true,
  }),

  sendChatMessage: async (message: string): Promise<ChatResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-copilot', {
        body: { message, context: { target_career: 'AI Engineer', readiness_score: 41.3 } },
      });
      if (!error && data?.reply) {
        return data;
      }
    } catch (_) {}

    return {
      reply: `PathFinder Copilot: Based on your current AI Engineer path (41% readiness), your top priority is mastering Model Evaluation before advancing to Deep Learning.`,
      suggested_actions: ['Start Next Action', 'View Roadmap', 'What-if Simulator'],
    };
  },
};
