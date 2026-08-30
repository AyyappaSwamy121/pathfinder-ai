import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, AuthResponseData } from '../services/api';
import { DashboardData, LearningPath, LearnerProfile } from '../types';

export interface UserState {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  college_name: string;
  profile_id: string;
}

interface LearnerContextType {
  user: UserState | null;
  token: string | null;
  isAuthenticated: boolean;
  profile: LearnerProfile | null;
  dashboard: DashboardData | null;
  activePath: LearningPath | null;
  loading: boolean;
  error: string | null;
  signup: (data: { first_name: string; last_name: string; college_name: string; email: string; password: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshState: () => Promise<void>;
  loadPresetProfile: (preset: 'alex' | 'jordan' | 'devon') => Promise<void>;
}

const LearnerContext = createContext<LearnerContextType | undefined>(undefined);

export const LearnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState | null>(() => {
    const savedUser = localStorage.getItem('pathfinder_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('pathfinder_token'));

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [activePath, setActivePath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    const userObj: UserState = {
      id: res.user_id,
      email: res.email,
      first_name: res.first_name,
      last_name: res.last_name,
      college_name: res.college_name,
      profile_id: res.profile_id,
    };
    setUser(userObj);
    setToken(res.token);
    localStorage.setItem('pathfinder_token', res.token);
    localStorage.setItem('pathfinder_user', JSON.stringify(userObj));
    await refreshState();
  };

  const signup = async (data: { first_name: string; last_name: string; college_name: string; email: string; password: string }) => {
    const res = await api.signup(data);
    const userObj: UserState = {
      id: res.user_id,
      email: res.email,
      first_name: res.first_name,
      last_name: res.last_name,
      college_name: res.college_name,
      profile_id: res.profile_id,
    };
    setUser(userObj);
    setToken(res.token);
    localStorage.setItem('pathfinder_token', res.token);
    localStorage.setItem('pathfinder_user', JSON.stringify(userObj));
    await refreshState();
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (_) {}
    setUser(null);
    setToken(null);
    localStorage.removeItem('pathfinder_token');
    localStorage.removeItem('pathfinder_user');
    await refreshState();
  };

  const loadPresetProfile = async (preset: 'alex' | 'jordan' | 'devon') => {
    let presetSkills = [
      { name: 'Python Programming', level: 'Intermediate' },
      { name: 'SQL & Relational Databases', level: 'Intermediate' },
    ];
    let careerId = 'c_ai_engineer';
    let pName = 'Alex';

    if (preset === 'jordan') {
      presetSkills = [
        { name: 'HTML5 & CSS3', level: 'Beginner' },
        { name: 'Python Programming', level: 'Beginner' },
      ];
      careerId = 'c_data_analyst';
      pName = 'Jordan';
    } else if (preset === 'devon') {
      presetSkills = [
        { name: 'TypeScript', level: 'Intermediate' },
        { name: 'FastAPI & REST APIs', level: 'Intermediate' },
        { name: 'Docker & Containerization', level: 'Intermediate' },
      ];
      careerId = 'c_fullstack_dev';
      pName = 'Devon';
    }

    const demoUser: UserState = {
      id: `usr_${preset}_demo`,
      email: `${preset}@demo.hcl`,
      first_name: pName,
      last_name: 'Evaluator',
      college_name: 'HCL Amplify Institute',
      profile_id: `prof_${preset}_001`,
    };
    setUser(demoUser);
    setToken(`usr_${preset}_demo`);
    localStorage.setItem('pathfinder_token', `usr_${preset}_demo`);
    localStorage.setItem('pathfinder_user', JSON.stringify(demoUser));

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
        user,
        token,
        isAuthenticated: !!token || !!user,
        profile,
        dashboard,
        activePath,
        loading,
        error,
        signup,
        login,
        logout,
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
