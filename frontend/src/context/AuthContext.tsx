import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, supabase } from '../services/api';
import { AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (data: {
    first_name: string;
    last_name: string;
    college_name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateOnboarding: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const syncAuth = async () => {
    try {
      const res = await api.getMe();
      if (res) {
        setUser({
          id: res.user_id,
          email: res.email,
          name: `${res.first_name} ${res.last_name}`,
          first_name: res.first_name,
          last_name: res.last_name,
          college_name: res.college_name,
          is_onboarded: true,
          profile_id: res.profile_id,
        });
        setToken(res.token);
      }
    } catch {
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncAuth();
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      syncAuth();
    });
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.login(credentials);
    setUser({
      id: res.user_id,
      email: res.email,
      name: `${res.first_name} ${res.last_name}`,
      first_name: res.first_name,
      last_name: res.last_name,
      college_name: res.college_name,
      is_onboarded: true,
      profile_id: res.profile_id,
    });
    setToken(res.token);
  };

  const signup = async (data: {
    first_name: string;
    last_name: string;
    college_name: string;
    email: string;
    password: string;
  }) => {
    const res = await api.signup(data);
    setUser({
      id: res.user_id,
      email: res.email,
      name: `${res.first_name} ${res.last_name}`,
      first_name: res.first_name,
      last_name: res.last_name,
      college_name: res.college_name,
      is_onboarded: true,
      profile_id: res.profile_id,
    });
    setToken(res.token);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setToken(null);
  };

  const updateOnboarding = (status: boolean) => {
    if (user) {
      setUser({ ...user, is_onboarded: status });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isOnboarded: !!user?.is_onboarded,
        loading,
        login,
        signup,
        logout,
        updateOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
