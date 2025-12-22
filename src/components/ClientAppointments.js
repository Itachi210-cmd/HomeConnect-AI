"use client";

import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Button from './Button';

export default function ClientAppointments({ userRole, userId }) {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) fetchAppointments();
    }, [userId]);

    const fetchAppointments = async () => {
        try {
            const res = await fetch(`/api/appointments?role=${userRole}&userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/appointments/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                fetchAppointments(); // Refresh list
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (loading) return <div>Loading appointments...</div>;
    if (appointments.length === 0) return <div>No appointments scheduled.</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {appointments.map((appt) => (
                <div key={appt.id} style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '1rem',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            background: '#F1F5F9',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Calendar size={24} className="text-primary" />
                        </div>
                        <div>
                            <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{appt.property.title}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                <Clock size={16} />
                                {new Date(appt.date).toLocaleString()}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                                With: <span style={{ fontWeight: '500', color: 'var(--foreground)' }}>
                                    {userRole === 'AGENT' ? appt.buyer.name : appt.agent.name}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '2rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            background: appt.status === 'CONFIRMED' ? '#DCFCE7' : appt.status === 'CANCELLED' ? '#FEE2E2' : '#FEF3C7',
                            color: appt.status === 'CONFIRMED' ? '#166534' : appt.status === 'CANCELLED' ? '#991B1B' : '#92400E'
                        }}>
                            {appt.status}
                        </div>

                        {userRole === 'AGENT' && appt.status === 'PENDING' && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Button size="sm" onClick={() => handleStatusUpdate(appt.id, 'CONFIRMED')} style={{ background: '#10B981', color: 'white' }}>
                                    <CheckCircle size={16} /> Accept
                                </Button>
                                <Button size="sm" onClick={() => handleStatusUpdate(appt.id, 'CANCELLED')} variant="outline" style={{ borderColor: '#EF4444', color: '#EF4444' }}>
                                    <XCircle size={16} /> Decline
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
