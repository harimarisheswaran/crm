import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, ROLE_DEFINITIONS } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import {
  School,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle2,
} from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login, allDemoProfiles, switchRole } = useAuth();
  const { school } = useData();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState('admin@oakridge.edu');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState('school_admin');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const profile = await login(email, password);
      const roleDef = ROLE_DEFINITIONS[profile.role];
      success(`Welcome back, ${profile.full_name}! Signed in as ${roleDef.label}.`);
      navigate(roleDef.defaultPath || '/admin/dashboard');
    } catch (err) {
      toastError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (profile) => {
    setEmail(profile.email);
    setPassword('password123');
    setSelectedDemoRole(profile.role);
    switchRole(profile.role);
    const roleDef = ROLE_DEFINITIONS[profile.role];
    success(`Quick login successful! Signed in as ${profile.full_name} (${roleDef.label})`);
    navigate(roleDef.defaultPath || '/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo and Brand */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-navy-900 to-brand-600 flex items-center justify-center text-white shadow-xl shadow-brand-500/20 mb-4">
          <School className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          EduPulse <span className="text-brand-600">ERP</span>
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          {school?.name || 'Oakridge International Academy'} • Enterprise School Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card rounded-3xl border border-slate-200/80">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Input
                label="Email Address"
                type="email"
                required
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@oakridge.edu"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </span>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                required
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                icon={ArrowRight}
                iconPosition="right"
                className="w-full shadow-lg shadow-brand-500/20"
              >
                Sign In to Portal
              </Button>
            </div>
          </form>

          {/* Quick Demo Role Switcher */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                Quick 1-Click Role Logins
              </span>
              <span className="text-[11px] text-slate-400">Click any role to test portal</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {allDemoProfiles.map((p) => {
                const roleDef = ROLE_DEFINITIONS[p.role] || {};
                const isSelected = selectedDemoRole === p.role;
                return (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => handleQuickLogin(p)}
                    className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-semibold text-slate-800 truncate block">
                      {roleDef.label}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate mt-0.5">
                      {p.full_name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Security Badge Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secured with Supabase RLS & Role-Based Authorization</span>
        </div>
      </div>
    </div>
  );
};

