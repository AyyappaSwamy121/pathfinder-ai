import React, { useState } from 'react';
import { AssessmentModal } from '../components/AssessmentModal';
import { AssessmentDetail } from '../types';
import { api } from '../services/api';
import { useLearner } from '../context/LearnerContext';
import { Award, CheckCircle2, Play, AlertCircle } from 'lucide-react';

export const AssessmentPage: React.FC = () => {
  const { refreshState } = useLearner();
  const [activeAssessment, setActiveAssessment] = useState<AssessmentDetail | null>(null);

  const availableAssessments = [
    {
      id: 'a_model_eval',
      title: 'Model Evaluation & Metrics Micro-Assessment',
      skillName: 'Model Evaluation & Metrics',
      questionsCount: 3,
      desc: 'Assess your understanding of precision, recall, ROC-AUC curves, and data leakage detection.',
    },
    {
      id: 'a_supervised',
      title: 'Supervised Learning Concepts',
      skillName: 'Supervised Learning',
      questionsCount: 3,
      desc: 'Evaluate core decision tree, random forest, and gradient boosting ensemble principles.',
    },
  ];

  const handleStart = async (id: string) => {
    try {
      const data = await api.getAssessment(id);
      setActiveAssessment(data);
    } catch (err) {
      console.error('Failed to load assessment:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-border pb-4">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary font-semibold text-xs mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>MICRO-ASSESSMENT ENGINE</span>
        </div>
        <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
          Assessments & Skill Proof
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Take micro-assessments to validate your skill proficiencies and trigger adaptive roadmap acceleration.
        </p>
      </div>

      <div className="space-y-4">
        {availableAssessments.map((a) => (
          <div key={a.id} className="bg-surface border border-border rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-primary bg-primary-soft px-2 py-0.5 rounded">
                Skill: {a.skillName}
              </span>
              <h3 className="text-lg font-bold text-text-main mt-1">{a.title}</h3>
              <p className="text-xs text-text-muted mt-1">{a.desc}</p>
            </div>

            <button
              onClick={() => handleStart(a.id)}
              className="bg-primary hover:bg-primary-dark text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-2xs transition-all shrink-0"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Assessment</span>
            </button>
          </div>
        ))}
      </div>

      {activeAssessment && (
        <AssessmentModal
          isOpen={!!activeAssessment}
          onClose={() => setActiveAssessment(null)}
          assessment={activeAssessment}
          onComplete={() => refreshState()}
        />
      )}
    </div>
  );
};
