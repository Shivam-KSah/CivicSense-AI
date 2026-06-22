import React, { useState, useEffect } from 'react';
import { Search, Bell, MapPin, LogOut, User, ChevronDown, Map, AlertCircle, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../hooks/useIssues';

export default function Navbar({ onNavigate, searchQuery, onSearch }) {
  const { user, logout } = useAuth();
  const { issues } = useIssues();
  const [showMenu, setShowMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('civicsense_theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('civicsense_theme', nextTheme);
  };

  const filteredIssues = issues?.filter(i => 
    searchQuery && (
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      i.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.location?.address?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ).slice(0, 5) || [];

  const initials = user?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo" onClick={() => onNavigate?.('dashboard')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <img src="/logo.png" alt="CivicSense Logo" style={{ height: 42 }} />
      </div>

      {/* Search */}
      <div className="navbar-center">
        <div style={{ position: 'relative', width: '100%', maxWidth: 600 }}>
          <div className="navbar-center-inner">
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search issues, categories, or locations..." 
              value={searchQuery || ''}
              onChange={(e) => onSearch?.(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery) {
                  onNavigate?.('feed');
                  setIsSearchFocused(false);
                }
              }}
            />
          </div>
          
          {/* Search Dropdown */}
          {isSearchFocused && searchQuery && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
              background: 'var(--white)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '8px 0',
              boxShadow: 'var(--shadow-lg)', zIndex: 300,
              maxHeight: 400, overflowY: 'auto'
            }}>
              {filteredIssues.length > 0 ? (
                <>
                  <div style={{ padding: '8px 16px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Matching Issues
                  </div>
                  {filteredIssues.map(issue => (
                    <div 
                      key={issue.id}
                      onClick={() => {
                        onSearch(issue.title);
                        onNavigate?.('feed');
                        setIsSearchFocused(false);
                      }}
                      style={{
                        padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12,
                        transition: 'background 0.2s', background: 'transparent'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-main)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: 8, borderRadius: 8 }}>
                        <AlertCircle size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{issue.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                          <span>{issue.category}</span>
                          <span>•</span>
                          <span>{issue.location?.address?.split(',')[0]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div 
                    onClick={() => { onNavigate?.('feed'); setIsSearchFocused(false); }}
                    style={{ padding: '12px 16px', borderTop: '1px solid var(--border-light)', fontSize: 13, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', textAlign: 'center' }}
                  >
                    View all results
                  </div>
                </>
              ) : (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                  No issues found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="navbar-actions">
        <div id="google_translate_element" style={{ marginRight: '8px', marginTop: '2px' }}></div>
        <button className="nav-icon-btn" onClick={toggleTheme}>
          {isDark ? <Sun size={18} color="var(--text-muted)" /> : <Moon size={18} color="var(--text-muted)" />}
        </button>
        <button className="nav-icon-btn">
          <Bell size={18} color="var(--text-muted)" />
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
