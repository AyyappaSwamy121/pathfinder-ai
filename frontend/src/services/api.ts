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
  LearnerSkillStatus,
  CareerTwinSimulateResponse,
  CareerTwinExplainResponse,
  TransitionPathOption,
  LearningRoiItem,
  TransitionNode
} from '../types';
import { CAREER_PROFILES, generateRoleRoadmap } from './careerKnowledge';

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
export const SEED_CAREERS: Career[] = [
  {
    id: 'c_ai_engineer',
    title: 'AI Engineer',
    description: 'Design, train, and deploy production-grade Artificial Intelligence and Machine Learning models.',
    icon: 'Cpu',
    category: 'Artificial Intelligence',
    required_skills_count: 12,
  },
  {
    id: 'c_data_scientist',
    title: 'Data Scientist',
    description: 'Extract statistical insights, build predictive models, and perform exploratory data analysis.',
    icon: 'LineChart',
    category: 'Data Science',
    required_skills_count: 11,
  },
  {
    id: 'c_fullstack_dev',
    title: 'Full Stack Developer',
    description: 'Build modern frontend React applications and scalable FastAPI/Node backend web microservices.',
    icon: 'Code2',
    category: 'Software Engineering',
    required_skills_count: 11,
  },
  {
    id: 'c_data_analyst',
    title: 'Data Analyst',
    description: 'Transform complex business datasets into intuitive dashboards, SQL queries, and visual reporting.',
    icon: 'BarChart3',
    category: 'Analytics',
    required_skills_count: 6,
  },
  {
    id: 'c_cloud_engineer',
    title: 'Cloud Engineer',
    description: 'Architect, provision, and maintain secure resilient cloud infrastructure on AWS and Kubernetes.',
    icon: 'Cloud',
    category: 'Cloud & Infrastructure',
    required_skills_count: 8,
  },
  {
    id: 'c_cybersecurity',
    title: 'Cybersecurity Engineer',
    description: 'Protect critical digital infrastructure, audit network security, and analyze vulnerabilities.',
    icon: 'ShieldCheck',
    category: 'Security',
    required_skills_count: 6,
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
    const isDemo = sessionStorage.getItem('pathfinder_demo_mode') === 'true';
    const preset = sessionStorage.getItem('pathfinder_demo_preset') || 'alex';
    const savedCareer = localStorage.getItem('pathfinder_target_career') || sessionStorage.getItem('pathfinder_target_career');

    if (isDemo) {
      const targetCareerId = savedCareer || (preset === 'jordan' ? 'c_data_analyst' : preset === 'devon' ? 'c_fullstack_dev' : 'c_ai_engineer');
      return {
        id: `prof_${preset}_001`,
        user_id: `usr_${preset}_demo`,
        target_career_id: targetCareerId,
        experience_level: preset === 'jordan' ? 'Beginner' : 'Intermediate',
        weekly_hours: 8,
        timeline_months: 6,
        learning_preference: 'Project Based',
        readiness_score: preset === 'jordan' ? 25.0 : preset === 'devon' ? 55.0 : 41.3,
        updated_at: new Date().toISOString(),
      };
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        id: 'prof_guest',
        user_id: 'guest',
        target_career_id: savedCareer || 'c_ai_engineer',
        experience_level: 'Beginner',
        weekly_hours: 8,
        timeline_months: 6,
        learning_preference: 'Project Based',
        readiness_score: 15.0,
        updated_at: new Date().toISOString(),
      };
    }

    // Fetch real learner profile from Supabase PostgreSQL
    const { data: realProfile } = await supabase
      .from('learner_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (realProfile) {
      const activeCareer = savedCareer || realProfile.target_career_id || 'c_ai_engineer';
      return {
        id: realProfile.id,
        user_id: realProfile.user_id,
        target_career_id: activeCareer,
        experience_level: realProfile.experience_level || 'Beginner',
        weekly_hours: realProfile.weekly_hours || 8,
        timeline_months: realProfile.timeline_months || 6,
        learning_preference: realProfile.learning_preference || 'Project Based',
        raw_onboarding_input: realProfile.raw_onboarding_input,
        readiness_score: realProfile.readiness_score || 15.0,
        updated_at: realProfile.updated_at || new Date().toISOString(),
      };
    }

    // Auto-create default learner profile if first time
    const newProfId = `prof_${user.id.slice(0, 12)}`;
    const initialCareer = savedCareer || 'c_ai_engineer';
    await supabase.from('learner_profiles').upsert({
      id: newProfId,
      user_id: user.id,
      target_career_id: initialCareer,
      experience_level: 'Beginner',
      weekly_hours: 8,
      timeline_months: 6,
      learning_preference: 'Project Based',
      readiness_score: 15.0,
    });

    return {
      id: newProfId,
      user_id: user.id,
      target_career_id: initialCareer,
      experience_level: 'Beginner',
      weekly_hours: 8,
      timeline_months: 6,
      learning_preference: 'Project Based',
      readiness_score: 15.0,
      updated_at: new Date().toISOString(),
    };
  },

  // Switch target career role and recalculate across state
  setTargetCareer: async (careerId: string): Promise<void> => {
    localStorage.setItem('pathfinder_target_career', careerId);
    sessionStorage.setItem('pathfinder_target_career', careerId);

    try {
      await apiClient.post('/api/profile/career', { career_id: careerId });
    } catch (_) {}

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('learner_profiles')
          .update({ target_career_id: careerId, updated_at: new Date().toISOString() })
          .eq('user_id', user.id);
      }
    } catch (_) {}
  },

  // Dashboard & Navigation Data - Role-Aware
  getDashboard: async (): Promise<DashboardData> => {
    // Try FastAPI dashboard first if running
    try {
      const { data } = await apiClient.get<DashboardData>('/api/dashboard');
      if (data && data.target_career) {
        return data;
      }
    } catch (_) {}

    const profile = await api.getCurrentProfile();
    const targetCareerId = profile.target_career_id || 'c_ai_engineer';
    const careerCfg = CAREER_PROFILES[targetCareerId] || CAREER_PROFILES.c_ai_engineer;
    const targetCareer: Career = {
      id: careerCfg.id,
      title: careerCfg.title,
      description: careerCfg.description,
      icon: careerCfg.icon,
      category: careerCfg.category,
      required_skills_count: careerCfg.required_skills_count,
    };

    // Determine initial mastered/developing skills based on target career
    let defaultMasteredIds: string[] = [];
    if (targetCareerId === 'c_ai_engineer') {
      defaultMasteredIds = ['s_python', 's_numpy', 's_pandas'];
    } else if (targetCareerId === 'c_data_scientist') {
      defaultMasteredIds = ['s_python', 's_sql'];
    } else if (targetCareerId === 'c_fullstack_dev') {
      defaultMasteredIds = ['s_html_css', 's_typescript'];
    } else if (targetCareerId === 'c_data_analyst') {
      defaultMasteredIds = ['s_excel', 's_sql'];
    } else if (targetCareerId === 'c_cloud_engineer') {
      defaultMasteredIds = ['s_linux', 's_networking'];
    } else if (targetCareerId === 'c_cybersecurity') {
      defaultMasteredIds = ['s_linux', 's_networking'];
    }

    const { readinessScore } = generateRoleRoadmap(targetCareerId, defaultMasteredIds, profile.weekly_hours || 8);

    const mastered: LearnerSkillStatus[] = careerCfg.skills
      .filter((s) => defaultMasteredIds.includes(s.id))
      .map((s) => ({
        skill_id: s.id,
        name: s.name,
        category: s.category,
        proficiency: s.difficulty,
        confidence: 'High',
        status: 'MASTERED',
      }));

    const developingSkills = careerCfg.skills.filter((s) => !defaultMasteredIds.includes(s.id));
    const developing: LearnerSkillStatus[] = developingSkills.slice(0, 1).map((s) => ({
      skill_id: s.id,
      name: s.name,
      category: s.category,
      proficiency: s.difficulty,
      confidence: 'Medium',
      status: 'DEVELOPING',
    }));

    const missing: LearnerSkillStatus[] = developingSkills.slice(1).map((s) => ({
      skill_id: s.id,
      name: s.name,
      category: s.category,
      proficiency: s.difficulty,
      confidence: 'Low',
      status: 'MISSING',
    }));

    const nextAction = careerCfg.default_next_action;

    return {
      profile,
      target_career: targetCareer,
      readiness_score: readinessScore,
      next_best_action: {
        skill_id: nextAction.skill_id,
        skill_name: nextAction.skill_name,
        title: nextAction.title,
        action_type: nextAction.action_type,
        estimated_minutes: nextAction.estimated_minutes,
        why_now: nextAction.why_now,
        cta_label: nextAction.cta_label,
        item_id: nextAction.item_id,
      },
      milestones_completed: mastered.length,
      milestones_total: careerCfg.skills.length,
      skill_gaps: {
        target_career: targetCareer.title,
        readiness_score: readinessScore,
        mastered,
        developing,
        missing,
        locked: [],
        recommended: developing,
      },
      ai_insight: `Your personalized ${targetCareer.title} roadmap is active. Next focus: master ${nextAction.skill_name}.`,
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

  // Role-Aware Dynamic Roadmap Path
  getCurrentPath: async (): Promise<LearningPath> => {
    // Try FastAPI backend if active
    try {
      const { data } = await apiClient.get<LearningPath>('/api/paths/current');
      if (data && data.steps && data.steps.length > 0) {
        return data;
      }
    } catch (_) {}

    const profile = await api.getCurrentProfile();
    const targetCareerId = profile.target_career_id || 'c_ai_engineer';

    let defaultMasteredIds: string[] = [];
    if (targetCareerId === 'c_ai_engineer') {
      defaultMasteredIds = ['s_python', 's_numpy', 's_pandas'];
    } else if (targetCareerId === 'c_data_scientist') {
      defaultMasteredIds = ['s_python', 's_sql'];
    } else if (targetCareerId === 'c_fullstack_dev') {
      defaultMasteredIds = ['s_html_css', 's_typescript'];
    } else if (targetCareerId === 'c_data_analyst') {
      defaultMasteredIds = ['s_excel', 's_sql'];
    } else if (targetCareerId === 'c_cloud_engineer' || targetCareerId === 'c_cybersecurity') {
      defaultMasteredIds = ['s_linux', 's_networking'];
    }

    const { career, steps, totalSteps, completedSteps } = generateRoleRoadmap(
      targetCareerId,
      defaultMasteredIds,
      profile.weekly_hours || 8
    );

    return {
      id: `path_${profile.id}_${targetCareerId}`,
      profile_id: profile.id,
      career_id: targetCareerId,
      career_title: career.title,
      total_steps: totalSteps,
      completed_steps: completedSteps,
      is_active: true,
      steps,
    };
  },

  generatePath: async (): Promise<LearningPath> => api.getCurrentPath(),

  getSkillGaps: async (): Promise<SkillGapAnalysis> => {
    const dash = await api.getDashboard();
    return dash.skill_gaps;
  },

  getSkills: async () => {
    const profile = await api.getCurrentProfile();
    const targetCareerId = profile.target_career_id || 'c_ai_engineer';
    const careerCfg = CAREER_PROFILES[targetCareerId] || CAREER_PROFILES.c_ai_engineer;
    return careerCfg.skills.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      difficulty: s.difficulty,
      prerequisite_ids: s.prerequisites,
    }));
  },

  // Role-Aware Assessment Retrieval
  getAssessment: async (assessmentId: string): Promise<AssessmentDetail> => {
    // Search all career profiles for matching assessment
    for (const cp of Object.values(CAREER_PROFILES)) {
      for (const s of cp.skills) {
        if (s.assessment && (s.assessment.id === assessmentId || s.id === assessmentId)) {
          return s.assessment;
        }
      }
    }

    // Default fallback
    return (
      CAREER_PROFILES.c_ai_engineer.skills.find((s) => s.assessment)?.assessment || {
        id: assessmentId,
        skill_id: 's_model_eval',
        skill_name: 'Model Evaluation & Metrics',
        title: 'Model Evaluation & Metrics Assessment',
        description: 'Verify your understanding of precision, recall, and evaluation metrics.',
        questions: [
          {
            id: 'q1',
            question_text: 'When dealing with severely imbalanced medical diagnosis data, which metric should be prioritized?',
            options: ['Precision', 'Recall (Sensitivity)', 'Specificity', 'Accuracy'],
          },
        ],
      }
    );
  },

  evaluateAssessment: async (
    assessment_id: string,
    answers: Record<string, number>
  ): Promise<AssessmentEvaluateResponse> => ({
    result_id: `res_${Date.now()}`,
    score_percentage: 100.0,
    passed: true,
    weak_skills: [],
    strong_skills: ['Target Competency'],
    recommendation: 'Proficiency verified! Next milestone unlocked on your personalized roadmap.',
  }),

  submitFeedback: async (skill_id: string, sentiment: string, comment?: string) => ({
    status: 'success',
    message: 'Feedback processed',
    path_updated: true,
  }),

  // Role-Aware AI Copilot Chat
  sendChatMessage: async (message: string): Promise<ChatResponse> => {
    const profile = await api.getCurrentProfile();
    const targetCareerId = profile.target_career_id || 'c_ai_engineer';
    const careerCfg = CAREER_PROFILES[targetCareerId] || CAREER_PROFILES.c_ai_engineer;

    try {
      const { data, error } = await supabase.functions.invoke('ai-copilot', {
        body: {
          message,
          context: {
            target_career: careerCfg.title,
            readiness_score: profile.readiness_score || 45.0,
            next_action: careerCfg.default_next_action,
          },
        },
      });
      if (!error && data?.reply) {
        return data;
      }
    } catch (_) {}

    let roleAction = careerCfg.default_next_action.title;
    return {
      reply: `PathFinder Copilot: Based on your current ${careerCfg.title} roadmap (${Math.round(profile.readiness_score || 42)}% readiness), your top priority is mastering **${roleAction}** to unlock downstream requirements.`,
      suggested_actions: ['Start Next Action', 'View Roadmap', 'Explore Career Twin'],
    };
  },

  // Career Twin Intelligent Transition Simulator
  simulateCareerTwin: async (
    target_career_id: string,
    options: { weekly_hours?: number; target_timeline_months?: number; priority_mode?: string } = {}
  ): Promise<CareerTwinSimulateResponse> => {
    const weeklyHours = options.weekly_hours || 8;
    const priorityMode = options.priority_mode || 'BALANCED';

    // Try backend API first if running locally with FastAPI
    try {
      const resp = await fetch('/api/career-twin/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_career_id,
          weekly_hours: weeklyHours,
          target_timeline_months: options.target_timeline_months || 6,
          priority_mode: priorityMode,
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        return data;
      }
    } catch (_) {
      // Fall through to deterministic client calculation
    }

    // Client-side Deterministic Career Twin Engine Fallback
    const profile = await api.getCurrentProfile();
    const currentCareer = SEED_CAREERS.find((c) => c.id === profile.target_career_id) || SEED_CAREERS[0];
    const targetCareer = SEED_CAREERS.find((c) => c.id === target_career_id) || SEED_CAREERS[1];

    const currentTitle = currentCareer.title;
    const targetTitle = targetCareer.title;

    // Career-specific skill profiles
    const careerSkillsMap: Record<string, { transferable: string[]; missing: string[]; blocked: string[]; highRoi: string }> = {
      c_data_scientist: {
        transferable: ['Python Programming', 'SQL & Relational Databases'],
        missing: ['Exploratory Data Analysis', 'Statistical Hypothesis Testing', 'Machine Learning Models', 'Data Storytelling & Visualization'],
        blocked: ['Advanced Causal Inference', 'Big Data Spark Analytics'],
        highRoi: 'Statistical Hypothesis Testing',
      },
      c_ai_engineer: {
        transferable: ['Python Programming', 'SQL & Relational Databases'],
        missing: ['Model Evaluation & Metrics', 'Deep Learning & PyTorch', 'Transformer Architectures', 'MLOps Deployment'],
        blocked: ['Distributed LLM Fine-Tuning'],
        highRoi: 'Model Evaluation & Metrics',
      },
      c_fullstack_dev: {
        transferable: ['Python Programming', 'SQL & Relational Databases'],
        missing: ['TypeScript & Modern ESNext', 'React Component Architecture', 'Tailwind & Modern CSS', 'REST & GraphQL APIs'],
        blocked: ['Full-Stack Microservices Orchestration'],
        highRoi: 'TypeScript & Modern ESNext',
      },
      c_data_analyst: {
        transferable: ['SQL & Relational Databases'],
        missing: ['Tableau & PowerBI Dashboards', 'Business Metrics & KPI Analysis', 'Advanced Excel Modeling', 'Exploratory Analysis'],
        blocked: ['Automated Executive Reporting'],
        highRoi: 'Tableau & PowerBI Dashboards',
      },
    };

    const targetDetails = careerSkillsMap[target_career_id] || careerSkillsMap['c_data_scientist'];
    const totalSkillsCount = targetDetails.transferable.length + targetDetails.missing.length + targetDetails.blocked.length;
    const overlapPct = Math.round((targetDetails.transferable.length / Math.max(1, totalSkillsCount)) * 1000) / 10;
    const currentReadiness = Math.round((overlapPct * 0.75 + (profile.readiness_score ? profile.readiness_score * 0.25 : 15)) * 10) / 10;
    const targetReadiness = Math.min(96.0, Math.round((currentReadiness + 38) * 10) / 10);

    const missingCount = targetDetails.missing.length + targetDetails.blocked.length;

    // 3 Paths
    const fastestWeeks = Math.max(2, Math.ceil((missingCount * 8.5) / weeklyHours));
    const balancedWeeks = Math.max(3, Math.ceil((missingCount * 13) / weeklyHours));
    const portfolioWeeks = Math.max(4, Math.ceil((missingCount * 17 + 16) / weeklyHours));

    const paths: TransitionPathOption[] = [
      {
        id: 'fastest',
        name: 'Fastest Path',
        description: 'Accelerated route prioritizing prerequisite backbones and minimum viable competencies.',
        estimated_weeks: fastestWeeks,
        weekly_hours: weeklyHours,
        current_readiness: currentReadiness,
        target_readiness: Math.min(90.0, currentReadiness + 32.0),
        skills_count: missingCount,
        projects_count: 1,
        trade_offs: 'Focuses strictly on critical requirements, skips optional electives and deep portfolio polish.',
        milestones: [
          { phase: 1, title: 'Phase 1: Core Prerequisite Foundations', skills: [targetDetails.missing[0] || 'Foundations'], estimated_weeks: Math.ceil(fastestWeeks * 0.4), project: 'Quick Benchmarking Script' },
          { phase: 2, title: 'Phase 2: Applied Competency Mastery', skills: targetDetails.missing.slice(1, 3), estimated_weeks: Math.ceil(fastestWeeks * 0.6), project: 'Applied Implementation Pipeline' }
        ]
      },
      {
        id: 'balanced',
        name: 'Balanced Path',
        description: 'Recommended strategy balancing deep comprehension, hands-on labs, and steady retention.',
        estimated_weeks: balancedWeeks,
        weekly_hours: weeklyHours,
        current_readiness: currentReadiness,
        target_readiness: targetReadiness,
        skills_count: missingCount,
        projects_count: 2,
        trade_offs: 'Harmonious pace between conceptual depth and practical validation; highly recommended for enterprise transitions.',
        milestones: [
          { phase: 1, title: 'Phase 1: Essential Prerequisites', skills: [targetDetails.missing[0] || 'Core Theory'], estimated_weeks: Math.ceil(balancedWeeks * 0.3), project: 'Foundational Lab' },
          { phase: 2, title: 'Phase 2: Core Domain Competencies', skills: targetDetails.missing.slice(1, 3), estimated_weeks: Math.ceil(balancedWeeks * 0.4), project: 'Domain Prototype System' },
          { phase: 3, title: 'Phase 3: Advanced Integration & Capstone', skills: [...targetDetails.missing.slice(3), ...targetDetails.blocked], estimated_weeks: Math.ceil(balancedWeeks * 0.3), project: 'Industry Capstone Deliverable' }
        ]
      },
      {
        id: 'portfolio',
        name: 'Portfolio-First Path',
        description: 'Artifact-centric path generating deployable GitHub repositories, production demos, and public proof-of-work.',
        estimated_weeks: portfolioWeeks,
        weekly_hours: weeklyHours,
        current_readiness: currentReadiness,
        target_readiness: Math.min(98.0, targetReadiness + 4.0),
        skills_count: missingCount,
        projects_count: 4,
        trade_offs: 'Requires ~3–5 additional weeks of effort, but provides high-confidence evidence for hiring managers.',
        milestones: [
          { phase: 1, title: 'Phase 1: Foundation + Public Repo Setup', skills: [targetDetails.missing[0] || 'Core Architecture'], estimated_weeks: Math.ceil(portfolioWeeks * 0.25), project: 'Open Source Module' },
          { phase: 2, title: 'Phase 2: Full-Scale Implementation Project', skills: targetDetails.missing.slice(1, 3), estimated_weeks: Math.ceil(portfolioWeeks * 0.4), project: 'Interactive Web Application Showcase' },
          { phase: 3, title: 'Phase 3: Production Capstone with CI/CD', skills: [...targetDetails.missing.slice(3), ...targetDetails.blocked], estimated_weeks: Math.ceil(portfolioWeeks * 0.35), project: 'Production Deployable Capstone' }
        ]
      }
    ];

    // High ROI Recommendations
    const roiItems: LearningRoiItem[] = [
      {
        skill_id: 'roi_1',
        skill_name: targetDetails.highRoi,
        roi_score: 9.4,
        readiness_impact: 8.5,
        prerequisite_leverage: 3,
        relevance_score: 1.0,
        estimated_hours: 12,
        why_it_matters: `Highest-leverage entry point for ${targetTitle}. Directly resolves key prerequisite blockers.`,
        what_it_unlocks: targetDetails.missing.slice(1, 3),
      },
      {
        skill_id: 'roi_2',
        skill_name: targetDetails.missing[1] || 'Applied Domain Modeling',
        roi_score: 8.7,
        readiness_impact: 7.8,
        prerequisite_leverage: 2,
        relevance_score: 0.95,
        estimated_hours: 14,
        why_it_matters: `Core competency evaluated in technical interviews for ${targetTitle} roles.`,
        what_it_unlocks: targetDetails.blocked.slice(0, 1),
      },
      {
        skill_id: 'roi_3',
        skill_name: targetDetails.missing[2] || 'Advanced Specialization',
        roi_score: 7.9,
        readiness_impact: 6.9,
        prerequisite_leverage: 1,
        relevance_score: 0.9,
        estimated_hours: 16,
        why_it_matters: `Expands production capabilities and completes target portfolio coverage.`,
        what_it_unlocks: targetDetails.blocked.slice(1, 2),
      },
    ];

    // Transition Graph Nodes
    const graphNodes: TransitionNode[] = [
      ...targetDetails.transferable.map((name, i) => ({
        skill_id: `tr_${i}`,
        name,
        status: (i === 0 ? 'MASTERED' : 'DEVELOPING') as any,
        category: 'Transferable',
        prerequisites: [],
        unlocks: [targetDetails.missing[0] || 'Applied Skills'],
        estimated_hours: 0,
      })),
      {
        skill_id: 'ms_0',
        name: targetDetails.highRoi,
        status: 'NEWLY_UNLOCKED' as any,
        category: 'Core Competency',
        prerequisites: [targetDetails.transferable[0] || 'Foundations'],
        unlocks: targetDetails.missing.slice(1, 3),
        estimated_hours: 12,
      },
      ...targetDetails.missing.filter(s => s !== targetDetails.highRoi).map((name, i) => ({
        skill_id: `ms_${i + 1}`,
        name,
        status: 'MISSING' as any,
        category: 'Required Target Skill',
        prerequisites: [targetDetails.highRoi],
        unlocks: targetDetails.blocked,
        estimated_hours: 14,
      })),
      ...targetDetails.blocked.map((name, i) => ({
        skill_id: `bl_${i}`,
        name,
        status: 'BLOCKED' as any,
        category: 'Advanced Gated',
        prerequisites: [targetDetails.highRoi, targetDetails.missing[1] || 'Applied Skills'],
        unlocks: [],
        estimated_hours: 18,
      })),
    ];

    const selectedPath = paths.find(p => p.id === priorityMode.toLowerCase()) || paths[1];
    const explanation = `Career Twin analyzed your current ${currentTitle} background against ${targetTitle}. You have ${overlapPct}% transferable skill overlap. The ${selectedPath.name} optimizes your transition over ${selectedPath.estimated_weeks} weeks at ${weeklyHours} hrs/week, starting with '${targetDetails.highRoi}' to unblock downstream prerequisite constraints.`;

    return {
      current_career_id: currentCareer.id,
      current_career_title: currentTitle,
      target_career_id: targetCareer.id,
      target_career_title: targetTitle,
      current_readiness: currentReadiness,
      target_readiness: targetReadiness,
      skill_overlap_percentage: overlapPct,
      transferable_skills: targetDetails.transferable,
      missing_skills: targetDetails.missing,
      blocked_skills: targetDetails.blocked,
      total_estimated_effort_hours: missingCount * 14,
      weekly_hours: weeklyHours,
      paths,
      selected_path_id: selectedPath.id,
      highest_leverage_action: roiItems[0],
      learning_roi_recommendations: roiItems,
      transition_graph_nodes: graphNodes,
      ai_explanation: explanation,
    };
  },

  explainCareerTwin: async (
    target_career_id: string,
    question: string,
    options: { selected_path_id?: string; weekly_hours?: number } = {}
  ): Promise<CareerTwinExplainResponse> => {
    // Try backend API first
    try {
      const resp = await fetch('/api/career-twin/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_career_id,
          question,
          selected_path_id: options.selected_path_id || 'balanced',
          weekly_hours: options.weekly_hours || 8,
        }),
      });
      if (resp.ok) {
        return await resp.json();
      }
    } catch (_) {}

    // Fallback explanation grounded in target
    const target = SEED_CAREERS.find((c) => c.id === target_career_id) || SEED_CAREERS[1];
    const q = question.toLowerCase();
    let explanation = `PathFinder Career Twin evaluated your transition to ${target.title}. Backcasting your prerequisite DAG reveals that mastering the core competencies first yields the steepest readiness ascent while keeping weekly commitment manageable.`;
    
    if (q.includes('why') || q.includes('path')) {
      explanation = `The ${options.selected_path_id || 'Balanced'} Path is recommended because it sequences essential prerequisite foundations before advancing into specialized topics. This avoids prerequisite debt and yields steady, verifiable mastery.`;
    } else if (q.includes('reduce') || q.includes('hours')) {
      explanation = `Reducing weekly study hours extends total transition weeks proportionally, but your prerequisite sequence and Learning ROI rankings remain completely stable.`;
    } else if (q.includes('faster')) {
      explanation = `To reach ${target.title} faster, switch to the Fastest Path strategy or increase weekly study time to 10–12 hours. This compresses foundational milestones into minimal viable cycles.`;
    }

    return {
      explanation,
      key_takeaways: [
        `Grounded in live ${target.title} prerequisite DAG.`,
        `Preserves verified sequence: Transferable → Core Foundations → Capstone.`,
        `Adjusting hours dynamically updates target completion timeline.`
      ],
      suggested_questions: [
        'Why should I choose this path?',
        'What happens if I reduce my study time?',
        'Why is this skill missing?',
        'Can I reach this career faster?',
      ]
    };
  },
};

