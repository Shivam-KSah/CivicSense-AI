import React from 'react';
import { ThumbsUp, MapPin, Clock, CheckCircle, AlertTriangle, MessageCircle, Shield, Info, AlertCircle, Droplet, Lightbulb, Trash2, TreePine, Waves, Hammer, ClipboardList } from 'lucide-react';

const CATEGORY_ICONS = {
  'Pothole': { icon: AlertCircle, color: '#F59E0B' },
  'Water Leakage': { icon: Droplet, color: '#3B82F6' },
  'Streetlight': { icon: Lightbulb, color: '#EAB308' },
  'Garbage': { icon: Trash2, color: '#10B981' },
  'Road Damage': { icon: AlertTriangle, color: '#EF4444' },
  'Tree Hazard': { icon: TreePine, color: '#84CC16' },
  'Flooding': { icon: Waves, color: '#0EA5E9' },
  'Vandalism': { icon: Hammer, color: '#6366F1' },
  'Other': { icon: ClipboardList, color: '#6B7280' },
};

const STATUS_COLORS = {
  'Open': 'badge-open',
  'In Progress': 'badge-progress',
  'Resolved': 'badge-resolved',
  'Verified': 'badge-verified',
};

const SEVERITY_COLORS = ['', '#10B981', '#84CC16', '#F59E0B', '#EF4444', '#7C3AED'];

export function StatusBadge({ status }) {
  return <span className={`badge ${STATUS_COLORS[status] || 'badge-open'}`}>{status}</span>;
}

export function SeverityIndicator({ severity }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width: 6, height: i <= severity ? 12 : 6,
          borderRadius: 2,
          background: i <= severity ? SEVERITY_COLORS[severity] : 'var(--border)',
          transition: 'all 0.2s'
        }} />
      ))}
    </div>
  );
}

export default function IssueCard({ issue, onVote, onVerify, onClick }) {
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <div className="issue-card" onClick={() => onClick?.(issue)} id={`issue-${issue.id}`}>
      {/* Image / Category Header */}
      <div style={{
        height: 120,
        background: `linear-gradient(135deg, ${SEVERITY_COLORS[issue.severity]}20, ${SEVERITY_COLORS[issue.severity]}08)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        borderBottom: '1px solid var(--border-light)'
      }}>
        {(() => {
          const config = CATEGORY_ICONS[issue.category] || CATEGORY_ICONS['Other'];
          const IconComp = config.icon;
          return (
            <div style={{ background: 'white', color: config.color, padding: 16, borderRadius: 24, display: 'flex', boxShadow: '0 8px 16px rgba(0,0,0,0.06)' }}>
              <IconComp size={40} strokeWidth={2} />
            </div>
          );
        })()}
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <StatusBadge status={issue.status} />
        </div>
        {issue.urgency === 'Critical' && (
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <span style={{ background: '#7C3AED', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 'var(--radius-full)' }}>
              🚨 CRITICAL
            </span>
          </div>
        )}
        {issue.verified && (
          <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', alignItems: 'center', gap: 4, background: 'var(--status-verified-bg)', color: 'var(--status-verified)', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 600 }}>
            <Shield size={11} fill="var(--status-verified)" /> Verified
          </div>
        )}
      </div>

      <div className="issue-card-body">
        {/* Header */}
        <div className="issue-card-top">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {issue.category}
              </div>
              <Info 
                size={14} 
                color="var(--text-muted)" 
                style={{ cursor: 'help' }} 
                title={issue.description} 
              />
            </div>
            <div className="issue-card-title" style={{ paddingRight: 12 }}>{issue.title}</div>
          </div>
          <SeverityIndicator severity={issue.severity} />
        </div>

        {/* Meta */}
        <div className="issue-card-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <MapPin size={11} /> {issue.location?.address?.split(',')[0]}
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={11} /> {timeAgo(issue.createdAt)}
          </span>
          <span>•</span>
          <span>by {issue.reportedBy}</span>
        </div>

        {/* AI confidence */}
        {issue.aiConfidence && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>🤖 AI</span>
            <div className="progress-bar" style={{ flex: 1, height: 4 }}>
              <div className="progress-fill" style={{ width: `${issue.aiConfidence}%` }} />
            </div>
            <span>{issue.aiConfidence}% confident</span>
          </div>
        )}

        {/* Actions */}
        <div className="issue-card-actions">
          <button
            className="action-btn"
            onClick={(e) => { e.stopPropagation(); onVote?.(issue.id); }}
          >
            <ThumbsUp size={13} />
            {issue.votes}
          </button>
          <button
            className={`action-btn ${issue.verified ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onVerify?.(issue.id); }}
          >
            <CheckCircle size={13} />
            Verify ({issue.verifyCount})
          </button>
          <button className="action-btn" style={{ marginLeft: 'auto' }}>
            <MessageCircle size={13} />
            {issue.comments}
          </button>
        </div>
      </div>
    </div>
  );
}
