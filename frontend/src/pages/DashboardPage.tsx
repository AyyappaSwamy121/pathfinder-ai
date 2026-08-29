import React, { useState } from 'react';
import { useLearner } from '../context/LearnerContext';
import { ReadinessGauge } from '../components/ReadinessGauge';
import { NextBestActionCard } from '../components/NextBestActionCard';
import { SkillGapBadge } from '../components/SkillGapBadge';
import { WhyThisModal } from '../components/WhyThisModal';
import { AssessmentModal } from '../components/AssessmentModal';
import { FeedbackModal } from '../components/FeedbackModal';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, Clock, MapPin, Sparkles, Sliders, Cpu, Activity, Award, BookOpen, ChevronRight, HelpCircle
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const DashboardPage: React.FC = () => {
  const { dashboard, activePath, loading, refreshState } = useLearner();

  const [whyThisOpen, setWhyThisOpen] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedSkillForFeedback, setSelectedSkillForFeedback] = useState<string>('s_model_eval');

  if (loading || !dashboard) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-slate-200 rounded-lg" />
          <div className="h-64 bg-slate-200 rounded-lg" />
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
      <div className="bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Good morning, Alex
          </h2>
          <div className="flex items-center space-x-2 mt-1 text-xs text-slate-600">
            <span className="font-semibold text-slate-900">{dashboard.target_career.title} Path</span>
            <span>·</span>
            <span className="font-mono text-primary font-bold">{Math.round(dashboard.readiness_score)}% Readiness</span>
            <span>·</span>
            <span>{dashboard.milestones_completed} of {dashboard.milestones_total} milestones completed</span>
          </div>
        </div>

        <Link
          to="/roadmap"
          className="bg-primary hover:bg-primary-dark text-white text-xs font-semibold px-4 py-2 rounded-md shadow-subtle transition-colors flex items-center justify-center space-x-1.5 self-start md:self-auto"
        >
          <span>Continue Your Path</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Row 1 Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-slate-200 rounded-lg p-4 shadow-subtle">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
            Career Readiness
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {Math.round(dashboard.readiness_score)}%
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              +12% this month
            </span>
          </div>
        </div>

        <div className="bg-surface border border-slate-200 rounded-lg p-4 shadow-subtle">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
            Skills Mastered
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {dashboard.skill_gaps.mastered.length} <span className="text-xs text-slate-400 font-normal">/ {dashboard.milestones_total}</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              Verified
            </span>
          </div>
        </div>

        <div className="bg-surface border border-slate-200 rounded-lg p-4 shadow-subtle">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
            Path Completion
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {Math.round((dashboard.milestones_completed / Math.max(1, dashboard.milestones_total)) * 100)}%
            </div>
            <span className="text-[10px] font-semibold text-primary bg-primary-soft px-2 py-0.5 rounded">
              Phase 2 Active
            </span>
          </div>
        </div>

        <div className="bg-surface border border-slate-200 rounded-lg p-4 shadow-subtle">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
            Weekly Hours Focus
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              3.5 <span className="text-xs text-slate-400 font-normal">/ 8.0 hrs</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              On Track
            </span>
          </div>
        </div>
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
        <div className="lg:col-span-2 bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Skill Competency Velocity
              </h3>
              <p className="text-xs text-slate-500">
                Verified skill mastery trajectory over recent 4 weeks
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
              Deterministic Trajectory
            </span>
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
        </div>

        {/* Skill Gap Distribution */}
        <div className="bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Active Skill Gap Status
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Real-time classification based on course evidence & assessment
            </p>

            <div className="space-y-2">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Developing Skills ({dashboard.skill_gaps.developing.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {dashboard.skill_gaps.developing.map((s) => (
                    <SkillGapBadge key={s.skill_id} status="DEVELOPING" name={s.name} />
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
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

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedSkillForFeedback('s_model_eval');
                setFeedbackOpen(true);
              }}
              aria-label="Submit confidence feedback for Model Evaluation"
              className="text-xs font-semibold text-primary hover:underline focus:outline-none"
            >
              Submit Confidence Feedback
            </button>
            <Link to="/skills" className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center">
              <span>Skill Graph</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Modals for Why This, Assessment, Feedback */}
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
