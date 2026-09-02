import React, { useState } from 'react';
import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MapPin, GitGraph, Briefcase, Award, Sliders, MessageSquareCode, Cpu, X, LogOut, LogIn, School
} from 'lucide-react';
import { useLearner } from '../../context/LearnerContext';
import { useAuth } from '../../context/AuthContext';
import { TopHeader } from '../TopHeader';
import { PageTransition } from '../motion/MotionPrimitives';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dashboard, isDemoMode, logout: learnerLogout } = useLearner();
  const { user: authUser, isAuthenticated, logout: authLogout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const handleLogout = async () => {
    await learnerLogout();
    await authLogout();
    navigate('/login');
  };

  const displayName = isDemoMode
    ? (dashboard?.target_career?.title === 'Data Analyst' ? 'Jordan Lee' : dashboard?.target_career?.title === 'Full Stack Developer' ? 'Devon Vance' : 'Alex Morgan')
    : authUser
    ? `${authUser.first_name || ''} ${authUser.last_name || ''}`.trim() || authUser.name
    : 'Student Workspace';

  const displayCollege = isDemoMode
    ? 'HCL Amplify Institute'
    : authUser?.college_name || 'University Workspace';

  const userInitials = isDemoMode
    ? (displayName[0] || 'A')
    : authUser
    ? `${authUser.first_name?.[0] || ''}${authUser.last_name?.[0] || ''}`.toUpperCase()
    : 'S';

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
                Career Intelligence Platform
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

        {/* Sidebar Workspace Status & User Footer */}
        <div className="p-3 border-t border-[var(--border)] bg-[var(--surface-sunken)] space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
              {dashboard?.target_career?.title || 'AI Engineer'}
            </div>
            <span className="font-mono text-xs font-bold text-[var(--brand)]">
              {Math.round(dashboard?.readiness_score || 41)}%
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 truncate">
              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                {userInitials}
              </div>
              <div className="truncate">
                <div className="font-semibold text-slate-900 leading-tight truncate">
                  {displayName}
                </div>
                <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                  <School className="w-3 h-3 shrink-0" />
                  <span className="truncate">{displayCollege}</span>
                </div>
              </div>
            </div>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="text-slate-400 hover:text-[#B91C1C] p-1 rounded hover:bg-slate-200/50"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link to="/login" title="Sign In" className="text-indigo-600 hover:text-indigo-800 p-1">
                <LogIn className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Layout Container */}
      <div className="lg:pl-[240px] flex flex-col flex-1 min-h-screen">
        <TopHeader onOpenMobileSidebar={() => setMobileOpen(true)} />

        {/* Main Content View */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <PageTransition key={location.pathname}>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
};
