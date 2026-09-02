import React from 'react';
import { NextBestAction } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Play, Clock, HelpCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { TRANSITION_EASE } from './motion/MotionPrimitives';

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
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.18, ease: TRANSITION_EASE } }}
      className="h-full"
    >
      <Card className="flex flex-col justify-between h-full border-[var(--brand-soft-border)] hover:border-indigo-300 hover:shadow-sm transition-colors duration-200">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge tone="brand">NEXT BEST ACTION</Badge>
              <span className="text-xs font-medium text-[var(--text-secondary)] flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-[var(--text-tertiary)]" />
                {action.estimated_minutes} mins
              </span>
            </div>

            <button
              onClick={onWhyThis}
              className="text-xs font-medium text-[var(--brand)] hover:text-[var(--brand-hover)] flex items-center gap-1 focus:outline-none transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Why this?</span>
            </button>
          </div>

          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
            {action.title}
          </h3>

          <div className="bg-[var(--surface-sunken)] border border-[var(--border)] rounded-[var(--radius-sm)] p-3 mb-6">
            <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
              Relevance Rationale
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {action.why_now}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button size="sm" variant="primary" onClick={onStartAction}>
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{action.cta_label}</span>
          </Button>

          <Button size="sm" variant="secondary" onClick={onWhyThis}>
            <span>View Reasoning</span>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
