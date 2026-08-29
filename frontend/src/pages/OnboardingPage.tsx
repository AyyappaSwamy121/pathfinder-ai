import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useLearner } from '../context/LearnerContext';
import { ProfileExtractResponse } from '../types';
import { ArrowRight, CheckCircle2, Loader2, Edit3, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-8 bg-[var(--bg)]">
      <Card className="max-w-2xl w-full">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-6 mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-[var(--radius-sm)] flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-[var(--brand)] text-white' : 'bg-[var(--surface-sunken)] text-[var(--text-tertiary)]'}`}>1</div>
            <span className="text-xs font-semibold text-[var(--text-primary)]">Background Input</span>
          </div>
          <div className="w-12 h-0.5 bg-[var(--border)]" />
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-[var(--radius-sm)] flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-[var(--brand)] text-white' : 'bg-[var(--surface-sunken)] text-[var(--text-tertiary)]'}`}>2</div>
            <span className="text-xs font-semibold text-[var(--text-primary)]">Confirm Profile</span>
          </div>
          <div className="w-12 h-0.5 bg-[var(--border)]" />
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-[var(--radius-sm)] flex items-center justify-center font-bold text-xs ${step >= 3 ? 'bg-[var(--brand)] text-white' : 'bg-[var(--surface-sunken)] text-[var(--text-tertiary)]'}`}>3</div>
            <span className="text-xs font-semibold text-[var(--text-primary)]">Build Path</span>
          </div>
        </div>

        {/* Step 1: Input */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <div className="mb-3">
                <Badge tone="brand">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  NLP PROFILE PARSER
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Tell us about your background & career goals
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Describe your current experience, skills you already know, target role, and time budget.
              </p>
            </div>

            <div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={5}
                placeholder="Tell us where you are, what you know, and where you want to go..."
                className="w-full p-4 rounded-[var(--radius-sm)] border border-[var(--border-strong)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)] leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <Button
                size="md"
                variant="primary"
                disabled={analyzing || !inputText.trim()}
                onClick={handleAnalyze}
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
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Confirm Profile */}
        {step === 2 && extracted && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>Confirm Learner Profile</span>
                <Edit3 className="w-4 h-4 text-[var(--brand)]" />
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Review extracted specifications before building your custom roadmap.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Target Career Role</label>
                <select
                  value={targetCareerId}
                  onChange={(e) => setTargetCareerId(e.target.value)}
                  className="w-full p-2.5 rounded-[var(--radius-sm)] border border-[var(--border-strong)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)] bg-[var(--surface)]"
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
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Experience Level</label>
                <select
                  value={expLevel}
                  onChange={(e) => setExpLevel(e.target.value)}
                  className="w-full p-2.5 rounded-[var(--radius-sm)] border border-[var(--border-strong)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)] bg-[var(--surface)]"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Weekly Time Budget (Hours)</label>
                <input
                  type="number"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full p-2.5 rounded-[var(--radius-sm)] border border-[var(--border-strong)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Learning Format Preference</label>
                <select
                  value={preference}
                  onChange={(e) => setPreference(e.target.value)}
                  className="w-full p-2.5 rounded-[var(--radius-sm)] border border-[var(--border-strong)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)] bg-[var(--surface)]"
                >
                  <option value="Project Based">Project Based</option>
                  <option value="Video">Video Courses</option>
                  <option value="Reading">Reading & Documentation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Detected Existing Skills</label>
              <div className="flex flex-wrap gap-2">
                {extracted.skills.map((s, idx) => (
                  <Badge key={idx} tone="brand">
                    {s.name} ({s.level})
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[var(--border)]">
              <Button size="sm" variant="ghost" onClick={() => setStep(1)}>
                Back to Edit
              </Button>
              <Button size="md" variant="primary" onClick={handleBuildPath}>
                <span>Generate My Path</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Build State */}
        {step === 3 && (
          <div className="py-8 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--brand-soft)] text-[var(--brand)] mb-1">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>

            <h3 className="text-base font-bold text-[var(--text-primary)]">Building Your Custom Learning Path</h3>

            <div className="max-w-md mx-auto space-y-2 text-left text-xs font-medium">
              <div className={`flex items-center justify-between p-3 rounded-[var(--radius-sm)] border ${buildProgress >= 1 ? 'bg-[var(--success-soft)] text-[var(--success)] border-[var(--success)]' : 'bg-[var(--surface-sunken)] text-[var(--text-secondary)] border-[var(--border)]'}`}>
                <span>Understanding learner profile</span>
                {buildProgress >= 1 ? <CheckCircle2 className="w-4 h-4 text-[var(--success)]" /> : <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              <div className={`flex items-center justify-between p-3 rounded-[var(--radius-sm)] border ${buildProgress >= 2 ? 'bg-[var(--success-soft)] text-[var(--success)] border-[var(--success)]' : 'bg-[var(--surface-sunken)] text-[var(--text-secondary)] border-[var(--border)]'}`}>
                <span>Mapping target career & skill requirements</span>
                {buildProgress >= 2 ? <CheckCircle2 className="w-4 h-4 text-[var(--success)]" /> : <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              <div className={`flex items-center justify-between p-3 rounded-[var(--radius-sm)] border ${buildProgress >= 3 ? 'bg-[var(--success-soft)] text-[var(--success)] border-[var(--success)]' : 'bg-[var(--surface-sunken)] text-[var(--text-secondary)] border-[var(--border)]'}`}>
                <span>Identifying skill gaps & prerequisite graph</span>
                {buildProgress >= 3 ? <CheckCircle2 className="w-4 h-4 text-[var(--success)]" /> : <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              <div className={`flex items-center justify-between p-3 rounded-[var(--radius-sm)] border ${buildProgress >= 4 ? 'bg-[var(--success-soft)] text-[var(--success)] border-[var(--success)]' : 'bg-[var(--surface-sunken)] text-[var(--text-secondary)] border-[var(--border)]'}`}>
                <span>Topological ordering & resource selection</span>
                {buildProgress >= 4 ? <CheckCircle2 className="w-4 h-4 text-[var(--success)]" /> : <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              <div className={`flex items-center justify-between p-3 rounded-[var(--radius-sm)] border ${buildProgress >= 5 ? 'bg-[var(--success-soft)] text-[var(--success)] border-[var(--success)]' : 'bg-[var(--surface-sunken)] text-[var(--text-secondary)] border-[var(--border)]'}`}>
                <span>Path ready! Redirecting to workspace...</span>
                {buildProgress >= 5 ? <CheckCircle2 className="w-4 h-4 text-[var(--success)]" /> : <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
