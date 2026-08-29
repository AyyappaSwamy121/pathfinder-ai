import React, { useState } from 'react';
import { AssessmentDetail, AssessmentEvaluateResponse } from '../types';
import { api } from '../services/api';
import { X, Award, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: AssessmentDetail;
  onComplete: (result: AssessmentEvaluateResponse) => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  isOpen,
  onClose,
  assessment,
  onComplete,
}) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentEvaluateResponse | null>(null);

  if (!isOpen) return null;

  const handleSelect = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await api.evaluateAssessment(assessment.id, answers);
      setResult(res);
      onComplete(res);
    } catch (err) {
      console.error('Assessment evaluation error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormComplete = assessment.questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-surface border border-border rounded-2xl max-w-2xl w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-main p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-primary font-bold text-sm mb-1">
          <Award className="w-5 h-5" />
          <span>MICRO-ASSESSMENT INTELLIGENCE</span>
        </div>

        <h3 className="text-xl font-bold text-text-main mb-1">
          {assessment.title}
        </h3>
        <p className="text-xs text-text-muted mb-6">
          {assessment.description || 'Test your current skill proficiency to adapt your learning path.'}
        </p>

        {!result ? (
          <div className="space-y-6">
            {assessment.questions.map((q, idx) => (
              <div key={q.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-text-main mb-3">
                  {idx + 1}. {q.question_text}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = answers[q.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelect(q.id, optIdx)}
                        className={`w-full text-left p-3 rounded-lg text-xs font-medium border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-primary-soft text-primary border-primary font-semibold shadow-2xs'
                            : 'bg-white text-text-main border-gray-200 hover:bg-gray-100'
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
              <span className="text-xs text-text-muted">
                {Object.keys(answers).length} of {assessment.questions.length} answered
              </span>

              <button
                disabled={!isFormComplete || submitting}
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all flex items-center space-x-2 shadow-sm"
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-soft text-primary font-extrabold text-2xl mb-2">
              {Math.round(result.score_percentage)}%
            </div>

            <h4 className="text-lg font-bold text-text-main">
              {result.passed ? 'Assessment Passed! 🎉' : 'Assessment Completed — Remediation Required'}
            </h4>

            <p className="text-sm text-text-muted max-w-md mx-auto">
              {result.recommendation}
            </p>

            {result.weak_skills.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Weak concept detected. Extra practice resources added to your roadmap.</span>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={onClose}
                className="bg-primary text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-primary-dark transition-colors"
              >
                Return to Dashboard & View Updated Path
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
