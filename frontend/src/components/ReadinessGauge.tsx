import React from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { ShieldCheck, Info } from 'lucide-react';
import { AnimatedNumber, AnimatedProgress } from './motion/MotionPrimitives';

interface ReadinessGaugeProps {
  score: number;
  careerTitle: string;
  strongSkills?: string[];
  developingSkills?: string[];
  priorityGaps?: string[];
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({
  score,
  careerTitle,
  strongSkills = ['Python', 'SQL'],
  developingSkills = ['Statistics', 'Model Evaluation'],
  priorityGaps = ['Deep Learning', 'MLOps'],
}) => {
  return (
    <Card className="flex flex-col justify-between h-full transition-all duration-200 hover:border-slate-300">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            CAREER READINESS ESTIMATE
          </span>
          <Badge tone="neutral">
            <ShieldCheck className="w-3 h-3 mr-1 text-[var(--brand)]" />
            Analytical Model
          </Badge>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <h4 className="text-sm font-bold text-[var(--text-primary)] truncate">
            {careerTitle}
          </h4>
          <div className="text-xl font-extrabold font-mono text-[var(--text-primary)]">
            <AnimatedNumber value={score} duration={0.9} /> <span className="text-xs font-normal text-[var(--text-tertiary)]">/ 100</span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="mb-6">
          <AnimatedProgress value={score} className="h-2.5" />
        </div>

        {/* Breakdown List */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Strong Foundation:</span>
            <span className="font-semibold text-[var(--success)] truncate max-w-[180px]">
              {strongSkills.join(', ')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Developing Focus:</span>
            <span className="font-semibold text-[var(--brand)] truncate max-w-[180px]">
              {developingSkills.join(', ')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Priority Gaps:</span>
            <span className="font-semibold text-[var(--warning)] truncate max-w-[180px]">
              {priorityGaps.join(', ')}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[var(--surface-sunken)] border border-[var(--border)] rounded-[var(--radius-sm)] p-3 mt-6 text-xs text-[var(--text-secondary)] flex items-start gap-2">
        <Info className="w-4 h-4 text-[var(--brand)] shrink-0 mt-0.5" />
        <span>
          Readiness represents satisfied prerequisite ratios and evidence portfolio weight. Not a guaranteed job prediction.
        </span>
      </div>
    </Card>
  );
};
