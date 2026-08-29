import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, ChevronDown, Sparkles, UserCheck, ShieldCheck, Search } from 'lucide-react';
import { useLearner } from '../context/LearnerContext';

interface TopHeaderProps {
  onOpenMobileSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileSidebar }) => {
  const location = useLocation();
  const { profile, dashboard, loadPresetProfile } = useLearner();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/dashboard':
        return 'Learner Workspace Overview';
      case '/roadmap':
        return 'Personalized Career Path';
      case '/skills':
        return 'Skill Knowledge Graph';
      case '/careers':
        return 'Career Explorer & Knowledge Base';
      case '/assessment':
        return 'Skill Assessment & Remediation';
      case '/simulator':
        return 'What-If Career Simulator';
      case '/copilot':
        return 'AI Career Intelligence Copilot';
      case '/architecture':
        return 'Engineering Transparency & System Logic';
      case '/onboarding':
        return 'Career Onboarding & Profile Extraction';
      default:
        return 'Dashboard Overview';
    }
  };

  return (
    <header className="h-16 bg-surface border-b border-border sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden text-slate-500 hover:text-slate-900 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-bold text-slate-900 leading-none">
            {getPageTitle(location.pathname)}
          </h1>
          <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center space-x-1">
            <span>PathFinder AI</span>
            <span>/</span>
            <span className="capitalize">{location.pathname.replace('/', '') || 'Overview'}</span>
          </div>
        </div>
      </div>

      {/* Right: Demo Workspace Dropdown for Judges & Quick Action */}
      <div className="flex items-center space-x-3">
        {/* Compact Demo Workspace Selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all focus:outline-none"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline text-slate-500 font-normal">Demo Workspace:</span>
            <span className="font-bold text-slate-900">
              {dashboard?.target_career?.title === 'Data Analyst'
                ? 'Jordan (Data Analyst)'
                : dashboard?.target_career?.title === 'Full Stack Developer'
                ? 'Devon (Full Stack)'
                : 'Alex (AI Engineer)'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-64 bg-surface border border-slate-200 rounded-lg shadow-dropdown z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Switch Evaluator Test Persona
              </div>

              <button
                onClick={() => loadPresetProfile('alex')}
                className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-900">Alex Morgan</div>
                  <div className="text-[11px] text-slate-500">AI Engineer Aspirant · 64% Readiness</div>
                </div>
                <UserCheck className="w-4 h-4 text-primary" />
              </button>

              <button
                onClick={() => loadPresetProfile('jordan')}
                className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-900">Jordan Taylor</div>
                  <div className="text-[11px] text-slate-500">Data Analyst · Entry Level</div>
                </div>
              </button>

              <button
                onClick={() => loadPresetProfile('devon')}
                className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-900">Devon Vance</div>
                  <div className="text-[11px] text-slate-500">Full Stack Engineer · Intermediate</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Build Path Action */}
        <Link
          to="/onboarding"
          className="bg-primary hover:bg-primary-dark text-white px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-subtle flex items-center space-x-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Build New Path</span>
        </Link>
      </div>
    </header>
  );
};
