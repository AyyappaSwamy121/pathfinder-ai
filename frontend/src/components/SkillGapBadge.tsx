import React from 'react';
import { Badge } from './ui/Badge';
import { CheckCircle2, Clock, AlertCircle, Lock } from 'lucide-react';

interface SkillGapBadgeProps {
  status: 'MASTERED' | 'DEVELOPING' | 'MISSING' | 'LOCKED' | 'RECOMMENDED';
  name: string;
  proficiency?: string;
}

export const SkillGapBadge: React.FC<SkillGapBadgeProps> = ({ status, name, proficiency }) => {
  const toneMap = {
    MASTERED: 'success',
    DEVELOPING: 'brand',
    MISSING: 'warning',
    LOCKED: 'danger',
    RECOMMENDED: 'brand',
  } as const;

  const IconMap = {
    MASTERED: CheckCircle2,
    DEVELOPING: Clock,
    MISSING: AlertCircle,
    LOCKED: Lock,
    RECOMMENDED: Clock,
  };

  const tone = toneMap[status] || 'neutral';
  const Icon = IconMap[status] || AlertCircle;

  return (
    <Badge tone={tone}>
      <Icon className="w-3 h-3 mr-1 shrink-0" />
      <span className="truncate">{name}</span>
      {proficiency && proficiency !== 'None' && (
        <span className="opacity-75 text-[10px] ml-1 uppercase">({proficiency})</span>
      )}
    </Badge>
  );
};
