import React from 'react';
import { useLearner } from '../context/LearnerContext';
import { Sparkles, UserCheck, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

export const JudgeDemoBanner: React.FC = () => {
  const { judgeMode, loadPresetProfile } = useLearner();

  if (!judgeMode) return null;

  return (
    <div className="bg-[var(--surface-sunken)] border-b border-[var(--border)] py-2 px-6 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[var(--text-secondary)] font-medium">
          <Badge tone="warning">
            <Sparkles className="w-3 h-3 mr-1" />
            HCL DEMO WORKSPACE
          </Badge>
          <span>Select preset test profile:</span>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => loadPresetProfile('alex')}>
            <UserCheck className="w-3 h-3 text-[var(--brand)]" />
            <span>Alex (AI Engineer)</span>
          </Button>

          <Button size="sm" variant="secondary" onClick={() => loadPresetProfile('jordan')}>
            <span>Jordan (Data Analyst)</span>
          </Button>

          <Button size="sm" variant="secondary" onClick={() => loadPresetProfile('devon')}>
            <span>Devon (Full Stack)</span>
          </Button>

          <Link to="/architecture">
            <Button size="sm" variant="ghost">
              <Eye className="w-3 h-3" />
              <span>How AI Thinks</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
