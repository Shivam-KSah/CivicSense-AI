import React, { useState } from 'react';
import { MapPin, Shield, TrendingUp, Users, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: '📸', title: 'AI-Powered Reporting', desc: 'Upload a photo and Gemini AI instantly categorizes and analyzes your issue.' },
  { icon: '🗺️', title: 'Live Issue Map', desc: 'See all community issues on an interactive map with real-time status updates.' },
  { icon: '✅', title: 'Community Verification', desc: 'Neighbors verify issues together, ensuring only real problems get escalated.' },
  { icon: '🏆', title: 'Earn Rewards', desc: 'Gain XP, unlock badges, and climb the leaderboard for civic participation.' },
];

export default function Landing({ onLogin }) {
  const { loginWithGoogle, loginWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    setLoading(true);
    const user = await loginWithGoogle();
    setLoading(false);
    onLogin?.(user);
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    const user = await loginWithEmail(email, password);
    setLoading(false);
    onLogin?.(user);
  };

  return (
    <div className="landing-hero">
      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 64,
        background: 'var(--white)', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 22, color: 'var(--primary)' }}>
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="var(--primary)" />
            <path d="M14 6L20 10V18L14 22L8 18V10L14 6Z" fill="white" opacity="0.9"/>
            <circle cx="14" cy="14" r="3" fill="var(--primary)"/>
          </svg>
          CivicSense AI
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setIsLogin(true)}>Log in</button>
          <button className="btn btn-primary btn-sm" onClick={() => setIsLogin(false)}>Sign up</button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="landing-content">
        {/* Left: Hero Text */}
        <div className="landing-left">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--primary-light)', color: 'var(--primary)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            <MapPin size={14} />
            Hyperlocal Problem Solver
          </div>

          <h1>
            Your community,<br />
            <span>smarter together</span>
          </h1>

          <p>
            CivicSense AI lets citizens report, verify, and track local infrastructure issues — powered by Google Gemini AI. From potholes to water leaks, make your neighborhood better.
          </p>

          <div className="landing-features">
            {FEATURES.map(f => (
              <div key={f.title} className="landing-feature">
                <div className="landing-feature-icon">{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Stats */}
          <div style={{ display: 'flex', gap: 32, marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            {[
              { val: '2,400+', label: 'Issues Reported' },
              { val: '89%', label: 'Resolution Rate' },
              { val: '15K+', label: 'Active Citizens' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Auth Card */}
        <div>
          <div className="auth-card">
            <div className="auth-title">
              {isLogin ? 'Welcome back 👋' : 'Join your community'}
            </div>
            <div className="auth-subtitle">
              {isLogin
                ? 'Sign in to track and report local issues'
                : 'Create an account to start making a difference'}
            </div>

            {/* Google Button */}
            <button className="google-btn" onClick={handleGoogle} disabled={loading} id="google-signin-btn">
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Continue with Google
            </button>

            <div className="divider">or</div>

            {/* Email Form */}
            <form onSubmit={handleEmail}>
              {error && (
                <div style={{ background: 'var(--status-open-bg)', color: 'var(--status-open)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 13, marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <div className="form-group">
                <input
                  id="email-input"
                  className="form-input"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ position: 'relative' }}>
                <input
                  id="password-input"
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
                By continuing, you agree to our{' '}
                <a href="#" style={{ color: 'var(--primary)' }}>Privacy Policy</a> and{' '}
                <a href="#" style={{ color: 'var(--primary)' }}>Terms of Service</a>
              </p>

              <button
                id="submit-auth-btn"
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
                disabled={loading}
              >
                {loading ? <span className="spinner" /> : (isLogin ? 'Sign In' : 'Continue')}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                style={{ color: 'var(--primary)', fontWeight: 600, background: 'none', fontSize: 13 }}
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 20 }}>
            {[
              { icon: <Shield size={14} />, label: 'Secure & Private' },
              { icon: <Users size={14} />, label: 'Community Verified' },
              { icon: <TrendingUp size={14} />, label: 'AI-Powered' },
            ].map(t => (
              <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                {t.icon} {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
