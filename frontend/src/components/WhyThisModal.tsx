import React from 'react';
import { X, HelpCircle, CheckCircle, ArrowRight, Shield } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-main p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-primary font-bold text-sm mb-3">
          <HelpCircle className="w-5 h-5" />
          <span>EXPLAINABLE AI RECOMMENDATION</span>
        </div>

        <h3 className="text-xl font-bold text-text-main mb-2">
          Why learn {skillName}?
        </h3>

        <div className="bg-primary-soft/50 border border-primary/20 rounded-xl p-4 mb-4">
          <p className="text-sm text-text-main leading-relaxed italic">
            "{reason || `This skill addresses a critical requirement for ${careerTitle} and unlocks downstream prerequisite modules.`}"
          </p>
        </div>

        <div className="space-y-3 mb-6 text-xs text-text-muted">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
            <span>
              <strong>Prerequisite Readiness:</strong> All mandatory foundational topics have been completed or marked proficient.
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              <strong>Target Career Alignment:</strong> High weight requirement for target goal as {careerTitle}.
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>Deterministic Ranking:</strong> Calculated via multi-factor hybrid scoring algorithm (30% Gap + 20% Career + 15% Prereq + 10% Time).
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-primary text-white font-medium px-4 py-2 rounded-xl text-sm hover:bg-primary-dark transition-colors"
          >
            Got it, continue learning
          </button>
        </div>
      </div>
    </div>
  );
};
