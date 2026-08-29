import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="mb-1">
            <Badge tone="brand">ENGINEERING TRANSPARENCY</Badge>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            How PathFinder AI Thinks
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Explicit boundary separating AI natural-language reasoning from deterministic recommendation logic
          </p>
        </div>

        <Badge tone="success">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          100% Deterministic Guarantee
        </Badge>
      </Card>

      {/* System Pipeline Breakdown */}
      <Card className="space-y-6">
        <h3 className="text-sm font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">
          7-Stage Intelligence Pipeline Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="border border-[var(--border)] rounded-[var(--radius-sm)] p-4 bg-[var(--surface-sunken)]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[var(--text-primary)]">STAGE 1: NLP PROFILE PARSER</span>
              <Badge tone="brand">LLM Engine</Badge>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
              Parses conversational text into structured Pydantic schemas (target role, skills, weekly hours, timeline).
            </p>
            <div className="text-[10px] font-mono text-[var(--text-tertiary)]">
              Input: Conversational text ──► Output: Structured JSON
            </div>
          </div>

          <div className="border border-[var(--border)] rounded-[var(--radius-sm)] p-4 bg-[var(--surface-sunken)]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[var(--text-primary)]">STAGE 2: LEARNER MODEL STATE</span>
              <Badge tone="neutral">Deterministic DB</Badge>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
              Maintains live persistent state for proficiency, confidence, and portfolio evidence for every skill.
            </p>
            <div className="text-[10px] font-mono text-[var(--text-tertiary)]">
              State: Mastered / Developing / Missing / Locked
            </div>
          </div>

          <div className="border border-[var(--border)] rounded-[var(--radius-sm)] p-4 bg-[var(--surface-sunken)]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[var(--text-primary)]">STAGE 3: SKILL GAP & READINESS</span>
              <Badge tone="neutral">Deterministic Math</Badge>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
              Computes readiness formula: (0.5 * Mastered + 0.3 * Developing + 0.2 * Prerequisite Ratio) * 100.
            </p>
            <div className="text-[10px] font-mono text-[var(--text-tertiary)]">
              Formula: Mathematical weighted sum
            </div>
          </div>

          <div className="border border-[var(--border)] rounded-[var(--radius-sm)] p-4 bg-[var(--surface-sunken)]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[var(--text-primary)]">STAGE 4: PREREQUISITE GRAPH TOPOLOGY</span>
              <Badge tone="neutral">DAG Graph Alg</Badge>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
              Performs topological sorting on 40+ skills to guarantee prerequisites are satisfied before advanced steps.
            </p>
            <div className="text-[10px] font-mono text-[var(--text-tertiary)]">
              Algorithm: Kahn's DAG Topological Ordering
            </div>
          </div>

          <div className="border border-[var(--border)] rounded-[var(--radius-sm)] p-4 bg-[var(--surface-sunken)]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[var(--text-primary)]">STAGE 5: HYBRID RECOMMENDATION RANKING</span>
              <Badge tone="neutral">Multi-factor Alg</Badge>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
              Ranks activities based on 7 factors (30% Gap, 20% Career, 15% Prereqs, 10% Difficulty, 10% Time, 5% Feedback).
            </p>
            <div className="text-[10px] font-mono text-[var(--text-tertiary)]">
              Output: Next Best Action Spotlight
            </div>
          </div>

          <div className="border border-[var(--border)] rounded-[var(--radius-sm)] p-4 bg-[var(--surface-sunken)]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[var(--text-primary)]">STAGE 6: ADAPTIVE FEEDBACK LOOP</span>
              <Badge tone="neutral">Adaptive Replanning</Badge>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
              Micro-assessments & 5-tier confidence feedback automatically re-evaluate gaps and re-sort roadmap topologically.
            </p>
            <div className="text-[10px] font-mono text-[var(--text-tertiary)]">
              Trigger: Quiz score or confidence rating
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
