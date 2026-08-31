import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Eye, EyeOff, Lock, Mail, School, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    college_name: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError('Please provide your first and last name.');
      return;
    }
    if (!formData.college_name.trim()) {
      setError('Please provide your college or university name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please provide a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await signup({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        college_name: formData.college_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      // New user goes to onboarding to build career path
      navigate('/onboarding', { replace: true });
    } catch (err: any) {
      setError(err.message || 'An error occurred during account creation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-[#0F172A]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#4338CA] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-[#0F172A] block leading-none">
                PATHFINDER
              </span>
              <span className="text-xs text-[#64748B] font-medium tracking-wide block mt-1">
                Career Intelligence Platform
              </span>
            </div>
          </Link>
        </div>
        <h2 className="mt-8 text-center text-2xl font-bold tracking-tight text-[#0F172A]">
          Create your career workspace
        </h2>
        <p className="mt-2 text-center text-sm text-[#475569]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#4338CA] hover:text-[#3730A3] transition-colors">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 border border-[#E2E8F0] rounded-xl shadow-xs">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3 text-sm text-[#B91C1C]">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="first_name"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Alex"
                    className="block w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Morgan"
                  className="block w-full px-3 py-2 text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                College / University
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                  <School className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="college_name"
                  required
                  value={formData.college_name}
                  onChange={handleChange}
                  placeholder="Stanford University / MIT / University of Washington"
                  className="block w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@stanford.edu"
                  className="block w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="•••••••• (min. 6 characters)"
                  className="block w-full pl-9 pr-10 py-2 text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#475569]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full justify-center py-2.5 bg-[#4338CA] hover:bg-[#3730A3] text-white font-medium shadow-xs"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E2E8F0] text-center">
            <p className="text-xs text-[#64748B]">
              By registering, you get a dedicated learner graph, AI copilot memory, and dynamic path recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
