import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LearnerProvider, useLearner } from './context/LearnerContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AppShell } from './components/layout/AppShell';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { SkillGraphPage } from './pages/SkillGraphPage';
import { CareersPage } from './pages/CareersPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { CopilotPage } from './pages/CopilotPage';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulatorPage';
import { ArchitecturePage } from './pages/ArchitecturePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useLearner();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">
        Loading PATHFINDER Workspace...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LearnerProvider>
        <Routes>
          {/* Public Landing & Auth Routes */}
          <Route
            path="/"
            element={
              <div className="min-h-screen flex flex-col justify-between bg-[var(--bg)] font-sans text-[var(--text-primary)]">
                <Navbar />
                <main className="flex-1">
                  <LandingPage />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/login"
            element={
              <div className="min-h-screen flex flex-col justify-between bg-[var(--bg)] font-sans text-[var(--text-primary)]">
                <Navbar />
                <main className="flex-1">
                  <AuthPage />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/signup"
            element={
              <div className="min-h-screen flex flex-col justify-between bg-[var(--bg)] font-sans text-[var(--text-primary)]">
                <Navbar />
                <main className="flex-1">
                  <AuthPage />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/onboarding"
            element={
              <div className="min-h-screen flex flex-col justify-between bg-[var(--bg)] font-sans text-[var(--text-primary)]">
                <Navbar />
                <main className="flex-1">
                  <OnboardingPage />
                </main>
                <Footer />
              </div>
            }
          />

          {/* Internal Workspace Routes wrapped in ProtectedRoute & AppShell */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppShell>
                  <DashboardPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <AppShell>
                  <RoadmapPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <AppShell>
                  <SkillGraphPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/careers"
            element={
              <ProtectedRoute>
                <AppShell>
                  <CareersPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <AppShell>
                  <AssessmentPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/copilot"
            element={
              <ProtectedRoute>
                <AppShell>
                  <CopilotPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/simulator"
            element={
              <ProtectedRoute>
                <AppShell>
                  <WhatIfSimulatorPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/architecture"
            element={
              <ProtectedRoute>
                <AppShell>
                  <ArchitecturePage />
                </AppShell>
              </ProtectedRoute>
            }
          />
        </Routes>
      </LearnerProvider>
    </BrowserRouter>
  );
};

export default App;
