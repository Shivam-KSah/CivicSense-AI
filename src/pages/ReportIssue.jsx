import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, MapPin, Camera, Loader, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { analyzeIssueImage } from '../gemini';
import { useIssues } from '../hooks/useIssues';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Pothole', 'Water Leakage', 'Streetlight', 'Garbage', 'Road Damage', 'Tree Hazard', 'Flooding', 'Vandalism', 'Other'];
const DEPARTMENTS = ['Public Works', 'Water Authority', 'Electricity Board', 'Sanitation', 'Traffic', 'Forest Department'];

const LOCATIONS = [
  { lat: 28.6139, lng: 77.2090, address: 'Connaught Place, New Delhi' },
  { lat: 19.0760, lng: 72.8777, address: 'Andheri West, Mumbai' },
  { lat: 12.9716, lng: 77.5946, address: 'Koramangala, Bangalore' },
  { lat: 13.0827, lng: 80.2707, address: 'T. Nagar, Chennai' },
  { lat: 22.5726, lng: 88.3639, address: 'Salt Lake, Kolkata' },
  { lat: 18.5204, lng: 73.8567, address: 'Viman Nagar, Pune' },
  { lat: 17.3850, lng: 78.4867, address: 'Banjara Hills, Hyderabad' },
];

export default function ReportIssue({ onNavigate }) {
  const { user, updateUserXP } = useAuth();
  const { addIssue, issues } = useIssues();
  const fileRef = useRef();

  const [step, setStep] = useState(1);
  const [dragOver, setDragOver] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsLocation, setGpsLocation] = useState(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    severity: 3,
    department: '',
    location: LOCATIONS[0],
    locationText: '',
  });

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = async (e) => {
      setImagePreview(e.target.result);
      setStep(2);
      setAnalyzing(true);
      setDuplicateWarning(null); // Reset duplicate warning on new image

      // Convert to base64
      const base64 = e.target.result.split(',')[1];
      const result = await analyzeIssueImage(base64, file.type);
      setAiResult(result);

      // Auto-fill form
      setForm(prev => ({
        ...prev,
        title: result.title || prev.title,
        description: result.description || prev.description,
        category: result.category || prev.category,
        severity: result.severity || prev.severity,
        department: result.suggestedDepartment || prev.department,
      }));

      setAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const customLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude, address: '📍 Your Current Location (GPS Detected)' };
        setGpsLocation(customLoc);
        setForm(p => ({ ...p, location: customLoc }));
        setGpsLoading(false);
      },
      (err) => {
        alert("Could not get your location. Please check browser permissions.");
        setGpsLoading(false);
      }
    );
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const handleSubmit = (bypassDuplicateCheck = false) => {
    if (!form.title || !form.category) return;

    if (!bypassDuplicateCheck) {
      // Check for duplicates (same category, not resolved)
      const similarIssues = issues?.filter(issue => 
        issue.category === form.category && 
        issue.status !== 'Resolved'
      ) || [];

      if (similarIssues.length > 0) {
        setDuplicateWarning(similarIssues[0]);
        return; // Stop submission to show warning
      }
    }

    addIssue({
      ...form,
      imageUrl: imagePreview,
      reportedBy: user?.displayName || 'Anonymous',
      reportedById: user?.uid,
      aiConfidence: aiResult?.confidence,
      urgency: aiResult?.urgency || 'Medium',
    });

    updateUserXP?.(10);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 500, margin: '60px auto', textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'var(--primary-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          animation: 'pulse 1s ease'
        }}>
          <CheckCircle size={40} color="var(--primary)" />
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Issue Reported! 🎉</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 6 }}>
          Your report has been submitted successfully and is now visible to the community.
        </p>
        <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 16, marginBottom: 28 }}>
          ⚡ +10 XP Earned!
        </p>

        {aiResult && (
          <div className="ai-panel" style={{ textAlign: 'left', marginBottom: 24 }}>
            <div className="ai-panel-header">
              <Sparkles size={16} /> AI Analysis Summary
            </div>
            <div className="ai-result-grid">
              <div className="ai-result-item">
                <div className="ai-result-label">Category</div>
                <div className="ai-result-value">{aiResult.category}</div>
              </div>
              <div className="ai-result-item">
                <div className="ai-result-label">Severity</div>
                <div className="ai-result-value">{aiResult.severity}/5</div>
              </div>
              <div className="ai-result-item">
                <div className="ai-result-label">Department</div>
                <div className="ai-result-value">{aiResult.suggestedDepartment}</div>
              </div>
              <div className="ai-result-item">
                <div className="ai-result-label">Urgency</div>
                <div className="ai-result-value">{aiResult.urgency}</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={() => { setStep(1); setSubmitted(false); setAiResult(null); setImagePreview(null); setForm({ title: '', description: '', category: '', severity: 3, department: '', location: LOCATIONS[0], locationText: '' }); }}>
            Report Another
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('feed')}>
            View in Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'var(--primary-light)', padding: 8, borderRadius: 12, color: 'var(--primary)', display: 'flex' }}>
              <Camera size={24} strokeWidth={2.5} />
            </div>
            Report an Issue
          </h1>
          <p className="page-subtitle">Upload a photo — Gemini AI will automatically analyze and categorize your issue</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 28, background: 'var(--bg-main)', borderRadius: 'var(--radius-lg)', padding: 4 }}>
        {['Upload Photo', 'AI Analysis', 'Details & Submit'].map((s, i) => (
          <div
            key={s}
            style={{
              flex: 1, textAlign: 'center', padding: '10px',
              borderRadius: 'var(--radius-md)',
              background: step > i ? 'var(--white)' : 'transparent',
              boxShadow: step > i ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition)'
            }}
          >
            <div style={{ fontSize: 13, fontWeight: step > i ? 700 : 500, color: step > i ? 'var(--primary)' : 'var(--text-muted)' }}>
              {step > i + 1 ? '✅ ' : `${i + 1}. `}{s}
            </div>
          </div>
        ))}
      </div>

      <div className="two-col" style={{ gap: 24, alignItems: 'start' }}>
        {/* Left: Upload + Preview */}
        <div>
          {!imagePreview ? (
            <div
              className={`upload-area ${dragOver ? 'drag-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              id="upload-area"
            >
              <div className="upload-icon">
                <Camera size={48} strokeWidth={1} />
              </div>
              <div className="upload-title">Drop your photo here</div>
              <div className="upload-subtitle" style={{ marginBottom: 16 }}>or click to browse your device</div>
              <button className="btn btn-primary btn-sm">
                <Upload size={14} /> Choose Photo
              </button>
              <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                Supports JPG, PNG, HEIC, WebP • Max 10MB
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files[0])}
                id="file-input"
              />
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative' }}>
                <img src={imagePreview} alt="Issue preview" style={{ width: '100%', height: 240, objectFit: 'cover' }} />
                <button
                  onClick={() => { setImagePreview(null); setAiResult(null); setStep(1); }}
                  style={{
                    position: 'absolute', top: 10, right: 10,
                    background: 'rgba(0,0,0,0.6)', color: 'white',
                    border: 'none', width: 28, height: 28, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
              <div style={{ padding: 16 }}>
                {analyzing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--primary)' }}>
                    <Loader size={16} className="spinner" style={{ animation: 'spin 0.6s linear infinite' }} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>Gemini AI is analyzing your image...</span>
                  </div>
                ) : aiResult ? (
                  <div className="ai-panel">
                    <div className="ai-panel-header">
                      <Sparkles size={16} /> AI Analysis Complete
                    </div>
                    <div className="ai-result-grid">
                      <div className="ai-result-item">
                        <div className="ai-result-label">Category</div>
                        <div className="ai-result-value">{aiResult.category}</div>
                      </div>
                      <div className="ai-result-item">
                        <div className="ai-result-label">Severity</div>
                        <div className="ai-result-value">{aiResult.severity}/5 — {aiResult.urgency}</div>
                      </div>
                      <div className="ai-result-item" style={{ gridColumn: 'span 2' }}>
                        <div className="ai-result-label">Department</div>
                        <div className="ai-result-value">{aiResult.suggestedDepartment}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div className="progress-fill" style={{ width: `${aiResult.confidence}%` }} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{aiResult.confidence}% confident</span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Right: Form */}
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Issue Details</h3>

          <div className="form-group">
            <label className="form-label">Issue Title *</label>
            <input
              className="form-input"
              placeholder="Brief description of the issue"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              id="issue-title"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              id="issue-category"
            >
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Describe the issue in detail..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              id="issue-description"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Severity: {form.severity}/5</label>
            <input
              type="range" min="1" max="5" value={form.severity}
              onChange={e => setForm(p => ({ ...p, severity: parseInt(e.target.value) }))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
              id="severity-slider"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              <span>Minor</span><span>Moderate</span><span>Critical</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={13} color="var(--primary)" /> Location
              </div>
              <button 
                onClick={(e) => { e.preventDefault(); handleGetGPS(); }} 
                disabled={gpsLoading}
                className="btn btn-sm"
                style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 8px', fontSize: 11, border: 'none' }}
              >
                {gpsLoading ? <Loader size={12} className="spinner" /> : '📍 Use My GPS'}
              </button>
            </label>
            <select
              className="form-select"
              value={form.location.address}
              onChange={e => {
                if (e.target.value === '📍 Your Current Location (GPS Detected)') {
                  setForm(p => ({ ...p, location: gpsLocation }));
                } else {
                  setForm(p => ({ ...p, location: LOCATIONS.find(l => l.address === e.target.value) }));
                }
              }}
              id="location-select"
            >
              {gpsLocation && <option value={gpsLocation.address}>{gpsLocation.address}</option>}
              {LOCATIONS.map((l) => <option key={l.address} value={l.address}>{l.address}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <select
              className="form-select"
              value={form.department}
              onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
              id="department-select"
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {duplicateWarning && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: 12, borderRadius: 8, marginBottom: 16 }}>
              <div style={{ color: '#DC2626', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <AlertTriangle size={14} /> AI Duplicate Detected!
              </div>
              <p style={{ fontSize: 12, color: '#991B1B', margin: 0, marginBottom: 10 }}>
                A similar issue ("{duplicateWarning.title}") was already reported recently.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1, borderColor: '#FCA5A5', color: '#DC2626' }} onClick={() => onNavigate('feed')}>
                  View Feed
                </button>
                <button className="btn btn-sm" style={{ flex: 1, background: '#DC2626', color: 'white', border: 'none' }} onClick={() => handleSubmit(true)}>
                  Submit Anyway
                </button>
              </div>
            </div>
          )}

          {!duplicateWarning && (
            <button
              id="submit-report-btn"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
              onClick={() => handleSubmit(false)}
              disabled={!form.title || !form.category}
            >
              <CheckCircle size={16} /> Submit Report • +10 XP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
