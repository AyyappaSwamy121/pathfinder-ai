import React, { useState } from 'react';
import { api } from '../services/api';
import { X, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { ModalTransition } from './motion/MotionPrimitives';
import { motion } from 'framer-motion';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillId: string;
  skillName: string;
  onSubmitted?: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  skillId,
  skillName,
  onSubmitted,
}) => {
  const [sentiment, setSentiment] = useState<string>('Comfortable');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const options = ['Struggling', 'Need Practice', 'Comfortable', 'Confident', 'Too Easy'];

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await api.submitFeedback(skillId, sentiment, comment);
      setSuccess(true);
      if (onSubmitted) onSubmitted();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Feedback submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalTransition isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] p-1 rounded hover:bg-[var(--surface-sunken)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-2">
          <Badge tone="brand">
            <MessageSquare className="w-3.5 h-3.5 mr-1" />
            CONFIDENCE FEEDBACK LOOP
          </Badge>
        </div>

        <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
          Feedback for {skillName}
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mb-6">
          Your confidence rating dynamically adjusts skill weights and re-ranks your topological roadmap.
        </p>

        {!success ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                How confident do you feel with this topic?
              </label>
              <div className="space-y-2">
                {options.map((opt) => (
                  <motion.button
                    key={opt}
                    whileHover={{ x: 2, transition: { duration: 0.15 } }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSentiment(opt)}
                    className={`w-full text-left px-3 py-2 rounded-[var(--radius-sm)] text-xs font-medium border transition-colors cursor-pointer ${
                      sentiment === opt
                        ? 'bg-[var(--brand-soft)] text-[var(--brand)] border-[var(--brand-soft-border)] font-semibold shadow-2xs'
                        : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--surface-sunken)] hover:border-slate-300'
                    }`}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Optional Notes
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Share any specific concepts you'd like more practice on..."
                className="w-full p-3 rounded-[var(--radius-sm)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)] transition-colors"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button size="md" variant="primary" disabled={submitting} onClick={handleSubmit}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Feedback</span>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center space-y-2"
          >
            <CheckCircle2 className="w-8 h-8 text-[var(--success)] mx-auto" />
            <h4 className="text-sm font-bold text-[var(--text-primary)]">Feedback Received!</h4>
            <p className="text-xs text-[var(--text-secondary)]">Your roadmap path has been adaptively updated.</p>
          </motion.div>
        )}
      </div>
    </ModalTransition>
  );
};
