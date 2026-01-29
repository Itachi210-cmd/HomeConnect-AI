"use client";
import { useLeads } from '@/context/LeadContext';
import { Phone, Mail, User, Edit } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

export default function LeadsPage() {
    const { leads, updateLeadStatus } = useLeads();

    const columns = [
        { id: 'New', title: 'New Leads', color: '#2563EB', bg: 'rgba(37, 99, 235, 0.1)', border: 'rgba(37, 99, 235, 0.2)' }, // Blue
        { id: 'Contacted', title: 'Contacted', color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)', border: 'rgba(217, 119, 6, 0.2)' }, // Amber
        { id: 'Qualified', title: 'Qualified', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.1)', border: 'rgba(124, 58, 237, 0.2)' }, // Violet
        { id: 'Closed', title: 'Closed', color: '#059669', bg: 'rgba(5, 150, 105, 0.1)', border: 'rgba(5, 150, 105, 0.2)' } // Emerald
    ];

    const getLeadsByStatus = (status) => leads.filter(lead => lead.status === status);

    return (
        <FadeIn>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Lead Management</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
                {columns.map(column => (
                    <div key={column.id} style={{ background: 'var(--input)', borderRadius: 'var(--radius)', padding: '1rem', minHeight: '500px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--border)' }}>
                            <h3 style={{ fontWeight: 'bold', color: column.color }}>{column.title}</h3>
                            <span style={{ background: 'var(--background)', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: 'var(--shadow-sm)' }}>
                                {getLeadsByStatus(column.id).length}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {getLeadsByStatus(column.id).map(lead => (
                                <div key={lead.id} className="card" style={{
                                    padding: '1rem',
                                    background: column.bg,
                                    border: `1px solid ${column.border}`,
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                    transition: 'transform 0.2s',
                                    cursor: 'grab'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{lead.name}</h4>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                                                {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : lead.date || 'No Date'}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <p style={{ fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.25rem' }}>Interested in:</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>
                                            {lead.message || lead.interest || "General Inquiry"}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <a href={`tel:${lead.phone}`} style={{ padding: '0.25rem', borderRadius: '4px', background: '#F0FDF4', color: '#15803D' }} title="Call">
                                            <Phone size={14} />
                                        </a>
                                        <a href={`mailto:${lead.email}`} style={{ padding: '0.25rem', borderRadius: '4px', background: '#EFF6FF', color: '#1D4ED8' }} title="Email">
                                            <Mail size={14} />
                                        </a>
                                        <button
                                            onClick={() => window.location.href = `/agent/dashboard/edit-lead/${lead.id}`}
                                            style={{ marginLeft: 'auto', padding: '0.25rem', borderRadius: '4px', background: '#F8FAFC', color: '#64748B' }}
                                            title="Edit Lead"
                                        >
                                            <Edit size={14} />
                                        </button>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', borderTop: '1px solid #F1F5F9', paddingTop: '0.5rem' }}>
                                        {column.id !== 'New' && (
                                            <button
                                                onClick={() => updateLeadStatus(lead.id, getPreviousStatus(column.id))}
                                                style={{ fontSize: '0.75rem', color: 'var(--muted)', cursor: 'pointer' }}
                                            >
                                                &larr; Back
                                            </button>
                                        )}
                                        {column.id !== 'Closed' && (
                                            <button
                                                onClick={() => updateLeadStatus(lead.id, getNextStatus(column.id))}
                                                style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', marginLeft: 'auto' }}
                                            >
                                                Move Next &rarr;
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </FadeIn>
    );
}

function getNextStatus(current) {
    const flow = ['New', 'Contacted', 'Qualified', 'Closed'];
    const idx = flow.indexOf(current);
    return idx < flow.length - 1 ? flow[idx + 1] : current;
}

function getPreviousStatus(current) {
    const flow = ['New', 'Contacted', 'Qualified', 'Closed'];
    const idx = flow.indexOf(current);
    return idx > 0 ? flow[idx - 1] : current;
}
