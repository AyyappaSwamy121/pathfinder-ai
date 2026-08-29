import React from 'react';
import { Cpu, ShieldCheck, CheckCircle2, GitGraph, Award, ArrowRight, Code } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1">
            ENGINEERING TRANSPARENCY & LOGIC MAP
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            How PathFinder AI Thinks
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Explicit boundary separating AI natural-language reasoning from deterministic recommendation logic
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-200 flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            100% Deterministic Guarantee
          </span>
        </div>
      </div>

      {/* System Pipeline Breakdown */}
      <div className="bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle space-y-6">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          7-Stage Intelligence Pipeline Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Stage 1 */}
          <div className="border border-slate-200 rounded-md p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900">STAGE 1: NLP PROFILE PARSER</span>
              <span className="bg-indigo-100 text-primary text-[10px] font-bold px-2 py-0.5 rounded">LLM Engine</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-2">
              Parses conversational text into structured Pydantic schemas (target role, skills, weekly hours, timeline).
            </p>
            <div className="text-[10px] font-mono text-slate-500">
              Input: Conversational text ──► Output: Structured JSON
            </div>
          </div>

          {/* Stage 2 */}
          <div className="border border-slate-200 rounded-md p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900">STAGE 2: LEARNER MODEL STATE</span>
              <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">Deterministic DB</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-2">
              Maintains live persistent state for proficiency, confidence, and portfolio evidence for every skill.
            </p>
            <div className="text-[10px] font-mono text-slate-500">
              State: Mastered / Developing / Missing / Locked
            </div>
          </div>

          {/* Stage 3 */}
          <div className="border border-slate-200 rounded-md p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900">STAGE 3: SKILL GAP & READINESS ENGINE</span>
              <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">Deterministic Math</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-2">
              Computes readiness formula: (0.5 * Mastered + 0.3 * Developing + 0.2 * Prerequisite Ratio) * 100.
            </p>
            <div className="text-[10px] font-mono text-slate-500">
              Formula: Mathematical weighted sum
            </div>
          </div>

          {/* Stage 4 */}
          <div className="border border-slate-200 rounded-md p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900">STAGE 4: PREREQUISITE GRAPH TOPOLOGY</span>
              <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">DAG Graph Alg</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-2">
              Performs topological sorting on 40+ skills to guarantee prerequisites are satisfied before advanced steps.
            </p>
            <div className="text-[10px] font-mono text-slate-500">
              Algorithm: Kahn's DAG Topological Ordering
            </div>
          </div>

          {/* Stage 5 */}
          <div className="border border-slate-200 rounded-md p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900">STAGE 5: HYBRID RECOMMENDATION RANKING</span>
              <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">Multi-factor Alg</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-2">
              Ranks activities based on 7 factors (30% Gap, 20% Career, 15% Prereqs, 10% Difficulty, 10% Time, 5% Feedback).
            </p>
            <div className="text-[10px] font-mono text-slate-500">
              Output: Next Best Action Spotlight
            </div>
          </div>

          {/* Stage 6 */}
          <div className="border border-slate-200 rounded-md p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900">STAGE 6: ADAPTIVE FEEDBACK LOOP</span>
              <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">Adaptive Replanning</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-2">
              Micro-assessments & 5-tier confidence feedback automatically re-evaluate gaps and re-sort roadmap topologically.
            </p>
            <div className="text-[10px] font-mono text-slate-500">
              Trigger: Quiz score or confidence rating
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
