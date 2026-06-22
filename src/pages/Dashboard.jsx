import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, MapPin, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../hooks/useIssues';
import IssueCard from '../components/IssueCard';

export default function Dashboard({ onNavigate }) {
  const { user } = useAuth();
  const { issues, getStats, voteIssue, verifyIssue } = useIssues();
  const stats = getStats();

  const recentIssues = issues.slice(0, 3);
  const criticalIssues = issues.filter(i => i.urgency === 'Critical' && i.status !== 'Resolved');

  const firstName = user?.displayName?.split(' ')[0] || 'Citizen';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const STAT_CARDS = [
    {
      label: 'Total Issues', value: stats.total, icon: '📊',
      color: '#3B82F6', bg: '#EFF6FF', trend: '+3 this week', up: true
    },
    {
      label: 'Open Issues', value: stats.open, icon: '🔴',
      color: '#EF4444', bg: '#FEF2F2', trend: `${stats.critical} critical`, up: false
    },
    {
      label: 'In Progress', value: stats.inProgress, icon: '🟡',
      color: '#F59E0B', bg: '#FFFBEB', trend: 'Being resolved', up: true
    },
    {
      label: 'Resolved', value: stats.resolved, icon: '🟢',
      color: '#10B981', bg: '#ECFDF5', trend: `${Math.round(stats.resolved / Math.max(stats.total, 1) * 100)}% rate`, up: true
    },
  ];

  const QUICK_ACTIONS = [
    { icon: '📸', label: 'Report Issue', sub: 'AI-powered', id: 'report', color: 'var(--primary)' },
    { icon: '🗺️', label: 'View Map', sub: 'All issues', id: 'map', color: '#3B82F6' },
    { icon: '👥', label: 'Community Feed', sub: 'Latest posts', id: 'feed', color: '#8B5CF6' },
    { icon: '📊', label: 'AI Insights', sub: 'Analytics', id: 'insights', color: '#F59E0B' },
  ];

  return (
    <div>
      {/* Welcome Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 32px',
        marginBottom: 24,
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: -20, top: -20, width: 150, height: 150, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', right: 40, bottom: -30, width: 100, height: 100, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: 14, opacity: 0.85, marginBottom: 4 }}>{greeting}, 👋</p>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>{firstName}!</h1>
          <p style={{ fontSize: 14, opacity: 0.8, marginTop: 8 }}>
            You've earned <strong>{user?.xp || 0} XP</strong> and made {user?.reportsCount || 0} reports.
            {criticalIssues.length > 0 && ` There are ${criticalIssues.length} critical issues needing attention near you.`}
          </p>
          <button
            className="btn"
            onClick={() => onNavigate('report')}
            style={{ marginTop: 16, background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            📸 Report an Issue
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {STAT_CARDS.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-trend ${s.up ? 'up' : 'down'}`}>
              {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {s.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Critical Alert */}
      {criticalIssues.length > 0 && (
        <div style={{
          background: '#FEF2F2', border: '1.5px solid #FCA5A5',
          borderRadius: 'var(--radius-lg)', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 24
        }}>
          <AlertCircle size={20} color="#EF4444" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: '#DC2626', fontSize: 14 }}>
              🚨 {criticalIssues.length} Critical Issue{criticalIssues.length > 1 ? 's' : ''} in Your Area
            </div>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
              {criticalIssues[0]?.title} — needs immediate attention
            </div>
          </div>
          <button
            className="btn btn-sm"
            style={{ background: '#EF4444', color: 'white', flexShrink: 0 }}
            onClick={() => onNavigate('map')}
          >
            View
          </button>
        </div>
      )}

      <div className="two-col" style={{ gap: 24 }}>
        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Quick Access</div>
              <div className="card-subtitle">Jump to key features</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {QUICK_ACTIONS.map(a => (
              <button
                key={a.id}
                id={`quick-${a.id}`}
                onClick={() => onNavigate(a.id)}
                style={{
                  background: 'var(--bg-main)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'var(--transition)',
                  display: 'flex', alignItems: 'center', gap: 12
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.background = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-main)'; }}
              >
                <span style={{ fontSize: 24 }}>{a.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{a.sub}</div>
                </div>
                <ArrowRight size={14} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Your Badges */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Your Achievements</div>
              <div className="card-subtitle">{user?.badges?.length || 0} badges earned</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('leaderboard')}>View All</button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {(user?.badges || ['First Reporter']).map(badge => (
              <span key={badge} style={{
                padding: '6px 12px', background: 'var(--primary-light)',
                color: 'var(--primary-dark)', borderRadius: 'var(--radius-full)',
                fontSize: 12, fontWeight: 600
              }}>
                🏅 {badge}
              </span>
            ))}
          </div>

          {/* XP Progress */}
          <div style={{ background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                ⚡ {user?.xp || 0} / {Math.ceil(((user?.xp || 0) + 1) / 500) * 500} XP
              </span>
              <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>{user?.level || 'Citizen'}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min(((user?.xp || 0) % 500) / 5, 100)}%` }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
              Report issues to earn XP • +10 per report • +5 per verification
            </div>
          </div>
        </div>
      </div>

      {/* Recent Issues */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Recent Issues Near You</h2>
          <button className="btn btn-outline btn-sm" onClick={() => onNavigate('feed')}>
            View All <ArrowRight size={13} />
          </button>
        </div>
        <div className="issues-grid">
          {recentIssues.map(issue => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onVote={voteIssue}
              onVerify={verifyIssue}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
