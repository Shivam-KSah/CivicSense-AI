import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, MapPin, Zap, ArrowRight, Camera, Map, Users, LineChart } from 'lucide-react';
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
    { icon: Camera, label: 'Report Issue', sub: 'AI-powered', id: 'report', color: 'var(--primary)' },
    { icon: Map, label: 'View Map', sub: 'All issues', id: 'map', color: '#3B82F6' },
    { icon: Users, label: 'Community Feed', sub: 'Latest posts', id: 'feed', color: '#8B5CF6' },
    { icon: LineChart, label: 'AI Insights', sub: 'Analytics', id: 'insights', color: '#F59E0B' },
  ];

  return (
    <div style={{ maxWidth: 'var(--max-content-width)', margin: '0 auto' }}>
      {/* Unstop-style Hero Section */}
      <div style={{ textAlign: 'center', marginTop: 40, marginBottom: 40 }}>
        <h1 style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-1px', color: 'var(--text-primary)' }}>
          Know Your <span style={{ color: 'var(--primary)' }}>Community!</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginTop: 12, maxWidth: 600, margin: '12px auto 0' }}>
          Welcome back, {firstName}. You have {user?.xp || 0} XP. 
          {criticalIssues.length > 0 && ` There is ${criticalIssues.length} critical issue near you.`}
        </p>
      </div>

      {/* Unstop Quick Action Row (Horizontal) */}
      <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 24, margin: '0 -20px', padding: '0 20px 24px' }}>
        {QUICK_ACTIONS.map(a => (
          <button
            key={a.id}
            onClick={() => onNavigate(a.id)}
            style={{
              flex: '0 0 200px',
              background: `linear-gradient(145deg, var(--bg-card), ${a.color}15)`,
              border: 'none',
              borderRadius: '24px',
              padding: '24px 20px',
              cursor: 'pointer',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.04)'; }}
          >
            <div style={{ background: `${a.color}20`, color: a.color, padding: 18, borderRadius: 20 }}>
              <a.icon size={36} strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{a.label}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{a.sub}</div>
            </div>
          </button>
        ))}
        {/* Your Progress Card */}
        <div style={{
            flex: '0 0 240px',
            background: `linear-gradient(145deg, var(--bg-card), var(--primary-light))`,
            borderRadius: '24px',
            padding: '24px 20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
            Your Progress
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>{user?.xp || 0} XP</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{user?.level || 'Citizen'}</span>
          </div>
          <div className="progress-bar" style={{ height: 8 }}>
            <div className="progress-fill" style={{ width: `${Math.min(((user?.xp || 0) % 500) / 5, 100)}%` }} />
          </div>
        </div>
      </div>

      <div style={{ width: 4, height: 24, background: 'var(--primary)', borderRadius: 4, marginTop: 40, marginBottom: 16 }} />
      
      {/* Featured Issues */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>Featured</h2>
          <button className="btn btn-outline btn-sm" onClick={() => onNavigate('feed')} style={{ borderRadius: '100px' }}>
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
