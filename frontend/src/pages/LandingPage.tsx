import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GitGraph, Award, Sliders, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-[var(--bg)] min-h-screen">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-8 max-w-6xl mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <Badge tone="brand">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            HCL AMPLIFY ROUND 2 PROTOTYPE
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight max-w-3xl mx-auto leading-tight mb-4">
          Turn your skills into a <span className="text-[var(--brand)]">clear career path</span>.
        </h1>

        <p className="text-sm text-[var(--text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed">
          PathFinder analyzes where you are, where you want to go, and builds the adaptive learning sequence between them.
        </p>

        <div className="flex items-center justify-center gap-3 mb-16">
          <Link to="/onboarding">
            <Button size="lg" variant="primary">
              <span>Build My Path</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link to="/careers">
            <Button size="lg" variant="secondary">
              Explore Careers Base
            </Button>
          </Link>
        </div>

        {/* Product Visualization Flow */}
        <Card className="max-w-4xl mx-auto text-left">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-6">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              PathFinder Architecture Preview
            </span>
            <Badge tone="brand">Adaptive Recommender</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs">
            <div className="bg-[var(--surface-sunken)] border border-[var(--border)] rounded-[var(--radius-sm)] p-4 flex flex-col justify-between">
              <div className="font-semibold text-[var(--text-primary)] mb-1">01 SKILLS</div>
              <p className="text-[var(--text-secondary)] text-[11px]">Python, SQL</p>
              <Badge tone="success" className="mx-auto mt-3">Mastered</Badge>
            </div>

            <div className="bg-[var(--surface-sunken)] border border-[var(--border)] rounded-[var(--radius-sm)] p-4 flex flex-col justify-between">
              <div className="font-semibold text-[var(--text-primary)] mb-1">02 GOAL</div>
              <p className="text-[var(--text-secondary)] text-[11px]">AI Engineer</p>
              <Badge tone="brand" className="mx-auto mt-3">Target</Badge>
            </div>

            <div className="bg-[var(--surface-sunken)] border border-[var(--border)] rounded-[var(--radius-sm)] p-4 flex flex-col justify-between">
              <div className="font-semibold text-[var(--text-primary)] mb-1">03 GAPS</div>
              <p className="text-[var(--text-secondary)] text-[11px]">Model Eval, DL</p>
              <Badge tone="warning" className="mx-auto mt-3">Identified</Badge>
            </div>

            <div className="bg-[var(--surface-sunken)] border border-[var(--border)] rounded-[var(--radius-sm)] p-4 flex flex-col justify-between">
              <div className="font-semibold text-[var(--text-primary)] mb-1">04 PREREQS</div>
              <p className="text-[var(--text-secondary)] text-[11px]">DAG Topological</p>
              <Badge tone="neutral" className="mx-auto mt-3">Sorted</Badge>
            </div>

            <div className="bg-[var(--brand)] text-white rounded-[var(--radius-sm)] p-4 flex flex-col justify-between">
              <div className="font-semibold mb-1">05 ACTION</div>
              <p className="text-white/80 text-[11px]">Model Eval</p>
              <span className="inline-block mt-3 text-[10px] font-mono text-white bg-white/20 rounded-[var(--radius-pill)] py-0.5 px-2">Next Best</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Differentiators */}
      <section className="py-16 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Why traditional course recommenders fail.
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Generic course libraries present thousands of choices without structure. PathFinder continuously builds the shortest practical path to your target career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center mb-4">
                <GitGraph className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">
                Prerequisite-Aware Topology
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Applies Directed Acyclic Graph (DAG) topological sorting across 40+ skills to guarantee foundational topics are mastered before advanced modules.
              </p>
            </Card>

            <Card>
              <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center mb-4">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">
                Continuous Adaptive Replanning
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Micro-assessments and confidence feedback dynamically update your learner model and re-rank roadmap steps in real time.
              </p>
            </Card>

            <Card>
              <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center mb-4">
                <Sliders className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">
                What-If Career Simulator
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Evaluate prospective career switches instantly. Compare skill overlap %, shared competencies, and estimated transition timelines.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 px-8 max-w-6xl mx-auto text-center">
        <Card className="bg-[var(--surface-sunken)] py-12">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Ready to discover your personalized career path?
          </h2>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto mb-6">
            Tell us where you are, what you know, and where you want to go. PathFinder will build your customized, adaptive learning path.
          </p>
          <Link to="/onboarding">
            <Button size="md" variant="primary">
              <span>Start Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
};
