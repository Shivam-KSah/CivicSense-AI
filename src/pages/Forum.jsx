import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Forum() {
  const { user } = useAuth();
  
  // Load messages from localStorage or use defaults
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem('civicsense_forum');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      { id: 1, author: 'System Admin', text: 'Welcome to the General Discussion Forum! Use this space to chat with neighbors, organize community cleanups, or discuss local events.', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: 2, author: 'Priya Sharma', text: 'Has anyone noticed the new recycling bins in Sector 15? They look great!', timestamp: new Date(Date.now() - 3600000).toISOString() }
    ];
  });
  
  const [input, setInput] = useState('');

  // Save to localStorage when messages change
  useEffect(() => {
    localStorage.setItem('civicsense_forum', JSON.stringify(messages));
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      author: user?.displayName || 'Anonymous Citizen',
      text: input.trim(),
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#FCE7F3', padding: 8, borderRadius: 12, color: '#DB2777', display: 'flex' }}>
              <MessageSquare size={24} strokeWidth={2.5} />
            </div>
            General Discussion
          </h1>
          <p className="page-subtitle">Chat with your neighbors and organize community initiatives</p>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', padding: 0, overflow: 'hidden' }}>
        
        {/* Messages Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--bg-main)' }}>
          {messages.map((msg) => {
            const isMe = msg.author === (user?.displayName || 'Anonymous Citizen');
            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, marginLeft: isMe ? 0 : 4, marginRight: isMe ? 4 : 0 }}>
                  {msg.author} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div style={{ 
                  background: isMe ? 'var(--primary)' : 'var(--white)',
                  color: isMe ? 'white' : 'var(--text-primary)',
                  padding: '12px 16px',
                  borderRadius: 16,
                  borderBottomRightRadius: isMe ? 4 : 16,
                  borderBottomLeftRadius: isMe ? 16 : 4,
                  boxShadow: 'var(--shadow-sm)',
                  maxWidth: '80%',
                  fontSize: 14,
                  lineHeight: 1.5,
                  border: isMe ? 'none' : '1px solid var(--border)'
                }}>
                  {msg.text}
                </div>
              </div>
            )
          })}
        </div>

        {/* Input Area */}
        <div style={{ padding: '16px 24px', background: 'var(--white)', borderTop: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: 1, borderRadius: 'var(--radius-full)', padding: '12px 20px' }}
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button 
            className="btn btn-primary"
            style={{ borderRadius: 'var(--radius-full)', width: 44, height: 44, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send size={18} style={{ transform: 'translateX(-1px)' }} />
          </button>
        </div>

      </div>
    </div>
  );
}
