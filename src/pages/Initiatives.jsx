import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, BookOpen, ExternalLink, ShieldCheck, TreePine, Droplets, Globe, Trash2, Droplet, PhoneCall, Cpu } from 'lucide-react';

const GOVT_INITIATIVES = [
  {
    title: 'Swachh Bharat Abhiyan',
    desc: 'National campaign to clean streets, roads, and infrastructure across the country, focusing on sanitation and waste management.',
    icon: ShieldCheck,
    color: '#10B981',
    link: 'https://swachhbharatmission.ddws.gov.in/'
  },
  {
    title: 'Smart Cities Mission',
    desc: 'Urban renewal and retrofitting program by the Government of India with the mission to develop sustainable and citizen-friendly cities.',
    icon: Megaphone,
    color: '#3B82F6',
    link: 'https://smartcities.gov.in/'
  },
  {
    title: 'Jal Jeevan Mission',
    desc: 'Initiative to provide safe and adequate drinking water through individual household tap connections to all households.',
    icon: Droplets,
    color: '#0EA5E9',
    link: 'https://jaljeevanmission.gov.in/'
  }
];

const INITIAL_DRIVES = [
  {
    id: 1,
    title: 'Weekend Park Cleanup',
    org: 'Sector 15 Welfare Society',
    date: 'Saturday, 9:00 AM',
    location: 'Sector 15 Central Park',
    participants: 45,
    xpPoints: 50,
    tags: ['Cleanup', 'Community'],
    posted: 'Posted Jun 20, 2026',
    deadline: '2 days left',
    joined: false,
    icon: Trash2,
    color: '#F59E0B'
  },
  {
    id: 2,
    title: 'E-Waste Collection Drive',
    org: 'Green Earth NGO',
    date: 'Sunday, 10:00 AM',
    location: 'Community Center Main Hall',
    participants: 120,
    xpPoints: 100,
    tags: ['E-Waste', 'Recycling'],
    posted: 'Posted Jun 18, 2026',
    deadline: '3 days left',
    joined: false,
    icon: Cpu,
    color: '#6366F1'
  },
  {
    id: 3,
    title: 'Tree Plantation Marathon',
    org: 'Govt. Forest Department',
    date: 'Next Friday, 8:00 AM',
    location: 'Highway Sector 14 Border',
    participants: 310,
    xpPoints: 150,
    tags: ['Environment', 'Plantation'],
    posted: 'Posted Jun 15, 2026',
    deadline: '8 days left',
    joined: false,
    icon: TreePine,
    color: '#10B981'
  }
];

export default function Initiatives() {
  const [drives, setDrives] = useState(INITIAL_DRIVES);
  const [xpFlash, setXpFlash] = useState(null);

  const handleJoin = (id, xp) => {
    setDrives(prev => prev.map(d => {
      if (d.id === id) return { ...d, joined: true, participants: d.participants + 1 };
      return d;
    }));
    setXpFlash(xp);
    setTimeout(() => setXpFlash(null), 2500);
  };
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 40 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#ECFDF5', padding: 8, borderRadius: 12, color: '#10B981', display: 'flex' }}>
              <Globe size={24} strokeWidth={2.5} />
            </div>
            Initiatives & Drives
          </h1>
          <p className="page-subtitle">Stay updated on government programs, local drives, and civic guidelines</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
        
        {/* Government Initiatives Section */}
        <section>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={20} color="var(--primary)" /> National & Local Initiatives
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {GOVT_INITIATIVES.map((item, idx) => (
              <div key={idx} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ background: `${item.color}20`, padding: 10, borderRadius: 12, color: item.color }}>
                    <item.icon size={20} />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{item.title}</h3>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16, flex: 1 }}>
                  {item.desc}
                </p>
                <button 
                  className="btn btn-outline btn-sm" 
                  style={{ alignSelf: 'flex-start', color: item.color, borderColor: `${item.color}50` }}
                  onClick={() => window.open(item.link, '_blank')}
                >
                  Learn More <ExternalLink size={12} style={{ marginLeft: 4 }} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Drives Section (Unstop Style) */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={20} color="var(--primary)" /> Upcoming Community Drives
            </h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
            {drives.map((drive) => (
              <div key={drive.id} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', transition: 'var(--transition)' }}>
                {/* Header with Title and Image */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, lineHeight: 1.3 }}>{drive.title}</h3>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{drive.org}</div>
                  </div>
                  <div style={{ width: 56, height: 56, background: `${drive.color}15`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: drive.color, border: `1px solid ${drive.color}30` }}>
                    <drive.icon size={28} strokeWidth={2} />
                  </div>
                </div>

                {/* Info row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    👥 Individual Participation
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    📍 {drive.location}
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                  {drive.tags.map(tag => (
                    <span key={tag} style={{ background: 'var(--bg-main)', color: 'var(--text-secondary)', padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{drive.posted}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>⌛ {drive.deadline}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {drive.participants} joined
                    </div>
                    {drive.joined ? (
                      <button className="btn btn-sm" style={{ background: '#E2E8F0', color: '#64748B', border: 'none', cursor: 'default' }}>
                        Joined ✅
                      </button>
                    ) : (
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => handleJoin(drive.id, drive.xpPoints)}
                      >
                        Join • +{drive.xpPoints} XP
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Guidelines Section */}
        <section>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={20} color="var(--primary)" /> Guidelines & Resources
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { title: 'Waste Segregation Guide', desc: 'Learn how to properly separate dry, wet, and hazardous waste at home.', icon: Trash2, color: '#F59E0B', link: 'https://wastewarriors.org/how-segregate-waste-correct-way/' },
              { title: 'Water Conservation', desc: 'Tips and municipal rules for reducing water wastage during summer.', icon: Droplet, color: '#3B82F6', link: 'https://jalshakti-dowr.gov.in/' },
              { title: 'Emergency Contacts', desc: 'Directory of all local municipal departments and emergency services.', icon: PhoneCall, color: '#EF4444', link: 'https://indianhelpline.com/' }
            ].map((guide, idx) => (
              <div key={idx} className="card hover-lift" onClick={() => window.open(guide.link, '_blank')} style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'var(--transition)' }}>
                <div style={{ background: `${guide.color}20`, color: guide.color, padding: 12, borderRadius: 12, display: 'flex' }}>
                  <guide.icon size={28} strokeWidth={2} />
                </div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>{guide.title} <ExternalLink size={12} color="var(--text-muted)" /></h3>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{guide.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Flashing XP Overlay */}
      {xpFlash && (
        <div style={{
          position: 'fixed', bottom: 40, right: 40, zIndex: 9999,
          background: 'var(--primary)', color: 'white',
          padding: '16px 24px', borderRadius: '100px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
          animation: 'slideUpFade 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          fontWeight: 800, fontSize: 18
        }}>
          <span>🎉</span> +{xpFlash} XP Earned!
        </div>
      )}

      <style>{`
        @keyframes slideUpFade {
          0% { transform: translateY(40px) scale(0.8); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
