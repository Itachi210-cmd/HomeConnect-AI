"use client";
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I am your AI assistant. Ask me anything about properties, market trends, or mortgage rates!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();
            setMessages(prev => [...prev, data.message]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
            {/* Chat Window */}
            {isOpen && (
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-300 glass" style={{
                    width: '380px',
                    height: '550px',
                    borderRadius: '1.5rem',
                    boxShadow: 'var(--shadow-xl)',
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid var(--glass-border)'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1.25rem',
                        background: 'var(--gradient-primary)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.4rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Sparkles size={20} className="animate-pulse" />
                            </div>
                            <div>
                                <div style={{ fontWeight: '800', fontSize: '1rem', letterSpacing: '-0.02em' }}>HomeConnect AI</div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: '500' }}>Always active • Ready to help</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                color: 'white',
                                opacity: 0.8,
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                cursor: 'pointer',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                            className="hover:rotate-90 hover:opacity-100"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        padding: '1.5rem',
                        overflowY: 'auto',
                        background: 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.25rem'
                    }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                padding: '1rem 1.25rem',
                                borderRadius: '1.25rem',
                                borderBottomRightRadius: msg.role === 'user' ? '0.25rem' : '1.25rem',
                                borderBottomLeftRadius: msg.role === 'assistant' ? '0.25rem' : '1.25rem',
                                background: msg.role === 'user' ? 'var(--primary)' : 'var(--input)',
                                color: msg.role === 'user' ? 'white' : 'var(--foreground)',
                                boxShadow: 'var(--shadow-sm)',
                                fontSize: '0.95rem',
                                lineHeight: '1.5',
                                border: `1px solid ${msg.role === 'user' ? 'var(--primary-dark)' : 'var(--border)'}`,
                                transition: 'all 0.3s'
                            }}>
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ alignSelf: 'flex-start', background: 'var(--input)', padding: '1rem', borderRadius: '1.25rem', borderBottomLeftRadius: '0.25rem', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    {[0, 0.1, 0.2].map((delay, i) => (
                                        <div key={i} className="animate-bounce" style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', animationDelay: `${delay}s`, opacity: 0.6 }}></div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} style={{
                        padding: '1.25rem',
                        background: 'transparent',
                        borderTop: '1px solid var(--glass-border)',
                        display: 'flex',
                        gap: '0.75rem'
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            style={{
                                flex: 1,
                                padding: '0.875rem 1.25rem',
                                borderRadius: '1rem',
                                border: '1px solid var(--border)',
                                outline: 'none',
                                fontSize: '0.95rem',
                                background: 'var(--input)',
                                color: 'var(--foreground)',
                                transition: 'border-color 0.2s',
                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                            }}
                            className="focus:border-primary"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            style={{
                                background: 'var(--primary)',
                                color: 'white',
                                width: '3.25rem',
                                height: '3.25rem',
                                borderRadius: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                            }}
                            className="hover:scale-105 active:scale-95"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="hover-scale"
                    style={{
                        width: '4rem',
                        height: '4rem',
                        borderRadius: '1.25rem',
                        background: 'var(--gradient-primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        border: 'none',
                        position: 'relative',
                        boxShadow: '0 10px 30px rgba(79, 70, 229, 0.4)'
                    }}
                >
                    <MessageSquare size={28} />
                    {/* Notification Dot */}
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', display: 'flex', height: '1.25rem', width: '1.25rem' }}>
                        <span className="animate-ping" style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: '#EF4444', opacity: 0.75 }}></span>
                        <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '1.25rem', width: '1.25rem', background: '#EF4444', border: '3px solid var(--background)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></span>
                    </span>
                </button>
            )}
        </div>
    );
}
