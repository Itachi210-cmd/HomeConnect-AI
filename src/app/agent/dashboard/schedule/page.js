"use client";
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User, Video, XCircle, CheckCircle, X } from 'lucide-react';
import Button from '@/components/Button';

export default function SchedulePage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    // Mock Agent ID for now. ideally from auth context
    const agentId = "agent_default";

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await fetch(`/api/appointments?role=AGENT&userId=${agentId}`);
            if (res.ok) {
                const data = await res.json();
                setAppointments(data);
                setError(null);
            } else {
                const errData = await res.json();
                throw new Error(errData.details || errData.error || "Failed to fetch appointments");
            }
        } catch (error) {
            console.error("Error fetching schedule:", error);
            setError(`Could not load schedule. ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAppointment = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch a valid property first
            const propRes = await fetch('/api/properties?limit=1');
            let propertyId = null;
            if (propRes.ok) {
                const props = await propRes.json();
                if (props.length > 0) propertyId = props[0].id;
            }

            if (!propertyId) {
                // Fallback if no API or empty
                propertyId = "property_placeholder";
                // But warn user
                alert("Warning: No properties found. Using placeholder ID (might fail).");
            }

            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: new Date().toISOString(),
                    propertyId: propertyId,
                    buyerId: agentId, // Self-booking for test
                    agentId: agentId,
                    notes: "Scheduled via Agent Dashboard quick actions."
                })
            });

            if (res.ok) {
                await fetchAppointments();
            } else {
                const err = await res.json();
                setError(`Failed to create test appointment: ${err.details || err.error}`);
            }
        } catch (e) {
            console.error(e);
            setError("Error adding appointment: " + e.message);
        } finally {
            setLoading(false);
        }
    }

    const handleStatusUpdate = async (id, newStatus) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/appointments/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                // Update local state
                setAppointments(prev => prev.map(appt =>
                    appt.id === id ? { ...appt, status: newStatus } : appt
                ));
                setSelectedAppointment(null); // Close modal
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading && appointments.length === 0) return <div>Loading schedule...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--foreground)' }}>My Schedule</h1>
                    <p style={{ color: 'var(--muted)' }}>Manage your appointments and viewings</p>
                </div>
                <Button style={{ gap: '0.5rem' }} onClick={handleAddAppointment}>
                    <CalendarIcon size={18} /> Add Appointment
                </Button>
            </div>

            {error && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Upcoming Appointments */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Upcoming</h2>
                    {appointments.length === 0 ? <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>No upcoming appointments. Click "Add Appointment" to begin.</p> : appointments.map((apt) => (
                        <div key={apt.id} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'var(--input)',
                                padding: '1rem',
                                borderRadius: 'var(--radius)',
                                minWidth: '80px'
                            }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary)' }}>
                                    {new Date(apt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--foreground)' }}>
                                    {new Date(apt.date).getDate()}
                                </span>
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontWeight: '600', fontSize: '1.125rem' }}>{apt.property?.title || "Property Viewing"}</h3>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        background: apt.status === 'CONFIRMED' ? '#DCFCE7' : apt.status === 'CANCELLED' ? '#FEE2E2' : '#F0FDFA',
                                        color: apt.status === 'CONFIRMED' ? '#166534' : apt.status === 'CANCELLED' ? '#991B1B' : '#0D9488',
                                        fontWeight: '600',
                                        textTransform: 'capitalize'
                                    }}>
                                        {apt.status}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Clock size={16} /> {new Date(apt.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <User size={16} /> {apt.buyer?.name || "Client"}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <MapPin size={16} /> {apt.property?.location || "On Site"}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Button variant="outline" size="sm" onClick={() => setSelectedAppointment(apt)}>Details</Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mini Calendar Placeholder */}
                <div className="card" style={{ height: 'fit-content' }}>
                    <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Calendar</h3>
                    <div style={{
                        background: 'var(--input)',
                        height: '300px',
                        borderRadius: 'var(--radius)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--muted)'
                    }}>
                        Calendar Coming Soon
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            {selectedAppointment && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100
                }}>
                    <div className="animate-fade-in-up" style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '1rem',
                        width: '100%',
                        maxWidth: '500px',
                        boxShadow: 'var(--shadow-2xl)',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setSelectedAppointment(null)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Appointment Details</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            <div>
                                <label style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Property</label>
                                <div style={{ fontWeight: '600' }}>{selectedAppointment.property?.title || "Unknown Property"}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Client</label>
                                <div style={{ fontWeight: '600' }}>{selectedAppointment.buyer?.name || "Unknown Client"}</div>
                                <div style={{ fontSize: '0.9rem' }}>{selectedAppointment.buyer?.email}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Date & Time</label>
                                <div style={{ fontWeight: '600' }}>{new Date(selectedAppointment.date).toLocaleString()}</div>
                            </div>
                            {selectedAppointment.notes && (
                                <div>
                                    <label style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Notes from Client</label>
                                    <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                        {selectedAppointment.notes}
                                    </div>
                                </div>
                            )}
                            <div>
                                <label style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Current Status</label>
                                <div style={{ fontWeight: '600', color: selectedAppointment.status === 'CONFIRMED' ? 'green' : 'inherit' }}>
                                    {selectedAppointment.status}
                                </div>
                            </div>
                        </div>

                        {selectedAppointment.status === 'PENDING' && (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Button
                                    fullWidth
                                    onClick={() => handleStatusUpdate(selectedAppointment.id, 'CONFIRMED')}
                                    disabled={updating}
                                    style={{ background: '#10B981', color: 'white' }}
                                >
                                    <CheckCircle size={18} className="mr-2" /> Accept
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outline"
                                    onClick={() => handleStatusUpdate(selectedAppointment.id, 'CANCELLED')}
                                    disabled={updating}
                                    style={{ borderColor: '#EF4444', color: '#EF4444' }}
                                >
                                    <XCircle size={18} className="mr-2" /> Decline
                                </Button>
                            </div>
                        )}

                        {selectedAppointment.status !== 'PENDING' && (
                            <Button fullWidth onClick={() => setSelectedAppointment(null)} variant="outline">Close</Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
