import React, { useState, useEffect } from 'react';
import { AssessmentDetail, AssessmentEvaluateResponse } from '../types';
import { api } from '../services/api';
import { X, Award, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

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

  if (!isOpen) return null;

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

  const isFormComplete = assessment?.questions.every((q) => answers[q.id] !== undefined) ?? false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] max-w-2xl w-full p-6 shadow-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-2">
          <Badge tone="brand">
            <Award className="w-3.5 h-3.5 mr-1" />
            VERIFICATION ASSESSMENT
          </Badge>
        </div>

        {loadingAssessment || !assessment ? (
          <div className="py-12 text-center text-[var(--text-tertiary)]">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[var(--brand)] mb-2" />
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

            {!result ? (
              <div className="space-y-6">
                {assessment.questions.map((q, idx) => (
                  <div key={q.id} className="bg-[var(--surface-sunken)] border border-[var(--border)] rounded-[var(--radius-md)] p-4">
                    <p className="text-xs font-semibold text-[var(--text-primary)] mb-3">
                      {idx + 1}. {q.question_text}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = answers[q.id] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelect(q.id, optIdx)}
                            className={`w-full text-left p-3 rounded-[var(--radius-sm)] text-xs font-medium border transition-colors flex items-center justify-between ${
                              isSelected
                                ? 'bg-[var(--brand-soft)] text-[var(--brand)] border-[var(--brand-soft-border)] font-semibold'
                                : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--surface-sunken)]'
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-[var(--text-secondary)]">
                    {Object.keys(answers).length} of {assessment.questions.length} answered
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
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-[var(--radius-pill)] bg-[var(--brand-soft)] text-[var(--brand)] font-bold text-2xl font-mono mb-2">
                  {Math.round(result.score_percentage)}%
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
