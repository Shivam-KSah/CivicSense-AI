import React from 'react';
import {
  LayoutDashboard, PlusCircle, Map, List, Users,
  BarChart2, Trophy, LogOut, MapPin, Star, MessageSquare, Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CITIZEN_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#475569' },
  { id: 'report', label: 'Report Issue', icon: PlusCircle, badge: null, color: '#059669' },
  { id: 'map', label: 'Map View', icon: Map, color: '#2563EB' },
  { id: 'feed', label: 'Community Feed', icon: Users, color: '#7C3AED' },
  { id: 'my-issues', label: 'My Issues', icon: List, color: '#475569' },
  { id: 'insights', label: 'Insights', icon: BarChart2, color: '#D97706' },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, color: '#D97706' },
  { id: 'forum', label: 'General Forum', icon: MessageSquare, color: '#DB2777' },
  { id: 'initiatives', label: 'Civic Initiatives', icon: Globe, color: '#059669' },
];

const ADMIN_NAV = [
  { id: 'dashboard', label: 'City Overview', icon: LayoutDashboard, color: '#475569' },
  { id: 'map', label: 'Live Heatmap', icon: Map, color: '#2563EB' },
  { id: 'feed', label: 'Live Feed', icon: Users, color: '#7C3AED' },
];

export default function Sidebar({ activePage, onNavigate }) {
  const { user, logout } = useAuth();
  const initials = user?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  const navItems = user?.role === 'admin' ? ADMIN_NAV : CITIZEN_NAV;

  return (
    <aside className="sidebar">

      {navItems.map(({ id, label, icon: Icon, badge, color }) => {
        const isActive = activePage === id;
        return (
          <div
            key={id}
            className={`sidebar-item ${isActive ? 'active' : ''}`}
            onClick={() => onNavigate(id)}
            id={`sidebar-${id}`}
            style={isActive ? { background: 'transparent' } : {}}
          >
            <div className="icon-container" style={{ 
              background: isActive ? `${color}20` : 'transparent', 
              color: isActive ? color : 'var(--text-secondary)',
              padding: 8, 
              borderRadius: 12, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="label" style={{ color: isActive ? color : 'var(--text-secondary)', fontWeight: isActive ? 800 : 600 }}>{label}</span>
            {badge && <span className="sidebar-badge">{badge}</span>}
          </div>
        );
      })}

      {/* User footer */}
      <div className="sidebar-item" style={{ marginTop: 'auto', marginBottom: 24 }} onClick={logout}>
        <div className="icon-container" style={{ background: 'var(--primary-light)', padding: 8, borderRadius: 12, color: 'var(--primary)', display: 'flex' }}>
          <LogOut size={20} />
        </div>
        <span className="label" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Sign Out</span>
      </div>
    </aside>
  );
}
