import React from 'react';
import { NextBestAction } from '../types';
import { Sparkles, Play, Clock, HelpCircle } from 'lucide-react';

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
    <div className="bg-gradient-to-br from-primary-soft/80 via-white to-white border-2 border-primary/20 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white uppercase tracking-wider">
            <Sparkles className="w-3 h-3 mr-1" />
            YOUR NEXT BEST ACTION
          </span>
          <span className="text-xs text-text-muted flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {action.estimated_minutes} mins
          </span>
        </div>

        <button
          onClick={onWhyThis}
          className="text-xs text-primary font-semibold flex items-center hover:underline focus:outline-none"
        >
          <HelpCircle className="w-3.5 h-3.5 mr-1" />
          Why this?
        </button>
      </div>

      <h3 className="text-xl font-bold text-text-main mb-2 tracking-tight">
        {action.title}
      </h3>

      <p className="text-sm text-text-muted mb-5 leading-relaxed">
        {action.why_now}
      </p>

      <div className="flex items-center space-x-3">
        <button
          onClick={onStartAction}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center space-x-2 shadow-sm transition-all hover:scale-[1.02]"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{action.cta_label}</span>
        </button>

        <button
          onClick={onWhyThis}
          className="bg-white hover:bg-gray-50 text-text-main border border-border px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          View Prerequisite Reason
        </button>
      </div>
    </div>
  );
};
