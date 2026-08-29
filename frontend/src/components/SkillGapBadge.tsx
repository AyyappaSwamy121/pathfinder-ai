import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Lock, Sparkles } from 'lucide-react';

interface SkillGapBadgeProps {
  status: 'MASTERED' | 'DEVELOPING' | 'MISSING' | 'LOCKED' | 'RECOMMENDED';
  name: string;
  proficiency?: string;
}

export const SkillGapBadge: React.FC<SkillGapBadgeProps> = ({ status, name, proficiency }) => {
  const configs = {
    MASTERED: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
      label: 'Mastered',
    },
    DEVELOPING: {
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      icon: Clock,
      label: 'Developing',
    },
    MISSING: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: AlertCircle,
      label: 'Missing Gap',
    },
    LOCKED: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: Lock,
      label: 'Prerequisite Locked',
    },
    RECOMMENDED: {
      bg: 'bg-amber-50 text-amber-900 border-amber-300 font-semibold',
      icon: Sparkles,
      label: 'Next Recommended',
    },
  };

  const config = configs[status] || configs.MISSING;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs border font-medium transition-all ${config.bg}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate">{name}</span>
      {proficiency && proficiency !== 'None' && (
        <span className="opacity-75 text-[10px] uppercase font-mono">({proficiency})</span>
      )}
    </div>
  );
};
