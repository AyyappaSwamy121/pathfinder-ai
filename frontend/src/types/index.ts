export interface ExtractedSkill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface ProfileExtractResponse {
  target_role: string;
  experience_level: string;
  skills: ExtractedSkill[];
  interests: string[];
  weekly_hours: number;
  timeline_months: number;
  learning_preference: string;
  extracted_summary: string;
}

export interface LearnerProfile {
  id: string;
  user_id: string;
  target_career_id: string | null;
  experience_level: string;
  weekly_hours: number;
  timeline_months: number;
  learning_preference: string;
  readiness_score: number;
  updated_at: string;
}

export interface Career {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  required_skills_count?: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  difficulty: string;
  prerequisite_ids: string[];
}

export interface LearnerSkillStatus {
  skill_id: string;
  name: string;
  category: string;
  proficiency: string;
  confidence: string;
  status: 'MASTERED' | 'DEVELOPING' | 'MISSING' | 'LOCKED' | 'RECOMMENDED';
  evidence?: string;
}

export interface SkillGapAnalysis {
  target_career: string;
  readiness_score: number;
  mastered: LearnerSkillStatus[];
  developing: LearnerSkillStatus[];
  missing: LearnerSkillStatus[];
  locked: LearnerSkillStatus[];
  recommended: LearnerSkillStatus[];
}

export interface Resource {
  id: string;
  skill_id: string;
  title: string;
  provider: string;
  type: string;
  difficulty: string;
  duration_minutes: number;
  url?: string;
  why_this?: string;
}

export interface Project {
  id: string;
  skill_id: string;
  title: string;
  objective: string;
  difficulty: string;
  estimated_hours: number;
  deliverables: string[];
  portfolio_value?: string;
}

export interface PathStep {
  id: string;
  skill_id: string;
  skill_name: string;
  phase_number: number;
  phase_title: string;
  step_order: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'LOCKED';
  estimated_minutes: number;
  difficulty: string;
  reason?: string;
  resources: Resource[];
  project?: Project;
  assessment_id?: string;
}

export interface LearningPath {
  id: string;
  profile_id: string;
  career_id: string;
  career_title: string;
  total_steps: number;
  completed_steps: number;
  is_active: boolean;
  steps: PathStep[];
}

export interface NextBestAction {
  skill_id: string;
  skill_name: string;
  title: string;
  action_type: string;
  estimated_minutes: number;
  why_now: string;
  cta_label: string;
  item_id: string;
}

export interface Question {
  id: string;
  question_text: string;
  options: string[];
}

export interface AssessmentDetail {
  id: string;
  skill_id: string;
  skill_name: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface AssessmentEvaluateResponse {
  result_id: string;
  score_percentage: number;
  passed: boolean;
  weak_skills: string[];
  strong_skills: string[];
  recommendation: string;
}

export interface SimulateCareerResponse {
  current_career_id: string;
  target_career_id: string;
  target_career_title: string;
  skill_overlap_percentage: number;
  shared_skills: string[];
  new_skills_required: string[];
  estimated_additional_weeks: number;
  recommended_projects: string[];
}

export interface ChatResponse {
  reply: string;
  suggested_actions?: string[];
}

export interface DashboardData {
  profile: LearnerProfile;
  target_career: Career;
  readiness_score: number;
  next_best_action: NextBestAction;
  milestones_completed: number;
  milestones_total: number;
  skill_gaps: SkillGapAnalysis;
  ai_insight: string;
}
