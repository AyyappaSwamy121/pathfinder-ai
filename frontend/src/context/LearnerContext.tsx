import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { DashboardData, LearningPath, LearnerProfile } from '../types';
import { useAuth } from './AuthContext';

interface LearnerContextType {
  profile: LearnerProfile | null;
  dashboard: DashboardData | null;
  activePath: LearningPath | null;
  loading: boolean;
  error: string | null;
  judgeMode: boolean;
  toggleJudgeMode: () => void;
  refreshState: () => Promise<void>;
  loadPresetProfile: (preset: 'alex' | 'jordan' | 'devon') => Promise<void>;
}

const LearnerContext = createContext<LearnerContextType | undefined>(undefined);

export const LearnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [activePath, setActivePath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [judgeMode, setJudgeMode] = useState<boolean>(true);

  const refreshState = async () => {
    try {
      setLoading(true);
      setError(null);
      const dash = await api.getDashboard();
      const path = await api.getCurrentPath();
      setDashboard(dash);
      setProfile(dash.profile);
      setActivePath(path);
    } catch (err: any) {
      console.warn('Backend API connection warning:', err);
      setError('Using offline demo mode.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshState();
  }, [token]);


  const toggleJudgeMode = () => setJudgeMode(!judgeMode);

  const loadPresetProfile = async (preset: 'alex' | 'jordan' | 'devon') => {
    let presetSkills = [
      { name: 'Python Programming', level: 'Intermediate' },
      { name: 'SQL & Relational Databases', level: 'Intermediate' },
    ];
    let careerId = 'c_ai_engineer';

    if (preset === 'jordan') {
      presetSkills = [
        { name: 'HTML5 & CSS3', level: 'Beginner' },
        { name: 'Python Programming', level: 'Beginner' },
      ];
      careerId = 'c_data_analyst';
    } else if (preset === 'devon') {
      presetSkills = [
        { name: 'TypeScript', level: 'Intermediate' },
        { name: 'FastAPI & REST APIs', level: 'Intermediate' },
        { name: 'Docker & Containerization', level: 'Intermediate' },
      ];
      careerId = 'c_fullstack_dev';
    }

    await api.updateProfile({
      target_career_id: careerId,
      experience_level: preset === 'jordan' ? 'Beginner' : 'Intermediate',
      weekly_hours: 10,
      timeline_months: 6,
      learning_preference: 'Project Based',
      skills: presetSkills,
    });

    await refreshState();
  };

  return (
    <LearnerContext.Provider
      value={{
        profile,
        dashboard,
        activePath,
        loading,
        error,
        judgeMode,
        toggleJudgeMode,
        refreshState,
        loadPresetProfile,
      }}
    >
      {children}
    </LearnerContext.Provider>
  );
};

export const useLearner = () => {
  const ctx = useContext(LearnerContext);
  if (!ctx) {
    throw new Error('useLearner must be used within LearnerProvider');
  }
  return ctx;
};
