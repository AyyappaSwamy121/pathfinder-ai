import React from 'react';
import { useLearner } from '../context/LearnerContext';
import { Sparkles, UserCheck, PlayCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const JudgeDemoBanner: React.FC = () => {
  const { judgeMode, loadPresetProfile } = useLearner();

  if (!judgeMode) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border-b border-amber-200/60 py-2.5 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-amber-900 font-medium">
          <Sparkles className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="font-bold">HCL JUDGE DEMO MODE:</span>
          <span>Quick test pre-seeded profiles to test adaptive replenishment and prerequisite ordering:</span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto">
          <button
            onClick={() => loadPresetProfile('alex')}
            className="flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 rounded font-medium shadow-2xs transition-colors"
          >
            <UserCheck className="w-3 h-3 text-amber-600" />
            <span>Alex (AI Engineer)</span>
          </button>

          <button
            onClick={() => loadPresetProfile('jordan')}
            className="flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-900 border border-indigo-200 rounded font-medium shadow-2xs transition-colors"
          >
            <UserCheck className="w-3 h-3 text-indigo-600" />
            <span>Jordan (Data Analyst)</span>
          </button>

          <button
            onClick={() => loadPresetProfile('devon')}
            className="flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 rounded font-medium shadow-2xs transition-colors"
          >
            <UserCheck className="w-3 h-3 text-emerald-600" />
            <span>Devon (Full Stack)</span>
          </button>

          <Link
            to="/architecture"
            className="flex items-center space-x-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium shadow-2xs transition-colors"
          >
            <Eye className="w-3 h-3" />
            <span>How AI Thinks</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
