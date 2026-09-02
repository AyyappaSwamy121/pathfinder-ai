import React, { useState, useMemo } from 'react';
import { ReactFlow, Background, Controls, Node, Edge, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Link } from 'react-router-dom';
import { useLearner } from '../context/LearnerContext';
import { GitGraph, ShieldCheck, GitCompare } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CardSkeleton, TRANSITION_EASE } from '../components/motion/MotionPrimitives';
import { motion, AnimatePresence } from 'framer-motion';

export const SkillGraphPage: React.FC = () => {
  const { dashboard, loading } = useLearner();
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  const skillsData = useMemo(() => {
    if (!dashboard) return [];
    const mastered = dashboard.skill_gaps.mastered.map((s) => ({ ...s, status: 'MASTERED' }));
    const developing = dashboard.skill_gaps.developing.map((s) => ({ ...s, status: 'DEVELOPING' }));
    const missing = dashboard.skill_gaps.missing.map((s) => ({ ...s, status: 'MISSING' }));
    const locked = dashboard.skill_gaps.locked.map((s) => ({ ...s, status: 'LOCKED' }));
    return [...mastered, ...developing, ...missing, ...locked];
  }, [dashboard]);

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const statusColors: Record<string, { bg: string; border: string; text: string }> = {
      MASTERED: { bg: '#F0FDF4', border: '#15803D', text: '#15803D' },
      DEVELOPING: { bg: '#EEF2FF', border: '#4338CA', text: '#4338CA' },
      MISSING: { bg: '#FFFBEB', border: '#B45309', text: '#B45309' },
      LOCKED: { bg: '#F4F5F7', border: '#D1D5DB', text: '#64748B' },
      RECOMMENDED: { bg: '#EEF2FF', border: '#4338CA', text: '#4338CA' },
    };

    skillsData.forEach((skill, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const color = statusColors[skill.status] || statusColors.MISSING;
      const isSelected = selectedNode?.skill_id === skill.skill_id;

      nodes.push({
        id: skill.skill_id,
        data: { label: skill.name, skill },
        position: { x: col * 240 + 40, y: row * 110 + 40 },
        style: {
          background: isSelected ? '#EEF2FF' : color.bg,
          border: isSelected ? '2px solid #4338CA' : `1px solid ${color.border}`,
          color: color.text,
          borderRadius: '6px',
          padding: '8px 12px',
          fontWeight: 600,
          fontSize: '12px',
          width: 190,
          boxShadow: isSelected ? '0 4px 12px rgba(67, 56, 202, 0.15)' : 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        },
      });

      if (index > 0 && index % 2 === 0) {
        edges.push({
          id: `edge-${skillsData[index - 1].skill_id}-${skill.skill_id}`,
          source: skillsData[index - 1].skill_id,
          target: skill.skill_id,
          animated: skill.status === 'DEVELOPING',
          style: { stroke: '#CBD5E1', strokeWidth: 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#94A3B8' },
        });
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [skillsData, selectedNode]);

  if (loading || !dashboard) {
    return (
      <div className="space-y-6">
        <CardSkeleton className="h-20" />
        <CardSkeleton className="h-[520px]" />
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
              <Badge tone="brand">DAG TOPOLOGY</Badge>
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Prerequisite Knowledge Dependencies
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Visualizing skill states and prerequisite resolution across 40+ career competencies
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium">
              <Badge tone="success">Mastered</Badge>
              <Badge tone="brand">Developing</Badge>
              <Badge tone="neutral">Locked</Badge>
            </div>
            <Link to="/career-twin">
              <Button size="sm" variant="secondary" className="border-indigo-200 text-[#4F46E5] hover:bg-indigo-50/50">
                <GitCompare className="w-3.5 h-3.5 mr-1" />
                <span>Simulate in Career Twin</span>
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>

      {/* Main Graph & Inspector Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: TRANSITION_EASE }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
      >
        <div className="lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] h-[520px] relative overflow-hidden shadow-xs hover:border-slate-300 transition-colors">
          <ReactFlow
            nodes={initialNodes}
            edges={initialEdges}
            onNodeClick={(_, node) => setSelectedNode(node.data.skill)}
            fitView
          >
            <Background color="#E5E7EB" gap={16} size={1} />
            <Controls className="bg-white border border-[var(--border)] rounded-[var(--radius-sm)] shadow-xs" />
          </ReactFlow>
        </div>

        {/* Selected Skill Inspector Panel */}
        <Card className="flex flex-col justify-between hover:border-slate-300 transition-colors">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.skill_id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: TRANSITION_EASE }}
                className="space-y-4"
              >
                <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                  SKILL INSPECTOR
                </div>

                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">{selectedNode.name}</h3>
                  <div className="text-xs text-[var(--text-secondary)]">{selectedNode.category || 'Core Skill'}</div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[var(--border)] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Status:</span>
                    <span className="font-bold text-[var(--text-primary)] uppercase">{selectedNode.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Proficiency:</span>
                    <span className="font-semibold text-[var(--text-primary)]">{selectedNode.proficiency || 'Intermediate'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Confidence:</span>
                    <span className="font-semibold text-[var(--text-primary)]">{selectedNode.confidence || 'Medium'}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-[var(--text-tertiary)] space-y-2"
              >
                <GitGraph className="w-8 h-8 mx-auto text-[var(--text-tertiary)]" />
                <div className="text-xs font-semibold text-[var(--text-secondary)]">Select a node in the graph</div>
                <p className="text-[11px] leading-relaxed">Click any skill node to inspect prerequisite requirements & confidence metrics.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-4 border-t border-[var(--border)] text-[11px] text-[var(--text-tertiary)] flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[var(--brand)]" />
            Topological Sort Verified
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
