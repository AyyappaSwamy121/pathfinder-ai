import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, MapPin, GitGraph, Briefcase, Award, Sliders, MessageSquareCode, Cpu, Menu, X, ShieldCheck, UserCheck, ChevronDown
} from 'lucide-react';
import { useLearner } from '../../context/LearnerContext';
import { Button } from '../ui/Button';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();
  const { dashboard, loadPresetProfile } = useLearner();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const primaryNav = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/roadmap', label: 'My Path', icon: MapPin },
    { path: '/skills', label: 'Skill Graph', icon: GitGraph },
    { path: '/careers', label: 'Careers', icon: Briefcase },
    { path: '/assessment', label: 'Assessments', icon: Award },
    { path: '/simulator', label: 'What-if Simulator', icon: Sliders },
    { path: '/copilot', label: 'AI Copilot', icon: MessageSquareCode },
  ];

  const systemNav = [
    { path: '/architecture', label: 'How PathFinder Thinks', icon: Cpu },
  ];

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/dashboard':
        return 'Overview';
      case '/roadmap':
        return 'My Learning Path';
      case '/skills':
        return 'Skill Knowledge Graph';
      case '/careers':
        return 'Career Base';
      case '/assessment':
        return 'Assessments';
      case '/simulator':
        return 'What-if Simulator';
      case '/copilot':
        return 'AI Copilot';
      case '/architecture':
        return 'How PathFinder Thinks';
      case '/onboarding':
        return 'Onboarding';
      default:
        return 'Overview';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col font-sans text-[var(--text-primary)]">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Fixed Desktop Sidebar (240px) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[240px] bg-[var(--surface)] border-r border-[var(--border)] flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-[56px] px-4 flex items-center justify-between border-b border-[var(--border)]">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[var(--radius-sm)] bg-[var(--brand)] text-white flex items-center justify-center font-bold text-xs">
              P
            </div>
            <div>
              <span className="font-bold text-[var(--text-primary)] text-sm leading-none block">
                PATHFINDER
              </span>
              <span className="text-[10px] text-[var(--text-tertiary)] font-medium leading-none block mt-0.5">
                Career Intelligence
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-[var(--text-secondary)] p-1 hover:text-[var(--text-primary)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          <div>
            <div className="px-3 mb-2 text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
              Workspace
            </div>
            <nav className="space-y-1">
              {primaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--brand-soft)] text-[var(--brand)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0 text-[var(--text-secondary)]" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 mb-2 text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
              System
            </div>
            <nav className="space-y-1">
              {systemNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--brand-soft)] text-[var(--brand)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0 text-[var(--text-secondary)]" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Workspace Status Footer */}
        <div className="p-3 border-t border-[var(--border)] bg-[var(--surface-sunken)]">
          <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
            {dashboard?.target_career?.title || 'AI Engineer'}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] flex items-center justify-between mt-1">
            <span>Readiness</span>
            <span className="font-mono font-bold text-[var(--brand)]">
              {Math.round(dashboard?.readiness_score || 64)}%
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Layout Container */}
      <div className="lg:pl-[240px] flex flex-col flex-1 min-h-screen">
        {/* Top Header (56px) */}
        <header className="h-[56px] bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-[var(--text-secondary)] p-1 hover:text-[var(--text-primary)]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-[var(--text-tertiary)]">PathFinder</span>
              <span className="text-[var(--text-tertiary)]">/</span>
              <h1 className="text-sm font-bold text-[var(--text-primary)]">
                {getPageTitle(location.pathname)}
              </h1>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium bg-[var(--surface-sunken)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--border)] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand)]" />
                <span className="text-[var(--text-secondary)]">Demo:</span>
                <span className="font-semibold">
                  {dashboard?.target_career?.title === 'Data Analyst'
                    ? 'Jordan (Data Analyst)'
                    : dashboard?.target_career?.title === 'Full Stack Developer'
                    ? 'Devon (Full Stack)'
                    : 'Alex (AI Engineer)'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--text-tertiary)] ml-1" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] shadow-md z-50 py-1"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider border-b border-[var(--border)]">
                    Switch Demo Persona
                  </div>
                  <button
                    onClick={() => loadPresetProfile('alex')}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-[var(--surface-sunken)] flex items-center justify-between"
                  >
                    <span>Alex (AI Engineer)</span>
                    <UserCheck className="w-3.5 h-3.5 text-[var(--brand)]" />
                  </button>
                  <button
                    onClick={() => loadPresetProfile('jordan')}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-[var(--surface-sunken)] flex items-center justify-between"
                  >
                    <span>Jordan (Data Analyst)</span>
                  </button>
                  <button
                    onClick={() => loadPresetProfile('devon')}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-[var(--surface-sunken)] flex items-center justify-between"
                  >
                    <span>Devon (Full Stack)</span>
                  </button>
                </div>
              )}
            </div>

            <Link to="/onboarding">
              <Button size="sm" variant="primary">
                Build Path
              </Button>
            </Link>
          </div>
        </header>

        {/* Main Content View (max-w-6xl mx-auto px-8 py-8) */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};
