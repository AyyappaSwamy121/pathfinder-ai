import React from 'react';
import { Compass, Cpu, Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border mt-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-text-main text-base">PATHFINDER <span className="text-primary font-normal">AI</span></span>
              <p className="text-xs text-text-muted">HCL AMPLIFY Round 2 Prototype — AI Career Navigation System</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted">
            <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/roadmap" className="hover:text-primary transition-colors">Personalized Roadmap</Link>
            <Link to="/skills" className="hover:text-primary transition-colors">Skill Knowledge Graph</Link>
            <Link to="/careers" className="hover:text-primary transition-colors">Career Explorer</Link>
            <Link to="/architecture" className="hover:text-primary transition-colors flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              <span>How PathFinder Thinks</span>
            </Link>
          </div>

          <div className="text-xs text-text-muted text-center md:text-right">
            <p>Traditional platforms recommend courses. PathFinder recommends a path.</p>
            <p className="mt-0.5 text-[11px] text-text-light">Built for HCL AMPLIFY Hackathon 2026</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
