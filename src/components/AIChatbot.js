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
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, fontFamily: 'var(--font-geist-sans)' }}>
            {/* Chat Window */}
            {isOpen && (
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-300" style={{
                    width: '350px',
                    height: '500px',
                    background: 'white',
                    borderRadius: '1rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    border: '1px solid var(--border)',
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1rem',
                        background: 'linear-gradient(135deg, var(--primary) 0%, #2563EB 100%)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.25rem', borderRadius: '0.25rem' }}>
                                <Sparkles size={18} />
                            </div>
                            <span style={{ fontWeight: '600' }}>AI Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ color: 'white', opacity: 0.8, background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                padding: '0.75rem 1rem',
                                borderRadius: '1rem',
                                borderBottomRightRadius: msg.role === 'user' ? '0' : '1rem',
                                borderBottomLeftRadius: msg.role === 'assistant' ? '0' : '1rem',
                                background: msg.role === 'user' ? 'var(--primary)' : 'white',
                                color: msg.role === 'user' ? 'white' : 'var(--foreground)',
                                boxShadow: msg.role === 'assistant' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                                fontSize: '0.9rem',
                                lineHeight: '1.4'
                            }}>
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ alignSelf: 'flex-start', background: 'white', padding: '0.75rem', borderRadius: '1rem', borderBottomLeftRadius: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    <div className="animate-bounce" style={{ width: '6px', height: '6px', background: '#94A3B8', borderRadius: '50%' }}></div>
                                    <div className="animate-bounce" style={{ width: '6px', height: '6px', background: '#94A3B8', borderRadius: '50%', animationDelay: '0.1s' }}></div>
                                    <div className="animate-bounce" style={{ width: '6px', height: '6px', background: '#94A3B8', borderRadius: '50%', animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} style={{ padding: '1rem', background: 'white', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--border)',
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            style={{
                                background: 'var(--primary)',
                                color: 'white',
                                width: '2.75rem',
                                borderRadius: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: (!input.trim() || isLoading) ? 0.5 : 1,
                                border: 'none',
                                cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="hover:scale-110 shadow-lg shadow-blue-500/20"
                    style={{
                        width: '3.5rem',
                        height: '3.5rem',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary) 0%, #2563EB 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        border: 'none',
                        position: 'relative'
                    }}
                >
                    <MessageSquare size={24} />
                    {/* Notification Dot */}
                    <span style={{ position: 'absolute', top: '0', right: '0', display: 'flex', height: '0.75rem', width: '0.75rem' }}>
                        <span className="animate-ping" style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: '#EF4444', opacity: 0.75 }}></span>
                        <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '0.75rem', width: '0.75rem', background: '#EF4444' }}></span>
                    </span>
                </button>
            )}
        </div>
    );
}
