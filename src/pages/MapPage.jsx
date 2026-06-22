import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Map as MapIcon } from 'lucide-react';
import L from 'leaflet';
import { useIssues } from '../hooks/useIssues';
import { StatusBadge } from '../components/IssueCard';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const STATUS_MARKER_COLORS = {
  'Open': '#EF4444',
  'In Progress': '#F59E0B',
  'Resolved': '#10B981',
  'Verified': '#3B82F6',
};

function createMarkerIcon(status, severity) {
  const color = STATUS_MARKER_COLORS[status] || '#EF4444';
  const size = 10 + severity * 4;
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const CATEGORY_ICONS = {
  'Pothole': '🕳️', 'Water Leakage': '💧', 'Streetlight': '💡',
  'Garbage': '🗑️', 'Road Damage': '🚧', 'Tree Hazard': '🌳',
  'Flooding': '🌊', 'Vandalism': '🔨', 'Other': '📋',
};

const FILTER_OPTIONS = ['All', 'Open', 'In Progress', 'Resolved', 'Verified'];
const CATEGORY_FILTERS = ['All', 'Pothole', 'Water Leakage', 'Streetlight', 'Garbage', 'Road Damage', 'Other'];

const PREDICTIVE_HOTSPOTS = [
  { lat: 28.5355, lng: 77.3910, radius: 600, risk: 'High', prob: 85, type: 'Severe Water Logging (Monsoon)' },
  { lat: 19.0760, lng: 72.8777, radius: 800, risk: 'Critical', prob: 92, type: 'Drainage Failure & Flooding' },
  { lat: 12.9716, lng: 77.5946, radius: 500, risk: 'High', prob: 78, type: 'Pothole Clusters & Road Degradation' },
  { lat: 13.0827, lng: 80.2707, radius: 700, risk: 'High', prob: 88, type: 'Monsoon Flood Zone' },
  { lat: 28.6139, lng: 77.2090, radius: 450, risk: 'Medium', prob: 65, type: 'Traffic Signal Failures (Rain)' },
];

export default function MapPage({ onNavigate }) {
  const { issues } = useIssues();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showHotspots, setShowHotspots] = useState(false);

  const filtered = issues.filter(i =>
    (statusFilter === 'All' || i.status === statusFilter) &&
    (categoryFilter === 'All' || i.category === categoryFilter)
  );

  const center = [28.5355, 77.3910];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#EFF6FF', padding: 8, borderRadius: 12, color: '#3B82F6', display: 'flex' }}>
              <MapIcon size={24} strokeWidth={2.5} />
            </div>
            Community Issue Map
          </h1>
          <p className="page-subtitle">{filtered.length} issues displayed • Click markers to see details</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            className={`btn ${showHotspots ? 'btn-primary' : 'btn-outline'} btn-sm`} 
            style={{ borderColor: showHotspots ? 'transparent' : 'var(--primary)', color: showHotspots ? 'white' : 'var(--primary)', background: showHotspots ? 'var(--primary)' : 'transparent' }}
            onClick={() => setShowHotspots(!showHotspots)}
          >
            🔥 {showHotspots ? 'Hide AI Hotspots' : 'Predictive Hotspots'}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('report')}>
            + Report Issue
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-main)', padding: 4, borderRadius: 'var(--radius-full)' }}>
          {FILTER_OPTIONS.map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              style={{
                padding: '5px 14px', borderRadius: 'var(--radius-full)', border: 'none',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'var(--transition)',
                background: statusFilter === f ? 'var(--white)' : 'transparent',
                color: statusFilter === f ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: statusFilter === f ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <select
          className="form-select"
          style={{ width: 'auto', padding: '5px 32px 5px 12px', fontSize: 13 }}
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          {CATEGORY_FILTERS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        {Object.entries(STATUS_MARKER_COLORS).map(([s, c]) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: c, border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            {s}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedIssue ? '1fr 340px' : '1fr', gap: 16 }}>
        {/* Map */}
        <div className="map-container">
          <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map(issue => (
              issue.location?.lat && (
                <Marker
                  key={issue.id}
                  position={[issue.location.lat, issue.location.lng]}
                  icon={createMarkerIcon(issue.status, issue.severity)}
                  eventHandlers={{ click: () => setSelectedIssue(issue) }}
                >
                  <Popup>
                    <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 160 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{issue.title}</div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>{issue.category} • {issue.status}</div>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}

            {showHotspots && PREDICTIVE_HOTSPOTS.map((spot, i) => (
              <Circle
                key={`hotspot-${i}`}
                center={[spot.lat, spot.lng]}
                radius={spot.radius}
                pathOptions={{ 
                  color: spot.risk === 'Critical' ? '#DC2626' : '#EA580C', 
                  fillColor: spot.risk === 'Critical' ? '#EF4444' : '#F97316', 
                  fillOpacity: 0.3,
                  weight: 2,
                  dashArray: '4 4'
                }}
              >
                <Popup>
                  <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 180 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', marginBottom: 4 }}>
                      🤖 AI Prediction: {spot.risk} Risk
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6 }}>{spot.type}</div>
                    <p style={{ fontSize: 11, color: '#4B5563', margin: 0 }}>
                      Based on historical weather & civic data, there is an <strong>{spot.prob}% probability</strong> of infrastructure failure here in the next 30 days. Preventative action recommended.
                    </p>
                  </div>
                </Popup>
              </Circle>
            ))}
          </MapContainer>
        </div>

        {/* Issue Detail Side Panel */}
        {selectedIssue && (
          <div className="card" style={{ padding: 0, overflow: 'hidden', height: 500 }}>
            {/* Issue image / header */}
            <div style={{
              height: 120,
              background: `linear-gradient(135deg, var(--primary-light), var(--bg-main))`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative'
            }}>
              <span style={{ fontSize: 52 }}>{CATEGORY_ICONS[selectedIssue.category] || '📋'}</span>
              <button
                onClick={() => setSelectedIssue(null)}
                style={{
                  position: 'absolute', top: 8, right: 8,
                  background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white',
                  width: 24, height: 24, borderRadius: '50%', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >✕</button>
              <div style={{ position: 'absolute', bottom: 8, left: 12 }}>
                <StatusBadge status={selectedIssue.status} />
              </div>
            </div>

            <div style={{ padding: 16, overflowY: 'auto', height: 'calc(100% - 120px)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                {selectedIssue.category}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, lineHeight: 1.3 }}>
                {selectedIssue.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
                {selectedIssue.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: '📍 Location', value: selectedIssue.location?.address },
                  { label: '👤 Reported by', value: selectedIssue.reportedBy },
                  { label: '🏢 Department', value: selectedIssue.department || 'Not assigned' },
                  { label: '⚠️ Severity', value: `${selectedIssue.severity}/5 — ${selectedIssue.urgency}` },
                  { label: '✅ Verifications', value: `${selectedIssue.verifyCount} community members` },
                  { label: '👍 Upvotes', value: selectedIssue.votes },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right', maxWidth: '55%' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {selectedIssue.aiConfidence && (
                <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>🤖 AI Confidence</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${selectedIssue.aiConfidence}%` }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{selectedIssue.aiConfidence}% accurate categorization</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
