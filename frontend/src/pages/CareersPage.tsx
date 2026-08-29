import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Career } from '../types';
import { useLearner } from '../context/LearnerContext';
import { Briefcase, Cpu, LineChart, Code2, BarChart3, Cloud, ShieldCheck, ArrowRight, Sliders, CheckCircle2 } from 'lucide-react';

export const CareersPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, refreshState } = useLearner();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  const iconMap: Record<string, any> = {
    Cpu: Cpu,
    LineChart: LineChart,
    Code2: Code2,
    BarChart3: BarChart3,
    Cloud: Cloud,
    ShieldCheck: ShieldCheck,
  };

  useEffect(() => {
    api.getCareers().then((res) => {
      setCareers(res);
      setLoading(false);
    });
  }, []);

  const handleSelectCareer = async (careerId: string) => {
    await api.updateProfile({
      target_career_id: careerId,
      experience_level: profile?.experience_level || 'Intermediate',
      weekly_hours: profile?.weekly_hours || 8,
      timeline_months: profile?.timeline_months || 6,
      learning_preference: profile?.learning_preference || 'Project Based',
      skills: [],
    });
    await refreshState();
    navigate('/dashboard');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-border pb-4">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary font-semibold text-xs mb-2">
          <Briefcase className="w-3.5 h-3.5" />
          <span>CAREER KNOWLEDGE BASE</span>
        </div>
        <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
          Explore Target Careers
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Select a career goal to build a personalized, prerequisite-aware learning roadmap.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {careers.map((c) => {
          const IconComp = iconMap[c.icon] || Briefcase;
          const isCurrent = profile?.target_career_id === c.id;

          return (
            <div
              key={c.id}
              className={`bg-surface border rounded-2xl p-6 shadow-2xs flex flex-col justify-between transition-all ${
                isCurrent ? 'border-2 border-primary bg-primary-soft/20 shadow-md' : 'border-border hover:border-gray-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center shadow-2xs">
                    <IconComp className="w-6 h-6" />
                  </div>
                  {isCurrent && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Active Target
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-text-main mb-2">{c.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed mb-6">{c.description}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>Required Skills Count:</span>
                  <span className="font-bold text-text-main">{c.required_skills_count || 12} skills</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSelectCareer(c.id)}
                    className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-2xs transition-colors"
                  >
                    <span>Select Path</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => navigate('/simulator', { state: { targetCareerId: c.id } })}
                    className="bg-white hover:bg-gray-50 border border-border text-text-main font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5 text-primary" />
                    <span>Simulate</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
