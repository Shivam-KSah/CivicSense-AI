import React, { useState } from 'react';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import { useIssues } from '../hooks/useIssues';
import IssueCard from '../components/IssueCard';

const FILTERS = ['All', 'Open', 'In Progress', 'Verified', 'Resolved'];
const CATEGORIES = ['All', 'Pothole', 'Water Leakage', 'Streetlight', 'Garbage', 'Road Damage'];
const SORT_OPTIONS = ['Latest', 'Most Upvoted', 'Most Urgent', 'Most Verified'];

export default function CommunityFeed({ onNavigate }) {
  const { issues, voteIssue, verifyIssue } = useIssues();
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sort, setSort] = useState('Latest');
  const [search, setSearch] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);

  let filtered = issues
    .filter(i => statusFilter === 'All' || i.status === statusFilter)
    .filter(i => categoryFilter === 'All' || i.category === categoryFilter)
    .filter(i => !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()));

  if (sort === 'Most Upvoted') filtered = [...filtered].sort((a, b) => b.votes - a.votes);
  else if (sort === 'Most Urgent') filtered = [...filtered].sort((a, b) => b.severity - a.severity);
  else if (sort === 'Most Verified') filtered = [...filtered].sort((a, b) => b.verifyCount - a.verifyCount);
  else filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const CATEGORY_ICONS = {
    'Pothole': '🕳️', 'Water Leakage': '💧', 'Streetlight': '💡',
    'Garbage': '🗑️', 'Road Damage': '🚧', 'Tree Hazard': '🌳',
    'Flooding': '🌊', 'Vandalism': '🔨', 'Other': '📋',
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">👥 Community Feed</h1>
          <p className="page-subtitle">{filtered.length} issues from your neighborhood</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => onNavigate('report')}>
          + Report Issue
        </button>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '8px 14px', flex: 1, minWidth: 200 }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search issues..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: 14, flex: 1, color: 'var(--text-primary)' }}
            id="search-feed"
          />
        </div>

        <select
          className="form-select"
          style={{ width: 'auto', padding: '8px 32px 8px 12px', fontSize: 13 }}
          value={sort}
          onChange={e => setSort(e.target.value)}
          id="sort-select"
        >
          {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Status Filter Tabs */}
      <div className="tabs" style={{ marginBottom: 16 }}>
        {FILTERS.map(f => (
          <div key={f} className={`tab-item ${statusFilter === f ? 'active' : ''}`} onClick={() => setStatusFilter(f)}>
            {f}
          </div>
        ))}
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            style={{
              padding: '5px 14px', border: '1.5px solid',
              borderColor: categoryFilter === c ? 'var(--primary)' : 'var(--border)',
              borderRadius: 'var(--radius-full)',
              background: categoryFilter === c ? 'var(--primary-light)' : 'var(--white)',
              color: categoryFilter === c ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'var(--transition)'
            }}
          >
            {c !== 'All' && (CATEGORY_ICONS[c] + ' ')}{c}
          </button>
        ))}
      </div>

      {/* Two-column: Feed + Detail */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedIssue ? '1fr 380px' : '1fr', gap: 20 }}>
        {/* Issues Grid */}
        <div>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <span style={{ fontSize: 64 }}>🔍</span>
              </div>
              <h3>No issues found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="issues-grid">
              {filtered.map(issue => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onVote={voteIssue}
                  onVerify={verifyIssue}
                  onClick={setSelectedIssue}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedIssue && (
          <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'sticky', top: 20, height: 'fit-content', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
            <div style={{
              height: 140, background: 'linear-gradient(135deg, var(--primary-light), var(--bg-main))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
            }}>
              <span style={{ fontSize: 56 }}>{CATEGORY_ICONS[selectedIssue.category] || '📋'}</span>
              <button
                onClick={() => setSelectedIssue(null)}
                style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', borderRadius: '50%', width: 26, height: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >✕</button>
            </div>

            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                {selectedIssue.category}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, lineHeight: 1.3 }}>{selectedIssue.title}</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>{selectedIssue.description}</p>

              {/* Status + Actions */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <span className={`badge badge-${selectedIssue.status === 'Open' ? 'open' : selectedIssue.status === 'In Progress' ? 'progress' : selectedIssue.status === 'Resolved' ? 'resolved' : 'verified'}`}>
                  {selectedIssue.status}
                </span>
                {selectedIssue.urgency && (
                  <span style={{ fontSize: 12, fontWeight: 600, color: selectedIssue.urgency === 'Critical' ? '#7C3AED' : 'var(--text-muted)' }}>
                    {selectedIssue.urgency === 'Critical' ? '🚨 ' : ''}{selectedIssue.urgency}
                  </span>
                )}
              </div>

              {/* Info grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: '📍', key: 'Location', val: selectedIssue.location?.address },
                  { label: '👤', key: 'Reported by', val: selectedIssue.reportedBy },
                  { label: '🏢', key: 'Department', val: selectedIssue.department || 'Pending assignment' },
                  { label: '⚠️', key: 'Severity', val: `${selectedIssue.severity}/5` },
                  { label: '✅', key: 'Verifications', val: `${selectedIssue.verifyCount} confirmations` },
                  { label: '👍', key: 'Upvotes', val: selectedIssue.votes },
                ].map(item => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={{ flexShrink: 0 }}>{item.label}</span>
                    <span style={{ color: 'var(--text-muted)', minWidth: 80 }}>{item.key}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{item.val}</span>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => voteIssue(selectedIssue.id)}
                >
                  👍 Upvote ({selectedIssue.votes})
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => verifyIssue(selectedIssue.id)}
                >
                  ✅ Verify
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
