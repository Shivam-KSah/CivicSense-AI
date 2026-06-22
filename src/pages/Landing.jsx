import React, { useState, useRef } from 'react';
import { MapPin, Shield, TrendingUp, Users, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: '📸', title: 'AI-Powered Reporting', desc: 'Upload a photo and Gemini AI instantly categorizes and analyzes your issue.' },
  { icon: '🗺️', title: 'Live Issue Map', desc: 'See all community issues on an interactive map with real-time status updates.' },
  { icon: '✅', title: 'Community Verification', desc: 'Neighbors verify issues together, ensuring only real problems get escalated.' },
  { icon: '🏆', title: 'Earn Rewards', desc: 'Gain XP, unlock badges, and climb the leaderboard for civic participation.' },
];

export default function Landing({ onLogin }) {
  const { loginWithGoogle, loginWithEmail, loginAsOfficer } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authRole, setAuthRole] = useState('citizen');
  const emailInputRef = useRef(null);

  const handleTopNavClick = (isLoginView) => {
    setIsLogin(isLoginView);
    setTimeout(() => {
      emailInputRef.current?.focus();
    }, 50);
  };

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

  const handleOfficerLogin = async () => {
    setLoading(true);
    const user = await loginAsOfficer();
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="CivicSense AI Logo" style={{ height: 55 }} />
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => handleTopNavClick(true)}>Log in</button>
          <button className="btn btn-primary btn-sm" onClick={() => handleTopNavClick(false)}>Sign up</button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="landing-hero-bg">
        <div className="auth-card">
          {/* Role Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-main)', borderRadius: 'var(--radius-full)', padding: 4, marginBottom: 24 }}>
            <button 
              onClick={() => setAuthRole('citizen')}
              style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-full)', border: 'none', background: authRole === 'citizen' ? 'var(--white)' : 'transparent', color: authRole === 'citizen' ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 700, fontSize: 14, boxShadow: authRole === 'citizen' ? 'var(--shadow-sm)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Citizen
            </button>
            <button 
              onClick={() => setAuthRole('officer')}
              style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-full)', border: 'none', background: authRole === 'officer' ? 'var(--white)' : 'transparent', color: authRole === 'officer' ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 700, fontSize: 14, boxShadow: authRole === 'officer' ? 'var(--shadow-sm)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Municipal Officer
            </button>
          </div>

          <div className="auth-title">
            {authRole === 'citizen' ? 'Discover your neighborhood' : 'Official Login Portal'}
          </div>

          {authRole === 'citizen' ? (
            <>

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
                  type="email"
                  placeholder="Email address"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  ref={emailInputRef}
                  required
                  style={{ background: 'transparent', padding: '14px', borderRadius: '8px' }}
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
                style={{ background: 'transparent', padding: '14px', borderRadius: '8px', paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5, textAlign: 'left' }}>
              By continuing with sign up, you agree to our{' '}
              <a href="#" style={{ textDecoration: 'underline' }}>Privacy Policy</a>,{' '}
              <a href="#" style={{ textDecoration: 'underline' }}>Cookie Policy</a>, and{' '}
              <a href="#" style={{ textDecoration: 'underline' }}>Member Agreement</a>.
            </p>

            <button
              id="submit-auth-btn"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', borderRadius: 'var(--radius-full)' }}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : 'Continue'}
            </button>
          </form>
          </>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleOfficerLogin(); }} style={{ textAlign: 'center' }}>
              <Shield size={48} color="var(--primary)" style={{ marginBottom: 16 }} />
              <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>
                Access the city management dashboard.
              </p>
              
              <div className="form-group">
                <input
                    type="email"
                    placeholder="Official Govt ID / Email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ background: 'transparent', padding: '14px', borderRadius: '8px', textAlign: 'left' }}
                  />
              </div>

              <div className="form-group" style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ background: 'transparent', padding: '14px', borderRadius: '8px', paddingRight: 44, textAlign: 'left' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button 
                type="submit"
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', borderRadius: 'var(--radius-full)', marginTop: 8 }}
                disabled={loading}
              >
                {loading ? <span className="spinner" /> : 'Secure Official Login'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Inspiring Banner Footer */}
      <div style={{ background: 'var(--primary)', color: 'white', padding: '40px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
          "Responsibility Starts With Us."
        </h2>
        <p style={{ fontSize: 16, marginTop: 10, opacity: 0.9, maxWidth: 600, margin: '10px auto 0' }}>
          Join thousands of civic-minded neighbors using AI to keep our streets clean, safe, and beautiful.
        </p>
      </div>
    </div>
  );
}
