"use client";
import { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { User, Lock, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Shield },
    ];

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--foreground)' }}>Settings</h1>
                <p style={{ color: 'var(--muted)' }}>Manage your account preferences</p>
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'start' }}>
                {/* Sidebar Tabs */}
                <div className="card" style={{ width: '250px', padding: '0.5rem' }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius)',
                                background: activeTab === tab.id ? 'var(--input)' : 'transparent',
                                color: activeTab === tab.id ? 'var(--foreground)' : 'var(--muted)',
                                fontWeight: activeTab === tab.id ? '600' : '500',
                                textAlign: 'left',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="card" style={{ flex: 1 }}>
                    {activeTab === 'profile' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Profile Information</h2>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: 'var(--input)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    color: 'var(--muted)'
                                }}>
                                    JD
                                </div>
                                <div>
                                    <Button variant="outline" size="sm" style={{ marginRight: '0.5rem' }}>Change Photo</Button>
                                    <Button variant="ghost" size="sm" style={{ color: '#EF4444' }}>Remove</Button>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <Input label="First Name" defaultValue="John" />
                                <Input label="Last Name" defaultValue="Doe" />
                                <Input label="Email" defaultValue="john.doe@example.com" type="email" />
                                <Input label="Phone" defaultValue="+1 (555) 123-4567" type="tel" />
                                <Input label="Agency Name" defaultValue="Prestige Realty" />
                                <Input label="License Number" defaultValue="RE-987654" />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--foreground)' }}>Bio</label>
                                <textarea
                                    rows="4"
                                    defaultValue="Experienced real estate agent specializing in luxury properties..."
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid var(--border)',
                                        fontFamily: 'inherit',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                <Button>Save Changes</Button>
                            </div>
                        </div>
                    )}

                    {activeTab !== 'profile' && (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
                            <p>Settings for {activeTab} are coming soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
