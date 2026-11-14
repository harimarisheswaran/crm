import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { Mail, ArrowLeft, CheckCircle2, School } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { success } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    success(`Reset instructions dispatched to ${email}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card rounded-3xl border border-slate-200/80">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-3">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-navy-900">Reset Your Password</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered school email address and we'll send a password recovery token.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>If an account exists for {email}, a recovery link has been generated.</span>
              </div>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                required
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@oakridge.edu"
              />

              <Button type="submit" variant="primary" size="lg" className="w-full">
                Send Recovery Link
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

