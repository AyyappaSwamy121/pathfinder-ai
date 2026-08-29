import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { PathStep, Resource, Project } from '../types';
import { WhyThisModal } from '../components/WhyThisModal';
import { AssessmentModal } from '../components/AssessmentModal';
import { FeedbackModal } from '../components/FeedbackModal';
import {
  CheckCircle2, Clock, MapPin, Play, Award, FileText, ExternalLink, HelpCircle, ChevronDown, ChevronRight, AlertCircle, RefreshCw, BookOpen
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const { activePath, dashboard, loading, refreshState } = useLearner();

  const [selectedStep, setSelectedStep] = useState<PathStep | null>(null);
  const [whyThisOpen, setWhyThisOpen] = useState(false);
  const [whyThisSkill, setWhyThisSkill] = useState<{ name: string; reason?: string }>({ name: '' });
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [activeAssessmentId, setActiveAssessmentId] = useState<string>('a_model_eval');
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  if (loading || !activePath) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-20 bg-slate-200 rounded-lg" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-32 bg-slate-200 rounded-lg" />
        ))}
      </div>
    );
  }

  // Group steps by Phase Number
  const phaseMap: Record<number, { title: string; steps: PathStep[] }> = {};
  activePath.steps.forEach((step) => {
    if (!phaseMap[step.phase_number]) {
      phaseMap[step.phase_number] = {
        title: step.phase_title,
        steps: [],
      };
    }
    phaseMap[step.phase_number].steps.push(step);
  });

  const phases = Object.keys(phaseMap).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1">
            PERSONALIZED CAREER PROGRESSION
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {activePath.career_title} Learning Roadmap
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Topologically ordered sequence respecting Directed Acyclic Graph (DAG) prerequisites
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => refreshState()}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold px-3 py-1.5 rounded-md text-xs transition-colors flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recalculate Roadmap</span>
          </button>
        </div>
      </div>

      {/* Vertical Phase Milestone Timeline */}
      <div className="space-y-6">
        {phases.map((phaseNum) => {
          const phase = phaseMap[phaseNum];
          const completedInPhase = phase.steps.filter((s) => s.status === 'COMPLETED').length;
          const totalInPhase = phase.steps.length;
          const phaseProgress = Math.round((completedInPhase / totalInPhase) * 100);

          return (
            <div key={phaseNum} className="bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle">
              {/* Phase Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-md bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center font-mono">
                    0{phaseNum}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{phase.title}</h3>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {completedInPhase} of {totalInPhase} milestones completed ({phaseProgress}%)
                    </div>
                  </div>
                </div>

                <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${phaseProgress}%` }}
                  />
                </div>
              </div>

              {/* Steps List */}
              <div className="space-y-3">
                {phase.steps.map((step) => {
                  const isSelected = selectedStep?.id === step.id;
                  return (
                    <div
                      key={step.id}
                      className={`border rounded-md p-4 transition-all ${
                        step.status === 'COMPLETED'
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : step.status === 'IN_PROGRESS'
                          ? 'bg-indigo-50/40 border-primary/40'
                          : 'bg-surface border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start space-x-3">
                          {step.status === 'COMPLETED' ? (
                            <CheckCircle2 className="w-5 h-5 text-semantic-success shrink-0 mt-0.5" />
                          ) : step.status === 'IN_PROGRESS' ? (
                            <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5 animate-pulse" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0 mt-0.5" />
                          )}

                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-xs font-bold text-slate-900">
                                {step.step_order}. {step.skill_name}
                              </h4>
                              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                {step.difficulty}
                              </span>
                              {step.status === 'IN_PROGRESS' && (
                                <span className="text-[10px] font-bold text-primary bg-primary-soft px-2 py-0.5 rounded uppercase">
                                  Current Focus
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                              {step.reason || `Essential requirement for ${activePath.career_title} path.`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                          <button
                            onClick={() => {
                              setWhyThisSkill({ name: step.skill_name, reason: step.reason });
                              setWhyThisOpen(true);
                            }}
                            className="text-xs font-medium text-slate-500 hover:text-primary flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Why this?</span>
                          </button>

                          <button
                            onClick={() => setSelectedStep(isSelected ? null : step)}
                            className="text-xs font-semibold text-primary hover:bg-primary-soft px-3 py-1 rounded border border-primary/20 transition-colors flex items-center space-x-1"
                          >
                            <span>{isSelected ? 'Hide Details' : 'View Details'}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Progressive Disclosure Details Panel */}
                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-slate-200 text-xs space-y-4 animate-in fade-in duration-150">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Resources Column */}
                            <div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Recommended Resources ({step.resources.length})
                              </div>
                              <div className="space-y-2">
                                {step.resources.map((res) => (
                                  <div key={res.id} className="bg-white border border-slate-200 rounded p-2.5 flex items-start justify-between">
                                    <div>
                                      <div className="font-semibold text-slate-900">{res.title}</div>
                                      <div className="text-[11px] text-slate-500">{res.provider} · {res.type} · {res.duration_minutes} mins</div>
                                    </div>
                                    {res.url && (
                                      <a
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:text-primary-dark p-1"
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Project & Assessment Column */}
                            <div className="space-y-3">
                              {step.project && (
                                <div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Milestone Project
                                  </div>
                                  <div className="bg-white border border-slate-200 rounded p-2.5">
                                    <div className="font-semibold text-slate-900">{step.project.title}</div>
                                    <div className="text-[11px] text-slate-600 mt-1">{step.project.objective}</div>
                                  </div>
                                </div>
                              )}

                              {step.assessment_id && (
                                <div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Verification Assessment
                                  </div>
                                  <button
                                    onClick={() => {
                                      setActiveAssessmentId(step.assessment_id!);
                                      setAssessmentOpen(true);
                                    }}
                                    className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 rounded text-xs transition-colors flex items-center justify-center space-x-1.5"
                                  >
                                    <Award className="w-4 h-4" />
                                    <span>Take Micro-Assessment</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <WhyThisModal
        isOpen={whyThisOpen}
        onClose={() => setWhyThisOpen(false)}
        skillName={whyThisSkill.name}
        reason={whyThisSkill.reason}
        careerTitle={activePath.career_title}
      />

      <AssessmentModal
        isOpen={assessmentOpen}
        onClose={() => setAssessmentOpen(false)}
        assessmentId={activeAssessmentId}
        onCompleted={refreshState}
      />
    </div>
  );
};
