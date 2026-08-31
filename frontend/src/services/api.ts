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
  ChatResponse
} from '../types';

const envBase = (import.meta as any).env?.VITE_API_BASE_URL;
const API_BASE = envBase ? `${envBase.replace(/\/$/, '')}/api` : '/api';

export interface AuthResponseData {
  token: str;
  user_id: str;
  email: str;
  first_name: str;
  last_name: str;
  college_name: str;
  profile_id: str;
}

type str = string;

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('pathfinder_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text();
    let parsedMsg = errorText;
    try {
      const errObj = JSON.parse(errorText);
      if (typeof errObj.detail === 'string') {
        parsedMsg = errObj.detail;
      } else if (Array.isArray(errObj.detail)) {
        parsedMsg = errObj.detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
      } else if (errObj.message) {
        parsedMsg = errObj.message;
      }
    } catch (_) {}
    throw new Error(parsedMsg || 'Request failed');
  }

  return res.json();
}

export const api = {
  // Authentication API
  signup: (data: {
    first_name: string;
    last_name: string;
    college_name: string;
    email: string;
    password: string;
  }) =>
    fetchJSON<AuthResponseData>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    fetchJSON<AuthResponseData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => fetchJSON<AuthResponseData>('/auth/me'),

  logout: () =>
    fetchJSON<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),

  // Onboarding & Profile
  analyzeProfile: (text: string) =>
    fetchJSON<ProfileExtractResponse>('/profile/analyze', {
      method: 'POST',
      body: JSON.stringify({ natural_language_input: text }),
    }),

  updateProfile: (data: {
    target_career_id: string;
    experience_level: string;
    weekly_hours: number;
    timeline_months: number;
    learning_preference: string;
    skills: { name: string; level: string }[];
  }) =>
    fetchJSON<{ status: string; message: string }>('/profile/update', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCurrentProfile: () => fetchJSON<LearnerProfile>('/profile/current'),

  // Dashboard
  getDashboard: () => fetchJSON<DashboardData>('/dashboard'),

  // Careers & Knowledge Base
  getCareers: () => fetchJSON<Career[]>('/careers'),

  getCareerDetail: (id: string) => fetchJSON<Career>(`/careers/${id}`),

  simulateCareer: (target_career_id: string) =>
    fetchJSON<SimulateCareerResponse>('/careers/simulate', {
      method: 'POST',
      body: JSON.stringify({ target_career_id }),
    }),

  // Roadmap & Skills
  getCurrentPath: () => fetchJSON<LearningPath>('/paths/current'),

  generatePath: () =>
    fetchJSON<LearningPath>('/paths/generate', {
      method: 'POST',
    }),

  getSkillGaps: () => fetchJSON<SkillGapAnalysis>('/skills/gaps'),

  getSkills: () => fetchJSON<import('../types').Skill[]>('/skills'),

  // Assessments & Feedback
  getAssessment: (assessmentId: string) =>
    fetchJSON<AssessmentDetail>(`/assessment/${assessmentId}`),

  evaluateAssessment: (assessment_id: string, answers: Record<string, number>) =>
    fetchJSON<AssessmentEvaluateResponse>('/assessment/evaluate', {
      method: 'POST',
      body: JSON.stringify({ assessment_id, answers }),
    }),

  submitFeedback: (skill_id: string, sentiment: string, comment?: string) =>
    fetchJSON<{ status: string; message: string; path_updated: boolean }>('/feedback', {
      method: 'POST',
      body: JSON.stringify({ skill_id, sentiment, comment }),
    }),

  // AI Copilot
  sendChatMessage: (message: string) =>
    fetchJSON<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
};
