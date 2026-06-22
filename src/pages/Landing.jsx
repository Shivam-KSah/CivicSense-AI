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
      <div className="landing-hero-bg">
        <div className="auth-card">
          <div className="auth-title">
            Discover your neighborhood
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

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14 }}>
            Have a business? <a href="#" style={{ color: 'var(--text-primary)', textDecoration: 'underline', fontWeight: 600 }}>Get started</a>
          </div>
        </div>
      </div>

      {/* Footer Section matching Nextdoor */}
      <div className="landing-footer">
        <div className="landing-footer-container">
          <div className="landing-footer-top">
            <h2 style={{ maxWidth: 350, lineHeight: 1.2 }}>Create a business page to connect with local customers on CivicSense</h2>
            <div style={{ display: 'flex', gap: 10, flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Your business name" 
                style={{ padding: '14px 20px', borderRadius: '8px', border: '1px solid var(--border)', width: '300px', fontSize: '15px' }} 
              />
              <button style={{ width: 46, height: 46, borderRadius: '50%', background: '#1A2b3c', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                →
              </button>
            </div>
          </div>

          <div className="landing-footer-grid">
            <div className="footer-col">
              <h4>CivicSense</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">News</a></li>
                <li><a href="#">Media Assets</a></li>
                <li><a href="#">Investor Relations</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Help</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Neighbors</h4>
              <ul>
                <li><a href="#">Get Started</a></li>
                <li><a href="#">Events</a></li>
                <li><a href="#">Neighborhoods</a></li>
                <li><a href="#">Guidelines</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Partners</h4>
              <ul>
                <li><a href="#">Small Business</a></li>
                <li><a href="#">Brands and Agencies</a></li>
                <li><a href="#">Public Agencies</a></li>
                <li><a href="#">Publishers</a></li>
                <li><a href="#">Businesses on CivicSense</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Legal & Terms</a></li>
                <li><a href="#">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
