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

const API_BASE = '/api';

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error (${res.status}): ${errorText}`);
  }

  return res.json();
}

export const api = {
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
