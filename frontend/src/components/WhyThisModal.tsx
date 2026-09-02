import React from 'react';
import { X, HelpCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { ModalTransition } from './motion/MotionPrimitives';

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
  return (
    <ModalTransition isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] p-1 rounded hover:bg-[var(--surface-sunken)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <Badge tone="brand">
            <HelpCircle className="w-3.5 h-3.5 mr-1" />
            EXPLAINABLE RECOMMENDATION
          </Badge>
        </div>

        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
          Why is {skillName} recommended now?
        </h3>

        <div className="bg-[var(--surface-sunken)] border border-[var(--border)] rounded-[var(--radius-sm)] p-4 mb-6">
          <p className="text-xs text-[var(--text-primary)] leading-relaxed italic">
            "{reason || `Addresses a current priority skill gap for ${careerTitle} and unlocks downstream prerequisite modules.`}"
          </p>
        </div>

        <div className="space-y-3 mb-6 text-xs text-[var(--text-secondary)]">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
            <span>
              <strong>Target Career Alignment:</strong> Required competency for {careerTitle}.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
            <span>
              <strong>Prerequisite Graph Satisfied:</strong> All prerequisite dependencies completed.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
            <span>
              <strong>Addresses Priority Gap:</strong> Resolves an active gap in your learner profile.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
          <div className="text-xs text-[var(--text-tertiary)] flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[var(--brand)]" />
            Deterministic Ranking Engine
          </div>

          <Button size="sm" variant="primary" onClick={onClose}>
            Close Reasoning
          </Button>
        </div>
      </div>
    </ModalTransition>
  );
};
