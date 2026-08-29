import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LearnerProvider } from './context/LearnerContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AppShell } from './components/layout/AppShell';

import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { SkillGraphPage } from './pages/SkillGraphPage';
import { CareersPage } from './pages/CareersPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { CopilotPage } from './pages/CopilotPage';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulatorPage';
import { ArchitecturePage } from './pages/ArchitecturePage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LearnerProvider>
        <Routes>
          {/* Public Landing & Onboarding */}
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

          {/* Internal Workspace Routes wrapped in AppShell */}
          <Route
            path="/dashboard"
            element={
              <AppShell>
                <DashboardPage />
              </AppShell>
            }
          />
          <Route
            path="/roadmap"
            element={
              <AppShell>
                <RoadmapPage />
              </AppShell>
            }
          />
          <Route
            path="/skills"
            element={
              <AppShell>
                <SkillGraphPage />
              </AppShell>
            }
          />
          <Route
            path="/careers"
            element={
              <AppShell>
                <CareersPage />
              </AppShell>
            }
          />
          <Route
            path="/assessment"
            element={
              <AppShell>
                <AssessmentPage />
              </AppShell>
            }
          />
          <Route
            path="/copilot"
            element={
              <AppShell>
                <CopilotPage />
              </AppShell>
            }
          />
          <Route
            path="/simulator"
            element={
              <AppShell>
                <WhatIfSimulatorPage />
              </AppShell>
            }
          />
          <Route
            path="/architecture"
            element={
              <AppShell>
                <ArchitecturePage />
              </AppShell>
            }
          />
        </Routes>
      </LearnerProvider>
    </BrowserRouter>
  );
};

export default App;
