
"use client";
import { useState, useEffect, useRef } from 'react';
import { Send, User, X } from 'lucide-react';
import Button from './Button';

export default function ChatWindow({ recipientId, recipientName, onClose }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (!recipientId) return;
        fetchMessages();

        // Poll for new messages every 5 seconds
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [recipientId]);

    useEffect(() => {
        // Scroll to bottom when messages update
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/messages?userId=${recipientId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newMessage,
                    receiverId: recipientId
                })
            });

            if (res.ok) {
                const sentMsg = await res.json();
                setMessages(prev => [...prev, sentMsg]);
                setNewMessage('');
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setSending(false);
        }
    };

    if (!recipientId) return null;

    return (
        <div className="card" style={{
            height: '500px',
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)'
        }}>
            {/* Header */}
            <div style={{
                padding: '1rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--primary)',
                color: 'white'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}>
                        <User size={18} />
                    </div>
                    <span style={{ fontWeight: '600' }}>{recipientName}</span>
                </div>
                {onClose && (
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                background: '#F8FAFC'
            }}>
                {loading && messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--muted)', marginTop: '2rem' }}>Loading conversation...</div>
                ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--muted)', marginTop: '2rem' }}>No messages yet. Say hello!</div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = msg.senderId !== recipientId;
                        return (
                            <div key={msg.id || i} style={{
                                alignSelf: isMe ? 'flex-end' : 'flex-start',
                                maxWidth: '80%'
                            }}>
                                <div style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: '1rem',
                                    borderBottomRightRadius: isMe ? '0.25rem' : '1rem',
                                    borderBottomLeftRadius: isMe ? '1rem' : '0.25rem',
                                    background: isMe ? 'var(--primary)' : 'white',
                                    color: isMe ? 'white' : 'var(--foreground)',
                                    boxShadow: 'var(--shadow-sm)',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.5,
                                    border: isMe ? 'none' : '1px solid var(--border)'
                                }}>
                                    {msg.content}
                                </div>
                                <div style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--muted)',
                                    marginTop: '0.25rem',
                                    textAlign: isMe ? 'right' : 'left'
                                }}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer / Input */}
            <form onSubmit={handleSendMessage} style={{
                padding: '1rem',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                gap: '0.5rem',
                background: 'white'
            }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{
                        flex: 1,
                        border: '1px solid var(--border)',
                        borderRadius: '999px',
                        padding: '0.75rem 1.25rem',
                        outline: 'none',
                        fontSize: '0.95rem'
                    }}
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    style={{
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '42px',
                        height: '42px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: newMessage.trim() ? 'pointer' : 'default',
                        opacity: newMessage.trim() ? 1 : 0.6
                    }}
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}
