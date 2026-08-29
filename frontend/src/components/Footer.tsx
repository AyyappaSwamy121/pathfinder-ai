import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)] py-6 px-8 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[var(--radius-sm)] bg-[var(--brand)] text-white flex items-center justify-center font-bold text-[10px]">
            P
          </div>
          <span className="font-semibold text-[var(--text-primary)]">PATHFINDER AI</span>
          <span className="text-[var(--text-tertiary)]">— Enterprise Career Navigation</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/architecture" className="hover:text-[var(--text-primary)] transition-colors">
            System Logic
          </Link>
          <Link to="/careers" className="hover:text-[var(--text-primary)] transition-colors">
            Careers Base
          </Link>
          <span className="flex items-center text-[var(--text-tertiary)]">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[var(--success)]" />
            HCL Amplify Prototype
          </span>
        </div>
      </div>
    </footer>
  );
};
