import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ShieldCheck, Info } from 'lucide-react';

interface ReadinessGaugeProps {
  score: number;
  careerTitle: string;
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({ score, careerTitle }) => {
  const data = [
    { name: 'Readiness', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const getColor = (s: number) => {
    if (s >= 75) return '#10B981'; // Success Green
    if (s >= 50) return '#4F46E5'; // Accent Indigo
    return '#F59E0B'; // Warning Amber
  };

  const currentColor = getColor(score);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Career Readiness
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-text-muted">
            <ShieldCheck className="w-3 h-3 mr-1 text-primary" />
            Deterministic Model
          </span>
        </div>
        <h4 className="text-sm font-semibold text-text-main">
          {careerTitle}
        </h4>
      </div>

      <div className="relative h-44 my-2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              startAngle={180}
              endAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell key="readiness" fill={currentColor} />
              <Cell key="remaining" fill="#F3F4F6" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <span className="text-4xl font-extrabold text-text-main tracking-tight">
            {Math.round(score)}%
          </span>
          <span className="text-xs font-medium text-text-muted mt-0.5">
            Readiness Score
          </span>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-[11px] text-text-muted flex items-start space-x-1.5">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <span>
          AI-generated estimate based on your current skill proficiencies, satisfied prerequisites, and evidence portfolio.
        </span>
      </div>
    </div>
  );
};
