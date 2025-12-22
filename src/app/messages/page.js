
"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatWindow from '@/components/ChatWindow';
import { MessageSquare, User, Search } from 'lucide-react';

function MessagesContent() {
    const searchParams = useSearchParams();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();

        // Handle new conversation from search params
        const agentId = searchParams.get('agentId');
        const agentName = searchParams.get('name');
        if (agentId && agentName) {
            setSelectedUser({ id: agentId, name: agentName });
        }
    }, [searchParams]);

    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/conversations');
            if (res.ok) {
                const data = await res.json();
                setConversations(data);
                // Select first conversation by default if none selected
                if (data.length > 0 && !selectedUser) {
                    setSelectedUser(data[0].user);
                }
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-8" style={{ minHeight: '80vh' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Messages</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr',
                gap: '2rem',
                minHeight: '600px'
            }}>
                {/* Conversations List */}
                <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', background: '#F8FAFC' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                            <Search size={18} color="var(--muted)" />
                            <input type="text" placeholder="Search chats..." style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {loading && conversations.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>Loading chats...</div>
                        ) : conversations.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                                <MessageSquare size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                <p>No conversations yet.</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv.user.id}
                                    onClick={() => setSelectedUser(conv.user)}
                                    style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid var(--border)',
                                        cursor: 'pointer',
                                        background: selectedUser?.id === conv.user.id ? '#F0F9FF' : 'transparent',
                                        transition: 'background 0.2s',
                                        display: 'flex',
                                        gap: '1rem',
                                        alignItems: 'center'
                                    }}
                                    className="hover:bg-slate-50"
                                >
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: '#E2E8F0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {conv.user.image ? (
                                            <img src={conv.user.image} alt={conv.user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <User size={24} color="#94A3B8" />
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{conv.user.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                                                {new Date(conv.lastMessageDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--muted)',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {conv.lastMessage}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                <div>
                    {selectedUser ? (
                        <ChatWindow
                            recipientId={selectedUser.id}
                            recipientName={selectedUser.name}
                        />
                    ) : (
                        <div className="card" style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--muted)' }}>
                            <div>
                                <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                                <p style={{ fontSize: '1.125rem' }}>Select a conversation to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function MessagesPage() {
    return (
        <Suspense fallback={<div className="container py-8">Loading Messages...</div>}>
            <MessagesContent />
        </Suspense>
    );
}
