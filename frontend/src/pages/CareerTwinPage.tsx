import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useLearner } from '../context/LearnerContext';
import { api } from '../services/api';
import {
  Career,
  CareerTwinSimulateResponse,
  TransitionPathOption,
  LearningRoiItem,
  TransitionNode,
} from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  GitCompare,
  ArrowRight,
  Clock,
  CheckCircle2,
  Lock,
  Sparkles,
  TrendingUp,
  FolderGit2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Zap,
  Target,
  Sliders,
  Loader2,
  Check,
  Briefcase,
  Layers,
  Info,
} from 'lucide-react';
import {
  AnimatedNumber,
  AnimatedProgress,
  CardSkeleton,
  TRANSITION_EASE,
} from '../components/motion/MotionPrimitives';
import { motion, AnimatePresence } from 'framer-motion';

export const CareerTwinPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { dashboard } = useLearner();

  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState<string>(
    searchParams.get('target') || 'c_data_scientist'
  );
  const [weeklyHours, setWeeklyHours] = useState<number>(8);
  const [timelineMonths, setTimelineMonths] = useState<number>(6);
  const [priorityMode, setPriorityMode] = useState<'FASTEST' | 'BALANCED' | 'PORTFOLIO'>('BALANCED');

  const [simulation, setSimulation] = useState<CareerTwinSimulateResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [selectedPathId, setSelectedPathId] = useState<string>('balanced');

  // Progressive Disclosure Toggles
  const [showPathComparison, setShowPathComparison] = useState<boolean>(false);
  const [showFullSkillMap, setShowFullSkillMap] = useState<boolean>(false);
  const [showAiReasoning, setShowAiReasoning] = useState<boolean>(false);
  const [showRoiDetails, setShowRoiDetails] = useState<boolean>(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);
  const [isChangingCareer, setIsChangingCareer] = useState<boolean>(false);

  // AI Explanation State
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiTakeaways, setAiTakeaways] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Load available careers
  useEffect(() => {
    api.getCareers().then((res) => {
      setCareers(res);
      const urlTarget = searchParams.get('target');
      if (urlTarget && res.some((c) => c.id === urlTarget)) {
        setSelectedCareerId(urlTarget);
      } else if (res.length > 0) {
        const defaultOther = res.find((c) => c.id !== dashboard?.target_career?.id) || res[1] || res[0];
        setSelectedCareerId(defaultOther.id);
      }
    });
  }, [dashboard]);

  // Run simulation whenever target career or scenario controls change
  useEffect(() => {
    if (!selectedCareerId) return;
    setUpdating(true);

    api
      .simulateCareerTwin(selectedCareerId, {
        weekly_hours: weeklyHours,
        target_timeline_months: timelineMonths,
        priority_mode: priorityMode,
      })
      .then((res) => {
        setSimulation(res);
        if (!selectedPathId || !res.paths.some((p) => p.id === selectedPathId)) {
          setSelectedPathId(res.selected_path_id || 'balanced');
        }
        setLoading(false);
        setUpdating(false);
      })
      .catch((err) => {
        console.error('Career Twin simulation error:', err);
        setLoading(false);
        setUpdating(false);
      });
  }, [selectedCareerId, weeklyHours, timelineMonths, priorityMode]);

  // Handle career change
  const handleCareerChange = (id: string) => {
    setSelectedCareerId(id);
    setSearchParams({ target: id });
    setIsChangingCareer(false);
    setAiResponse(null);
  };

  // Ask AI
  const handleAskAi = (questionText: string) => {
    if (!questionText.trim() || !simulation) return;
    setAiLoading(true);
    setAiQuestion(questionText);

    api
      .explainCareerTwin(selectedCareerId, questionText, {
        selected_path_id: selectedPathId,
        weekly_hours: weeklyHours,
      })
      .then((res) => {
        setAiResponse(res.explanation);
        setAiTakeaways(res.key_takeaways || []);
        setAiLoading(false);
      })
      .catch(() => {
        setAiResponse(
          `Career Twin recommends this path for ${simulation.target_career_title} because it sequences prerequisite foundations before specialized competencies, keeping cognitive load manageable at ${weeklyHours} hrs/week.`
        );
        setAiLoading(false);
      });
  };

  const activePath = useMemo(() => {
    if (!simulation) return null;
    return simulation.paths.find((p) => p.id === selectedPathId) || simulation.paths[0];
  }, [simulation, selectedPathId]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 font-sans">
      {/* Loading Skeleton */}
      {loading || !simulation ? (
        <div className="space-y-6">
          <CardSkeleton className="h-44" />
          <CardSkeleton className="h-48" />
          <CardSkeleton className="h-36" />
        </div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* SECTION 1 — TRANSITION HERO */}
          {/* ========================================================================= */}
          <section className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-[#E2E8F0]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4338CA]">
                    Career Twin
                  </span>
                  {updating && (
                    <span className="flex items-center gap-1 text-[11px] text-[#4338CA] font-medium animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" /> Updating...
                    </span>
                  )}
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-[#0F172A] leading-snug">
                  Your personalized transition from{' '}
                  <span className="text-[#475569]">{simulation.current_career_title}</span>{' '}
                  <ArrowRight className="w-4 h-4 inline text-[#4338CA] mx-1" />{' '}
                  <span className="text-[#4338CA]">{simulation.target_career_title}</span>
                </h1>
              </div>

              {/* Change Career Action */}
              <div className="relative shrink-0">
                {isChangingCareer ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedCareerId}
                      onChange={(e) => handleCareerChange(e.target.value)}
                      className="p-2 text-xs font-semibold rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] shadow-xs focus:ring-2 focus:ring-[#4338CA] focus:outline-none"
                      autoFocus
                    >
                      {careers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setIsChangingCareer(false)}
                      className="text-xs text-[#64748B] hover:text-[#0F172A] px-2 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsChangingCareer(true)}
                    className="text-xs text-[#475569] hover:text-[#0F172A]"
                  >
                    <Briefcase className="w-3.5 h-3.5 mr-1.5 text-[#4338CA]" />
                    <span>Change Target Role</span>
                  </Button>
                )}
              </div>
            </div>

            {/* ONLY 3 KEY METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* 1. Readiness */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 flex flex-col justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                  Readiness Jump
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#475569] font-mono">
                    {Math.round(simulation.current_readiness)}%
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#4338CA]" />
                  <span className="text-xl sm:text-2xl font-extrabold text-[#4338CA] font-mono">
                    <AnimatedNumber
                      value={Math.round(activePath?.target_readiness || simulation.target_readiness)}
                      suffix="%"
                    />
                  </span>
                </div>
                <div className="mt-2">
                  <AnimatedProgress
                    value={activePath?.target_readiness || simulation.target_readiness}
                    className="h-1.5"
                  />
                </div>
              </div>

              {/* 2. Skill Match */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 flex flex-col justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                  Skill Match
                </span>
                <div className="mt-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#15803D] font-mono">
                    <AnimatedNumber value={simulation.skill_overlap_percentage} suffix="%" />
                  </span>
                </div>
                <span className="text-xs text-[#64748B] mt-2">
                  {simulation.transferable_skills.length} transferable competencies
                </span>
              </div>

              {/* 3. Estimated Time */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 flex flex-col justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                  Estimated Time
                </span>
                <div className="mt-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#0F172A] font-mono">
                    <AnimatedNumber value={activePath?.estimated_weeks || 9} /> weeks
                  </span>
                </div>
                <span className="text-xs text-[#64748B] mt-2">
                  at {weeklyHours} hours per week
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <Link to="/roadmap" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full sm:w-auto justify-center text-sm font-semibold">
                  <span>Use Recommended Path</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <span className="text-xs text-[#64748B]">
                Applies sequence to your personalized learning roadmap
              </span>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 2 — STUDY AVAILABILITY (SIMPLIFIED WHAT-IF) */}
          {/* ========================================================================= */}
          <section className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
              <div>
                <h2 className="text-sm font-bold text-[#0F172A]">
                  How much time can you study each week?
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Adjusting your study time instantly recalculates your transition timeline.
                </p>
              </div>

              {/* Study Hours Selector (Min 44px Touch Targets) */}
              <div className="flex items-center gap-1.5 bg-[#F8FAFC] p-1.5 rounded-lg border border-[#E2E8F0]">
                {[2, 4, 6, 8, 10, 12].map((hrs) => (
                  <button
                    key={hrs}
                    onClick={() => setWeeklyHours(hrs)}
                    className={`min-w-[44px] min-h-[36px] px-2.5 py-1.5 rounded-md font-mono text-xs font-semibold transition-all cursor-pointer ${
                      weeklyHours === hrs
                        ? 'bg-[#4338CA] text-white shadow-xs'
                        : 'text-[#475569] hover:bg-white hover:text-[#0F172A]'
                    }`}
                    aria-label={`${hrs} study hours per week`}
                  >
                    {hrs}h
                  </button>
                ))}
              </div>
            </div>

            {/* Immediate Recalculation Sentence */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-[#E2E8F0] text-xs">
              <div className="text-[#0F172A] font-medium">
                With <strong className="text-[#4338CA]">{weeklyHours} hrs/week</strong>: Estimated completion in{' '}
                <strong className="text-[#0F172A]">{activePath?.estimated_weeks} weeks</strong> (~
                {simulation.total_estimated_effort_hours} study hours total).
              </div>

              <button
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                className="text-xs font-semibold text-[#4338CA] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showAdvancedSettings ? 'Hide advanced settings' : 'Advanced scenario settings'}</span>
                {showAdvancedSettings ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Advanced Settings Drawer */}
            <AnimatePresence>
              {showAdvancedSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 pt-4 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
                >
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1.5">
                      Target Completion Horizon
                    </label>
                    <div className="flex items-center gap-2">
                      {[3, 6, 9, 12].map((mos) => (
                        <button
                          key={mos}
                          onClick={() => setTimelineMonths(mos)}
                          className={`px-3 py-1.5 rounded-md border text-xs font-semibold transition-all ${
                            timelineMonths === mos
                              ? 'bg-[#0F172A] border-[#0F172A] text-white'
                              : 'bg-white border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          {mos} Months
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1.5">
                      Optimization Strategy Priority
                    </label>
                    <div className="flex items-center gap-2">
                      {(['FASTEST', 'BALANCED', 'PORTFOLIO'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => {
                            setPriorityMode(mode);
                            setSelectedPathId(mode.toLowerCase());
                          }}
                          className={`px-3 py-1.5 rounded-md border text-xs font-semibold transition-all ${
                            priorityMode === mode
                              ? 'bg-[#4338CA] border-[#4338CA] text-white'
                              : 'bg-white border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          {mode === 'FASTEST' ? 'Fastest' : mode === 'BALANCED' ? 'Balanced' : 'Portfolio'}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 3 — RECOMMENDED PATH (PRIMARY DECISION FOCUS) */}
          {/* ========================================================================= */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#15803D]">
                  RECOMMENDED FOR YOU
                </span>
                <h2 className="text-base font-bold text-[#0F172A]">
                  Your Recommended Transition Approach
                </h2>
              </div>

              <button
                onClick={() => setShowPathComparison(!showPathComparison)}
                className="text-xs font-semibold text-[#4338CA] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{showPathComparison ? 'Hide alternatives' : 'Compare other approaches'}</span>
                {showPathComparison ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* MAIN FOCUSED STRATEGY CARD */}
            {activePath && (
              <div
                className="bg-white border-2 border-[#4338CA] rounded-xl p-5 sm:p-6 shadow-sm bg-gradient-to-br from-indigo-50/20 via-white to-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
                      <Check className="w-3.5 h-3.5" /> SELECTED
                    </span>
                    <h3 className="text-lg font-bold text-[#0F172A]">{activePath.name}</h3>
                  </div>

                  <div className="text-xs font-mono font-semibold text-[#475569]">
                    {activePath.estimated_weeks} weeks · {activePath.weekly_hours} hrs/week
                  </div>
                </div>

                <div className="text-xs text-[#0F172A] font-medium leading-relaxed mb-4">
                  {activePath.description}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 text-xs mb-5">
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Target Readiness</span>
                    <span className="text-sm font-bold font-mono text-[#15803D]">
                      {Math.round(activePath.target_readiness)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Duration</span>
                    <span className="text-sm font-bold font-mono text-[#0F172A]">
                      {activePath.estimated_weeks} weeks
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Key Competencies</span>
                    <span className="text-sm font-bold text-[#0F172A]">
                      {activePath.skills_count} Skills
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Projects Included</span>
                    <span className="text-sm font-bold text-[#4338CA] flex items-center gap-1">
                      <FolderGit2 className="w-3.5 h-3.5" />
                      {activePath.projects_count} Project{activePath.projects_count > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E2E8F0]">
                  <p className="text-xs text-[#64748B]">
                    Best balance of learning depth, practical projects, and completion velocity for your profile.
                  </p>

                  <Link to="/roadmap" className="w-full sm:w-auto">
                    <Button size="sm" variant="primary" className="w-full sm:w-auto justify-center text-xs font-semibold">
                      <span>Continue with this path</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* COLLAPSIBLE ALTERNATIVE PATH COMPARISON */}
            <AnimatePresence>
              {showPathComparison && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3 pt-2"
                >
                  <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                    Select an alternative transition strategy:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {simulation.paths.map((path) => {
                      const isSelected = selectedPathId === path.id;

                      return (
                        <div
                          key={path.id}
                          onClick={() => setSelectedPathId(path.id)}
                          className={`rounded-xl p-4 cursor-pointer transition-all duration-200 border-2 flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#4338CA] bg-[#EEF2FF]/20 shadow-md ring-2 ring-[#4338CA]/20'
                              : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              {isSelected ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4338CA] bg-[#EEF2FF] px-2 py-0.5 rounded-full">
                                  <Check className="w-3 h-3" /> SELECTED
                                </span>
                              ) : (
                                <span className="text-[11px] font-semibold text-[#64748B]">
                                  {path.id.toUpperCase()}
                                </span>
                              )}
                              <span className="text-xs font-mono font-bold text-[#475569]">
                                {path.estimated_weeks}w
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-[#0F172A] mb-1">{path.name}</h4>
                            <p className="text-xs text-[#475569] leading-relaxed mb-3">
                              {path.description}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                            <span className="font-semibold text-[#15803D]">
                              {Math.round(path.target_readiness)}% readiness
                            </span>
                            <span className="text-[#4338CA] font-medium">
                              {isSelected ? 'Active' : 'Choose path →'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 4 — YOUR NEXT BEST ACTION (HIGH VISUAL DOMINANCE) */}
          {/* ========================================================================= */}
          <section className="bg-white border-2 border-[#4338CA]/60 rounded-xl p-5 sm:p-6 shadow-sm bg-gradient-to-r from-indigo-50/20 via-white to-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4338CA]">
                YOUR NEXT BEST ACTION
              </span>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold font-mono text-[#15803D] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full">
                  HIGH IMPACT · {simulation.highest_leverage_action?.roi_score.toFixed(1)} / 10 Learning ROI
                </span>
                <button
                  onClick={() => setShowRoiDetails(!showRoiDetails)}
                  className="text-xs text-[#4338CA] hover:underline font-semibold cursor-pointer"
                >
                  Why?
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
              <div>
                <h3 className="text-lg font-extrabold text-[#0F172A]">
                  {simulation.highest_leverage_action?.skill_name || 'Core Foundations'}
                </h3>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed max-w-xl">
                  {simulation.highest_leverage_action?.why_it_matters} Completing this unlocks{' '}
                  <strong className="text-[#0F172A]">
                    {simulation.highest_leverage_action?.prerequisite_leverage} downstream competencies
                  </strong>{' '}
                  required for {simulation.target_career_title}.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-semibold text-[#64748B] block">Estimated Effort</span>
                <span className="text-base font-bold font-mono text-[#0F172A]">
                  {simulation.highest_leverage_action?.estimated_hours} hours
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-[#E2E8F0]">
              <Link to="/assessment" className="w-full sm:w-auto">
                <Button size="sm" variant="primary" className="w-full sm:w-auto justify-center text-xs font-semibold">
                  <span>Start Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
              <Link to="/roadmap" className="w-full sm:w-auto">
                <Button size="sm" variant="secondary" className="w-full sm:w-auto justify-center text-xs font-semibold">
                  <span>Add to My Path</span>
                </Button>
              </Link>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 5 — SIMPLIFIED TRANSITION SEQUENCE (4–6 KEY NODES) */}
          {/* ========================================================================= */}
          <section className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-[#0F172A]">
                  Key Transition Milestones
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  How your background naturally bridges into {simulation.target_career_title}.
                </p>
              </div>

              <button
                onClick={() => setShowFullSkillMap(!showFullSkillMap)}
                className="text-xs font-semibold text-[#4338CA] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{showFullSkillMap ? 'Hide full map' : 'Explore full skill map'}</span>
                {showFullSkillMap ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Clean Linear Stepped Transition (4–6 Key Nodes) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              {/* Step 1: Current Mastered Foundations */}
              <div className="p-3 rounded-lg border border-[#A7F3D0] bg-[#F0FDF4] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#15803D] flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> CURRENT SKILLS
                  </span>
                  <div className="font-bold text-xs text-[#166534]">
                    {simulation.transferable_skills.slice(0, 2).map((s) => s.name).join(' & ') || 'Core Programming'}
                  </div>
                </div>
                <span className="text-[11px] text-[#15803D] mt-2 font-medium">✓ Mastered Base</span>
              </div>

              {/* Step 2: Next Key Unlock */}
              <div className="p-3 rounded-lg border-2 border-[#4338CA] bg-[#EEF2FF]/40 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#4338CA] flex items-center gap-1 mb-1">
                    <Zap className="w-3.5 h-3.5" /> NEXT UNLOCK
                  </span>
                  <div className="font-bold text-xs text-[#0F172A]">
                    {simulation.highest_leverage_action?.skill_name || 'Model Evaluation'}
                  </div>
                </div>
                <span className="text-[11px] text-[#4338CA] mt-2 font-semibold">→ Start Here</span>
              </div>

              {/* Step 3: Key Target Core Competency */}
              <div className="p-3 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#B45309] flex items-center gap-1 mb-1">
                    <Clock className="w-3.5 h-3.5" /> CRITICAL GAP
                  </span>
                  <div className="font-bold text-xs text-[#92400E]">
                    {simulation.missing_skills[1]?.name || 'Specialized Workflows'}
                  </div>
                </div>
                <span className="text-[11px] text-[#B45309] mt-2 font-medium">Unlocks Next</span>
              </div>

              {/* Step 4: Target Role Readiness */}
              <div className="p-3 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#0F172A] flex items-center gap-1 mb-1">
                    <Target className="w-3.5 h-3.5 text-[#4338CA]" /> TARGET GOAL
                  </span>
                  <div className="font-bold text-xs text-[#0F172A]">
                    {simulation.target_career_title}
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#15803D] mt-2">
                  {Math.round(activePath?.target_readiness || simulation.target_readiness)}% Ready
                </span>
              </div>
            </div>

            {/* Collapsible Complete Transition Map Details */}
            <AnimatePresence>
              {showFullSkillMap && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-5 pt-4 border-t border-[#E2E8F0] space-y-3"
                >
                  <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                    All Required Competencies for {simulation.target_career_title}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                    {simulation.transition_graph_nodes.map((node) => {
                      const isMastered = node.status === 'MASTERED';
                      const isBlocked = node.status === 'BLOCKED';
                      const isUnlocked = node.status === 'NEWLY_UNLOCKED';

                      return (
                        <div
                          key={node.skill_id}
                          className={`p-2.5 rounded-lg border ${
                            isMastered
                              ? 'bg-[#F0FDF4] border-[#A7F3D0] text-[#166534]'
                              : isUnlocked
                              ? 'bg-[#EEF2FF] border-[#C7D2FE] text-[#3730A3]'
                              : isBlocked
                              ? 'bg-[#FFF1F2] border-[#FECDD3] text-[#9F1239]'
                              : 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
                          }`}
                        >
                          <div className="font-bold text-xs">{node.name}</div>
                          <div className="text-[10px] opacity-80 mt-1 flex items-center justify-between">
                            <span>{node.status.replace('_', ' ')}</span>
                            {node.unlocks && node.unlocks.length > 0 && (
                              <span>Unlocks {node.unlocks.length}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 6 — PROGRESSIVE DISCLOSURE (REASONING & ROI DEEP DIVES) */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            {/* 1. Human AI Explanation Accordion */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={() => setShowAiReasoning(!showAiReasoning)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#4338CA]" />
                  <span className="text-sm font-bold text-[#0F172A]">Why this path?</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-[#4338CA]">
                  <span>{showAiReasoning ? 'Hide explanation' : 'Show reasoning'}</span>
                  {showAiReasoning ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </button>

              <AnimatePresence>
                {showAiReasoning && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-5 pt-1 border-t border-[#E2E8F0] space-y-4 text-xs"
                  >
                    <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-4 leading-relaxed text-[#0F172A]">
                      {aiLoading ? (
                        <div className="flex items-center gap-2 text-[#64748B]">
                          <Loader2 className="w-4 h-4 animate-spin text-[#4338CA]" />
                          <span>Consulting career knowledge base...</span>
                        </div>
                      ) : (
                        <>
                          <p className="font-medium leading-relaxed mb-2">
                            {aiResponse || simulation.ai_explanation}
                          </p>
                          {aiTakeaways.length > 0 && (
                            <ul className="list-disc list-inside space-y-1 text-[#475569] mt-2 pt-2 border-t border-[#E2E8F0]">
                              {aiTakeaways.map((t, idx) => (
                                <li key={idx}>{t}</li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-[#64748B] block mb-2">
                        Common Transition Questions:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Why should I choose this path?',
                          'What happens if I reduce my study time?',
                          'Why is this skill missing?',
                          'Can I reach this career faster?',
                        ].map((q, idx) => (
                          <button
                            key={idx}
                            disabled={aiLoading}
                            onClick={() => handleAskAi(q)}
                            className="px-3 py-1.5 rounded-full border border-[#CBD5E1] bg-white text-xs font-medium text-[#475569] hover:border-[#4338CA] hover:text-[#4338CA] hover:bg-[#EEF2FF]/30 transition-all cursor-pointer"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Transparent Learning ROI Details Accordion */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={() => setShowRoiDetails(!showRoiDetails)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-[#15803D]" />
                  <span className="text-sm font-bold text-[#0F172A]">Learning ROI & Prioritization Logic</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-[#4338CA]">
                  <span>{showRoiDetails ? 'Hide details' : 'View rankings'}</span>
                  {showRoiDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </button>

              <AnimatePresence>
                {showRoiDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-5 pt-1 border-t border-[#E2E8F0] space-y-3 text-xs"
                  >
                    <p className="text-[#64748B] text-xs">
                      PathFinder Learning ROI evaluates: <code className="text-[#0F172A] font-mono bg-slate-100 px-1 py-0.5 rounded">(readiness impact × prerequisite leverage × relevance) / estimated time</code>.
                    </p>

                    <div className="space-y-2 mt-3">
                      {simulation.learning_roi_recommendations.map((item, idx) => (
                        <div
                          key={item.skill_id}
                          className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-[#0F172A]">{item.skill_name}</div>
                            <div className="text-[11px] text-[#64748B]">{item.why_it_matters}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono font-bold text-[#15803D] text-xs">
                              ROI {item.roi_score.toFixed(1)} / 10
                            </span>
                            <span className="block text-[10px] text-[#64748B] font-mono">
                              {item.estimated_hours}h effort
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default CareerTwinPage;
