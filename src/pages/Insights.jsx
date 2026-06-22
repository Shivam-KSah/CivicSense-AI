import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useIssues } from '../hooks/useIssues';
import { generateInsightsSummary } from '../gemini';

const COLORS = ['#00A651', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const WEEKLY_DATA = [
  { week: 'Jun 1', reported: 8, resolved: 5 },
  { week: 'Jun 8', reported: 12, resolved: 9 },
  { week: 'Jun 15', reported: 7, resolved: 11 },
  { week: 'Jun 22', reported: 15, resolved: 8 },
];

export default function Insights() {
  const { issues, getStats } = useIssues();
  const stats = getStats();
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const categoryData = Object.entries(stats.byCategory || {}).map(([name, value]) => ({ name, value }));

  const statusData = [
    { name: 'Open', value: stats.open, color: '#EF4444' },
    { name: 'In Progress', value: stats.inProgress, color: '#F59E0B' },
    { name: 'Resolved', value: stats.resolved, color: '#10B981' },
    { name: 'Verified', value: stats.verified, color: '#3B82F6' },
  ];

  const resolutionRate = Math.round((stats.resolved / Math.max(stats.total, 1)) * 100);

  const loadAIInsights = async () => {
    setLoadingInsights(true);
    const result = await generateInsightsSummary(stats);
    setAiInsights(result);
    setLoadingInsights(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">📊 Insights & Analytics</h1>
          <p className="page-subtitle">AI-powered community intelligence dashboard</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={loadAIInsights} disabled={loadingInsights} id="load-insights-btn">
          {loadingInsights ? <span className="spinner" /> : <Sparkles size={14} />}
          {loadingInsights ? 'Analyzing...' : 'Generate AI Insights'}
        </button>
      </div>

      {/* AI Insights Banner */}
      {aiInsights && (
        <div className="ai-panel" style={{ marginBottom: 24 }}>
          <div className="ai-panel-header">
            <Sparkles size={16} /> AI-Generated Community Summary
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: 14 }}>{aiInsights.summary}</p>
          <div className="ai-result-grid">
            <div className="ai-result-item">
              <div className="ai-result-label">Top Concern</div>
              <div className="ai-result-value">⚠️ {aiInsights.topConcern}</div>
            </div>
            <div className="ai-result-item">
              <div className="ai-result-label">Trend Alert</div>
              <div className="ai-result-value">📈 {aiInsights.trendAlert}</div>
            </div>
            <div className="ai-result-item" style={{ gridColumn: 'span 2' }}>
              <div className="ai-result-label">AI Recommendation</div>
              <div className="ai-result-value" style={{ fontWeight: 500, fontSize: 13 }}>💡 {aiInsights.recommendation}</div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Reports', value: stats.total, icon: '📋', color: '#3B82F6', bg: '#EFF6FF' },
          { label: 'Resolution Rate', value: `${resolutionRate}%`, icon: '✅', color: '#10B981', bg: '#ECFDF5' },
          { label: 'Critical Issues', value: stats.critical, icon: '🚨', color: '#EF4444', bg: '#FEF2F2' },
          { label: 'Avg Verification', value: `${Math.round(issues.reduce((s, i) => s + i.verifyCount, 0) / Math.max(issues.length, 1))}`, icon: '👥', color: '#8B5CF6', bg: '#F5F3FF' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="two-col" style={{ gap: 20, marginBottom: 20 }}>
        {/* Category Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Issues by Category</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }} />
              <Bar dataKey="value" fill="var(--primary)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Status Breakdown</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)' }} />
              <Legend formatter={(value) => <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Weekly Issue Trend</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Reported vs Resolved</div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={WEEKLY_DATA} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }} />
            <Legend formatter={(v) => <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{v}</span>} />
            <Line type="monotone" dataKey="reported" stroke="#EF4444" strokeWidth={2.5} dot={{ fill: '#EF4444', strokeWidth: 2 }} name="Reported" />
            <Line type="monotone" dataKey="resolved" stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: 'var(--primary)', strokeWidth: 2 }} name="Resolved" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Hotspot Analysis */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <div className="card-title">🔥 Hotspot Areas</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Areas with highest issue density</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { area: 'Main Road, Sector 15', count: 8, pct: 80 },
            { area: 'Market Area, Sector 15', count: 5, pct: 50 },
            { area: 'Highway Entry Junction', count: 4, pct: 40 },
            { area: 'Park Road, Sector 15', count: 3, pct: 30 },
          ].map(h => (
            <div key={h.area} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{h.area}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{h.count} issues</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${h.pct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
