import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Career } from '../types';
import { Link } from 'react-router-dom';
import { ArrowRight, Sliders } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const CareersPage: React.FC = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCareers().then((res) => {
      setCareers(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-44 bg-[var(--surface-sunken)] rounded-[var(--radius-md)]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="mb-1">
            <Badge tone="brand">CAREER KNOWLEDGE BASE</Badge>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Target Career Specifications
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Curated skill requirements, importance weights, and prerequisite paths across 6 technology roles
          </p>
        </div>

        <Link to="/simulator">
          <Button size="sm" variant="secondary">
            <Sliders className="w-3.5 h-3.5" />
            <span>What-if Simulator</span>
          </Button>
        </Link>
      </Card>

      {/* Careers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {careers.map((career) => (
          <Card key={career.id} className="flex flex-col justify-between hover:border-[var(--border-strong)] transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge tone="brand">{career.category}</Badge>
                <span className="text-xs text-[var(--text-tertiary)]">
                  {career.required_skills_count || 12} Skills
                </span>
              </div>

              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">{career.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                {career.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
              <Link to="/simulator">
                <Button size="sm" variant="ghost">
                  <span>Simulate Transition</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
