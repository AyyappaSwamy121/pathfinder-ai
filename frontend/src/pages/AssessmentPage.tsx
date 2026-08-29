import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLearner } from '../context/LearnerContext';
import { AssessmentDetail, AssessmentEvaluateResponse } from '../types';
import { Award, CheckCircle2, AlertCircle, RefreshCw, ArrowRight, ShieldCheck } from 'lucide-react';

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
    return <div className="h-64 bg-slate-200 animate-pulse rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1">
            VERIFICATION & REMEDIATION ASSESSMENT
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {assessment.title}
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Validate skill mastery before advancing to downstream roadmap phases
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500">Skill Target:</span>
          <span className="text-xs font-bold text-primary bg-primary-soft px-2.5 py-1 rounded">
            {assessment.skill_name}
          </span>
        </div>
      </div>

      {/* Quiz or Result Card */}
      {!result ? (
        <div className="bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle space-y-6">
          {assessment.questions.map((q, qIdx) => (
            <div key={q.id} className="space-y-3 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="text-xs font-bold text-slate-900 leading-relaxed">
                {qIdx + 1}. {q.question_text}
              </div>

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers[q.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left p-3 rounded-md border text-xs transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-primary-soft text-primary border-primary font-semibold'
                          : 'bg-surface hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < assessment.questions.length}
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2.5 rounded-md text-xs transition-colors shadow-subtle disabled:opacity-50"
            >
              Submit Assessment
            </button>
          </div>
        </div>
      ) : (
        /* Result & Adaptive Impact Panel */
        <div className="bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                ASSESSMENT DIAGNOSIS RESULT
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                Score: {result.score_percentage}%
              </h3>
            </div>

            <span
              className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                result.passed ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {result.passed ? 'PASSED · SKILL MASTERED' : 'REMEDIATION REQUIRED'}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
            <div className="text-xs font-bold text-slate-900 mb-1">Adaptive System Impact</div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {result.recommendation}
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setResult(null)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold px-4 py-2 rounded-md text-xs transition-colors"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
