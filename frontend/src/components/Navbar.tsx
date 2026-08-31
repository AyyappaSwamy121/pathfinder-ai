import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, LayoutDashboard, LogIn, User } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="h-[60px] bg-white border-b border-[#E2E8F0] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4338CA] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[#0F172A] font-bold text-sm leading-none block tracking-tight">
              PATHFINDER
            </span>
            <span className="text-[10px] text-[#64748B] font-medium leading-none block mt-1">
              Career Intelligence Platform
            </span>
          </div>
        </Link>

        {/* Public Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#475569]">
          <Link to="/dashboard" className="hover:text-[#0F172A] transition-colors flex items-center gap-1.5">
            <LayoutDashboard className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Workspace</span>
          </Link>
          <Link to="/careers" className="hover:text-[#0F172A] transition-colors">
            Career Base
          </Link>
          <Link to="/architecture" className="hover:text-[#0F172A] transition-colors">
            Engine Architecture
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="sm" variant="secondary" className="flex items-center gap-1.5 text-xs py-1.5">
                <User className="w-3.5 h-3.5 text-[#4338CA]" />
                <span>{user?.first_name || 'Dashboard'}</span>
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button size="sm" variant="ghost" className="text-xs py-1.5 text-[#475569] hover:text-[#0F172A]">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" variant="secondary" className="text-xs py-1.5 border-[#CBD5E1]">
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          <Link to="/onboarding">
            <Button size="sm" className="bg-[#4338CA] hover:bg-[#3730A3] text-white flex items-center gap-1.5 text-xs py-1.5 shadow-xs">
              <span>Build Path</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
