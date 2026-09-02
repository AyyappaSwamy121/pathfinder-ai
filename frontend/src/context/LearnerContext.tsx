import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
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
  isDemoMode: boolean;
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
  exitDemoMode: () => Promise<void>;
  setTargetCareer: (careerId: string) => Promise<void>;
}

const LearnerContext = createContext<LearnerContextType | undefined>(undefined);

export const LearnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState | null>(() => {
    const savedUser = localStorage.getItem('pathfinder_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('pathfinder_token'));
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return sessionStorage.getItem('pathfinder_demo_mode') === 'true';
  });

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [activePath, setActivePath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshState = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check current Supabase Auth user
      const me = await api.getMe();
      if (me && me.user_id && me.user_id !== 'usr_alex_demo' && !isDemoMode) {
        const userObj: UserState = {
          id: me.user_id,
          email: me.email,
          first_name: me.first_name,
          last_name: me.last_name,
          college_name: me.college_name,
          profile_id: me.profile_id,
        };
        setUser(userObj);
        setToken(me.token);
        localStorage.setItem('pathfinder_user', JSON.stringify(userObj));
        localStorage.setItem('pathfinder_token', me.token);
      }

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
  }, [token, isDemoMode]);

  const login = async (email: string, password: string) => {
    sessionStorage.setItem('pathfinder_demo_mode', 'false');
    sessionStorage.removeItem('pathfinder_demo_preset');
    setIsDemoMode(false);

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
    sessionStorage.setItem('pathfinder_demo_mode', 'false');
    sessionStorage.removeItem('pathfinder_demo_preset');
    setIsDemoMode(false);

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
    sessionStorage.setItem('pathfinder_demo_mode', 'false');
    sessionStorage.removeItem('pathfinder_demo_preset');
    setIsDemoMode(false);

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
    sessionStorage.setItem('pathfinder_demo_mode', 'true');
    sessionStorage.setItem('pathfinder_demo_preset', preset);
    setIsDemoMode(true);

    let pName = 'Alex';
    let careerId = 'c_ai_engineer';

    if (preset === 'jordan') {
      pName = 'Jordan';
      careerId = 'c_data_analyst';
    } else if (preset === 'devon') {
      pName = 'Devon';
      careerId = 'c_fullstack_dev';
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

    await refreshState();
  };

  const setTargetCareer = async (careerId: string) => {
    try {
      setLoading(true);
      await api.setTargetCareer(careerId);
      await refreshState();
    } catch (e) {
      console.error('Failed to set target career:', e);
    } finally {
      setLoading(false);
    }
  };

  const exitDemoMode = async () => {
    sessionStorage.setItem('pathfinder_demo_mode', 'false');
    sessionStorage.removeItem('pathfinder_demo_preset');
    setIsDemoMode(false);
    const savedUser = localStorage.getItem('pathfinder_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    await refreshState();
  };

  return (
    <LearnerContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token || !!user,
        isDemoMode,
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
        exitDemoMode,
        setTargetCareer,
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
