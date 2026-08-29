import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Career } from '../types';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, ShieldCheck, Sliders } from 'lucide-react';

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
          <div key={i} className="h-44 bg-slate-200 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1">
            CAREER KNOWLEDGE BASE
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Target Career Specifications
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Curated skill requirements, importance weights, and prerequisite paths across 6 technology roles
          </p>
        </div>

        <Link
          to="/simulator"
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold px-4 py-2 rounded-md text-xs transition-colors flex items-center space-x-1.5 self-start md:self-auto"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Launch What-if Simulator</span>
        </Link>
      </div>

      {/* Careers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {careers.map((career) => (
          <div
            key={career.id}
            className="bg-surface border border-slate-200 rounded-lg p-6 shadow-subtle flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary-soft text-primary">
                  {career.category}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {career.required_skills_count || 12} Skills Required
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2">{career.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                {career.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={`/simulator`}
                className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center space-x-1"
              >
                <span>Simulate Transition</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
