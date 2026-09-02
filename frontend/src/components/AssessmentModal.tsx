import React, { useState, useEffect } from 'react';
import { AssessmentDetail, AssessmentEvaluateResponse } from '../types';
import { api } from '../services/api';
import { X, Award, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { ModalTransition, AnimatedProgress, AnimatedNumber, TRANSITION_EASE } from './motion/MotionPrimitives';
import { motion, AnimatePresence } from 'framer-motion';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentId?: string;
  assessment?: AssessmentDetail;
  onCompleted?: () => void;
  onComplete?: (result: AssessmentEvaluateResponse) => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  isOpen,
  onClose,
  assessmentId,
  assessment: initialAssessment,
  onCompleted,
  onComplete,
}) => {
  const [assessment, setAssessment] = useState<AssessmentDetail | null>(initialAssessment || null);
  const [loadingAssessment, setLoadingAssessment] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentEvaluateResponse | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialAssessment) {
        setAssessment(initialAssessment);
      } else if (assessmentId) {
        setLoadingAssessment(true);
        api.getAssessment(assessmentId).then((res) => {
          setAssessment(res);
          setLoadingAssessment(false);
        });
      }
    } else {
      setResult(null);
      setAnswers({});
    }
  }, [isOpen, assessmentId, initialAssessment]);

  const handleSelect = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!assessment) return;
    try {
      setSubmitting(true);
      const res = await api.evaluateAssessment(assessment.id, answers);
      setResult(res);
      if (onComplete) onComplete(res);
      if (onCompleted) onCompleted();
    } catch (err) {
      console.error('Assessment evaluation error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const isFormComplete = assessment?.questions.every((q) => answers[q.id] !== undefined) ?? false;
  const progressPct = assessment ? Math.round((answeredCount / assessment.questions.length) * 100) : 0;

  return (
    <ModalTransition isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] p-1 rounded hover:bg-[var(--surface-sunken)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between mb-3 pr-8">
          <Badge tone="brand">
            <Award className="w-3.5 h-3.5 mr-1" />
            VERIFICATION ASSESSMENT
          </Badge>

          {assessment && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[var(--text-secondary)] font-medium">
                {answeredCount}/{assessment.questions.length}
              </span>
              <div className="w-20">
                <AnimatedProgress value={progressPct} className="h-1.5" />
              </div>
            </div>
          )}
        </div>

        {loadingAssessment || !assessment ? (
          <div className="py-12 text-center text-[var(--text-tertiary)] space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[var(--brand)]" />
            <span className="text-xs">Loading assessment questions...</span>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
              {assessment.title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-6">
              {assessment.description || 'Test your current skill proficiency to adapt your learning path.'}
            </p>

            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key="questions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {assessment.questions.map((q, idx) => (
                    <div key={q.id} className="bg-[var(--surface-sunken)] border border-[var(--border)] rounded-[var(--radius-md)] p-4">
                      <p className="text-xs font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center font-mono text-[10px] text-[var(--text-secondary)]">
                          {idx + 1}
                        </span>
                        <span>{q.question_text}</span>
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = answers[q.id] === optIdx;
                          return (
                            <motion.button
                              key={optIdx}
                              whileHover={{ x: 2, transition: { duration: 0.15 } }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => handleSelect(q.id, optIdx)}
                              className={`w-full text-left p-3 rounded-[var(--radius-sm)] text-xs font-medium border transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-[var(--brand-soft)] text-[var(--brand)] border-[var(--brand-soft-border)] font-semibold shadow-2xs'
                                  : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--surface-sunken)] hover:border-slate-300'
                              }`}
                            >
                              <span>{opt}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0 ml-2" />}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-[var(--text-secondary)]">
                      {answeredCount} of {assessment.questions.length} answered
                    </span>

                    <Button
                      size="md"
                      variant="primary"
                      disabled={!isFormComplete || submitting}
                      onClick={handleSubmit}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Evaluating...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit & Adapt Path</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: TRANSITION_EASE }}
                  className="text-center py-6 space-y-4"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-[var(--radius-pill)] bg-[var(--brand-soft)] text-[var(--brand)] font-bold text-2xl font-mono mb-2 shadow-xs">
                    <AnimatedNumber value={result.score_percentage} suffix="%" />
                  </div>

                  <h4 className="text-base font-bold text-[var(--text-primary)]">
                    {result.passed ? 'Assessment Passed' : 'Assessment Completed — Remediation Required'}
                  </h4>

                  <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                    {result.recommendation}
                  </p>

                  {result.weak_skills.length > 0 && (
                    <div className="bg-[var(--warning-soft)] border border-[var(--warning)] rounded-[var(--radius-sm)] p-3 text-xs text-[var(--warning)] flex items-center justify-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Weak concept detected. Remediation practice added to your path.</span>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button size="md" variant="primary" onClick={onClose}>
                      Return to Workspace
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </ModalTransition>
  );
};
