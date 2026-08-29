import React from 'react';
import { NextBestAction } from '../types';
import { Play, Clock, HelpCircle, ArrowRight } from 'lucide-react';

interface NextBestActionCardProps {
  action: NextBestAction;
  onStartAction: () => void;
  onWhyThis: () => void;
}

export const NextBestActionCard: React.FC<NextBestActionCardProps> = ({
  action,
  onStartAction,
  onWhyThis,
}) => {
  return (
    <div className="bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary-soft px-2.5 py-1 rounded">
              NEXT BEST ACTION
            </span>
            <span className="text-xs font-medium text-slate-500 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {action.estimated_minutes} mins
            </span>
          </div>

          <button
            onClick={onWhyThis}
            className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center space-x-1 focus:outline-none"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why this?</span>
          </button>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
          {action.title}
        </h3>

        <div className="bg-slate-50 border border-slate-100 rounded-md p-3 mb-5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Relevance Rationale
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {action.why_now}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-2">
        <button
          onClick={onStartAction}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md font-semibold text-xs flex items-center space-x-2 shadow-subtle transition-colors"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>{action.cta_label}</span>
        </button>

        <button
          onClick={onWhyThis}
          className="bg-surface hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-md font-medium text-xs transition-colors flex items-center space-x-1"
        >
          <span>View Reasoning</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
