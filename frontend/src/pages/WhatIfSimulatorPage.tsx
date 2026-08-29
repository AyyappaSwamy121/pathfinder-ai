import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLearner } from '../context/LearnerContext';
import { Career, SimulateCareerResponse } from '../types';
import { Sliders, ArrowRight, CheckCircle2, Clock, ShieldCheck, RefreshCw } from 'lucide-react';

export const WhatIfSimulatorPage: React.FC = () => {
  const { dashboard } = useLearner();
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState<string>('c_data_scientist');
  const [simulation, setSimulation] = useState<SimulateCareerResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCareers().then((res) => {
      setCareers(res);
      const filtered = res.filter((c) => c.id !== dashboard?.target_career.id);
      if (filtered.length > 0) setSelectedCareerId(filtered[0].id);
    });
  }, [dashboard]);

  useEffect(() => {
    if (!selectedCareerId) return;
    setLoading(true);
    api.simulateCareer(selectedCareerId).then((res) => {
      setSimulation(res);
      setLoading(false);
    });
  }, [selectedCareerId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1">
            DECISION-SUPPORT CAREER SIMULATOR
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Explore a Different Career Path
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Analyze skill overlap %, transferable competencies, and estimated transition timelines before switching
          </p>
        </div>

        {/* Target Career Dropdown Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500">Compare with:</span>
          <select
            value={selectedCareerId}
            onChange={(e) => setSelectedCareerId(e.target.value)}
            className="p-2 rounded-md border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-primary focus:outline-none bg-surface shadow-subtle"
          >
            {careers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Simulation Results */}
      {loading || !simulation ? (
        <div className="h-64 bg-slate-200 animate-pulse rounded-lg" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overlap Summary Card */}
          <div className="bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                SKILL OVERLAP MATCH
              </div>

              <div className="text-4xl font-extrabold text-slate-900 font-mono mb-2">
                {simulation.skill_overlap_percentage}%
              </div>

              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-700"
                  style={{ width: `${simulation.skill_overlap_percentage}%` }}
                />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Your existing skill portfolio covers {simulation.skill_overlap_percentage}% of the requirements for <strong>{simulation.target_career_title}</strong>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-xs">
              <div className="font-semibold text-slate-900 mb-1 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-primary" />
                Estimated Transition Timeline
              </div>
              <div className="text-slate-600 font-mono font-bold text-sm">
                +{simulation.estimated_additional_weeks} weeks <span className="text-slate-400 text-xs font-normal">(at 8 hrs/week)</span>
              </div>
            </div>
          </div>

          {/* Transferable Skills vs New Skills Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Transferable Skills */}
            <div className="bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle">
              <div className="text-[10px] font-extrabold text-semantic-success uppercase tracking-widest mb-3">
                TRANSFERABLE SKILLS YOU ALREADY HAVE ({simulation.shared_skills.length})
              </div>

              <div className="space-y-2">
                {simulation.shared_skills.map((s, idx) => (
                  <div key={idx} className="bg-emerald-50/60 border border-emerald-200 text-emerald-900 text-xs font-medium p-2.5 rounded flex items-center justify-between">
                    <span>{s}</span>
                    <CheckCircle2 className="w-4 h-4 text-semantic-success" />
                  </div>
                ))}
              </div>
            </div>

            {/* New Skills to Acquire */}
            <div className="bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle">
              <div className="text-[10px] font-extrabold text-semantic-warning uppercase tracking-widest mb-3">
                NEW SKILLS TO ACQUIRE ({simulation.new_skills_required.length})
              </div>

              <div className="space-y-2">
                {simulation.new_skills_required.map((s, idx) => (
                  <div key={idx} className="bg-amber-50/60 border border-amber-200 text-amber-900 text-xs font-medium p-2.5 rounded flex items-center justify-between">
                    <span>{s}</span>
                    <ArrowRight className="w-4 h-4 text-amber-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
