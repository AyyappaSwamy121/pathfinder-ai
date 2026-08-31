import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearner } from '../context/LearnerContext';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, loadPresetProfile } = useLearner();

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Login Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberSession, setRememberSession] = useState(true);

  // Signup Form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isLogin) {
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Please enter both email and password.');
        return;
      }
      try {
        setLoading(true);
        await login(email, password);
        navigate('/dashboard');
      } catch (err: any) {
        setErrorMsg(err.message || 'Invalid credentials. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!firstName.trim() || !lastName.trim() || !collegeName.trim() || !email.trim() || !password.trim()) {
        setErrorMsg('Please fill in all required fields.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      try {
        setLoading(true);
        await signup({
          first_name: firstName,
          last_name: lastName,
          college_name: collegeName,
          email,
          password,
        });
        navigate('/onboarding');
      } catch (err: any) {
        setErrorMsg(err.message || 'Signup failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDemoPreset = async (preset: 'alex' | 'jordan' | 'devon') => {
    try {
      setLoading(true);
      await loadPresetProfile(preset);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-[#F8FAFC]">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
        {/* Brand Logo & Subtitle */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-[#4338CA] text-white font-extrabold text-sm mb-3">
            P
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            PATHFINDER
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Career Intelligence Platform
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 mb-6 text-xs font-semibold">
          <button
            onClick={() => {
              setIsLogin(true);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
              isLogin ? 'border-[#4338CA] text-[#4338CA] font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
              !isLogin ? 'border-[#4338CA] text-[#4338CA] font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Student Account
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Alex"
                    className="w-full p-2.5 rounded-md border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#4338CA] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Morgan"
                    className="w-full p-2.5 rounded-md border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#4338CA] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  College / Institution Name
                </label>
                <input
                  type="text"
                  required
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="Indian Institute of Technology / HCL Amplify"
                  className="w-full p-2.5 rounded-md border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#4338CA] focus:outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Student Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              className="w-full p-2.5 rounded-md border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#4338CA] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 pr-10 rounded-md border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#4338CA] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-md border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#4338CA] focus:outline-none"
              />
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-slate-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="rounded border-slate-300 text-[#4338CA] focus:ring-[#4338CA]"
                />
                <span>Remember session</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4338CA] hover:bg-[#3730A3] text-white font-semibold py-3 px-4 rounded-md text-xs transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 mt-4 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isLogin ? 'Signing in...' : 'Creating workspace...'}</span>
              </>
            ) : (
              <>
                <span>{isLogin ? 'Sign In to Workspace' : 'Create Student Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Evaluator Quick Presets */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
            HCL Judge Evaluator Quick Workspace Login
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoPreset('alex')}
              className="p-2 rounded bg-slate-50 border border-slate-200 hover:border-slate-300 text-[11px] text-slate-800 font-semibold transition-colors flex flex-col items-center text-center cursor-pointer"
            >
              <span>Alex</span>
              <span className="text-[9px] text-slate-500 font-normal">AI Engineer</span>
            </button>
            <button
              onClick={() => handleDemoPreset('jordan')}
              className="p-2 rounded bg-slate-50 border border-slate-200 hover:border-slate-300 text-[11px] text-slate-800 font-semibold transition-colors flex flex-col items-center text-center cursor-pointer"
            >
              <span>Jordan</span>
              <span className="text-[9px] text-slate-500 font-normal">Data Analyst</span>
            </button>
            <button
              onClick={() => handleDemoPreset('devon')}
              className="p-2 rounded bg-slate-50 border border-slate-200 hover:border-slate-300 text-[11px] text-slate-800 font-semibold transition-colors flex flex-col items-center text-center cursor-pointer"
            >
              <span>Devon</span>
              <span className="text-[9px] text-slate-500 font-normal">Full Stack</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
