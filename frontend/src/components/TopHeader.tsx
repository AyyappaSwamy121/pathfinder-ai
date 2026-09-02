import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, ShieldCheck, UserCheck, PlusCircle, LogOut, User, School, Sparkles, XCircle } from 'lucide-react';
import { useLearner } from '../context/LearnerContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { SEED_CAREERS } from '../services/api';

interface TopHeaderProps {
  onOpenMobileSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dashboard, loadPresetProfile, isDemoMode, exitDemoMode, setTargetCareer } = useLearner();
  const { user, isAuthenticated, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard':
        return { full: 'Overview', short: 'Overview' };
      case '/roadmap':
        return { full: 'My Learning Path', short: 'Roadmap' };
      case '/skills':
        return { full: 'Skill Knowledge Graph', short: 'Skills' };
      case '/careers':
        return { full: 'Career Intelligence Base', short: 'Careers' };
      case '/assessment':
        return { full: 'Adaptive Assessments', short: 'Assess' };
      case '/simulator':
        return { full: 'What-if Career Simulator', short: 'Simulator' };
      case '/career-twin':
        return { full: 'Career Twin — Transition Simulator', short: 'Career Twin' };
      case '/copilot':
        return { full: 'Grounded AI Copilot', short: 'Copilot' };
      case '/architecture':
        return { full: 'System Architecture & Reasoning', short: 'Architecture' };
      case '/onboarding':
        return { full: 'Career Onboarding Wizard', short: 'Onboarding' };
      default:
        return { full: 'Career Workspace', short: 'Workspace' };
    }
  };

  const currentCareerTitle = dashboard?.target_career?.title || 'AI Engineer';

  const userFullName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.name
    : 'Student';

  return (
    <header className="h-[60px] bg-white border-b border-[#E2E8F0] sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 font-sans gap-2">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden text-[#64748B] p-1.5 rounded-lg hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 text-sm min-w-0">
          <span className="text-[#94A3B8] font-medium hidden md:inline shrink-0">PathFinder</span>
          <span className="text-[#CBD5E1] hidden md:inline shrink-0">/</span>
          <h1 className="text-xs sm:text-sm font-semibold text-[#0F172A] truncate whitespace-nowrap max-w-[100px] xs:max-w-[140px] sm:max-w-[220px] md:max-w-none">
            <span className="sm:hidden">{getPageTitle(location.pathname).short}</span>
            <span className="hidden sm:inline">{getPageTitle(location.pathname).full}</span>
          </h1>
        </div>
      </div>

      {/* Right: User Workspace / Demo Switcher & CTAs */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto">
        {/* Interactive Target Career Selector */}
        <div className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-md bg-[#EEF2FF] border border-[#C7D2FE] text-xs font-semibold text-[#4338CA] shrink-0">
          <span className="hidden lg:inline text-[#64748B]">Target:</span>
          <select
            value={dashboard?.target_career?.id || 'c_ai_engineer'}
            onChange={(e) => setTargetCareer(e.target.value)}
            className="bg-transparent border-none text-[#4338CA] font-bold focus:outline-none cursor-pointer text-xs max-w-[80px] xs:max-w-[105px] sm:max-w-[150px] md:max-w-none truncate"
            aria-label="Select Target Career Role"
          >
            {SEED_CAREERS.map((c) => (
              <option key={c.id} value={c.id} className="text-[#0F172A] bg-white font-medium">
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Demo Mode Exit Button if active */}
        {isDemoMode && (
          <button
            onClick={() => exitDemoMode()}
            className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors shrink-0"
            title="Return to your real authenticated workspace"
          >
            <XCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="hidden md:inline">Exit Demo</span>
          </button>
        )}

        {isAuthenticated && user && !isDemoMode ? (
          /* Logged-in Real User Workspace Badge */
          <div className="relative shrink-0">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] hover:bg-[#DCFCE7] transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse shrink-0" />
              <span className="font-semibold text-[#0F172A] max-w-[65px] xs:max-w-[90px] sm:max-w-[140px] truncate">
                {userFullName}
              </span>
              <span className="hidden md:inline text-[10px] text-[#16A34A] font-extrabold uppercase bg-white/80 px-1.5 py-0.5 rounded border border-[#BBF7D0]">
                Workspace
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
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
          <div className="relative shrink-0">
            <button
              onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-bold truncate max-w-[60px] xs:max-w-[85px] sm:max-w-[120px]">
                {currentCareerTitle === 'Data Analyst'
                  ? 'Jordan'
                  : currentCareerTitle === 'Full Stack Developer'
                  ? 'Devon'
                  : 'Alex'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
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

        {/* Build Path / Onboarding CTA - Hidden on mobile to keep header clean and spacious */}
        <Link to="/onboarding" className="hidden md:inline-flex shrink-0">
          <Button size="sm" className="bg-[#4338CA] hover:bg-[#3730A3] text-white flex items-center gap-1.5 text-xs py-1.5">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Build Path</span>
          </Button>
        </Link>
      </div>
    </header>
  );
};
