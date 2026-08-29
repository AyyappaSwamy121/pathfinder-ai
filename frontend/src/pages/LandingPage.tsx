import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, ArrowRight, ShieldCheck, GitGraph, MapPin, CheckCircle2, Zap, Brain, Layers } from 'lucide-react';
import { ReadinessGauge } from '../components/ReadinessGauge';
import { SkillGapBadge } from '../components/SkillGapBadge';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary-soft text-primary font-semibold text-xs mb-6 shadow-2xs border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span>Traditional platforms recommend courses. PathFinder recommends a path.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-text-main tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Your Career. Your Path. <br />
            <span className="text-primary bg-gradient-to-r from-primary via-indigo-600 to-primary-dark bg-clip-text text-transparent">
              Powered by Adaptive AI.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            Turn your current skills and ambitions into a personalized, prerequisite-aware career roadmap with the exact skills, projects, resources, and next actions you need.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              to="/onboarding"
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-xl text-base shadow-md transition-all hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <span>Build My Path</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/careers"
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-text-main border border-border font-semibold px-8 py-4 rounded-xl text-base shadow-2xs transition-all"
            >
              Explore Careers
            </Link>
          </div>

          {/* Differentiator Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left text-xs mb-16">
            <div className="bg-surface p-3.5 rounded-xl border border-border flex items-center space-x-2.5">
              <Brain className="w-5 h-5 text-primary shrink-0" />
              <div>
                <div className="font-bold text-text-main">NLP Profile Extraction</div>
                <div className="text-text-muted">Understands natural background</div>
              </div>
            </div>
            <div className="bg-surface p-3.5 rounded-xl border border-border flex items-center space-x-2.5">
              <GitGraph className="w-5 h-5 text-primary shrink-0" />
              <div>
                <div className="font-bold text-text-main">Skill Knowledge Graph</div>
                <div className="text-text-muted">Prerequisite DAG ordering</div>
              </div>
            </div>
            <div className="bg-surface p-3.5 rounded-xl border border-border flex items-center space-x-2.5">
              <Zap className="w-5 h-5 text-primary shrink-0" />
              <div>
                <div className="font-bold text-text-main">Next Best Action</div>
                <div className="text-text-muted">Always know what's next</div>
              </div>
            </div>
            <div className="bg-surface p-3.5 rounded-xl border border-border flex items-center space-x-2.5">
              <Layers className="w-5 h-5 text-primary shrink-0" />
              <div>
                <div className="font-bold text-text-main">Adaptive Replanning</div>
                <div className="text-text-muted">Path adapts as you learn</div>
              </div>
            </div>
          </div>

          {/* Live Product Interactive Preview */}
          <div className="max-w-5xl mx-auto bg-surface border border-border rounded-2xl p-6 shadow-xl text-left relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-text-muted ml-2">PathFinder AI — Live Learner Dashboard Preview</span>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                AI Target: AI Engineer
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <ReadinessGauge score={64} careerTitle="AI Engineer" />
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="bg-primary-soft/40 border border-primary/20 rounded-xl p-4">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                    YOUR NEXT BEST ACTION
                  </div>
                  <h4 className="text-base font-bold text-text-main">
                    Complete Model Evaluation & Metrics (45 mins)
                  </h4>
                  <p className="text-xs text-text-muted mt-1">
                    Addresses a current skill gap and unlocks the next stage of your AI Engineer roadmap.
                  </p>
                </div>

                <div>
                  <div className="text-xs font-bold text-text-muted uppercase mb-2">Live Skill Gaps Breakdown</div>
                  <div className="flex flex-wrap gap-2">
                    <SkillGapBadge status="MASTERED" name="Python Programming" proficiency="Intermediate" />
                    <SkillGapBadge status="MASTERED" name="SQL & Relational Databases" proficiency="Intermediate" />
                    <SkillGapBadge status="DEVELOPING" name="Statistics & Probability" />
                    <SkillGapBadge status="RECOMMENDED" name="Model Evaluation" />
                    <SkillGapBadge status="LOCKED" name="Deep Learning Principles" />
                    <SkillGapBadge status="LOCKED" name="Transformers & LLMs" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
