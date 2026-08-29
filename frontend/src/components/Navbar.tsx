import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { Button } from './ui/Button';

export const Navbar: React.FC = () => {
  return (
    <header className="h-[56px] bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-8 h-full flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[var(--radius-sm)] bg-[var(--brand)] text-white flex items-center justify-center font-bold text-xs">
            P
          </div>
          <div>
            <span className="text-[var(--text-primary)] font-bold text-sm leading-none block">
              PATHFINDER
            </span>
            <span className="text-[10px] text-[var(--text-tertiary)] font-medium leading-none block mt-0.5">
              Career Intelligence
            </span>
          </div>
        </Link>

        {/* Public Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[var(--text-secondary)]">
          <Link to="/dashboard" className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
            <LayoutDashboard className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span>Workspace</span>
          </Link>
          <Link to="/careers" className="hover:text-[var(--text-primary)] transition-colors">
            Careers Base
          </Link>
          <Link to="/architecture" className="hover:text-[var(--text-primary)] transition-colors">
            System Logic
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button size="sm" variant="ghost">
              Workspace
            </Button>
          </Link>
          <Link to="/onboarding">
            <Button size="sm" variant="primary">
              <span>Build Path</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
