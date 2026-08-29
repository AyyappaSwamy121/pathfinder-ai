import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LearnerProvider } from './context/LearnerContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AppLayout } from './components/AppLayout';

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
          {/* Public Landing & Onboarding Layout */}
          <Route
            path="/"
            element={
              <div className="min-h-screen flex flex-col justify-between bg-background">
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
              <div className="min-h-screen flex flex-col justify-between bg-background">
                <Navbar />
                <main className="flex-1">
                  <OnboardingPage />
                </main>
                <Footer />
              </div>
            }
          />

          {/* Enterprise Application SaaS Layout (Left Sidebar + Header) */}
          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            }
          />
          <Route
            path="/roadmap"
            element={
              <AppLayout>
                <RoadmapPage />
              </AppLayout>
            }
          />
          <Route
            path="/skills"
            element={
              <AppLayout>
                <SkillGraphPage />
              </AppLayout>
            }
          />
          <Route
            path="/careers"
            element={
              <AppLayout>
                <CareersPage />
              </AppLayout>
            }
          />
          <Route
            path="/assessment"
            element={
              <AppLayout>
                <AssessmentPage />
              </AppLayout>
            }
          />
          <Route
            path="/copilot"
            element={
              <AppLayout>
                <CopilotPage />
              </AppLayout>
            }
          />
          <Route
            path="/simulator"
            element={
              <AppLayout>
                <WhatIfSimulatorPage />
              </AppLayout>
            }
          />
          <Route
            path="/architecture"
            element={
              <AppLayout>
                <ArchitecturePage />
              </AppLayout>
            }
          />
        </Routes>
      </LearnerProvider>
    </BrowserRouter>
  );
};

export default App;
