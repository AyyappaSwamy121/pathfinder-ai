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
import { ArrowRight, ChevronRight, GitCompare, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SEED_CAREERS } from '../services/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import {
  StaggerContainer,
  StaggerItem,
  AnimatedNumber,
  MetricSkeleton,
  CardSkeleton,
  TRANSITION_EASE,
} from '../components/motion/MotionPrimitives';
import { motion } from 'framer-motion';

export const DashboardPage: React.FC = () => {
  const { dashboard, loading, refreshState, user: learnerUser, isDemoMode, setTargetCareer } = useLearner();
  const { user: authUser } = useAuth();

  const [whyThisOpen, setWhyThisOpen] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedSkillForFeedback, setSelectedSkillForFeedback] = useState<string>('s_model_eval');

  const firstName = isDemoMode
    ? (dashboard?.target_career?.title === 'Data Analyst' ? 'Jordan' : dashboard?.target_career?.title === 'Full Stack Developer' ? 'Devon' : 'Alex')
    : (authUser?.first_name || learnerUser?.first_name || 'Student');

  if (loading || !dashboard) {
    return (
      <div className="space-y-6">
        <CardSkeleton className="h-24" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <MetricSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CardSkeleton className="lg:col-span-2 h-64" />
          <CardSkeleton className="lg:col-span-1 h-64" />
        </div>
      </div>
    );
  }

  const targetTitle = dashboard.target_career?.title || 'AI Engineer';
  const readinessScore = Math.round(dashboard.readiness_score || 0);
  const masteredSkills = dashboard.skill_gaps?.mastered || [];
  const developingSkills = dashboard.skill_gaps?.developing || [];
  const missingSkills = dashboard.skill_gaps?.missing || [];
  const milestonesCompleted = dashboard.milestones_completed || 0;
  const milestonesTotal = dashboard.milestones_total || 15;
  const pathCompletionPct = Math.round((milestonesCompleted / Math.max(1, milestonesTotal)) * 100);

  // Growth Analytics Data
  const growthData = [
    { week: 'Week 1', score: 20, mastered: 2 },
    { week: 'Week 2', score: 32, mastered: 4 },
    { week: 'Week 3', score: 48, mastered: 6 },
    { week: 'Week 4', score: readinessScore || 64, mastered: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: TRANSITION_EASE }}
      >
        <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Welcome back, {firstName}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">{targetTitle} Path</span>
              <span>·</span>
              <span className="font-mono text-[var(--brand)] font-bold">
                <AnimatedNumber value={readinessScore} suffix="% Readiness" />
              </span>
              <span>·</span>
              <span>{milestonesCompleted} of {milestonesTotal} milestones completed</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Target Role Switcher */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC]">
              <span className="text-xs font-semibold text-[#64748B]">Target Role:</span>
              <select
                value={dashboard.target_career?.id || 'c_ai_engineer'}
                onChange={(e) => setTargetCareer(e.target.value)}
                className="text-xs font-bold text-[#4338CA] bg-transparent focus:outline-none cursor-pointer"
                aria-label="Switch Target Career"
              >
                {SEED_CAREERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <Link to={`/career-twin?target=${dashboard.target_career?.id || 'c_ai_engineer'}`}>
              <Button size="sm" variant="secondary" className="border-indigo-200 text-[#4F46E5] hover:bg-indigo-50/50">
                <GitCompare className="w-3.5 h-3.5 mr-1" />
                <span>Simulate in Career Twin</span>
              </Button>
            </Link>
            <Link to="/roadmap">
              <Button size="sm" variant="primary">
                <span>Continue Your Path</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>

      {/* Row 1 Metrics Summary Cards (Staggered Animation) */}
      <StaggerContainer staggerDelay={0.07} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StaggerItem>
          <motion.div
            whileHover={{ y: -2, transition: { duration: 0.18, ease: TRANSITION_EASE } }}
            className="h-full"
          >
            <Card className="p-4 h-full flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                Career Readiness
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-extrabold text-[var(--text-primary)] font-mono">
                  <AnimatedNumber value={readinessScore} suffix="%" />
                </div>
                <Badge tone="success">+12% month</Badge>
              </div>
            </Card>
          </motion.div>
        </StaggerItem>

        <StaggerItem>
          <motion.div
            whileHover={{ y: -2, transition: { duration: 0.18, ease: TRANSITION_EASE } }}
            className="h-full"
          >
            <Card className="p-4 h-full flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                Skills Mastered
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-extrabold text-[var(--text-primary)] font-mono">
                  <AnimatedNumber value={masteredSkills.length} /> <span className="text-xs text-[var(--text-tertiary)] font-normal">/ {milestonesTotal}</span>
                </div>
                <Badge tone="neutral">Verified</Badge>
              </div>
            </Card>
          </motion.div>
        </StaggerItem>

        <StaggerItem>
          <motion.div
            whileHover={{ y: -2, transition: { duration: 0.18, ease: TRANSITION_EASE } }}
            className="h-full"
          >
            <Card className="p-4 h-full flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                Path Completion
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-extrabold text-[var(--text-primary)] font-mono">
                  <AnimatedNumber value={pathCompletionPct} suffix="%" />
                </div>
                <Badge tone="brand">Phase 2</Badge>
              </div>
            </Card>
          </motion.div>
        </StaggerItem>

        <StaggerItem>
          <motion.div
            whileHover={{ y: -2, transition: { duration: 0.18, ease: TRANSITION_EASE } }}
            className="h-full"
          >
            <Card className="p-4 h-full flex flex-col justify-between hover:border-slate-300 transition-colors">
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
          </motion.div>
        </StaggerItem>
      </StaggerContainer>

      {/* Main Grid: Next Best Action spotlight + Readiness Gauge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12, ease: TRANSITION_EASE }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Next Best Action Card Spotlight */}
        <div className="lg:col-span-2">
          {dashboard.next_best_action && (
            <NextBestActionCard
              action={dashboard.next_best_action}
              onStartAction={() => setAssessmentOpen(true)}
              onWhyThis={() => setWhyThisOpen(true)}
            />
          )}
        </div>

        {/* Career Readiness Breakdown */}
        <div className="lg:col-span-1">
          <ReadinessGauge
            score={dashboard.readiness_score || 0}
            careerTitle={targetTitle}
            strongSkills={masteredSkills.map((s) => s.name).slice(0, 2)}
            developingSkills={developingSkills.map((s) => s.name).slice(0, 2)}
            priorityGaps={missingSkills.map((s) => s.name).slice(0, 2)}
          />
        </div>
      </motion.div>

      {/* Skill Growth Analytics & Skill Gaps Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18, ease: TRANSITION_EASE }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Growth Curve Chart */}
        <Card className="lg:col-span-2 hover:border-slate-300 transition-colors">
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
        <Card className="flex flex-col justify-between hover:border-slate-300 transition-colors">
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
                  Developing Skills ({developingSkills.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {developingSkills.map((s) => (
                    <SkillGapBadge key={s.skill_id} status="DEVELOPING" name={s.name} />
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                  Next Priority Gaps ({missingSkills.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {missingSkills.slice(0, 3).map((s) => (
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
      </motion.div>

      {/* Modals */}
      {dashboard.next_best_action && (
        <WhyThisModal
          isOpen={whyThisOpen}
          onClose={() => setWhyThisOpen(false)}
          skillName={dashboard.next_best_action.skill_name}
          reason={dashboard.next_best_action.why_now}
          careerTitle={targetTitle}
        />
      )}

      <AssessmentModal
        isOpen={assessmentOpen}
        onClose={() => setAssessmentOpen(false)}
        assessmentId={dashboard.next_best_action?.item_id || 'a_model_eval'}
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
