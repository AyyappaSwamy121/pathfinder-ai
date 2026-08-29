import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLearner } from '../context/LearnerContext';
import { ReadinessGauge } from '../components/ReadinessGauge';
import { NextBestActionCard } from '../components/NextBestActionCard';
import { SkillGapBadge } from '../components/SkillGapBadge';
import { WhyThisModal } from '../components/WhyThisModal';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Sparkles, MapPin, GitGraph, Award, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { dashboard, loading, error, refreshState } = useLearner();
  const [whyThisOpen, setWhyThisOpen] = useState(false);

  if (loading && !dashboard) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-primary font-semibold text-sm">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading Learner Dashboard...</span>
        </div>
      </div>
    );
  }

  const data = dashboard;

  // Mock growth chart data
  const growthData = [
    { month: 'Month 1', score: 20 },
    { month: 'Month 2', score: 35 },
    { month: 'Month 3', score: 48 },
    { month: 'Month 4', score: 58 },
    { month: 'Current', score: data?.readiness_score || 64 },
    { month: 'Projected', score: 85 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-surface border border-border rounded-2xl p-6 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>LEARNER PROFILE ACTIVE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-text-main tracking-tight">
            Target Goal: {data?.target_career.title || 'AI Engineer'}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Weekly Commitment: {data?.profile.weekly_hours || 8} hrs/week • Preference: {data?.profile.learning_preference || 'Project Based'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => refreshState()}
            className="flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-text-main px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recalculate Gaps</span>
          </button>
          <Link
            to="/roadmap"
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>View Full Roadmap</span>
          </Link>
        </div>
      </div>

      {/* AI Insight Callout */}
      {data?.ai_insight && (
        <div className="bg-gradient-to-r from-primary-soft to-indigo-50 border border-primary/20 rounded-2xl p-4 flex items-start space-x-3 shadow-2xs">
          <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-primary uppercase">AI Adaptive Insight</div>
            <p className="text-xs text-text-main font-medium leading-relaxed mt-0.5">
              {data.ai_insight}
            </p>
          </div>
        </div>
      )}

      {/* Grid: 1. Readiness & 2. Next Best Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ReadinessGauge
            score={data?.readiness_score || 64}
            careerTitle={data?.target_career.title || 'AI Engineer'}
          />
        </div>

        <div className="lg:col-span-2">
          {data?.next_best_action && (
            <NextBestActionCard
              action={data.next_best_action}
              onStartAction={() => navigate('/roadmap')}
              onWhyThis={() => setWhyThisOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Roadmap Progress & Skill Growth Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Bar & Stats */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Roadmap Milestone Completion
            </span>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-text-main">
                {data?.milestones_completed || 8} / {data?.milestones_total || 20}
              </span>
              <span className="text-xs font-semibold text-primary">
                {Math.round(((data?.milestones_completed || 8) / (data?.milestones_total || 20)) * 100)}% Complete
              </span>
            </div>

            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mt-3">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(((data?.milestones_completed || 8) / (data?.milestones_total || 20)) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-border mt-6 flex items-center justify-between text-xs">
            <span className="text-text-muted">Current Active Milestone:</span>
            <span className="font-bold text-text-main">{data?.next_best_action.skill_name}</span>
          </div>
        </div>

        {/* Recharts Skill Growth Chart */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Readiness Score Trajectory
              </span>
              <h4 className="text-sm font-semibold text-text-main">
                Skill Mastery Growth Over Time
              </h4>
            </div>
            <span className="text-xs text-semantic-success font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              +16% this month
            </span>
          </div>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Skill Gap Breakdown */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-lg font-bold text-text-main">
              Skill Gap & Prerequisite Matrix
            </h3>
            <p className="text-xs text-text-muted">
              Live comparison of your profile vs. required skills for {data?.target_career.title || 'AI Engineer'}
            </p>
          </div>

          <Link
            to="/skills"
            className="text-xs text-primary font-semibold hover:underline flex items-center space-x-1"
          >
            <GitGraph className="w-3.5 h-3.5" />
            <span>Interactive Graph View</span>
          </Link>
        </div>

        {/* Mastered & Developing */}
        <div>
          <span className="block text-xs font-bold text-text-muted uppercase mb-2">Mastered Skills</span>
          <div className="flex flex-wrap gap-2">
            {data?.skill_gaps.mastered.map((s) => (
              <SkillGapBadge key={s.skill_id} status="MASTERED" name={s.name} proficiency={s.proficiency} />
            ))}
          </div>
        </div>

        <div>
          <span className="block text-xs font-bold text-text-muted uppercase mb-2">Developing Skills</span>
          <div className="flex flex-wrap gap-2">
            {data?.skill_gaps.developing.map((s) => (
              <SkillGapBadge key={s.skill_id} status="DEVELOPING" name={s.name} proficiency={s.proficiency} />
            ))}
          </div>
        </div>

        <div>
          <span className="block text-xs font-bold text-text-muted uppercase mb-2">Missing Skills & Prerequisite Locked</span>
          <div className="flex flex-wrap gap-2">
            {data?.skill_gaps.recommended.map((s) => (
              <SkillGapBadge key={s.skill_id} status="RECOMMENDED" name={s.name} />
            ))}
            {data?.skill_gaps.missing.map((s) => (
              <SkillGapBadge key={s.skill_id} status="MISSING" name={s.name} />
            ))}
            {data?.skill_gaps.locked.map((s) => (
              <SkillGapBadge key={s.skill_id} status="LOCKED" name={s.name} />
            ))}
          </div>
        </div>
      </div>

      {/* Why This Modal */}
      <WhyThisModal
        isOpen={whyThisOpen}
        onClose={() => setWhyThisOpen(false)}
        skillName={data?.next_best_action.skill_name || 'Model Evaluation'}
        reason={data?.next_best_action.why_now}
        careerTitle={data?.target_career.title}
      />
    </div>
  );
};
