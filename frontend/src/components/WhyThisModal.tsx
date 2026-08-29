import React from 'react';
import { X, HelpCircle, CheckCircle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface WhyThisModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillName: string;
  reason?: string;
  careerTitle?: string;
}

export const WhyThisModal: React.FC<WhyThisModalProps> = ({
  isOpen,
  onClose,
  skillName,
  reason,
  careerTitle = 'AI Engineer',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-surface border border-slate-200 rounded-lg max-w-lg w-full p-6 shadow-dropdown relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-primary font-bold text-xs mb-3 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>EXPLAINABLE AI RECOMMENDATION LOGIC</span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Why is {skillName} recommended now?
        </h3>

        <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 mb-5">
          <p className="text-xs text-slate-800 leading-relaxed font-medium italic">
            "{reason || `Addresses a current priority skill gap for ${careerTitle} and unlocks downstream prerequisite modules.`}"
          </p>
        </div>

        <div className="space-y-2.5 mb-6 text-xs text-slate-600">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
            <span>
              <strong>Target Career Alignment:</strong> Required competency for {careerTitle}.
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
            <span>
              <strong>Prerequisite Graph Satisfied:</strong> All prerequisite dependencies completed.
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
            <span>
              <strong>Addresses Priority Gap:</strong> Resolves an active gap in your learner profile.
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
            <span>
              <strong>Unlocks Milestone:</strong> Required before advancing to downstream phase topics.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="text-[11px] text-slate-400 flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-primary" />
            Deterministic Ranking Engine
          </div>

          <button
            onClick={onClose}
            className="bg-primary text-white font-medium px-4 py-1.5 rounded-md text-xs hover:bg-primary-dark transition-colors"
          >
            Close Reasoning
          </button>
        </div>
      </div>
    </div>
  );
};
