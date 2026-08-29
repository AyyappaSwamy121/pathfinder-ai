import React, { useState, useEffect } from 'react';
import { AssessmentDetail, AssessmentEvaluateResponse } from '../types';
import { api } from '../services/api';
import { X, Award, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-surface border border-slate-200 rounded-lg max-w-2xl w-full p-6 shadow-dropdown relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-primary font-bold text-xs mb-1 uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>VERIFICATION & REMEDIATION ASSESSMENT</span>
        </div>

        {loadingAssessment || !assessment ? (
          <div className="py-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
            <span className="text-xs">Loading assessment questions...</span>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {assessment.title}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {assessment.description || 'Test your current skill proficiency to adapt your learning path.'}
            </p>

            {!result ? (
              <div className="space-y-6">
                {assessment.questions.map((q, idx) => (
                  <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-md p-4">
                    <p className="text-xs font-bold text-slate-900 mb-3">
                      {idx + 1}. {q.question_text}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = answers[q.id] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelect(q.id, optIdx)}
                            className={`w-full text-left p-3 rounded-md text-xs font-medium border transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-primary-soft text-primary border-primary font-semibold'
                                : 'bg-surface text-slate-800 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">
                    {Object.keys(answers).length} of {assessment.questions.length} answered
                  </span>

                  <button
                    disabled={!isFormComplete || submitting}
                    onClick={handleSubmit}
                    className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-md text-xs transition-colors flex items-center space-x-2 shadow-subtle"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating Answers...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit & Adapt Path</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-soft text-primary font-extrabold text-2xl font-mono mb-2">
                  {Math.round(result.score_percentage)}%
                </div>

                <h4 className="text-base font-bold text-slate-900">
                  {result.passed ? 'Assessment Passed! 🎉' : 'Assessment Completed — Remediation Required'}
                </h4>

                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  {result.recommendation}
                </p>

                {result.weak_skills.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-xs text-amber-900 flex items-center justify-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Weak concept detected. Remediation practice added to your path.</span>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    onClick={onClose}
                    className="bg-primary text-white font-semibold px-6 py-2 rounded-md text-xs hover:bg-primary-dark transition-colors"
                  >
                    Return to Workspace & View Updated Path
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
