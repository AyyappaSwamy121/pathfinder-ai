import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Career } from '../types';
import { Link } from 'react-router-dom';
import { ArrowRight, Sliders, Briefcase } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  StaggerContainer,
  StaggerItem,
  CardSkeleton,
  TRANSITION_EASE,
} from '../components/motion/MotionPrimitives';
import { motion } from 'framer-motion';

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

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
              <Badge tone="brand">CAREER KNOWLEDGE BASE</Badge>
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Target Career Specifications
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Curated skill requirements, importance weights, and prerequisite paths across technology roles
            </p>
          </div>

          <Link to="/simulator">
            <Button size="sm" variant="secondary">
              <Sliders className="w-3.5 h-3.5" />
              <span>What-if Simulator</span>
            </Button>
          </Link>
        </Card>
      </motion.div>

      {/* Careers Grid */}
      <StaggerContainer staggerDelay={0.06} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {careers.map((career) => (
          <StaggerItem key={career.id}>
            <motion.div
              whileHover={{ y: -3, transition: { duration: 0.18, ease: TRANSITION_EASE } }}
              className="h-full"
            >
              <Card className="flex flex-col justify-between h-full hover:border-slate-300 hover:shadow-sm transition-all duration-200">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge tone="brand">{career.category}</Badge>
                    <span className="text-xs text-[var(--text-tertiary)] font-mono">
                      {career.required_skills_count || 12} Skills
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-[var(--brand)]" />
                    <span>{career.title}</span>
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                    {career.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                  <Link to="/simulator" className="w-full">
                    <Button size="sm" variant="ghost" className="w-full justify-between hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]">
                      <span>Simulate Transition</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
};
