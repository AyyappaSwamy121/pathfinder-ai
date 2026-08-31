import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  GitGraph,
  Award,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ScrollReveal, ScrollProgressBar, TRANSITION_EASE } from '../components/motion/MotionPrimitives';

export const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'roadmap' | 'skills' | 'copilot'>('dashboard');

  return (
    <div className="bg-[#FAFAF9] text-[#111827] min-h-screen font-sans selection:bg-[#EEF2FF] selection:text-[#4F46E5] relative">
      {/* 2px Top Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* SECTION 01 — HERO & LIVE PRODUCT CENTERPIECE */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#EEF2FF] via-[#E0E7FF] to-transparent rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />

        <div className="text-center max-w-4xl mx-auto mb-12">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: TRANSITION_EASE }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] shadow-xs mb-6 text-xs font-semibold text-[#4B5563]"
          >
            <ShieldCheck className="w-4 h-4 text-[#4F46E5]" />
            <span>Enterprise AI Career Intelligence Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: TRANSITION_EASE }}
            className="text-4xl sm:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.1] mb-6"
          >
            YOUR CAREER. <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] via-[#4338CA] to-[#3730A3]">
              YOUR PATH.
            </span>{' '}
            POWERED BY ADAPTIVE AI.
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: TRANSITION_EASE }}
            className="text-base sm:text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed mb-8 font-normal"
          >
            Stop searching thousands of disconnected courses. PathFinder evaluates your current competencies, maps your target role, and calculates the exact prerequisite-aware learning sequence to get you hired.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28, ease: TRANSITION_EASE }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-[#4F46E5] hover:bg-[#3730A3] text-white px-8 py-3.5 rounded-lg font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all">
                <span>Build My Career Path</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link to="/careers" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-[#F9FAFB] text-[#111827] border border-[#D1D5DB] px-8 py-3.5 rounded-lg font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-all">
                <span>Explore Careers Base</span>
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Live Interactive Centerpiece Visualizer with Scale Entrance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: TRANSITION_EASE }}
          className="max-w-5xl mx-auto bg-white border border-[#E5E7EB] rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header Controls Bar */}
          <div className="px-6 py-4 bg-[#FAFAF9] border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
              <div className="w-3 h-3 rounded-full bg-[#10B981]" />
              <span className="ml-2 text-xs font-mono text-[#6B7280]">pathfinder.ai/workspace/overview</span>
            </div>

            {/* Interactive Showcase Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E5E7EB] text-xs font-semibold">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'text-[#6B7280] hover:text-[#111827]'}`}
              >
                Readiness & Action
              </button>
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'roadmap' ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'text-[#6B7280] hover:text-[#111827]'}`}
              >
                Prerequisite DAG
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'skills' ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'text-[#6B7280] hover:text-[#111827]'}`}
              >
                Skill Graph
              </button>
              <button
                onClick={() => setActiveTab('copilot')}
                className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'copilot' ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'text-[#6B7280] hover:text-[#111827]'}`}
              >
                AI Copilot
              </button>
            </div>
          </div>

          {/* Interactive Live Content Frame */}
          <div className="p-6 bg-white min-h-[380px] flex items-center justify-center">
            {activeTab === 'dashboard' && (
              <div className="w-full space-y-6">
                <div className="p-4 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">Target Role: AI Engineer</div>
                    <div className="text-lg font-extrabold text-[#111827]">Career Readiness Estimate: 41%</div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-white text-[#15803D] border border-[#BBF7D0]">
                      +12% month
                    </span>
                  </div>
                </div>

                {/* Dominant Next Best Action Spotlight */}
                <div className="p-5 rounded-xl bg-white border-2 border-[#4F46E5] shadow-sm relative">
                  <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded bg-[#4F46E5] text-white text-[10px] font-extrabold uppercase tracking-wider">
                    Next Best Action Spotlight
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                    <div>
                      <h4 className="text-base font-bold text-[#111827]">Master Model Evaluation & Metrics</h4>
                      <p className="text-xs text-[#4B5563] mt-1">
                        Addresses critical gap: Needed to evaluate precision, recall, and ROC-AUC before deploying model pipelines.
                      </p>
                    </div>
                    <Link to="/onboarding">
                      <button className="px-4 py-2 bg-[#4F46E5] hover:bg-[#3730A3] text-white text-xs font-semibold rounded-md shrink-0 flex items-center gap-1.5">
                        <span>Start Milestone</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="w-full space-y-3">
                <div className="p-3.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-[#15803D]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>01. Python Programming Foundations</span>
                  </div>
                  <Badge tone="success">Mastered</Badge>
                </div>
                <div className="p-3.5 rounded-lg bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-[#4F46E5]">
                    <Clock className="w-4 h-4" />
                    <span>02. Model Evaluation & Metrics</span>
                  </div>
                  <Badge tone="brand">In Progress</Badge>
                </div>
                <div className="p-3.5 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280]">
                  <div className="flex items-center gap-2 font-medium">
                    <div className="w-4 h-4 rounded-full border border-[#D1D5DB]" />
                    <span>03. Deep Learning & PyTorch Specialization</span>
                  </div>
                  <Badge tone="neutral">Upcoming</Badge>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="w-full text-center py-6">
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                    Python Programming
                  </div>
                  <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800 animate-pulse">
                    Model Evaluation
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 opacity-60">
                    Deep Learning
                  </div>
                </div>
                <p className="text-xs text-[#6B7280] mt-4">
                  Directed Acyclic Graph (DAG) topological prerequisite ordering active.
                </p>
              </div>
            )}

            {activeTab === 'copilot' && (
              <div className="w-full space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[#111827] max-w-lg">
                  <span className="font-bold text-[#4F46E5]">User:</span> What should I focus on next to achieve my AI Engineer goal?
                </div>
                <div className="p-3 rounded-lg bg-[#EEF2FF] border border-[#C7D2FE] text-[#111827] max-w-lg ml-auto">
                  <span className="font-bold text-[#4F46E5]">PathFinder Copilot:</span> Based on your target AI Engineer career (41% readiness), your highest-leverage milestone is Model Evaluation & Metrics (90 mins). Your Python prerequisite is already satisfied.
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* SECTION 02 — THE REAL LEARNER PROBLEM */}
      <ScrollReveal>
        <section className="py-20 bg-white border-t border-[#E5E7EB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-4">
                Thousands of courses. <span className="text-[#4F46E5]">No clear path.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
                Traditional course catalogs present endless choices without structure. Learners waste hundreds of hours studying out of order or pursuing skills they don't need.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-[#FAFAF9] border border-[#E5E7EB]">
                <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center font-bold text-sm mb-4">
                  01
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-2">Choice Overload</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Searching "Data Science" yields 5,000+ unorganized courses without clear starting points or prerequisite guidance.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#FAFAF9] border border-[#E5E7EB]">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-sm mb-4">
                  02
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-2">Unknown Skill Gaps</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Learners rarely know which specific competencies are missing between their current state and real job requirements.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#FAFAF9] border border-[#E5E7EB]">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 text-[#4F46E5] flex items-center justify-center font-bold text-sm mb-4">
                  03
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-2">Static Learning Paths</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Fixed syllabi ignore your existing knowledge and fail to adapt when you pass assessments or encounter difficulty.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SECTION 03 — HOW PATHFINDER WORKS */}
      <ScrollReveal>
        <section className="py-20 bg-[#FAFAF9] border-t border-[#E5E7EB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <Badge tone="brand">CONNECTED PRODUCT JOURNEY</Badge>
              <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight mt-3 mb-4">
                How PathFinder AI Works
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563]">
                From natural language goals to an adaptive, prerequisite-aware career roadmap in four steps.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 relative">
                <div className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-extrabold text-xs flex items-center justify-center mb-4">
                  01
                </div>
                <h3 className="text-sm font-bold text-[#111827] mb-1">Understand You</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Describe your career goals and current background in natural language.
                </p>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 relative">
                <div className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-extrabold text-xs flex items-center justify-center mb-4">
                  02
                </div>
                <h3 className="text-sm font-bold text-[#111827] mb-1">Map Your Skills</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  AI extracts verified competencies and maps exact gaps against industry roles.
                </p>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 relative">
                <div className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-extrabold text-xs flex items-center justify-center mb-4">
                  03
                </div>
                <h3 className="text-sm font-bold text-[#111827] mb-1">Build Your Path</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Topological DAG algorithms sequence milestones respecting prerequisite logic.
                </p>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 relative">
                <div className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-extrabold text-xs flex items-center justify-center mb-4">
                  04
                </div>
                <h3 className="text-sm font-bold text-[#111827] mb-1">Adapt As You Learn</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Micro-assessments and feedback dynamically recalculate your roadmap.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SECTION 04 — AI ARCHITECTURE & REASONING PIPELINE */}
      <ScrollReveal>
        <section className="py-20 bg-white border-t border-[#E5E7EB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <Badge tone="neutral">TRANSPARENT REASONING ENGINE</Badge>
              <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight mt-3 mb-4">
                Hybrid Intelligence Architecture
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563]">
                Combining Natural Language Processing with deterministic Graph Algorithms and Mathematical Readiness Scoring.
              </p>
            </div>

            <div className="bg-[#FAFAF9] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl">
                  <div className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-wider mb-1">Stage 1</div>
                  <div className="text-xs font-bold text-[#111827]">NL Profile Parser</div>
                  <div className="text-[11px] text-[#6B7280] mt-1">LLM Text Extraction</div>
                </div>

                <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl">
                  <div className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-wider mb-1">Stage 2</div>
                  <div className="text-xs font-bold text-[#111827]">Skill Gap Analysis</div>
                  <div className="text-[11px] text-[#6B7280] mt-1">Competency Mapping</div>
                </div>

                <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl">
                  <div className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-wider mb-1">Stage 3</div>
                  <div className="text-xs font-bold text-[#111827]">Prerequisite DAG</div>
                  <div className="text-[10px] text-[#6B7280] mt-1">Topological Sorting</div>
                </div>

                <div className="p-4 bg-[#4F46E5] text-white rounded-xl">
                  <div className="text-[10px] font-bold text-white/80 uppercase tracking-wider mb-1">Stage 4</div>
                  <div className="text-xs font-bold">Next Best Action</div>
                  <div className="text-[10px] text-white/80 mt-1">7-Factor Ranking</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SECTION 05 — IMMERSIVE PRODUCT SHOWCASE */}
      <ScrollReveal>
        <section className="py-20 bg-[#FAFAF9] border-t border-[#E5E7EB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-4">
                Built for serious career growth.
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563]">
                Every tool designed to give you clarity, direction, and verified skill mastery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mb-4">
                  <GitGraph className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-2">Prerequisite-Aware Skill Graph</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
                  Visualizes foundational competencies and prerequisite dependencies across 40+ industry skills.
                </p>
                <Link to="/skills" className="text-xs font-bold text-[#4F46E5] hover:underline inline-flex items-center gap-1">
                  <span>View Skill Graph →</span>
                </Link>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mb-4">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-2">What-If Career Simulator</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
                  Evaluate prospective career switches instantly. Compare skill overlap %, shared competencies, and estimated transition timelines.
                </p>
                <Link to="/simulator" className="text-xs font-bold text-[#4F46E5] hover:underline inline-flex items-center gap-1">
                  <span>Launch Simulator →</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SECTION 06 — ADAPTIVE LEARNING */}
      <ScrollReveal>
        <section className="py-20 bg-white border-t border-[#E5E7EB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge tone="brand">CONTINUOUS REPLANNING</Badge>
                <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight mt-3 mb-4">
                  YOUR PATH CHANGES AS YOU LEARN.
                </h2>
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed mb-6">
                  When you complete micro-assessments or submit confidence ratings, PathFinder automatically updates your competency profile and re-evaluates your roadmap.
                </p>
                <div className="space-y-3 text-xs text-[#111827] font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                    <span>Micro-assessment scores update skill confidence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                    <span>Topological DAG re-sorts remaining steps</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                    <span>Next Best Action updates dynamically</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAFAF9] border border-[#E5E7EB] rounded-2xl p-6">
                <div className="text-xs font-bold text-[#111827] mb-3">Adaptive Path Re-evaluation</div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-between">
                    <span>Assessment Score: 100%</span>
                    <Badge tone="success">Passed</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-between">
                    <span>Model Evaluation Mastered</span>
                    <Badge tone="brand">Unlocked Phase 3</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SECTION 07 — CAREER SIMULATOR SHOWCASE */}
      <ScrollReveal>
        <section className="py-20 bg-[#FAFAF9] border-t border-[#E5E7EB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-3">
                What-If Career Simulator
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563]">
                Test transition effort between AI Engineer, Data Scientist, Data Analyst, and Full Stack Developer roles.
              </p>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB] text-xs font-bold">
                <div>CURRENT: AI Engineer</div>
                <div className="text-[#4F46E5]">72.7% Skill Overlap</div>
                <div>TARGET: Data Scientist</div>
              </div>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-semibold text-[#6B7280] mb-2">Shared Skills (2)</div>
                  <div className="space-y-1">
                    <div className="p-2 rounded bg-emerald-50 text-emerald-800 font-medium">Python Programming</div>
                    <div className="p-2 rounded bg-emerald-50 text-emerald-800 font-medium">SQL & Relational Databases</div>
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-[#6B7280] mb-2">New Skills Required (2)</div>
                  <div className="space-y-1">
                    <div className="p-2 rounded bg-amber-50 text-amber-800 font-medium">A/B Testing & Statistics</div>
                    <div className="p-2 rounded bg-amber-50 text-amber-800 font-medium">Exploratory Data Analysis</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SECTION 08 — AI COPILOT SHOWCASE */}
      <ScrollReveal>
        <section className="py-20 bg-white border-t border-[#E5E7EB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <Badge tone="brand">GROUNDED AI ASSISTANT</Badge>
              <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight mt-3 mb-3">
                Grounded AI Career Copilot
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563]">
                Context-aware career advice grounded in your actual readiness score, roadmap progress, and assessment results.
              </p>
            </div>

            <div className="max-w-2xl mx-auto bg-[#FAFAF9] border border-[#E5E7EB] rounded-2xl p-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#111827]">
                <span className="font-bold text-[#4F46E5]">User:</span> "Why was Model Evaluation recommended to me first?"
              </div>
              <div className="p-3.5 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] text-xs text-[#111827] space-y-2">
                <div className="font-bold text-[#4F46E5]">PathFinder Copilot:</div>
                <p className="leading-relaxed">
                  Model Evaluation & Metrics was selected because Python Programming is already verified. It is the direct prerequisite for Deep Learning and addresses a critical requirement for your target AI Engineer path.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SECTION 09 — EXPLAINABILITY & TRUST FRAMEWORK */}
      <ScrollReveal>
        <section className="py-20 bg-[#FAFAF9] border-t border-[#E5E7EB]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-3">
                Explainable AI Guarantee
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563]">
                No black-box recommendations. Every suggestion provides explicit "Why This?" reasoning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="bg-white p-6 rounded-xl border border-[#E5E7EB]">
                <h3 className="font-bold text-[#111827] text-sm mb-2">Prerequisite Logic</h3>
                <p className="text-[#4B5563] leading-relaxed">
                  Verifies foundational competencies are satisfied before suggesting advanced modules.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#E5E7EB]">
                <h3 className="font-bold text-[#111827] text-sm mb-2">Role Alignment</h3>
                <p className="text-[#4B5563] leading-relaxed">
                  Evaluates exact skill weights against verified industry job descriptions.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#E5E7EB]">
                <h3 className="font-bold text-[#111827] text-sm mb-2">Time Optimization</h3>
                <p className="text-[#4B5563] leading-relaxed">
                  Calculates shortest effort path based on your weekly study hours.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SECTION 10 — FINAL ENTERPRISE CTA & FOOTER */}
      <ScrollReveal>
        <section className="py-24 bg-white border-t border-[#E5E7EB]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-[#111827] text-white rounded-3xl p-10 sm:p-14 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#4F46E5] opacity-20 rounded-full blur-3xl -z-0 pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight text-white">
                  Stop searching for what to learn next. <br />
                  Start following a path built for you.
                </h2>
                <p className="text-xs sm:text-sm text-[#9CA3AF] mb-8 leading-relaxed">
                  Join thousands of students and professionals who use PathFinder AI to map their career goals and master in-demand skills.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/onboarding" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-[#4F46E5] hover:bg-[#3730A3] text-white px-8 py-3.5 rounded-lg font-semibold text-sm shadow-md flex items-center justify-center gap-2">
                      <span>Build My Path Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Link to="/careers" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3.5 rounded-lg font-semibold text-sm">
                      <span>Explore Careers</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
};
