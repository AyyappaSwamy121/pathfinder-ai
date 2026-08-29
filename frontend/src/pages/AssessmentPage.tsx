import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLearner } from '../context/LearnerContext';
import { AssessmentDetail, AssessmentEvaluateResponse } from '../types';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const AssessmentPage: React.FC = () => {
  const { refreshState } = useLearner();
  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AssessmentEvaluateResponse | null>(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    const res = await api.evaluateAssessment(assessment.id, answers);
    setResult(res);
    setLoading(false);
    await refreshState();
  };

  if (loading || !assessment) {
    return <div className="h-64 bg-[var(--surface-sunken)] animate-pulse rounded-[var(--radius-md)]" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[var(--text-secondary)]">Target Skill:</span>
          <Badge tone="brand">{assessment.skill_name}</Badge>
        </div>
      </Card>

      {/* Quiz or Result Card */}
      {!result ? (
        <Card className="space-y-6">
          {assessment.questions.map((q, qIdx) => (
            <div key={q.id} className="space-y-3 pb-6 border-b border-[var(--border)] last:border-0 last:pb-0">
              <div className="text-xs font-semibold text-[var(--text-primary)]">
                {qIdx + 1}. {q.question_text}
              </div>

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers[q.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left p-3 rounded-[var(--radius-sm)] border text-xs transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-[var(--brand-soft)] text-[var(--brand)] border-[var(--brand-soft-border)] font-semibold'
                          : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--surface-sunken)]'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button
              size="md"
              variant="primary"
              disabled={Object.keys(answers).length < assessment.questions.length}
              onClick={handleSubmit}
            >
              Submit Assessment
            </Button>
          </div>
        </Card>
      ) : (
        /* Result Panel */
        <Card className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div>
              <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                DIAGNOSIS RESULT
              </div>
              <h3 className="text-2xl font-extrabold text-[var(--text-primary)] font-mono mt-1">
                Score: {result.score_percentage}%
              </h3>
            </div>

            <Badge tone={result.passed ? 'success' : 'danger'}>
              {result.passed ? 'PASSED · MASTERED' : 'REMEDIATION REQUIRED'}
            </Badge>
          </div>

          <div className="bg-[var(--surface-sunken)] border border-[var(--border)] rounded-[var(--radius-sm)] p-4">
            <div className="text-xs font-semibold text-[var(--text-primary)] mb-1">Adaptive System Impact</div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {result.recommendation}
            </p>
          </div>

          <div className="flex justify-end">
            <Button size="sm" variant="secondary" onClick={() => setResult(null)}>
              Retake Assessment
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
