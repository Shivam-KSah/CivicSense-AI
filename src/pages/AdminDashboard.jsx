import React, { useState } from 'react';
import { ShieldCheck, Activity, Users, AlertTriangle, Send, Map, CheckCircle, X, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../hooks/useIssues';

export default function AdminDashboard({ onNavigate }) {
  const { user } = useAuth();
  const { issues, updateStatus } = useIssues();
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showWorkerModal, setShowWorkerModal] = useState(false);

  const criticalIssues = issues.filter(i => i.urgency === 'Critical');
  const openIssues = issues.filter(i => i.status === 'Open' || i.status === 'In Progress');
  const resolvedIssues = issues.filter(i => i.status === 'Resolved');
  const resolutionRate = Math.round((resolvedIssues.length / Math.max(issues.length, 1)) * 100);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMsg) return;
    setBroadcastMsg('');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const cycleStatus = (issueId, currentStatus) => {
    let nextStatus = 'Open';
    if (currentStatus === 'Open' || currentStatus === 'Verified') nextStatus = 'In Progress';
    else if (currentStatus === 'In Progress') nextStatus = 'Resolved';
    else if (currentStatus === 'Resolved') nextStatus = 'Open';
    
    updateStatus(issueId, nextStatus);
  };

  return (
    <div style={{ maxWidth: 'var(--max-content-width)', margin: '0 auto', paddingBottom: 40 }}>
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'var(--primary-light)', padding: 8, borderRadius: 12, color: 'var(--primary)', display: 'flex' }}>
              <ShieldCheck size={24} strokeWidth={2.5} />
            </div>
            Officer Dashboard
          </h1>
          <p className="page-subtitle">Welcome back, {user?.displayName}. Here is the city overview.</p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Critical Alerts</div>
            <div style={{ background: '#FEF2F2', padding: 8, borderRadius: 12, color: '#EF4444' }}><AlertTriangle size={20} /></div>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{criticalIssues.length}</div>
          <div style={{ fontSize: 13, color: '#EF4444', marginTop: 8, fontWeight: 600 }}>Require immediate action</div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Issues</div>
            <div style={{ background: '#FFFBEB', padding: 8, borderRadius: 12, color: '#F59E0B' }}><Activity size={20} /></div>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{openIssues.length}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>Across all sectors</div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resolution Rate</div>
            <div style={{ background: '#ECFDF5', padding: 8, borderRadius: 12, color: '#10B981' }}><CheckCircle size={20} /></div>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{resolutionRate}%</div>
          <div style={{ fontSize: 13, color: '#10B981', marginTop: 8, fontWeight: 600 }}>↑ 4% from last month</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 24 }}>
        {/* Issue Management Table */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Recent Reports</h2>
            <button className="btn btn-outline btn-sm" onClick={() => onNavigate('map')}>View on Map</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 8px' }}>Issue</th>
                  <th style={{ padding: '12px 8px' }}>Location</th>
                  <th style={{ padding: '12px 8px' }}>Severity</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {issues.slice(0, 6).map(issue => (
                  <tr key={issue.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '16px 8px', fontWeight: 600 }}>{issue.title}</td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>{issue.location.address.split(',')[0]}</td>
                    <td style={{ padding: '16px 8px' }}>
                      <span style={{ 
                        background: issue.urgency === 'Critical' ? '#FEF2F2' : 'var(--bg-main)', 
                        color: issue.urgency === 'Critical' ? '#EF4444' : 'var(--text-secondary)',
                        padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600
                      }}>
                        {issue.urgency}
                      </span>
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <span className={`badge badge-${issue.status.toLowerCase().replace(' ', '-')}`}>{issue.status}</span>
                    </td>
                    <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                      <button 
                        className="btn btn-primary btn-sm" 
                        style={{ padding: '6px 12px', fontSize: 12 }}
                        onClick={() => cycleStatus(issue.id, issue.status)}
                      >
                        {issue.status === 'Resolved' ? 'Reopen' : 'Update'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Quick Actions */}
          <div className="card" style={{ padding: 24, background: 'var(--primary)', color: 'white' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>City Management</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button 
                className="btn" 
                onClick={() => setShowWorkerModal(true)}
                style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', justifyContent: 'flex-start', padding: '14px 20px' }}
              >
                <Users size={18} /> Manage Field Workers
              </button>
              <button 
                className="btn" 
                onClick={() => alert("Loading Mapbox integration for Area Zoning...")}
                style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', justifyContent: 'flex-start', padding: '14px 20px' }}
              >
                <Map size={18} /> Area Zone Mapping
              </button>
            </div>
          </div>

          {/* Broadcast Form */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Send size={18} color="var(--primary)" /> Official Broadcast
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Share updates or warnings directly to the citizen community feed.</p>
            <form onSubmit={handleBroadcast}>
              <textarea 
                className="form-input" 
                rows="4" 
                placeholder="Type official update here..." 
                value={broadcastMsg}
                onChange={e => setBroadcastMsg(e.target.value)}
                style={{ resize: 'none', marginBottom: 16, fontSize: 14 }}
              />
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Broadcast to Feed
              </button>
            </form>
          </div>
        </div>
      </div>

      {showToast && (
        <div style={{
          position: 'fixed', bottom: 40, right: 40,
          background: '#10B981', color: 'white', padding: '16px 24px',
          borderRadius: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)', zIndex: 1000
        }}>
          <CheckCircle size={20} /> Update Broadcasted Successfully!
        </div>
      )}

      {/* Workers Modal */}
      {showWorkerModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 500, padding: 24, position: 'relative' }}>
            <button 
              onClick={() => setShowWorkerModal(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={24} />
            </button>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Field Worker Deployment</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Live location tracking of assigned municipal workers.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name: 'Ramesh Singh', role: 'Sanitation Dept', status: 'Active • 2km away', zone: 'Sector 15', active: true },
                { name: 'Vivek Kumar', role: 'Electricity Board', status: 'En route • 4km away', zone: 'Sector 18', active: true },
                { name: 'Suresh Patel', role: 'Public Works', status: 'Off Duty', zone: 'Sector 14', active: false },
              ].map(worker => (
                <div key={worker.name} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'var(--bg-main)', borderRadius: 12 }}>
                  <div style={{ background: worker.active ? '#ECFDF5' : '#F3F4F6', color: worker.active ? '#10B981' : '#9CA3AF', padding: 12, borderRadius: 12 }}>
                    <Users size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{worker.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{worker.role}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: worker.active ? '#10B981' : 'var(--text-muted)' }}>{worker.status}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 2 }}>
                      <MapPin size={10} /> {worker.zone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 20, justifyContent: 'center' }}>
              Dispatch New Unit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
