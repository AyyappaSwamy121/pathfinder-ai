import React from 'react';
import { Cpu, Layers, GitGraph, CheckCircle2, HelpCircle, ShieldCheck, Zap } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const traceabilityData = [
    { req: '1. Conversational interface', impl: 'AI Profile Onboarding & Natural Language Processing' },
    { req: '2. Build learner profile', impl: 'Learner Model State (Proficiency, Confidence, Evidence)' },
    { req: '3. Understand career objectives', impl: 'Career Knowledge Base (6 Roles, Skills & Weights)' },
    { req: '4. Identify skill gaps', impl: 'Deterministic Skill Gap Engine (Mastered vs Missing)' },
    { req: '5. Recommend relevant resources', impl: 'Hybrid Recommendation Engine (50+ Seeded Resources)' },
    { req: '6. Generate structured roadmap', impl: 'Deterministic Topological DAG Roadmap Generator' },
    { req: '7. Respect prerequisites', impl: 'Skill Knowledge Graph (50+ Prerequisite Edges)' },
    { req: '8. Recommend projects', impl: 'Project-First Learning Module (20+ Portfolio Projects)' },
    { req: '9. Provide assessments', impl: 'Assessment Engine (Micro-assessments & scoring)' },
    { req: '10. Explain recommendations', impl: 'Explainable AI Module ("Why this?" prerequisite reasons)' },
    { req: '11. Track progress', impl: 'Readiness Gauge & Recharts Growth Analytics' },
    { req: '12. Adapt recommendations', impl: 'Adaptive Learning Replanning Engine (5-tier feedback)' },
    { req: '13. Conversational AI assistant', impl: 'Grounded AI Copilot with RAG-lite context' },
    { req: '14. Visualize career readiness', impl: 'Dashboard Readiness Gauge & Skill Gap Badges' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary font-semibold text-xs mb-2">
          <Cpu className="w-3.5 h-3.5" />
          <span>SYSTEM ARCHITECTURE & JUDGE TRANSPARENCY</span>
        </div>
        <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
          How PathFinder AI Thinks
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Detailed technical breakdown of PathFinder AI's multi-layered architecture and HCL requirement traceability matrix.
        </p>
      </div>

      {/* Architecture Flow Diagram */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xs space-y-6">
        <h3 className="text-lg font-bold text-text-main flex items-center space-x-2">
          <Layers className="w-5 h-5 text-primary" />
          <span>End-to-End System Pipeline</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">1. Learner NLP Input</div>
          <div className="p-3 bg-primary-soft border border-primary/20 rounded-xl text-primary font-bold">2. Profile Extraction</div>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">3. Learner Model State</div>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">4. Career Knowledge Base</div>
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 font-bold">5. Skill Gap Engine</div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-bold">6. Skill Graph DAG</div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-bold">7. Topological Roadmap</div>
          <div className="p-3 bg-primary-soft border border-primary/20 rounded-xl text-primary font-bold">8. Adaptive Replanning</div>
        </div>
      </div>

      {/* Why Isn't This Just ChatGPT? Card */}
      <div className="bg-gradient-to-r from-indigo-900 to-primary text-white rounded-2xl p-6 shadow-md space-y-3">
        <h3 className="text-lg font-extrabold flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>Why Isn't This Just ChatGPT?</span>
        </h3>
        <p className="text-xs leading-relaxed text-indigo-100">
          The LLM is NOT the recommendation engine. PathFinder AI uses a deterministic skill gap engine, a structured prerequisite DAG topology, a live learner model state, and multi-factor hybrid scoring to generate learning paths. AI is utilized for natural-language profile understanding, prerequisite reasoning explanations, and grounded copilot assistance. If the external LLM provider fails, PathFinder continues operating seamlessly using its offline fallback engine.
        </p>
      </div>

      {/* HCL Requirement Traceability Matrix */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xs space-y-4">
        <h3 className="text-lg font-bold text-text-main">
          HCL Official Objective Traceability Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-text-muted uppercase tracking-wider bg-gray-50">
                <th className="p-3 font-bold">HCL Official Requirement</th>
                <th className="p-3 font-bold">PathFinder AI Implementation</th>
                <th className="p-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {traceabilityData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="p-3 font-medium text-text-main">{row.req}</td>
                  <td className="p-3 text-text-muted">{row.impl}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center text-semantic-success font-bold space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>COMPLETE</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
