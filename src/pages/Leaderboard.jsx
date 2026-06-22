import React, { useState } from 'react';
import { Award, Star, TrendingUp, Users, Trophy, Zap, Shield, Camera, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Priya Sharma', neighborhood: 'Sector 12', xp: 1250, reports: 45, verified: 120, badges: ['🏆 Top Reporter', '⚡ Speed Verifier'], avatar: 'PS' },
  { rank: 2, name: 'Rahul Gupta', neighborhood: 'Sector 15', xp: 980, reports: 38, verified: 89, badges: ['🌟 Community Star'], avatar: 'RG' },
  { rank: 3, name: 'Anita Singh', neighborhood: 'Sector 18', xp: 820, reports: 29, verified: 95, badges: ['✅ Verified Hero'], avatar: 'AS' },
  { rank: 4, name: 'Vikram Mehta', neighborhood: 'Sector 10', xp: 640, reports: 22, verified: 67, badges: [], avatar: 'VM' },
  { rank: 5, name: 'Neha Yadav', neighborhood: 'Sector 20', xp: 520, reports: 18, verified: 54, badges: [], avatar: 'NY' },
  { rank: 6, name: 'Arjun Patel', neighborhood: 'Sector 8', xp: 410, reports: 14, verified: 42, badges: [], avatar: 'AP' },
  { rank: 7, name: 'Kavya Reddy', neighborhood: 'Sector 22', xp: 380, reports: 12, verified: 38, badges: [], avatar: 'KR' },
  { rank: 8, name: 'Shivam Kumar', neighborhood: 'Sector 15', xp: 340, reports: 12, verified: 28, badges: ['🏅 First Reporter'], avatar: 'SK', isCurrentUser: true },
];

const BADGE_CATALOG = [
  { icon: Award, color: '#10B981', name: 'First Reporter', desc: 'Submit your first issue', xp: 10, earned: true },
  { icon: Camera, color: '#6366F1', name: '10 Reports Club', desc: 'Report 10 community issues', xp: 100, earned: false },
  { icon: ShieldCheck, color: '#3B82F6', name: 'Verified Hero', desc: 'Verify 50 community issues', xp: 250, earned: false },
  { icon: Trophy, color: '#F59E0B', name: 'Top Reporter', desc: 'Reach #1 on the leaderboard', xp: 500, earned: false },
  { icon: Zap, color: '#EAB308', name: 'Speed Verifier', desc: 'Verify 5 issues in 1 hour', xp: 50, earned: false },
  { icon: Star, color: '#F59E0B', name: 'Community Star', desc: 'Get 100+ votes on your reports', xp: 200, earned: false },
];

const RANK_STYLES = {
  1: { bg: '#FEF3C7', color: '#D97706', icon: '🥇' },
  2: { bg: '#F3F4F6', color: '#6B7280', icon: '🥈' },
  3: { bg: '#FEF2F2', color: '#DC2626', icon: '🥉' },
};

export default function Leaderboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('All Time');
  const [activeTab, setActiveTab] = useState('leaderboard');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#FFFBEB', padding: 8, borderRadius: 12, color: '#F59E0B', display: 'flex' }}>
              <Trophy size={24} strokeWidth={2.5} />
            </div>
            Leaderboard
          </h1>
          <p className="page-subtitle">Top civic contributors in your community</p>
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-main)', padding: 4, borderRadius: 'var(--radius-full)' }}>
          {['This Week', 'This Month', 'All Time'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '6px 14px', borderRadius: 'var(--radius-full)', border: 'none',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'var(--transition)',
                background: period === p ? 'var(--white)' : 'transparent',
                color: period === p ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: period === p ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <div className={`tab-item ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}>
          🏆 Leaderboard
        </div>
        <div className={`tab-item ${activeTab === 'badges' ? 'active' : ''}`} onClick={() => setActiveTab('badges')}>
          🏅 Badge Catalog
        </div>
      </div>

      {activeTab === 'leaderboard' ? (
        <div className="two-col" style={{ gap: 20, alignItems: 'start' }}>
          {/* Podium Top 3 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12, marginBottom: 28, padding: '20px 0' }}>
              {/* 2nd */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 4 }}>{LEADERBOARD_DATA[1].avatar}</div>
                <div style={{ width: 70, height: 80, background: RANK_STYLES[2].bg, borderRadius: '12px 12px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: 8 }}>
                  <span style={{ fontSize: 20 }}>🥈</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6 }}>{LEADERBOARD_DATA[1].name.split(' ')[0]}</div>
                <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700 }}>⚡ {LEADERBOARD_DATA[1].xp}</div>
              </div>

              {/* 1st */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 4 }}>{LEADERBOARD_DATA[0].avatar}</div>
                <div style={{ width: 80, height: 110, background: RANK_STYLES[1].bg, borderRadius: '12px 12px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: 8 }}>
                  <span style={{ fontSize: 24 }}>🥇</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, marginTop: 6 }}>{LEADERBOARD_DATA[0].name.split(' ')[0]}</div>
                <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700 }}>⚡ {LEADERBOARD_DATA[0].xp}</div>
              </div>

              {/* 3rd */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 4 }}>{LEADERBOARD_DATA[2].avatar}</div>
                <div style={{ width: 70, height: 60, background: RANK_STYLES[3]?.bg || '#FFF3E0', borderRadius: '12px 12px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: 8 }}>
                  <span style={{ fontSize: 20 }}>🥉</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6 }}>{LEADERBOARD_DATA[2].name.split(' ')[0]}</div>
                <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700 }}>⚡ {LEADERBOARD_DATA[2].xp}</div>
              </div>
            </div>

            {/* Full List */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {LEADERBOARD_DATA.map((person, idx) => (
                <div
                  key={person.rank}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
                    borderBottom: idx < LEADERBOARD_DATA.length - 1 ? '1px solid var(--border-light)' : 'none',
                    background: person.isCurrentUser ? 'var(--primary-light)' : 'transparent',
                    transition: 'var(--transition)'
                  }}
                  id={`leaderboard-rank-${person.rank}`}
                >
                  {/* Rank */}
                  <div className={`rank-badge rank-${person.rank <= 3 ? person.rank : 'other'}`}>
                    {person.rank <= 3 ? RANK_STYLES[person.rank].icon : person.rank}
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: person.isCurrentUser ? 'var(--primary)' : '#E5E7EB',
                    color: person.isCurrentUser ? 'white' : 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, flexShrink: 0
                  }}>
                    {person.avatar}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{person.name}</span>
                      {person.isCurrentUser && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-medium)', padding: '2px 6px', borderRadius: 'var(--radius-full)' }}>YOU</span>}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {person.neighborhood} • {person.reports} reports • {person.verified} verifications
                    </div>
                    {person.badges.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                        {person.badges.slice(0, 2).map(b => (
                          <span key={b} style={{ fontSize: 10, background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 6px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>{b}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* XP */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--primary)' }}>⚡{person.xp}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>XP</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Stats */}
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-header">
                <div className="card-title">Your Stats</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>#8 Ranking</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'XP Earned', val: user?.xp || 340, icon: '⚡' },
                  { label: 'Reports', val: user?.reportsCount || 12, icon: '📸' },
                  { label: 'Verified', val: user?.verifiedCount || 28, icon: '✅' },
                  { label: 'Badges', val: user?.badges?.length || 1, icon: '🏅' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--primary)' }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* How to earn XP */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 14 }}>💡 How to Earn XP</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { action: 'Report an Issue', xp: '+10 XP', icon: '📸' },
                  { action: 'Verify a Report', xp: '+5 XP', icon: '✅' },
                  { action: 'Issue Gets Resolved', xp: '+20 XP', icon: '🎉' },
                  { action: 'Get 10+ Upvotes', xp: '+15 XP', icon: '👍' },
                  { action: 'First Report Daily', xp: '+5 XP bonus', icon: '🌅' },
                ].map(e => (
                  <div key={e.action} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: 18 }}>{e.icon}</span>
                    <span style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{e.action}</span>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 13 }}>{e.xp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Badge Catalog */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {BADGE_CATALOG.map(badge => (
            <div
              key={badge.name}
              className="card"
              style={{
                opacity: badge.earned ? 1 : 0.7,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {badge.earned && (
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  background: 'var(--primary)', color: 'white',
                  fontSize: 10, fontWeight: 700,
                  padding: '4px 10px 4px 14px',
                  borderBottomLeftRadius: 10
                }}>EARNED</div>
              )}
              <div style={{ marginBottom: 12 }}>
                <div style={{ 
                  display: 'inline-flex', padding: 12, borderRadius: 12, 
                  background: `${badge.color}20`, color: badge.color 
                }}>
                  <badge.icon size={28} strokeWidth={2} />
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{badge.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>{badge.desc}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>⚡ {badge.xp} XP reward</span>
                {!badge.earned && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Not earned yet</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
