import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredToken, setStoredToken } from '../services/api';
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
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [loading, setLoading] = useState<boolean>(true);

  const initAuth = async () => {
    const existingToken = getStoredToken();
    if (existingToken) {
      try {
        const userData = await api.getMe();
        setUser(userData);
        setToken(existingToken);
      } catch (err) {
        console.warn('Session verification failed, resetting token:', err);
        setStoredToken(null);
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.login(credentials);
    setStoredToken(res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const signup = async (data: {
    first_name: string;
    last_name: string;
    college_name: string;
    email: string;
    password: string;
  }) => {
    const res = await api.signup(data);
    setStoredToken(res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore error on network disconnect
    }
    setStoredToken(null);
    setToken(null);
    setUser(null);
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
