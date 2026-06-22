import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Minimize2 } from 'lucide-react';
import { getChatResponse } from '../gemini';

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'bot',
    text: "Hi! I'm CivicBot 🏘️ Your AI assistant for community issues. How can I help you today?",
  },
  {
    id: 2,
    role: 'bot',
    text: "You can ask me to help report an issue, check status of reports, or learn about civic processes!",
  }
];

const QUICK_REPLIES = [
  "How do I report an issue?",
  "What's the status of my reports?",
  "How does verification work?",
  "What XP do I earn?",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;

    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const response = await getChatResponse(userMsg);
    
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: response }]);
    setLoading(false);
  };

  return (
    <>
      {/* FAB Button */}
      <button
        className="chat-fab"
        onClick={() => setIsOpen(!isOpen)}
        id="chat-fab-btn"
        title="Chat with CivicBot"
      >
        {isOpen ? <X size={22} /> : <Bot size={22} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <Bot size={18} />
              </div>
              <div>
                <div className="chat-title">CivicBot</div>
                <div className="chat-status">🟢 Always online</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: 6, borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex' }}
            >
              <Minimize2 size={14} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-msg ${msg.role}`}>
                <div className="chat-bubble">{msg.text}</div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg bot">
                <div className="chat-bubble" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span className="spinner" style={{ width: 14, height: 14 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Thinking...</span>
                </div>
              </div>
            )}

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {QUICK_REPLIES.map(reply => (
                  <button
                    key={reply}
                    onClick={() => sendMessage(reply)}
                    style={{
                      padding: '8px 12px', border: '1.5px solid var(--primary)',
                      borderRadius: 'var(--radius-full)', background: 'var(--white)',
                      color: 'var(--primary)', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', textAlign: 'left', transition: 'var(--transition)'
                    }}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <input
              className="chat-input"
              type="text"
              placeholder="Ask CivicBot anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button
              className="chat-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{ opacity: !input.trim() ? 0.5 : 1, border: 'none', cursor: 'pointer' }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
