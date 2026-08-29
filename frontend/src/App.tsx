import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LearnerProvider } from './context/LearnerContext';
import { Navbar } from './components/Navbar';
import { JudgeDemoBanner } from './components/JudgeDemoBanner';
import { Footer } from './components/Footer';

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
        <div className="min-h-screen flex flex-col justify-between bg-background font-sans text-text-main antialiased selection:bg-primary-soft selection:text-primary">
          <div>
            <JudgeDemoBanner />
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="/skills" element={<SkillGraphPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/assessment" element={<AssessmentPage />} />
                <Route path="/copilot" element={<CopilotPage />} />
                <Route path="/simulator" element={<WhatIfSimulatorPage />} />
                <Route path="/architecture" element={<ArchitecturePage />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </LearnerProvider>
    </BrowserRouter>
  );
};

export default App;
