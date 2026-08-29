import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, LayoutDashboard, MapPin, GitGraph, Briefcase, Award, MessageSquareCode, Sliders, Cpu, Sparkles } from 'lucide-react';
import { useLearner } from '../context/LearnerContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { judgeMode, toggleJudgeMode } = useLearner();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/roadmap', label: 'Roadmap', icon: MapPin },
    { path: '/skills', label: 'Skill Graph', icon: GitGraph },
    { path: '/careers', label: 'Careers', icon: Briefcase },
    { path: '/assessment', label: 'Assessments', icon: Award },
    { path: '/simulator', label: 'What-if', icon: Sliders },
    { path: '/copilot', label: 'AI Copilot', icon: MessageSquareCode },
    { path: '/architecture', label: 'How AI Thinks', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-sm">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-text-main font-extrabold text-lg">PATHFINDER <span className="text-primary font-normal">AI</span></span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-soft text-primary font-semibold'
                      : 'text-text-muted hover:text-text-main hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions & Judge Demo Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleJudgeMode}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                judgeMode
                  ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-xs'
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{judgeMode ? 'Judge Mode ON' : 'Standard Mode'}</span>
            </button>

            <Link
              to="/onboarding"
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Build My Path
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
