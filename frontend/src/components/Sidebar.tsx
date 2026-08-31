import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  MapPin,
  GitGraph,
  Briefcase,
  Award,
  Sliders,
  MessageSquareCode,
  Cpu,
  X,
  LogOut,
  LogIn,
  School,
} from 'lucide-react';
import { useLearner } from '../context/LearnerContext';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const { dashboard, isDemoMode } = useLearner();
  const { user, isAuthenticated, logout } = useAuth();

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

  const displayName = isDemoMode
    ? (dashboard?.target_career?.title === 'Data Analyst' ? 'Jordan Lee' : dashboard?.target_career?.title === 'Full Stack Developer' ? 'Devon Vance' : 'Alex Morgan')
    : user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.name || 'Student Workspace'
    : 'Student Workspace';

  const displayCollege = isDemoMode
    ? 'HCL Amplify Institute'
    : user?.college_name || 'University Workspace';

  const initials = isDemoMode
    ? 'AM'
    : user
    ? `${user.first_name?.[0] || 'S'}${user.last_name?.[0] || ''}`.toUpperCase()
    : 'SW';

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[240px] bg-white border-r border-[#E5E7EB] flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-[64px] px-4 flex items-center justify-between border-b border-[#E5E7EB]">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-[#111827] text-sm tracking-tight leading-none block">
                PATHFINDER <span className="text-[#4F46E5]">AI</span>
              </span>
              <span className="text-[10px] text-[#6B7280] font-medium leading-none block mt-1">
                Career Intelligence
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-[#6B7280] p-1 hover:text-[#111827]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          <div>
            <div className="px-3 mb-2 flex items-center justify-between text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
              <span>Workspace</span>
              {isDemoMode ? (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Demo
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live
                </span>
              )}
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
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#EEF2FF] text-[#4F46E5] border-l-2 border-[#4F46E5]'
                        : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#4F46E5]' : 'text-[#6B7280]'}`} />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
              System Logic
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
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#EEF2FF] text-[#4F46E5] border-l-2 border-[#4F46E5]'
                        : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#4F46E5]' : 'text-[#6B7280]'}`} />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User / Workspace Account Footer */}
        <div className="p-3 border-t border-[#E5E7EB] bg-[#FAFAF9]">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-[#E5E7EB]">
            <div className="w-8 h-8 rounded-full bg-[#4F46E5] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[#111827] truncate">
                {displayName}
              </div>
              <div className="text-[10.5px] text-[#6B7280] flex items-center gap-1 truncate">
                <School className="w-3 h-3 shrink-0" />
                <span className="truncate">{displayCollege}</span>
              </div>
            </div>
            {isAuthenticated ? (
              <button
                onClick={() => logout()}
                title="Sign Out"
                className="p-1.5 text-[#9CA3AF] hover:text-[#B91C1C] rounded-md hover:bg-[#FEF2F2] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link
                to="/login"
                title="Sign In"
                className="p-1.5 text-[#4F46E5] hover:text-[#3730A3] rounded-md hover:bg-[#EEF2FF] transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
