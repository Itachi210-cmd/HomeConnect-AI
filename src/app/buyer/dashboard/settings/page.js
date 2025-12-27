"use client";
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react"
import Button from '@/components/Button';
import { User, Mail, Phone, Save } from 'lucide-react';

export default function SettingsPage() {
    const { data: session } = useSession()
    const user = session?.user
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '+1 (555) 000-0000',
        bio: 'Looking for a modern apartment in the city center.'
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would update the user context/backend
        alert('Profile updated successfully!');
    };

    return (
        <div style={{ maxWidth: '900px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '950', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
                <User className="text-primary" size={32} /> Profile Settings
            </h1>

            <div className="card glass" style={{ padding: '3rem', borderRadius: '2.5rem', border: '1px solid var(--border)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '2rem' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '2.5rem', background: 'var(--input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: '900', color: 'var(--primary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                            {formData.name.charAt(0)}
                        </div>
                        <div>
                            <Button variant="outline" size="lg" style={{ borderRadius: '1rem' }}>Change Photo</Button>
                        </div>
                    </div>

                    <div className="grid-cols-1 md:grid-cols-2" style={{ display: 'grid', gap: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', color: 'var(--muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1.25rem', border: '1px solid var(--border)', outline: 'none', background: 'var(--input)', color: 'var(--foreground)', fontSize: '1rem' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', color: 'var(--muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1.25rem', border: '1px solid var(--border)', outline: 'none', background: 'var(--input)', color: 'var(--foreground)', fontSize: '1rem' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', color: 'var(--muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1.25rem', border: '1px solid var(--border)', outline: 'none', background: 'var(--input)', color: 'var(--foreground)', fontSize: '1rem' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', color: 'var(--muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Bio / Preferences</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="4"
                            style={{ width: '100%', padding: '1.25rem', borderRadius: '1.5rem', border: '1px solid var(--border)', outline: 'none', fontFamily: 'inherit', background: 'var(--input)', color: 'var(--foreground)', fontSize: '1rem' }}
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <Button type="submit" size="lg" style={{ gap: '0.75rem', padding: '1rem 3rem', borderRadius: '1.25rem' }}>
                            <Save size={20} /> Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
