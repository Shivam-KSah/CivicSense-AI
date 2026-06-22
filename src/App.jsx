import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatWidget from './components/ChatWidget';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import MapPage from './pages/MapPage';
import CommunityFeed from './pages/CommunityFeed';
import MyIssues from './pages/MyIssues';
import Insights from './pages/Insights';
import Leaderboard from './pages/Leaderboard';
import Forum from './pages/Forum';
import Initiatives from './pages/Initiatives';
import AdminDashboard from './pages/AdminDashboard';

const PAGE_MAP = {
  dashboard: Dashboard,
  report: ReportIssue,
  map: MapPage,
  feed: CommunityFeed,
  'my-issues': MyIssues,
  insights: Insights,
  leaderboard: Leaderboard,
  forum: Forum,
  initiatives: Initiatives,
};

function AppContent() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-main)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto 16px' }} />
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Loading CivicSense AI...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Landing onLogin={() => setActivePage('dashboard')} />;
  }

  // Admin Routing override
  if (user.role === 'admin' && activePage === 'dashboard') {
    var ActivePage = AdminDashboard;
  } else {
    var ActivePage = PAGE_MAP[activePage] || Dashboard;
  }

  return (
    <div className="app-layout">
      <Navbar onNavigate={setActivePage} searchQuery={searchQuery} onSearch={setSearchQuery} />
      <div className="main-layout">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <main className="content-area">
          <ActivePage onNavigate={setActivePage} searchQuery={searchQuery} />
        </main>
      </div>
      <ChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
