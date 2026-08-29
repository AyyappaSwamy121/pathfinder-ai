import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, ArrowRight, LayoutDashboard, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xs border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-primary text-white flex items-center justify-center font-bold text-base shadow-subtle">
              P
            </div>
            <div>
              <span className="text-slate-900 font-black text-lg tracking-tight block leading-none">
                PATHFINDER
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase block mt-0.5">
                Career Intelligence Platform
              </span>
            </div>
          </Link>

          {/* Navigation links for Landing page */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-600">
            <Link to="/dashboard" className="hover:text-primary transition-colors flex items-center space-x-1">
              <LayoutDashboard className="w-4 h-4" />
              <span>Workspace</span>
            </Link>
            <Link to="/careers" className="hover:text-primary transition-colors">
              Careers Base
            </Link>
            <Link to="/architecture" className="hover:text-primary transition-colors">
              System Logic
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <Link
              to="/dashboard"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors hidden sm:inline-block"
            >
              Go to Workspace
            </Link>
            <Link
              to="/onboarding"
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-xs font-semibold shadow-subtle transition-colors flex items-center space-x-1.5"
            >
              <span>Build My Path</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
