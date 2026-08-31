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
  User,
  School,
  Sparkles,
} from 'lucide-react';
import { useLearner } from '../context/LearnerContext';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const { dashboard } = useLearner();
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
    { path: '/architecture', label: 'System Architecture', icon: Cpu },
  ];

  const displayName = user ? `${user.first_name} ${user.last_name}` : 'Alex Morgan';
  const displayCollege = user?.college_name || 'Stanford University';
  const initials = user
    ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
    : 'AM';

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
        className={`fixed top-0 bottom-0 left-0 z-50 w-[250px] bg-white border-r border-[#E2E8F0] flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-[60px] px-4 flex items-center justify-between border-b border-[#E2E8F0]">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4338CA] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-[#0F172A] text-sm tracking-tight leading-none block">
                PATHFINDER
              </span>
              <span className="text-[10.5px] text-[#64748B] font-medium leading-none block mt-1">
                Career Intelligence
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-[#64748B] p-1 hover:text-[#0F172A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          <div>
            <div className="px-3 mb-2 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
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
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#EEF2FF] text-[#4338CA]'
                        : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#4338CA]' : 'text-[#64748B]'}`} />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 mb-2 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Engine
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
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#EEF2FF] text-[#4338CA]'
                        : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#4338CA]' : 'text-[#64748B]'}`} />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User / Workspace Account Footer */}
        <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-full bg-[#4338CA] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[#0F172A] truncate">
                {displayName}
              </div>
              <div className="text-[10.5px] text-[#64748B] flex items-center gap-1 truncate">
                <School className="w-3 h-3 shrink-0" />
                <span className="truncate">{displayCollege}</span>
              </div>
            </div>
            {isAuthenticated ? (
              <button
                onClick={() => logout()}
                title="Sign Out"
                className="p-1.5 text-[#94A3B8] hover:text-[#B91C1C] rounded-md hover:bg-[#FEF2F2] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link
                to="/login"
                title="Sign In"
                className="p-1.5 text-[#4338CA] hover:text-[#3730A3] rounded-md hover:bg-[#EEF2FF] transition-colors"
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
