import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../hooks/useIssues';
import { StatusBadge } from '../components/IssueCard';
import { Plus, Filter, Search, List, ChevronRight, Clock, MapPin } from 'lucide-react';

const CATEGORY_ICONS = {
  'Pothole': '🕳️', 'Water Leakage': '💧', 'Streetlight': '💡',
  'Garbage': '🗑️', 'Road Damage': '🚧', 'Tree Hazard': '🌳',
  'Flooding': '🌊', 'Vandalism': '🔨', 'Other': '📋',
};

export default function MyIssues({ onNavigate }) {
  const { user } = useAuth();
  const { issues, updateStatus } = useIssues();
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const myIssues = issues.filter(i => i.reportedById === user?.uid);
  const filtered = filter === 'All' ? myIssues : myIssues.filter(i => i.status === filter);

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    return days > 0 ? `${days}d ago` : hours > 0 ? `${hours}h ago` : 'Just now';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#F1F5F9', padding: 8, borderRadius: 12, color: '#64748B', display: 'flex' }}>
              <List size={24} strokeWidth={2.5} />
            </div>
            My Issues
          </h1>
          <p className="page-subtitle">{myIssues.length} issues you've reported • +10 XP per report</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => onNavigate('report')}>
          <Plus size={14} /> New Report
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="tabs">
        {['All', 'Open', 'In Progress', 'Verified', 'Resolved'].map(f => (
          <div key={f} className={`tab-item ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f} {f === 'All' ? `(${myIssues.length})` : `(${myIssues.filter(i => i.status === f).length})`}
          </div>
        ))}
      </div>

      {myIssues.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><span style={{ fontSize: 64 }}>📋</span></div>
          <h3>No reports yet</h3>
          <p>Start making a difference — report your first issue!</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => onNavigate('report')}>
            📸 Report an Issue
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 20, alignItems: 'start' }}>
          {/* Issues Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {filtered.length === 0 ? (
              <div className="empty-state" style={{ padding: 40 }}>
                <p>No issues with status "{filter}"</p>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 100px 120px 80px',
                  padding: '12px 20px', borderBottom: '1px solid var(--border)',
                  fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  <span>Issue</span>
                  <span>Status</span>
                  <span>Category</span>
                  <span>Votes</span>
                </div>

                {filtered.map((issue, idx) => (
                  <div
                    key={issue.id}
                    onClick={() => setSelected(selected?.id === issue.id ? null : issue)}
                    style={{
                      display: 'grid', gridTemplateColumns: '1fr 100px 120px 80px',
                      padding: '14px 20px',
                      borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-light)' : 'none',
                      cursor: 'pointer',
                      background: selected?.id === issue.id ? 'var(--primary-light)' : 'transparent',
                      transition: 'var(--transition)',
                      alignItems: 'center'
                    }}
                    onMouseEnter={e => { if (selected?.id !== issue.id) e.currentTarget.style.background = 'var(--bg-main)'; }}
                    onMouseLeave={e => { if (selected?.id !== issue.id) e.currentTarget.style.background = 'transparent'; }}
                    id={`my-issue-${issue.id}`}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 18 }}>{CATEGORY_ICONS[issue.category] || '📋'}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>{issue.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Clock size={10} /> {timeAgo(issue.createdAt)}
                            <span>•</span>
                            <MapPin size={10} /> {issue.location?.address?.split(',')[0]}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div><StatusBadge status={issue.status} /></div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{issue.category}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>👍 {issue.votes}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail Panel */}
          {selected && (
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 32 }}>{CATEGORY_ICONS[selected.category]}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>{selected.category}</div>
                  <StatusBadge status={selected.status} />
                </div>
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 10, lineHeight: 1.3 }}>{selected.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>{selected.description}</p>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Votes', val: selected.votes },
                  { label: 'Verifies', val: selected.verifyCount },
                  { label: 'Severity', val: `${selected.severity}/5` },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--primary)' }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* AI info */}
              {selected.aiConfidence && (
                <div style={{ background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>🤖 AI Analysis</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${selected.aiConfidence}%` }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{selected.aiConfidence}% confidence • Dept: {selected.department}</div>
                </div>
              )}

              {/* Update Status */}
              <div className="form-group">
                <label className="form-label">Update Status</label>
                <select
                  className="form-select"
                  value={selected.status}
                  onChange={e => { updateStatus(selected.id, e.target.value); setSelected(s => ({ ...s, status: e.target.value })); }}
                >
                  {['Open', 'In Progress', 'Verified', 'Resolved'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
