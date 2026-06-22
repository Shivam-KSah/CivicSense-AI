import React, { useState } from 'react';
import { Search, Bell, MapPin, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onNavigate }) {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const initials = user?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo" onClick={() => onNavigate?.('dashboard')} style={{ cursor: 'pointer' }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="8" fill="var(--primary)" />
          <path d="M14 6L20 10V18L14 22L8 18V10L14 6Z" fill="white" opacity="0.9"/>
          <circle cx="14" cy="14" r="3" fill="var(--primary)"/>
        </svg>
        CivicSense AI
      </div>

      {/* Search */}
      <div className="navbar-center">
        <Search size={16} color="var(--text-muted)" />
        <input type="text" placeholder="Search issues in your area..." />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 12 }}>
          <MapPin size={12} />
          <span>{user?.neighborhood || 'Set location'}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="navbar-actions">
        <button className="nav-icon-btn">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        {user && (
          <div style={{ position: 'relative' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 8px', borderRadius: 'var(--radius-full)', transition: 'var(--transition)' }}
              onClick={() => setShowMenu(!showMenu)}
              className="navbar-user-trigger"
            >
              <div className="avatar">{initials}</div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.displayName?.split(' ')[0]}</span>
                <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>⚡ {user.xp} XP</span>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </div>

            {showMenu && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: 'var(--white)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '8px 0',
                boxShadow: 'var(--shadow-lg)', minWidth: 180, zIndex: 200
              }}>
                <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{user.displayName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.email}</div>
                </div>
                <button
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 14, color: 'var(--text-secondary)', background: 'none' }}
                  onClick={() => { setShowMenu(false); onNavigate?.('profile'); }}
                >
                  <User size={15} /> My Profile
                </button>
                <button
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 14, color: 'var(--status-open)', background: 'none' }}
                  onClick={() => { logout(); setShowMenu(false); }}
                >
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .navbar-user-trigger:hover { background: var(--bg-main); }
      `}</style>
    </nav>
  );
}
