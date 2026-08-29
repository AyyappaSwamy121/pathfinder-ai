import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useLearner } from '../context/LearnerContext';
import { ProfileExtractResponse } from '../types';
import { ArrowRight, CheckCircle2, Loader2, Edit3, ShieldCheck } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshState } = useLearner();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [inputText, setInputText] = useState<string>(
    "I'm a CSE student with Python and SQL experience. I have done two ML projects and want to become an AI Engineer within six months spending 8 hours a week."
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [extracted, setExtracted] = useState<ProfileExtractResponse | null>(null);

  // Editable Step 2 states
  const [targetCareerId, setTargetCareerId] = useState('c_ai_engineer');
  const [expLevel, setExpLevel] = useState('Intermediate');
  const [weeklyHours, setWeeklyHours] = useState(8);
  const [timelineMonths, setTimelineMonths] = useState(6);
  const [preference, setPreference] = useState('Project Based');

  // Step 3 animation state
  const [buildProgress, setBuildProgress] = useState(0);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    try {
      setAnalyzing(true);
      const res = await api.analyzeProfile(inputText);
      setExtracted(res);
      if (res.target_role === 'Data Scientist') setTargetCareerId('c_data_scientist');
      else if (res.target_role === 'Full Stack Developer') setTargetCareerId('c_fullstack_dev');
      else if (res.target_role === 'Data Analyst') setTargetCareerId('c_data_analyst');
      else if (res.target_role === 'Cloud Engineer') setTargetCareerId('c_cloud_engineer');
      else if (res.target_role === 'Cybersecurity Engineer') setTargetCareerId('c_cybersecurity');
      else setTargetCareerId('c_ai_engineer');

      setWeeklyHours(res.weekly_hours || 8);
      setPreference(res.learning_preference || 'Project Based');
      setStep(2);
    } catch (err) {
      console.error('NLP Profile Extraction error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleBuildPath = async () => {
    setStep(3);
    setBuildProgress(1);

    setTimeout(() => setBuildProgress(2), 600);
    setTimeout(() => setBuildProgress(3), 1200);
    setTimeout(() => setBuildProgress(4), 1800);
    setTimeout(async () => {
      setBuildProgress(5);
      await api.updateProfile({
        target_career_id: targetCareerId,
        experience_level: expLevel,
        weekly_hours: weeklyHours,
        timeline_months: timelineMonths,
        learning_preference: preference,
        skills: extracted?.skills || [{ name: 'Python Programming', level: 'Intermediate' }],
      });
      await refreshState();
      setTimeout(() => navigate('/dashboard'), 800);
    }, 2400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-background">
      <div className="max-w-2xl w-full bg-surface border border-slate-200 rounded-lg p-8 shadow-card">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-8">
          <div className="flex items-center space-x-2">
            <div className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>1</div>
            <span className="text-xs font-semibold text-slate-800">Background Input</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200" />
          <div className="flex items-center space-x-2">
            <div className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>2</div>
            <span className="text-xs font-semibold text-slate-800">Confirm Profile</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200" />
          <div className="flex items-center space-x-2">
            <div className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs ${step >= 3 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>3</div>
            <span className="text-xs font-semibold text-slate-800">Build Path</span>
          </div>
        </div>

        {/* Step 1: Input */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-primary-soft text-primary text-[11px] font-bold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Layer 1: NLP Profile Parser</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Tell us about your background & career goals
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Describe your current experience, skills you already know, target role, and time budget.
              </p>
            </div>

            <div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={5}
                placeholder="Tell us where you are, what you know, and where you want to go..."
                className="w-full p-4 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary focus:outline-none text-xs text-slate-900 leading-relaxed font-sans"
              />
            </div>

            <div className="flex justify-end">
              <button
                disabled={analyzing || !inputText.trim()}
                onClick={handleAnalyze}
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2.5 rounded-md text-xs transition-colors flex items-center space-x-2 shadow-subtle disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Extract Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Confirm Profile */}
        {step === 2 && extracted && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                <span>Confirm Learner Profile</span>
                <Edit3 className="w-4 h-4 text-primary" />
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Review extracted specifications before building your custom roadmap.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Target Career Role</label>
                <select
                  value={targetCareerId}
                  onChange={(e) => setTargetCareerId(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-primary focus:outline-none bg-surface"
                >
                  <option value="c_ai_engineer">AI Engineer</option>
                  <option value="c_data_scientist">Data Scientist</option>
                  <option value="c_fullstack_dev">Full Stack Developer</option>
                  <option value="c_data_analyst">Data Analyst</option>
                  <option value="c_cloud_engineer">Cloud Engineer</option>
                  <option value="c_cybersecurity">Cybersecurity Engineer</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Experience Level</label>
                <select
                  value={expLevel}
                  onChange={(e) => setExpLevel(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-primary focus:outline-none bg-surface"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Weekly Time Budget (Hours)</label>
                <input
                  type="number"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full p-2.5 rounded-md border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Learning Format Preference</label>
                <select
                  value={preference}
                  onChange={(e) => setPreference(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-primary focus:outline-none bg-surface"
                >
                  <option value="Project Based">Project Based</option>
                  <option value="Video">Video Courses</option>
                  <option value="Reading">Reading & Documentation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-2">Detected Existing Skills</label>
              <div className="flex flex-wrap gap-2">
                {extracted.skills.map((s, idx) => (
                  <span key={idx} className="bg-primary-soft text-primary px-2.5 py-1 rounded text-xs font-semibold border border-primary/10">
                    {s.name} ({s.level})
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Back to Edit
              </button>
              <button
                onClick={handleBuildPath}
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2.5 rounded-md text-xs transition-colors flex items-center space-x-2 shadow-subtle"
              >
                <span>Generate My Path</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Build State */}
        {step === 3 && (
          <div className="py-8 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-primary-soft text-primary mb-1">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Building Your Custom Learning Path</h3>

            <div className="max-w-md mx-auto space-y-2.5 text-left text-xs font-medium">
              <div className={`flex items-center justify-between p-3 rounded-md border ${buildProgress >= 1 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                <span>Understanding learner profile</span>
                {buildProgress >= 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              <div className={`flex items-center justify-between p-3 rounded-md border ${buildProgress >= 2 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                <span>Mapping target career & skill requirements</span>
                {buildProgress >= 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              <div className={`flex items-center justify-between p-3 rounded-lg border ${buildProgress >= 3 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                <span>Identifying skill gaps & prerequisite graph</span>
                {buildProgress >= 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              <div className={`flex items-center justify-between p-3 rounded-md border ${buildProgress >= 4 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                <span>Topological ordering & resource selection</span>
                {buildProgress >= 4 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              <div className={`flex items-center justify-between p-3 rounded-md border ${buildProgress >= 5 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                <span>Path ready! Redirecting to workspace...</span>
                {buildProgress >= 5 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
