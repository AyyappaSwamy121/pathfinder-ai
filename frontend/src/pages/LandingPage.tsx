import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShieldCheck, GitGraph, Award, Sliders, MapPin, Cpu, CheckCircle2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-semibold mb-6 border border-primary/10">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>HCL Amplify Round 2 Prototype — AI Career Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight mb-6">
          Turn your skills into a <span className="text-primary">clear career path</span>.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          PathFinder analyzes where you are, where you want to go, and builds the adaptive learning sequence between them.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Link
            to="/onboarding"
            className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-md text-sm shadow-subtle transition-colors flex items-center justify-center space-x-2"
          >
            <span>Build My Path</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/careers"
            className="w-full sm:w-auto bg-surface hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold px-6 py-3 rounded-md text-sm transition-colors flex items-center justify-center"
          >
            Explore Careers Base
          </Link>
        </div>

        {/* Product Visualization: Skill Progression Flow */}
        <div className="bg-surface border border-slate-200 rounded-xl p-6 shadow-card max-w-5xl mx-auto text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-slate-400 ml-2">PathFinder Architecture Preview</span>
            </div>
            <span className="text-xs font-semibold text-primary bg-primary-soft px-2.5 py-0.5 rounded">
              Adaptive Recommender
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-md p-4 flex flex-col justify-between">
              <div className="font-bold text-slate-900 mb-1">01 CURRENT SKILLS</div>
              <p className="text-slate-500 text-[11px]">Python, SQL, Data Wrangling</p>
              <span className="inline-block mt-3 text-[10px] font-mono text-emerald-700 bg-emerald-50 rounded py-0.5">Mastered</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-4 flex flex-col justify-between">
              <div className="font-bold text-slate-900 mb-1">02 CAREER GOAL</div>
              <p className="text-slate-500 text-[11px]">AI Engineer</p>
              <span className="inline-block mt-3 text-[10px] font-mono text-primary bg-primary-soft rounded py-0.5">Target Specification</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-4 flex flex-col justify-between">
              <div className="font-bold text-slate-900 mb-1">03 SKILL GAPS</div>
              <p className="text-slate-500 text-[11px]">Model Eval, Deep Learning</p>
              <span className="inline-block mt-3 text-[10px] font-mono text-amber-700 bg-amber-50 rounded py-0.5">Identified Gaps</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-4 flex flex-col justify-between">
              <div className="font-bold text-slate-900 mb-1">04 PREREQUISITES</div>
              <p className="text-slate-500 text-[11px]">DAG Topological Sort</p>
              <span className="inline-block mt-3 text-[10px] font-mono text-slate-700 bg-slate-200 rounded py-0.5">Resolved Dependencies</span>
            </div>

            <div className="bg-primary text-white rounded-md p-4 flex flex-col justify-between shadow-subtle">
              <div className="font-bold mb-1">05 NEXT ACTION</div>
              <p className="text-white/80 text-[11px]">Complete Model Eval</p>
              <span className="inline-block mt-3 text-[10px] font-mono text-white bg-white/20 rounded py-0.5">Highest Leverage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Differentiators Section */}
      <section className="py-16 bg-surface border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Why traditional course recommenders fail.
            </h2>
            <p className="text-sm text-slate-600">
              Generic course libraries present thousands of choices without structure. PathFinder continuously builds the shortest practical path to your target career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background border border-slate-200 rounded-lg p-6">
              <div className="w-10 h-10 rounded-md bg-primary-soft text-primary flex items-center justify-center mb-4">
                <GitGraph className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Prerequisite-Aware Topology
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applies Directed Acyclic Graph (DAG) topological sorting across 40+ skills to guarantee foundational topics are mastered before advanced modules.
              </p>
            </div>

            <div className="bg-background border border-slate-200 rounded-lg p-6">
              <div className="w-10 h-10 rounded-md bg-primary-soft text-primary flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Continuous Adaptive Replanning
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Micro-assessments and confidence feedback dynamically update your learner model and re-rank roadmap steps in real time.
              </p>
            </div>

            <div className="bg-background border border-slate-200 rounded-lg p-6">
              <div className="w-10 h-10 rounded-md bg-primary-soft text-primary flex items-center justify-center mb-4">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                What-If Career Simulator
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluate prospective career switches instantly. Compare skill overlap %, shared competencies, and estimated transition timelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="bg-slate-900 text-white rounded-xl p-8 sm:p-12 shadow-card">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Ready to discover your personalized career path?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
            Tell us where you are, what you know, and where you want to go. PathFinder will build your customized, adaptive learning path.
          </p>
          <Link
            to="/onboarding"
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-md text-sm transition-colors shadow-subtle"
          >
            <span>Start Onboarding</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
