import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useLearner } from '../context/LearnerContext';
import { ProfileExtractResponse } from '../types';
import { Sparkles, ArrowRight, CheckCircle2, Loader2, Edit3, Clock, Target, BookOpen } from 'lucide-react';

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

    // Sequence progress
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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-surface border border-border rounded-2xl p-8 shadow-xl">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-border pb-6 mb-8">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-100 text-text-muted'}`}>1</div>
            <span className="text-xs font-semibold text-text-main">Tell Us</span>
          </div>
          <div className="w-12 h-0.5 bg-border" />
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-100 text-text-muted'}`}>2</div>
            <span className="text-xs font-semibold text-text-main">Confirm Profile</span>
          </div>
          <div className="w-12 h-0.5 bg-border" />
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-100 text-text-muted'}`}>3</div>
            <span className="text-xs font-semibold text-text-main">Build Path</span>
          </div>
        </div>

        {/* Step 1: Input */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Profile Parsing Engine</span>
              </div>
              <h2 className="text-2xl font-extrabold text-text-main tracking-tight">
                Tell us about yourself & your career goal
              </h2>
              <p className="text-xs text-text-muted mt-1">
                Describe your current background, skills you already know, target job role, available weekly hours, and timeline.
              </p>
            </div>

            <div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={5}
                placeholder="Tell us where you are, what you know, and where you want to go..."
                className="w-full p-4 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                disabled={analyzing || !inputText.trim()}
                onClick={handleAnalyze}
                className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl text-sm transition-all flex items-center space-x-2 shadow-sm"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting Profile...</span>
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
              <h2 className="text-2xl font-extrabold text-text-main tracking-tight flex items-center space-x-2">
                <span>Confirm your learner profile</span>
                <Edit3 className="w-5 h-5 text-primary" />
              </h2>
              <p className="text-xs text-text-muted mt-1">
                Review AI-extracted information. You can edit any parameter before building your path.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Target Career Role</label>
                <select
                  value={targetCareerId}
                  onChange={(e) => setTargetCareerId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border text-xs font-semibold text-text-main focus:ring-2 focus:ring-primary focus:outline-none"
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
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Experience Level</label>
                <select
                  value={expLevel}
                  onChange={(e) => setExpLevel(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border text-xs font-semibold text-text-main focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Weekly Time (Hours)</label>
                <input
                  type="number"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-border text-xs font-semibold text-text-main focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Learning Preference</label>
                <select
                  value={preference}
                  onChange={(e) => setPreference(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border text-xs font-semibold text-text-main focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="Project Based">Project Based</option>
                  <option value="Video">Video Courses</option>
                  <option value="Reading">Reading & Documentation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-2">Detected Current Skills</label>
              <div className="flex flex-wrap gap-2">
                {extracted.skills.map((s, idx) => (
                  <span key={idx} className="bg-primary-soft text-primary px-3 py-1 rounded-lg text-xs font-semibold border border-primary/20">
                    {s.name} ({s.level})
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-text-muted hover:text-text-main"
              >
                Back to Edit Prompt
              </button>
              <button
                onClick={handleBuildPath}
                className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl text-sm transition-all flex items-center space-x-2 shadow-sm"
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-soft text-primary mb-2">
              <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
            </div>

            <h3 className="text-xl font-extrabold text-text-main">Building Your Custom Learning Path</h3>

            <div className="max-w-md mx-auto space-y-3 text-left text-xs font-medium">
              <div className={`flex items-center justify-between p-3 rounded-lg border ${buildProgress >= 1 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-gray-50 text-text-muted border-gray-200'}`}>
                <span>Understanding your profile</span>
                {buildProgress >= 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              <div className={`flex items-center justify-between p-3 rounded-lg border ${buildProgress >= 2 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-gray-50 text-text-muted border-gray-200'}`}>
                <span>Mapping target career & skill requirements</span>
                {buildProgress >= 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              <div className={`flex items-center justify-between p-3 rounded-lg border ${buildProgress >= 3 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-gray-50 text-text-muted border-gray-200'}`}>
                <span>Identifying skill gaps & prerequisite graph</span>
                {buildProgress >= 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              <div className={`flex items-center justify-between p-3 rounded-lg border ${buildProgress >= 4 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-gray-50 text-text-muted border-gray-200'}`}>
                <span>Topological ordering & resource selection</span>
                {buildProgress >= 4 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              <div className={`flex items-center justify-between p-3 rounded-lg border ${buildProgress >= 5 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-gray-50 text-text-muted border-gray-200'}`}>
                <span>Your path is ready! Redirecting...</span>
                {buildProgress >= 5 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
