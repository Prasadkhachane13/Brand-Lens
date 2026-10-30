import React, { useState } from 'react';
import { Shield, ArrowRight, UserCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBrandLens } from '../lib/store';
import { SEED_USERS } from '../lib/seedData';
import { User } from '../lib/types';

export const LoginView: React.FC = () => {
  const { setCurrentUser, setActiveTab } = useBrandLens();
  const [emailInput, setEmailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'CREATOR':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'REVIEWER':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'BRAND_ADMIN':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'VIEWER':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'CREATOR':
        return 'Author copy, manage drafts, and resolve findings.';
      case 'REVIEWER':
        return 'Inspect collateral, request changes, and issue Stage 1 approvals.';
      case 'BRAND_ADMIN':
        return 'Configure Brand Kit guidelines, grant final approvals, and publish.';
      case 'VIEWER':
        return 'Read-only visibility for approved & published collateral.';
      default:
        return '';
    }
  };

  const executeLogin = async (email: string, userObj?: User) => {
    setErrorMsg(null);
    setLoadingEmail(email);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      // Set cookie in browser
      document.cookie = `user_id=${data.user.id}; path=/; max-age=86400`;

      // Find local user or construct from server response
      const matched = userObj || SEED_USERS.find((u) => u.id === data.user.id || u.email === data.user.email) || data.user;
      setCurrentUser(matched);

      // Redirect to dashboard
      setActiveTab('dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to connect to authentication server');
    } finally {
      setLoadingEmail(null);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMsg('Please enter an authorized email address.');
      return;
    }
    executeLogin(emailInput.trim());
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8 bg-[#101726] border border-[#1E293B] rounded-2xl p-8 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0F172A] border border-blue-500/40 p-1 flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-10-29_at_4.30.14_PM_2ad5aa9c.jpeg"
              alt="BrandLens Logo"
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight font-sans">
            BrandLens Sign In
          </h2>
          <p className="text-xs font-semibold tracking-wider text-cyan-400 font-sans uppercase">
            One Brand, One Voice
          </p>
          <p className="text-xs text-slate-400">
            Sign in to access pre-publication brand governance & compliance
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Standard Email Input Form */}
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="e.g. ada@northwind.test"
              className="w-full bg-[#0B111E] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loadingEmail !== null}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{loadingEmail === emailInput ? 'Authenticating...' : 'Sign In with Email'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1E293B]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-[#101726] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              Or Quick Sign-In (RBAC Personas)
            </span>
          </div>
        </div>

        {/* 4 Clickable Quick-Login Persona Cards */}
        <div className="space-y-2.5">
          {SEED_USERS.map((user) => {
            const isLoading = loadingEmail === user.email;
            return (
              <button
                key={user.id}
                type="button"
                onClick={() => executeLogin(user.email, user)}
                disabled={loadingEmail !== null}
                className="w-full p-3 bg-[#0B111E] hover:bg-[#131B2A] border border-[#1E293B] hover:border-blue-500/60 rounded-xl transition-all cursor-pointer text-left flex items-center justify-between group disabled:opacity-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600 shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name[0]
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                        {user.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{getRoleDescription(user.role)}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${getRoleBadgeStyle(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                  <span className="text-[10px] text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center space-x-0.5">
                    <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
