import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { SimulateCareerResponse, Career } from '../types';
import { Sliders, Sparkles, ArrowRight, CheckCircle2, Clock, FolderGit2, RefreshCw } from 'lucide-react';

export const WhatIfSimulatorPage: React.FC = () => {
  const location = useLocation();
  const initialTarget = (location.state as any)?.targetCareerId || 'c_data_scientist';

  const [targetCareerId, setTargetCareerId] = useState<string>(initialTarget);
  const [careers, setCareers] = useState<Career[]>([]);
  const [simulation, setSimulation] = useState<SimulateCareerResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getCareers().then(setCareers);
  }, []);

  const handleSimulate = async (cid?: string) => {
    const idToSim = cid || targetCareerId;
    try {
      setLoading(true);
      const res = await api.simulateCareer(idToSim);
      setSimulation(res);
    } catch (err) {
      console.error('Career Simulation Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSimulate(initialTarget);
  }, [initialTarget]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary font-semibold text-xs mb-2">
          <Sliders className="w-3.5 h-3.5" />
          <span>INNOVATION FEATURE</span>
        </div>
        <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
          What-if Career Simulator
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Explore what happens if you transition from your current career track to another field.
        </p>
      </div>

      {/* Target Career Selector */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase mb-1">
            Simulate Switching Target Goal To:
          </label>
          <select
            value={targetCareerId}
            onChange={(e) => {
              setTargetCareerId(e.target.value);
              handleSimulate(e.target.value);
            }}
            className="p-3 rounded-xl border border-border text-sm font-bold text-text-main focus:ring-2 focus:ring-primary focus:outline-none"
          >
            {careers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.category})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => handleSimulate()}
          className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center space-x-2 shadow-xs transition-all"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Run What-if Simulation</span>
        </button>
      </div>

      {/* Simulation Results */}
      {simulation && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xs text-center">
              <span className="text-xs font-bold text-text-muted uppercase">Skill Overlap</span>
              <div className="text-4xl font-extrabold text-primary my-2">
                {simulation.skill_overlap_percentage}%
              </div>
              <p className="text-xs text-text-muted">
                Of your existing skills transfer directly to {simulation.target_career_title}
              </p>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xs text-center">
              <span className="text-xs font-bold text-text-muted uppercase">Additional Effort</span>
              <div className="text-4xl font-extrabold text-text-main my-2">
                ~{simulation.estimated_additional_weeks} Wks
              </div>
              <p className="text-xs text-text-muted">
                Estimated additional learning duration based on your 8 hrs/week
              </p>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xs text-center">
              <span className="text-xs font-bold text-text-muted uppercase">New Skills Required</span>
              <div className="text-4xl font-extrabold text-amber-600 my-2">
                {simulation.new_skills_required.length}
              </div>
              <p className="text-xs text-text-muted">
                New specialized skills needed to reach 100% readiness
              </p>
            </div>
          </div>

          {/* Shared vs New Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xs">
              <h4 className="text-sm font-bold text-text-main flex items-center space-x-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-semantic-success" />
                <span>Shared Transferable Skills ({simulation.shared_skills.length})</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {simulation.shared_skills.map((s, idx) => (
                  <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg text-xs font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xs">
              <h4 className="text-sm font-bold text-text-main flex items-center space-x-2 mb-4">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>New Required Skills ({simulation.new_skills_required.length})</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {simulation.new_skills_required.map((s, idx) => (
                  <span key={idx} className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-lg text-xs font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Transition Projects */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xs">
            <h4 className="text-sm font-bold text-text-main flex items-center space-x-2 mb-3">
              <FolderGit2 className="w-4 h-4 text-primary" />
              <span>Recommended Portfolio Projects for {simulation.target_career_title} Transition</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {simulation.recommended_projects.map((p, idx) => (
                <div key={idx} className="bg-primary-soft/40 border border-primary/20 p-3 rounded-xl text-xs font-bold text-text-main">
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
