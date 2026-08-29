import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { WhyThisModal } from '../components/WhyThisModal';
import { AssessmentModal } from '../components/AssessmentModal';
import { FeedbackModal } from '../components/FeedbackModal';
import { api } from '../services/api';
import { PathStep, AssessmentDetail } from '../types';
import { CheckCircle2, Clock, HelpCircle, Award, ExternalLink, MessageSquare, Play, Sparkles, FolderGit2, BookOpen } from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const { activePath, refreshState } = useLearner();

  const [whyThisStep, setWhyThisStep] = useState<PathStep | null>(null);
  const [activeAssessment, setActiveAssessment] = useState<AssessmentDetail | null>(null);
  const [feedbackStep, setFeedbackStep] = useState<PathStep | null>(null);

  const handleOpenAssessment = async (assessmentId: string) => {
    try {
      const data = await api.getAssessment(assessmentId);
      setActiveAssessment(data);
    } catch (err) {
      console.error('Failed to load assessment:', err);
    }
  };

  // Group steps by Phase Number
  const phasesMap: Record<number, { title: string; steps: PathStep[] }> = {};
  if (activePath?.steps) {
    activePath.steps.forEach((step) => {
      if (!phasesMap[step.phase_number]) {
        phasesMap[step.phase_number] = { title: step.phase_title, steps: [] };
      }
      phasesMap[step.phase_number].steps.push(step);
    });
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-6 gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary font-semibold text-xs mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TOPOLOGICAL PREREQUISITE ROADMAP</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
            Personalized {activePath?.career_title || 'AI Engineer'} Learning Path
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Topologically ordered learning path generated specifically for your profile.
          </p>
        </div>

        <button
          onClick={() => refreshState()}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-semibold text-xs shadow-xs transition-colors"
        >
          Re-rank Topological Path
        </button>
      </div>

      {/* Vertical Phase Timeline */}
      <div className="space-y-10 relative">
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border -z-0 hidden md:block" />

        {Object.entries(phasesMap).map(([phaseNum, phaseData]) => {
          const completedInPhase = phaseData.steps.filter((s) => s.status === 'COMPLETED').length;
          const totalInPhase = phaseData.steps.length;

          return (
            <div key={phaseNum} className="relative space-y-4">
              {/* Phase Header */}
              <div className="flex items-center space-x-3 bg-surface border border-border rounded-xl p-4 shadow-2xs z-10 relative">
                <div className="w-10 h-10 rounded-xl bg-primary text-white font-extrabold flex items-center justify-center text-sm shadow-xs shrink-0">
                  P{phaseNum}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-text-main">{phaseData.title}</h3>
                  <div className="text-xs text-text-muted flex items-center space-x-3 mt-0.5">
                    <span>{completedInPhase} of {totalInPhase} milestones completed</span>
                    <span>•</span>
                    <span>Est. {totalInPhase * 2} hours</span>
                  </div>
                </div>
              </div>

              {/* Phase Steps */}
              <div className="ml-0 md:ml-12 space-y-4">
                {phaseData.steps.map((step) => {
                  const isCompleted = step.status === 'COMPLETED';
                  const isInProgress = step.status === 'IN_PROGRESS';

                  return (
                    <div
                      key={step.id}
                      className={`bg-surface border rounded-2xl p-5 shadow-2xs transition-all relative ${
                        isInProgress
                          ? 'border-2 border-primary/40 bg-gradient-to-r from-primary-soft/30 via-white to-white'
                          : 'border-border'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-700'
                                : isInProgress
                                ? 'bg-primary text-white animate-pulse'
                                : 'bg-gray-100 text-text-muted'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.step_order}
                          </div>

                          <div>
                            <h4 className="text-base font-bold text-text-main flex items-center space-x-2">
                              <span>{step.skill_name}</span>
                              <span
                                className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                                  isCompleted
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : isInProgress
                                    ? 'bg-indigo-50 text-primary border border-indigo-200'
                                    : 'bg-gray-100 text-text-muted'
                                }`}
                              >
                                {step.status}
                              </span>
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-xs">
                          <span className="text-text-muted flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            {step.estimated_minutes} mins
                          </span>

                          <button
                            onClick={() => setWhyThisStep(step)}
                            className="text-xs text-primary font-semibold flex items-center hover:underline bg-primary-soft px-2.5 py-1 rounded-lg"
                          >
                            <HelpCircle className="w-3.5 h-3.5 mr-1" />
                            Why this?
                          </button>
                        </div>
                      </div>

                      {/* Explanation Reason */}
                      <p className="text-xs text-text-muted mb-4 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-100 italic">
                        "{step.reason}"
                      </p>

                      {/* Resources & Projects Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {step.resources.map((res) => (
                          <a
                            key={res.id}
                            href={res.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-surface hover:bg-gray-50 border border-border p-3 rounded-xl transition-all flex items-start space-x-3 group"
                          >
                            <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-text-main truncate group-hover:text-primary transition-colors">
                                {res.title}
                              </div>
                              <div className="text-[11px] text-text-muted mt-0.5">
                                {res.provider} • {res.type} ({res.duration_minutes} mins)
                              </div>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-primary shrink-0" />
                          </a>
                        ))}

                        {step.project && (
                          <div className="bg-surface border border-primary/20 p-3 rounded-xl flex items-start space-x-3">
                            <FolderGit2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-bold text-text-main">
                                Project: {step.project.title}
                              </div>
                              <div className="text-[11px] text-text-muted mt-0.5">
                                {step.project.objective}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions Footer */}
                      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-border gap-2">
                        <div className="flex items-center space-x-2">
                          {step.assessment_id && (
                            <button
                              onClick={() => handleOpenAssessment(step.assessment_id!)}
                              className="bg-primary hover:bg-primary-dark text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-2xs transition-colors"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>Take Micro-Assessment</span>
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => setFeedbackStep(step)}
                          className="text-xs font-semibold text-text-muted hover:text-text-main flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>How confident are you?</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Why This Modal */}
      {whyThisStep && (
        <WhyThisModal
          isOpen={!!whyThisStep}
          onClose={() => setWhyThisStep(null)}
          skillName={whyThisStep.skill_name}
          reason={whyThisStep.reason}
          careerTitle={activePath?.career_title}
        />
      )}

      {/* Assessment Modal */}
      {activeAssessment && (
        <AssessmentModal
          isOpen={!!activeAssessment}
          onClose={() => setActiveAssessment(null)}
          assessment={activeAssessment}
          onComplete={() => {
            refreshState();
          }}
        />
      )}

      {/* Feedback Modal */}
      {feedbackStep && (
        <FeedbackModal
          isOpen={!!feedbackStep}
          onClose={() => setFeedbackStep(null)}
          skillId={feedbackStep.skill_id}
          skillName={feedbackStep.skill_name}
          onSubmitted={() => refreshState()}
        />
      )}
    </div>
  );
};
