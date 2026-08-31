import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, ShieldCheck, UserCheck, PlusCircle, LogOut, User, School, Sparkles, XCircle } from 'lucide-react';
import { useLearner } from '../context/LearnerContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

interface TopHeaderProps {
  onOpenMobileSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dashboard, loadPresetProfile, isDemoMode, exitDemoMode } = useLearner();
  const { user, isAuthenticated, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard':
        return 'Overview';
      case '/roadmap':
        return 'My Learning Path';
      case '/skills':
        return 'Skill Knowledge Graph';
      case '/careers':
        return 'Career Intelligence Base';
      case '/assessment':
        return 'Adaptive Assessments';
      case '/simulator':
        return 'What-if Career Simulator';
      case '/copilot':
        return 'Grounded AI Copilot';
      case '/architecture':
        return 'System Architecture & Reasoning';
      case '/onboarding':
        return 'Career Onboarding Wizard';
      default:
        return 'Career Workspace';
    }
  };

  const currentCareerTitle = dashboard?.target_career?.title || 'AI Engineer';

  const userFullName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.name
    : 'Student';

  return (
    <header className="h-[60px] bg-white border-b border-[#E2E8F0] sticky top-0 z-30 flex items-center justify-between px-6 font-sans">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden text-[#64748B] p-1.5 rounded-lg hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#94A3B8] font-medium hidden sm:inline">PathFinder</span>
          <span className="text-[#CBD5E1] hidden sm:inline">/</span>
          <h1 className="text-sm font-semibold text-[#0F172A]">
            {getPageTitle(location.pathname)}
          </h1>
        </div>
      </div>

      {/* Right: User Workspace / Demo Switcher & CTAs */}
      <div className="flex items-center gap-3">
        {/* Target Career Tag */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EEF2FF] border border-[#C7D2FE] text-xs font-semibold text-[#4338CA]">
          <span>Target:</span>
          <span>{currentCareerTitle}</span>
        </div>

        {/* Demo Mode Exit Button if active */}
        {isDemoMode && (
          <button
            onClick={() => exitDemoMode()}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors"
            title="Return to your real authenticated workspace"
          >
            <XCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Exit Demo Mode</span>
          </button>
        )}

        {isAuthenticated && user && !isDemoMode ? (
          /* Logged-in Real User Workspace Badge */
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] hover:bg-[#DCFCE7] transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse shrink-0" />
              <span className="font-semibold text-[#0F172A] max-w-[150px] truncate">
                {userFullName}
              </span>
              <span className="hidden sm:inline text-[10px] text-[#16A34A] font-extrabold uppercase bg-white/80 px-1.5 py-0.5 rounded border border-[#BBF7D0]">
                Workspace
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 py-1.5"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-3.5 py-2 border-b border-[#E2E8F0]">
                  <div className="text-xs font-bold text-[#0F172A] truncate">{userFullName}</div>
                  <div className="text-[11px] text-[#64748B] truncate">{user.email}</div>
                  <div className="text-[10px] text-[#4338CA] font-medium mt-1 flex items-center gap-1">
                    <School className="w-3 h-3" />
                    <span className="truncate">{user.college_name || 'University'}</span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    to="/dashboard"
                    className="w-full px-3.5 py-1.5 text-xs text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Personal Workspace</span>
                  </Link>
                  <Link
                    to="/onboarding"
                    className="w-full px-3.5 py-1.5 text-xs text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#4338CA]" />
                    <span>Update Career Goal</span>
                  </Link>
                </div>

                {/* Demo Presets Switcher Option for Evaluators */}
                <div className="border-t border-[#E2E8F0] pt-1">
                  <div className="px-3.5 py-1 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                    Evaluator Demo Presets
                  </div>
                  <button
                    onClick={() => loadPresetProfile('alex')}
                    className="w-full px-3.5 py-1.5 text-left text-xs text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#4338CA]" />
                    <span>Test Alex (AI Engineer)</span>
                  </button>
                  <button
                    onClick={() => loadPresetProfile('jordan')}
                    className="w-full px-3.5 py-1.5 text-left text-xs text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#4338CA]" />
                    <span>Test Jordan (Data Analyst)</span>
                  </button>
                </div>

                <div className="border-t border-[#E2E8F0] pt-1 mt-1">
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="w-full px-3.5 py-1.5 text-left text-xs text-[#B91C1C] hover:bg-[#FEF2F2] flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Demo Mode / Switcher Badge */
          <div className="relative">
            <button
              onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-amber-700 hidden sm:inline">Demo:</span>
              <span className="font-bold truncate max-w-[120px] sm:max-w-none">
                {currentCareerTitle === 'Data Analyst'
                  ? 'Jordan (Analyst)'
                  : currentCareerTitle === 'Full Stack Developer'
                  ? 'Devon (Full Stack)'
                  : 'Alex (AI Eng)'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-amber-600" />
            </button>

            {demoDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 py-1.5"
                onClick={() => setDemoDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider border-b border-[#E2E8F0]">
                  Switch Demo Persona
                </div>
                <button
                  onClick={() => loadPresetProfile('alex')}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-[#F8FAFC] flex items-center justify-between text-[#0F172A]"
                >
                  <div>
                    <div className="font-semibold">Alex Morgan</div>
                    <div className="text-[11px] text-[#64748B]">Target: AI Engineer (ML / PyTorch)</div>
                  </div>
                  <UserCheck className="w-4 h-4 text-[#4338CA]" />
                </button>
                <button
                  onClick={() => loadPresetProfile('jordan')}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-[#F8FAFC] flex items-center justify-between text-[#0F172A]"
                >
                  <div>
                    <div className="font-semibold">Jordan Lee</div>
                    <div className="text-[11px] text-[#64748B]">Target: Data Analyst (SQL / Analytics)</div>
                  </div>
                </button>
                <button
                  onClick={() => loadPresetProfile('devon')}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-[#F8FAFC] flex items-center justify-between text-[#0F172A]"
                >
                  <div>
                    <div className="font-semibold">Devon Vance</div>
                    <div className="text-[11px] text-[#64748B]">Target: Full Stack (React / FastAPI)</div>
                  </div>
                </button>

                {isAuthenticated && (
                  <div className="border-t border-[#E2E8F0] pt-1 px-3 py-1.5">
                    <button
                      onClick={() => exitDemoMode()}
                      className="w-full text-left text-xs text-[#4338CA] font-bold hover:underline flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Return to My Real Workspace →</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Build Path / Onboarding CTA */}
        <Link to="/onboarding">
          <Button size="sm" className="bg-[#4338CA] hover:bg-[#3730A3] text-white flex items-center gap-1.5 text-xs py-1.5">
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Build Path</span>
          </Button>
        </Link>
      </div>
    </header>
  );
};
