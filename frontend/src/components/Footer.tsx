import React from 'react';
import { Compass, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border py-6 px-4 sm:px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-primary text-white flex items-center justify-center font-bold text-[10px]">
            P
          </div>
          <span className="font-semibold text-slate-800">PATHFINDER AI</span>
          <span>— Enterprise Career Navigation System</span>
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/architecture" className="hover:text-slate-900 transition-colors">
            System Logic
          </Link>
          <Link to="/careers" className="hover:text-slate-900 transition-colors">
            Knowledge Base
          </Link>
          <span className="flex items-center text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            HCL Amplify Prototype
          </span>
        </div>
      </div>
    </footer>
  );
};
