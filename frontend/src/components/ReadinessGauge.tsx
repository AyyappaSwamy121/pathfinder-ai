import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

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
    <div className="bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            CAREER READINESS ESTIMATE
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600">
            <ShieldCheck className="w-3 h-3 mr-1 text-primary" />
            Analytical Model
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <h4 className="text-sm font-bold text-slate-900 truncate">
            {careerTitle}
          </h4>
          <div className="text-xl font-extrabold font-mono text-slate-900">
            {Math.round(score)} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
        </div>

        {/* Refined Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-5">
          <div
            className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
          />
        </div>

        {/* Analytical Breakdown Grid */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Strong Foundation:</span>
            <span className="font-semibold text-semantic-success truncate max-w-[180px]">
              {strongSkills.join(', ')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Developing Focus:</span>
            <span className="font-semibold text-primary truncate max-w-[180px]">
              {developingSkills.join(', ')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Priority Gaps:</span>
            <span className="font-semibold text-semantic-warning truncate max-w-[180px]">
              {priorityGaps.join(', ')}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-md p-2.5 mt-5 text-[11px] text-slate-500 flex items-start space-x-1.5">
        <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
        <span>
          Readiness represents satisfied prerequisite ratios and evidence portfolio weight. Not a guaranteed job prediction.
        </span>
      </div>
    </div>
  );
};
