import React, { useEffect, useState, useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { api } from '../services/api';
import { SkillGapAnalysis, Skill } from '../types';
import { Sparkles, GitGraph, Info, RefreshCw } from 'lucide-react';

export const SkillGraphPage: React.FC = () => {
  const [gaps, setGaps] = useState<SkillGapAnalysis | null>(null);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const gapRes = await api.getSkillGaps();
      const skillRes = await api.getSkills();
      setGaps(gapRes);
      setAllSkills(skillRes);
    } catch (err) {
      console.error('Failed to load skill graph:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const { nodes, edges } = useMemo(() => {
    if (!gaps || allSkills.length === 0) return { nodes: [], edges: [] };

    // Status map
    const statusMap: Record<string, string> = {};
    gaps.mastered.forEach((s) => (statusMap[s.skill_id] = 'MASTERED'));
    gaps.developing.forEach((s) => (statusMap[s.skill_id] = 'DEVELOPING'));
    gaps.recommended.forEach((s) => (statusMap[s.skill_id] = 'RECOMMENDED'));
    gaps.locked.forEach((s) => (statusMap[s.skill_id] = 'LOCKED'));
    gaps.missing.forEach((s) => (statusMap[s.skill_id] = 'MISSING'));

    const nodesList: Node[] = [];
    const edgesList: Edge[] = [];

    // Layout grid coordinates
    const categories = Array.from(new Set(allSkills.map((s) => s.category)));
    const catYMap: Record<string, number> = {};
    categories.forEach((cat, idx) => (catYMap[cat] = idx * 140));

    const catXTracker: Record<string, number> = {};

    allSkills.forEach((skill) => {
      const status = statusMap[skill.id] || 'MISSING';
      const cat = skill.category;
      const xIndex = catXTracker[cat] || 0;
      catXTracker[cat] = xIndex + 1;

      let bgColor = '#F3F4F6';
      let textColor = '#374151';
      let borderColor = '#E5E7EB';

      if (status === 'MASTERED') {
        bgColor = '#ECFDF5';
        textColor = '#065F46';
        borderColor = '#10B981';
      } else if (status === 'DEVELOPING') {
        bgColor = '#EEF2FF';
        textColor = '#3730A3';
        borderColor = '#6366F1';
      } else if (status === 'RECOMMENDED') {
        bgColor = '#FEF3C7';
        textColor = '#92400E';
        borderColor = '#F59E0B';
      } else if (status === 'LOCKED') {
        bgColor = '#FFF1F2';
        textColor = '#9F1239';
        borderColor = '#FDA4AF';
      }

      nodesList.push({
        id: skill.id,
        position: { x: xIndex * 220 + 40, y: (catYMap[cat] || 0) + 40 },
        data: {
          label: (
            <div className="p-2 text-center">
              <div className="font-bold text-xs">{skill.name}</div>
              <div className="text-[10px] uppercase opacity-75">{status}</div>
            </div>
          ),
        },
        style: {
          background: bgColor,
          color: textColor,
          border: `2px solid ${borderColor}`,
          borderRadius: '12px',
          width: 180,
          boxShadow: status === 'RECOMMENDED' ? '0 0 15px rgba(245, 158, 11, 0.4)' : 'none',
        },
      });

      // Add edges
      skill.prerequisite_ids.forEach((prereqId: string) => {
        edgesList.push({
          id: `e_${prereqId}_${skill.id}`,
          source: prereqId,
          target: skill.id,
          animated: status === 'RECOMMENDED' || status === 'DEVELOPING',
          style: { stroke: status === 'RECOMMENDED' ? '#F59E0B' : '#CBD5E1', strokeWidth: 2 },
        });
      });
    });

    return { nodes: nodesList, edges: edgesList };
  }, [gaps, allSkills]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary font-semibold text-xs mb-2">
            <GitGraph className="w-3.5 h-3.5" />
            <span>DEPENDENCY TOPOLOGY GRAPH</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
            Skill Knowledge Graph
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Visualizing 40+ skills and prerequisite dependency relationships for {gaps?.target_career || 'AI Engineer'}.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /><span>Mastered</span></span>
          <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" /><span>Developing</span></span>
          <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /><span>Recommended Next</span></span>
          <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-full bg-rose-400 inline-block" /><span>Locked</span></span>
        </div>
      </div>

      <div className="h-[650px] bg-surface border border-border rounded-2xl overflow-hidden shadow-sm relative">
        {loading ? (
          <div className="h-full flex items-center justify-center text-primary font-medium text-xs space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Rendering Skill Graph DAG...</span>
          </div>
        ) : (
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <Background color="#E5E7EB" gap={20} />
            <Controls />
            <MiniMap nodeStrokeWidth={3} zoomable pannable />
          </ReactFlow>
        )}
      </div>
    </div>
  );
};
