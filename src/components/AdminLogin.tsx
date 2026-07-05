import React, { useState } from 'react';
import { ShieldAlert, KeyRound, User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
  setCurrentPage: (page: string) => void;
}

export default function AdminLogin({ onLoginSuccess, setCurrentPage }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Secure call to Express server, keeping credentials 100% server-side
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onLoginSuccess(data.token);
      } else {
        setError(data.error || 'Access denied. Please check your credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to security gateway failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 py-12 relative overflow-hidden" id="admin-login-container">
      
      {/* Decorative center glowing orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 relative z-10" id="admin-login-header">
        <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto shadow-lg shadow-pink-500/5 mb-4 animate-[bounce_2s_infinite]">
          <ShieldAlert className="w-6 h-6 text-pink-500" />
        </div>
        <h1 className="font-sans text-2xl font-black text-white tracking-tight">
          Admin Portal <span className="bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent">Gateway</span>
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          Enter credentials to authorize session
        </p>
      </div>

      {/* Login Card */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8 relative z-10" id="admin-login-card">
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs text-pink-400 font-semibold" id="login-error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
          <div className="space-y-1.5" id="login-username-group">
            <label className="text-[10px] font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <User className="w-3 h-3 text-pink-500" />
              <span>Username</span>
            </label>
            <input
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 focus:bg-white/10 text-white placeholder-slate-500 text-sm rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-pink-500 focus:outline-none transition-all"
              id="login-username-input"
            />
          </div>

          <div className="space-y-1.5" id="login-password-group">
            <label className="text-[10px] font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Lock className="w-3 h-3 text-pink-500" />
              <span>Security Key</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 focus:bg-white/10 text-white placeholder-slate-500 text-sm rounded-xl pl-3.5 pr-10 py-2.5 border border-white/10 focus:border-pink-500 focus:outline-none transition-all"
                id="login-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                id="toggle-password-visibility-btn"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-pink-900/20 transition-all disabled:opacity-50"
            id="login-submit-btn"
          >
            <span>{isSubmitting ? 'Verifying Gateway...' : 'Access Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/5 text-center" id="login-card-footer">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-xs text-slate-400 hover:text-white transition-colors"
            id="cancel-login-btn"
          >
            Cancel and Return Home
          </button>
        </div>
      </div>

    </div>
  );
}
