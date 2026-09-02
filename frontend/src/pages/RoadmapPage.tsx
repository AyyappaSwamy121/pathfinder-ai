import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { PathStep } from '../types';
import { WhyThisModal } from '../components/WhyThisModal';
import { AssessmentModal } from '../components/AssessmentModal';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Award, ExternalLink, HelpCircle, ChevronDown, RefreshCw, GitCompare, Briefcase } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SEED_CAREERS } from '../services/api';
import {
  StaggerContainer,
  StaggerItem,
  AnimatedProgress,
  CardSkeleton,
  TRANSITION_EASE,
} from '../components/motion/MotionPrimitives';
import { motion, AnimatePresence } from 'framer-motion';

export const RoadmapPage: React.FC = () => {
  const { activePath, loading, refreshState, setTargetCareer } = useLearner();

  const [selectedStep, setSelectedStep] = useState<PathStep | null>(null);
  const [whyThisOpen, setWhyThisOpen] = useState(false);
  const [whyThisSkill, setWhyThisSkill] = useState<{ name: string; reason?: string }>({ name: '' });
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [activeAssessmentId, setActiveAssessmentId] = useState<string>('a_model_eval');

  if (loading || !activePath) {
    return (
      <div className="space-y-4">
        <CardSkeleton className="h-20" />
        {[1, 2, 3].map((i) => (
          <CardSkeleton key={i} className="h-40" />
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
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: TRANSITION_EASE }}
      >
        <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-slate-200/80 hover:border-slate-300 transition-colors">
          <div>
            <div className="mb-1">
              <Badge tone="brand">PERSONALIZED CAREER PROGRESSION</Badge>
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {activePath.career_title} Learning Roadmap
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Topologically ordered sequence respecting Directed Acyclic Graph (DAG) prerequisites
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Target Role Switcher */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC]">
              <span className="text-xs font-semibold text-[#64748B]">Target Role:</span>
              <select
                value={activePath.career_id}
                onChange={(e) => setTargetCareer(e.target.value)}
                className="text-xs font-bold text-[#4338CA] bg-transparent focus:outline-none cursor-pointer"
                aria-label="Switch Target Career Roadmap"
              >
                {SEED_CAREERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <Link to={`/career-twin?target=${activePath.career_id}`}>
              <Button size="sm" variant="primary">
                <GitCompare className="w-3.5 h-3.5 mr-1" />
                <span>Optimize in Career Twin</span>
              </Button>
            </Link>
            <Button size="sm" variant="secondary" onClick={() => refreshState()}>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Recalculate</span>
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Vertical Phase Milestone Timeline */}
      <StaggerContainer staggerDelay={0.08} className="space-y-6">
        {phases.map((phaseNum) => {
          const phase = phaseMap[phaseNum];
          const completedInPhase = phase.steps.filter((s) => s.status === 'COMPLETED').length;
          const totalInPhase = phase.steps.length;
          const phaseProgress = Math.round((completedInPhase / totalInPhase) * 100);

          return (
            <StaggerItem key={phaseNum}>
              <Card className="hover:border-slate-300 transition-colors">
                {/* Phase Header */}
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--text-primary)] text-white font-bold text-xs flex items-center justify-center font-mono">
                      0{phaseNum}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">{phase.title}</h3>
                      <div className="text-[11px] text-[var(--text-secondary)]">
                        {completedInPhase} of {totalInPhase} milestones completed ({phaseProgress}%)
                      </div>
                    </div>
                  </div>

                  <div className="w-28">
                    <AnimatedProgress value={phaseProgress} className="h-2" />
                  </div>
                </div>

                {/* Steps List */}
                <div className="space-y-3">
                  {phase.steps.map((step) => {
                    const isSelected = selectedStep?.id === step.id;
                    return (
                      <div
                        key={step.id}
                        className={`border rounded-[var(--radius-sm)] p-4 transition-all duration-200 ${
                          step.status === 'COMPLETED'
                            ? 'bg-[var(--success-soft)] border-[var(--success)]'
                            : step.status === 'IN_PROGRESS'
                            ? 'bg-[var(--brand-soft)] border-[var(--brand-soft-border)] shadow-xs'
                            : 'bg-[var(--surface)] border-[var(--border)] hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-start gap-3">
                            {step.status === 'COMPLETED' ? (
                              <CheckCircle2 className="w-5 h-5 text-[var(--success)] shrink-0 mt-0.5 transition-transform" />
                            ) : step.status === 'IN_PROGRESS' ? (
                              <Clock className="w-5 h-5 text-[var(--brand)] shrink-0 mt-0.5 animate-pulse-slow" />
                            ) : (
                              <div className="w-5 h-5 rounded-[var(--radius-pill)] border-2 border-[var(--border-strong)] shrink-0 mt-0.5" />
                            )}

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-[var(--text-primary)]">
                                  {step.step_order}. {step.skill_name}
                                </h4>
                                <Badge tone="neutral">{step.difficulty}</Badge>
                                {step.status === 'IN_PROGRESS' && (
                                  <Badge tone="brand">Current Focus</Badge>
                                )}
                              </div>

                              <p className="text-xs text-[var(--text-secondary)] mt-1">
                                {step.reason || `Essential requirement for ${activePath.career_title} path.`}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <button
                              onClick={() => {
                                setWhyThisSkill({ name: step.skill_name, reason: step.reason });
                                setWhyThisOpen(true);
                              }}
                              className="text-xs text-[var(--text-secondary)] hover:text-[var(--brand)] flex items-center gap-1 px-2 py-1 focus:outline-none transition-colors"
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                              <span>Why this?</span>
                            </button>

                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setSelectedStep(isSelected ? null : step)}
                            >
                              <span>{isSelected ? 'Hide' : 'Details'}</span>
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSelected ? 'rotate-180' : ''}`} />
                            </Button>
                          </div>
                        </div>

                        {/* Details Panel Accordion */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25, ease: TRANSITION_EASE }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 pt-4 border-t border-[var(--border)] text-xs space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                                      Recommended Resources ({(step.resources || []).length})
                                    </div>
                                    <div className="space-y-2">
                                      {(step.resources || []).map((res) => (
                                        <div key={res.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] p-3 flex items-start justify-between hover:border-slate-300 transition-colors">
                                          <div>
                                            <div className="font-semibold text-[var(--text-primary)]">{res.title}</div>
                                            <div className="text-[11px] text-[var(--text-secondary)]">{res.provider} · {res.type} · {res.duration_minutes} mins</div>
                                          </div>
                                          {res.url && (
                                            <a
                                              href={res.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-[var(--brand)] hover:text-[var(--brand-hover)] p-1 transition-colors"
                                            >
                                              <ExternalLink className="w-4 h-4" />
                                            </a>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    {step.project && (
                                      <div>
                                        <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                                          Milestone Project
                                        </div>
                                        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] p-3">
                                          <div className="font-semibold text-[var(--text-primary)]">{step.project.title}</div>
                                          <div className="text-[11px] text-[var(--text-secondary)] mt-1">{step.project.objective}</div>
                                        </div>
                                      </div>
                                    )}

                                    {step.assessment_id && (
                                      <div>
                                        <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                                          Verification Assessment
                                        </div>
                                        <Button
                                          size="sm"
                                          variant="primary"
                                          className="w-full"
                                          onClick={() => {
                                            setActiveAssessmentId(step.assessment_id!);
                                            setAssessmentOpen(true);
                                          }}
                                        >
                                          <Award className="w-4 h-4" />
                                          <span>Take Micro-Assessment</span>
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

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
