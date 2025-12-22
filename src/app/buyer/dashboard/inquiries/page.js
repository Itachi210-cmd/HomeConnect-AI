"use client";
import { useProperties } from '@/context/PropertyContext';
import { MessageSquare, Calendar, CheckCircle, Clock } from 'lucide-react';

export default function InquiriesPage() {
    const { inquiries, properties } = useProperties();

    const getPropertyTitle = (id) => {
        const prop = properties.find(p => p.id === id);
        return prop ? prop.title : 'Unknown Property';
    };

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MessageSquare className="text-primary" /> My Inquiries
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {inquiries.map(inquiry => (
                    <div key={inquiry.id} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                        <div style={{
                            background: inquiry.status === 'Replied' ? '#DCFCE7' : '#FEF3C7',
                            color: inquiry.status === 'Replied' ? '#166534' : '#92400E',
                            padding: '0.5rem',
                            borderRadius: '0.5rem'
                        }}>
                            {inquiry.status === 'Replied' ? <CheckCircle size={24} /> : <Clock size={24} />}
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{getPropertyTitle(inquiry.propertyId)}</h3>
                                <span style={{ fontSize: '0.875rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Calendar size={14} /> {inquiry.date}
                                </span>
                            </div>
                            <p style={{ color: 'var(--foreground)', marginBottom: '1rem' }}>{inquiry.message}</p>

                            <div style={{
                                display: 'inline-block',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '1rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                background: inquiry.status === 'Replied' ? '#DCFCE7' : '#FEF3C7',
                                color: inquiry.status === 'Replied' ? '#166534' : '#92400E'
                            }}>
                                {inquiry.status}
                            </div>
                        </div>
                    </div>
                ))}

                {inquiries.length === 0 && (
                    <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <MessageSquare size={48} style={{ color: 'var(--muted)', marginBottom: '1rem', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>No inquiries yet</h3>
                        <p style={{ color: 'var(--muted)' }}>Questions you ask about properties will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
