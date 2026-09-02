import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLearner } from '../context/LearnerContext';
import { Career, SimulateCareerResponse } from '../types';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, GitCompare, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  AnimatedNumber,
  AnimatedProgress,
  CardSkeleton,
  StaggerContainer,
  StaggerItem,
  TRANSITION_EASE,
} from '../components/motion/MotionPrimitives';
import { motion, AnimatePresence } from 'framer-motion';

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
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: TRANSITION_EASE }}
      >
        <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-colors">
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

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[var(--text-secondary)]">Compare with:</span>
              <select
                value={selectedCareerId}
                onChange={(e) => setSelectedCareerId(e.target.value)}
                className="p-2 rounded-[var(--radius-sm)] border border-[var(--border-strong)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none bg-[var(--surface)] hover:border-slate-400 transition-colors cursor-pointer"
              >
                {careers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <Link to={`/career-twin?target=${selectedCareerId}`}>
              <Button size="sm" variant="primary">
                <GitCompare className="w-3.5 h-3.5 mr-1" />
                <span>Launch in Career Twin</span>
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>

      {/* Simulation Results */}
      {loading || !simulation ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CardSkeleton className="h-64" />
          <CardSkeleton className="lg:col-span-2 h-64" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCareerId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: TRANSITION_EASE }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <Card className="flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                  SKILL OVERLAP MATCH
                </div>

                <div className="text-3xl font-extrabold text-[var(--text-primary)] font-mono mb-2">
                  <AnimatedNumber value={simulation.skill_overlap_percentage} suffix="%" />
                </div>

                <div className="mb-4">
                  <AnimatedProgress value={simulation.skill_overlap_percentage} className="h-2.5" />
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  Your existing skill portfolio covers <AnimatedNumber value={simulation.skill_overlap_percentage} suffix="%" /> of the requirements for <strong>{simulation.target_career_title}</strong>.
                </p>
              </div>

              <div className="bg-[var(--surface-sunken)] border border-[var(--border)] rounded-[var(--radius-sm)] p-3 text-xs">
                <div className="font-semibold text-[var(--text-primary)] mb-1 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-[var(--brand)]" />
                  Estimated Transition Timeline
                </div>
                <div className="text-[var(--text-secondary)] font-mono font-bold text-sm">
                  +<AnimatedNumber value={simulation.estimated_additional_weeks} /> weeks <span className="text-[var(--text-tertiary)] text-xs font-normal">(at 8 hrs/week)</span>
                </div>
              </div>
            </Card>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="hover:border-slate-300 transition-colors">
                <div className="text-[10px] font-semibold text-[var(--success)] uppercase tracking-wider mb-3">
                  TRANSFERABLE SKILLS ({simulation.shared_skills.length})
                </div>

                <StaggerContainer staggerDelay={0.05} className="space-y-2">
                  {simulation.shared_skills.map((s, idx) => (
                    <StaggerItem key={idx}>
                      <div className="bg-[var(--success-soft)] border border-[var(--success)] text-[var(--success)] text-xs font-medium p-2.5 rounded-[var(--radius-sm)] flex items-center justify-between hover:translate-x-0.5 transition-transform duration-150">
                        <span>{s}</span>
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </Card>

              <Card className="hover:border-slate-300 transition-colors">
                <div className="text-[10px] font-semibold text-[var(--warning)] uppercase tracking-wider mb-3">
                  NEW SKILLS TO ACQUIRE ({simulation.new_skills_required.length})
                </div>

                <StaggerContainer staggerDelay={0.05} className="space-y-2">
                  {simulation.new_skills_required.map((s, idx) => (
                    <StaggerItem key={idx}>
                      <div className="bg-[var(--warning-soft)] border border-[var(--warning)] text-[var(--warning)] text-xs font-medium p-2.5 rounded-[var(--radius-sm)] flex items-center justify-between hover:translate-x-0.5 transition-transform duration-150">
                        <span>{s}</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </Card>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
