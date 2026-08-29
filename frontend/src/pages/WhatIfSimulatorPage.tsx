import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLearner } from '../context/LearnerContext';
import { Career, SimulateCareerResponse } from '../types';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

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
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="mb-1">
            <Badge tone="brand">DECISION-SUPPORT SIMULATOR</Badge>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Explore a Different Career Path
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Analyze skill overlap %, transferable competencies, and estimated transition timelines before switching
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[var(--text-secondary)]">Compare with:</span>
          <select
            value={selectedCareerId}
            onChange={(e) => setSelectedCareerId(e.target.value)}
            className="p-2 rounded-[var(--radius-sm)] border border-[var(--border-strong)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none bg-[var(--surface)]"
          >
            {careers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Simulation Results */}
      {loading || !simulation ? (
        <div className="h-64 bg-[var(--surface-sunken)] animate-pulse rounded-[var(--radius-md)]" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                SKILL OVERLAP MATCH
              </div>

              <div className="text-3xl font-extrabold text-[var(--text-primary)] font-mono mb-2">
                {simulation.skill_overlap_percentage}%
              </div>

              <div className="w-full bg-[var(--surface-sunken)] h-2 rounded-[var(--radius-pill)] overflow-hidden mb-4">
                <div
                  className="bg-[var(--brand)] h-full rounded-[var(--radius-pill)] transition-all duration-500"
                  style={{ width: `${simulation.skill_overlap_percentage}%` }}
                />
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                Your existing skill portfolio covers {simulation.skill_overlap_percentage}% of the requirements for <strong>{simulation.target_career_title}</strong>.
              </p>
            </div>

            <div className="bg-[var(--surface-sunken)] border border-[var(--border)] rounded-[var(--radius-sm)] p-3 text-xs">
              <div className="font-semibold text-[var(--text-primary)] mb-1 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-[var(--brand)]" />
                Estimated Transition Timeline
              </div>
              <div className="text-[var(--text-secondary)] font-mono font-bold text-sm">
                +{simulation.estimated_additional_weeks} weeks <span className="text-[var(--text-tertiary)] text-xs font-normal">(at 8 hrs/week)</span>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <div className="text-[10px] font-semibold text-[var(--success)] uppercase tracking-wider mb-3">
                TRANSFERABLE SKILLS ({simulation.shared_skills.length})
              </div>

              <div className="space-y-2">
                {simulation.shared_skills.map((s, idx) => (
                  <div key={idx} className="bg-[var(--success-soft)] border border-[var(--success)] text-[var(--success)] text-xs font-medium p-2.5 rounded-[var(--radius-sm)] flex items-center justify-between">
                    <span>{s}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="text-[10px] font-semibold text-[var(--warning)] uppercase tracking-wider mb-3">
                NEW SKILLS TO ACQUIRE ({simulation.new_skills_required.length})
              </div>

              <div className="space-y-2">
                {simulation.new_skills_required.map((s, idx) => (
                  <div key={idx} className="bg-[var(--warning-soft)] border border-[var(--warning)] text-[var(--warning)] text-xs font-medium p-2.5 rounded-[var(--radius-sm)] flex items-center justify-between">
                    <span>{s}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
