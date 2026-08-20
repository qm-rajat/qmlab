import React, { useState } from 'react';
import { Shield, Info, Key } from 'lucide-react';

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid administrator credentials.');
      }
      setPassword('');
      onLoginSuccess();
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4 no-print">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary mx-auto flex items-center justify-center">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Admin CRM Console</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Please authorize with developer key credentials to manage your portfolio content and read enquiries.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <div className="space-y-1.5 text-left">
            <label htmlFor="admin-email-input" className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
              Console Email
            </label>
            <input
              id="admin-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@qmlabs.com"
              className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/30 focus:bg-white border border-slate-200 focus:border-primary focus:ring-4 focus:ring-blue-500/5 rounded-xl text-sm transition-all focus:outline-hidden text-slate-800"
              required
            />
          </div>

          <div className="space-y-1.5 font-sans text-left">
            <label htmlFor="admin-password-input" className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
              Access Password
            </label>
            <input
              id="admin-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/30 focus:bg-white border border-slate-200 focus:border-primary focus:ring-4 focus:ring-blue-500/5 rounded-xl text-sm transition-all focus:outline-hidden text-slate-800"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Key className="w-3.5 h-3.5" />
            {isLoggingIn ? 'Authorizing...' : 'Authorize Credentials'}
          </button>
        </form>
      </div>
    </div>
  );
};
