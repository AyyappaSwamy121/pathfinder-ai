import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MapPin, GitGraph, Briefcase, Award, Sliders, MessageSquareCode, Cpu, X, ChevronRight
} from 'lucide-react';
import { useLearner } from '../context/LearnerContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const { dashboard } = useLearner();

  const primaryNav = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/roadmap', label: 'My Path', icon: MapPin },
    { path: '/skills', label: 'Skill Graph', icon: GitGraph },
    { path: '/careers', label: 'Careers', icon: Briefcase },
    { path: '/assessment', label: 'Assessments', icon: Award },
    { path: '/simulator', label: 'What-if Simulator', icon: Sliders },
    { path: '/copilot', label: 'AI Copilot', icon: MessageSquareCode },
  ];

  return (
    <aside className="w-60 bg-[var(--surface)] border-r border-[var(--border)] p-4">
      <div className="text-xs font-semibold text-[var(--text-primary)]">
        PathFinder Sidebar
      </div>
    </aside>
  );
};
