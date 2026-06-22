import React from 'react';
import {
  LayoutDashboard, PlusCircle, Map, List, Users,
  BarChart2, Trophy, LogOut, MapPin, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'report', label: 'Report Issue', icon: PlusCircle, badge: null },
  { id: 'map', label: 'Map View', icon: Map },
  { id: 'feed', label: 'Community Feed', icon: Users },
  { id: 'my-issues', label: 'My Issues', icon: List },
  { id: 'insights', label: 'Insights', icon: BarChart2 },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
];

export default function Sidebar({ activePage, onNavigate }) {
  const { user, logout } = useAuth();
  const initials = user?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <aside className="sidebar">
      <div className="sidebar-section-label">Main Menu</div>

      {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => (
        <div
          key={id}
          className={`sidebar-item ${activePage === id ? 'active' : ''}`}
          onClick={() => onNavigate(id)}
          id={`sidebar-${id}`}
        >
          <Icon size={17} />
          <span>{label}</span>
          {badge && <span className="sidebar-badge">{badge}</span>}
        </div>
      ))}

      <div className="sidebar-divider" />

      {/* User XP Progress */}
      {user && (
        <div style={{ padding: '12px 16px 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Your Progress
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)' }}>⚡ {user.xp} XP</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min((user.xp % 500) / 5, 100)}%` }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
            <span>{user.level}</span>
            <span>{500 - (user.xp % 500)} XP to next</span>
          </div>
        </div>
      )}

      {/* Neighborhood */}
      {user && (
        <div style={{ padding: '8px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)', background: 'var(--bg-main)', padding: '8px 10px', borderRadius: 'var(--radius-md)' }}>
            <MapPin size={13} color="var(--primary)" />
            <span style={{ fontWeight: 500 }}>{user.neighborhood || 'Set location'}</span>
          </div>
        </div>
      )}

      {/* User footer */}
      <div className="sidebar-user" style={{ marginTop: 'auto' }}>
        <div className="avatar" style={{ fontSize: 13 }}>{initials}</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.displayName || 'User'}</div>
          <div className="sidebar-user-sub" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Star size={9} fill="var(--status-progress)" color="var(--status-progress)" />
            {user?.level || 'Citizen'}
          </div>
        </div>
        <button
          onClick={logout}
          style={{ background: 'none', padding: 6, borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', transition: 'var(--transition)' }}
          title="Sign out"
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}
