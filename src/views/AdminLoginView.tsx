import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import { loginAdmin } from '../lib/api.ts';
import { AdminUser } from '../types.ts';

interface AdminLoginViewProps {
  onLoginSuccess: (token: string, user: AdminUser) => void;
  onCancel: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await loginAdmin(email, password);
      localStorage.setItem('eventticket_admin_token', result.token);
      localStorage.setItem('eventticket_admin_user', JSON.stringify(result.user));
      onLoginSuccess(result.token, result.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@eventticket.com');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700/90 p-8 shadow-xl space-y-6">
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Admin Authentication
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            JWT Token Protected Control Center
          </p>
        </div>

        {/* Demo Helper Banner */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs space-y-2">
          <div className="flex items-center justify-between font-semibold text-indigo-900 dark:text-indigo-300">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Project Demo Credentials</span>
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-indigo-600 dark:text-indigo-400 underline font-bold hover:text-indigo-800 cursor-pointer"
            >
              Auto-Fill
            </button>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
            email: <strong>admin@eventticket.com</strong> • pass: <strong>admin123</strong>
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-login-email"
                type="email"
                required
                placeholder="admin@eventticket.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-login-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            id="admin-login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Verifying Token...</span>
            ) : (
              <>
                <span>Sign In to Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            ← Back to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
