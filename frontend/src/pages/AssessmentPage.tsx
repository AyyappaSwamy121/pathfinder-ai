import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLearner } from '../context/LearnerContext';
import { AssessmentDetail, AssessmentEvaluateResponse } from '../types';
import { CheckCircle2, Award, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  AnimatedNumber,
  AnimatedProgress,
  CardSkeleton,
  TRANSITION_EASE,
} from '../components/motion/MotionPrimitives';
import { motion, AnimatePresence } from 'framer-motion';

export const AssessmentPage: React.FC = () => {
  const { refreshState } = useLearner();
  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AssessmentEvaluateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getAssessment('a_model_eval').then((res) => {
      setAssessment(res);
      setLoading(false);
    });
  }, []);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!assessment) return;
    setSubmitting(true);
    const res = await api.evaluateAssessment(assessment.id, answers);
    setResult(res);
    setSubmitting(false);
    await refreshState();
  };

  if (loading || !assessment) {
    return (
      <div className="space-y-6">
        <CardSkeleton className="h-20" />
        <CardSkeleton className="h-64" />
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / assessment.questions.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: TRANSITION_EASE }}
      >
        <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-colors">
          <div>
            <div className="mb-1">
              <Badge tone="brand">VERIFICATION ASSESSMENT</Badge>
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {assessment.title}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Validate skill mastery before advancing to downstream roadmap phases
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] uppercase font-semibold text-[var(--text-tertiary)]">Answered</div>
              <div className="text-xs font-mono font-bold text-[var(--brand)]">
                {answeredCount} / {assessment.questions.length}
              </div>
            </div>
            <div className="w-24">
              <AnimatedProgress value={progressPct} className="h-2" />
            </div>
            <Badge tone="brand">{assessment.skill_name}</Badge>
          </div>
        </Card>
      </motion.div>

      {/* Quiz or Result Card */}
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="questions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: TRANSITION_EASE }}
          >
            <Card className="space-y-6 hover:border-slate-300 transition-colors">
              {assessment.questions.map((q, qIdx) => (
                <div key={q.id} className="space-y-3 pb-6 border-b border-[var(--border)] last:border-0 last:pb-0">
                  <div className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[var(--surface-sunken)] border border-[var(--border)] flex items-center justify-center font-mono text-[10px] text-[var(--text-secondary)]">
                      {qIdx + 1}
                    </span>
                    <span>{q.question_text}</span>
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = answers[q.id] === optIdx;
                      return (
                        <motion.button
                          key={optIdx}
                          whileHover={{ x: 2, transition: { duration: 0.15 } }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-[var(--radius-sm)] border text-xs transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-[var(--brand-soft)] text-[var(--brand)] border-[var(--brand-soft-border)] font-semibold shadow-2xs'
                              : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--surface-sunken)] hover:border-slate-300'
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.18 }}
                            >
                              <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <Button
                  size="md"
                  variant="primary"
                  disabled={answeredCount < assessment.questions.length || submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Grading Assessment...</span>
                    </>
                  ) : (
                    <span>Submit Assessment</span>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          /* Result Panel */
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: TRANSITION_EASE }}
          >
            <Card className="space-y-6 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div>
                  <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                    DIAGNOSIS RESULT
                  </div>
                  <h3 className="text-2xl font-extrabold text-[var(--text-primary)] font-mono mt-1 flex items-center gap-1.5">
                    <span>Score:</span>
                    <span className="text-[var(--brand)]">
                      <AnimatedNumber value={result.score_percentage} suffix="%" />
                    </span>
                  </h3>
                </div>

                <Badge tone={result.passed ? 'success' : 'danger'}>
                  {result.passed ? 'PASSED · MASTERED' : 'REMEDIATION REQUIRED'}
                </Badge>
              </div>

              <div className="bg-[var(--surface-sunken)] border border-[var(--border)] rounded-[var(--radius-sm)] p-4">
                <div className="text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[var(--brand)]" />
                  <span>Adaptive System Impact</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {result.recommendation}
                </p>
              </div>

              <div className="flex justify-end">
                <Button size="sm" variant="secondary" onClick={() => { setResult(null); setAnswers({}); }}>
                  Retake Assessment
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
