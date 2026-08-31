import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { useAuth } from '../context/AuthContext';
import { ReadinessGauge } from '../components/ReadinessGauge';
import { NextBestActionCard } from '../components/NextBestActionCard';
import { SkillGapBadge } from '../components/SkillGapBadge';
import { WhyThisModal } from '../components/WhyThisModal';
import { AssessmentModal } from '../components/AssessmentModal';
import { FeedbackModal } from '../components/FeedbackModal';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const DashboardPage: React.FC = () => {
  const { dashboard, loading, refreshState } = useLearner();
  const { user } = useAuth();

  const [whyThisOpen, setWhyThisOpen] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedSkillForFeedback, setSelectedSkillForFeedback] = useState<string>('s_model_eval');

  const firstName = user?.first_name || 'Alex';

  if (loading || !dashboard) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-[var(--surface-sunken)] rounded-[var(--radius-md)]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-[var(--surface-sunken)] rounded-[var(--radius-md)]" />
          ))}
        </div>
      </div>
    );
  }

  // Growth Analytics Data
  const growthData = [
    { week: 'Week 1', score: 20, mastered: 2 },
    { week: 'Week 2', score: 32, mastered: 4 },
    { week: 'Week 3', score: 48, mastered: 6 },
    { week: 'Week 4', score: 64, mastered: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Welcome back, {firstName}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">{dashboard.target_career.title} Path</span>
            <span>·</span>
            <span className="font-mono text-[var(--brand)] font-bold">{Math.round(dashboard.readiness_score)}% Readiness</span>
            <span>·</span>
            <span>{dashboard.milestones_completed} of {dashboard.milestones_total} milestones completed</span>
          </div>
        </div>

        <Link to="/roadmap">
          <Button size="sm" variant="primary">
            <span>Continue Your Path</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </Card>

      {/* Row 1 Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
            Career Readiness
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-[var(--text-primary)] font-mono">
              {Math.round(dashboard.readiness_score)}%
            </div>
            <Badge tone="success">+12% month</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
            Skills Mastered
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-[var(--text-primary)] font-mono">
              {dashboard.skill_gaps.mastered.length} <span className="text-xs text-[var(--text-tertiary)] font-normal">/ {dashboard.milestones_total}</span>
            </div>
            <Badge tone="neutral">Verified</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
            Path Completion
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-[var(--text-primary)] font-mono">
              {Math.round((dashboard.milestones_completed / Math.max(1, dashboard.milestones_total)) * 100)}%
            </div>
            <Badge tone="brand">Phase 2</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
            Weekly Hours Focus
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-[var(--text-primary)] font-mono">
              3.5 <span className="text-xs text-[var(--text-tertiary)] font-normal">/ 8.0 hrs</span>
            </div>
            <Badge tone="neutral">On Track</Badge>
          </div>
        </Card>
      </div>

      {/* Main Grid: Next Best Action spotlight + Readiness Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Best Action Card Spotlight */}
        <div className="lg:col-span-2">
          <NextBestActionCard
            action={dashboard.next_best_action}
            onStartAction={() => setAssessmentOpen(true)}
            onWhyThis={() => setWhyThisOpen(true)}
          />
        </div>

        {/* Career Readiness Breakdown */}
        <div className="lg:col-span-1">
          <ReadinessGauge
            score={dashboard.readiness_score}
            careerTitle={dashboard.target_career.title}
            strongSkills={dashboard.skill_gaps.mastered.map((s) => s.name).slice(0, 2)}
            developingSkills={dashboard.skill_gaps.developing.map((s) => s.name).slice(0, 2)}
            priorityGaps={dashboard.skill_gaps.missing.map((s) => s.name).slice(0, 2)}
          />
        </div>
      </div>

      {/* Skill Growth Analytics & Skill Gaps Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Curve Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Skill Competency Velocity
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Verified skill mastery trajectory over recent 4 weeks
              </p>
            </div>
            <Badge tone="neutral">Deterministic Trajectory</Badge>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4338CA" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4338CA" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '6px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#4338CA" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Skill Gap Distribution */}
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">
              Active Skill Gap Status
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Real-time classification based on course evidence & assessment
            </p>

            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                  Developing Skills ({dashboard.skill_gaps.developing.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {dashboard.skill_gaps.developing.map((s) => (
                    <SkillGapBadge key={s.skill_id} status="DEVELOPING" name={s.name} />
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                  Next Priority Gaps ({dashboard.skill_gaps.missing.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {dashboard.skill_gaps.missing.slice(0, 3).map((s) => (
                    <SkillGapBadge key={s.skill_id} status={s.status as any} name={s.name} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between mt-4">
            <button
              onClick={() => {
                setSelectedSkillForFeedback('s_model_eval');
                setFeedbackOpen(true);
              }}
              className="text-xs font-semibold text-[var(--brand)] hover:underline focus:outline-none"
            >
              Submit Confidence Feedback
            </button>
            <Link to="/skills" className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center">
              <span>Skill Graph</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Modals */}
      <WhyThisModal
        isOpen={whyThisOpen}
        onClose={() => setWhyThisOpen(false)}
        skillName={dashboard.next_best_action.skill_name}
        reason={dashboard.next_best_action.why_now}
        careerTitle={dashboard.target_career.title}
      />

      <AssessmentModal
        isOpen={assessmentOpen}
        onClose={() => setAssessmentOpen(false)}
        assessmentId="a_model_eval"
        onCompleted={refreshState}
      />

      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        skillId={selectedSkillForFeedback}
        skillName="Model Evaluation & Metrics"
        onSubmitted={refreshState}
      />
    </div>
  );
};
