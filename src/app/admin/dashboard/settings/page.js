"use client";
import { useState } from 'react';
import Button from '@/components/Button';
import { User, Lock, Shield, Save, Bell } from 'lucide-react';

export default function AdminSettingsPage() {
    const [profile, setProfile] = useState({
        name: 'Admin User',
        email: 'admin@homeconnect.com',
        role: 'Administrator'
    });

    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        newSignups: true,
        reports: false
    });

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
    };

    const handleNotificationToggle = (key) => {
        setNotifications({ ...notifications, [key]: !notifications[key] });
    };

    const handleSave = () => {
        alert('Settings saved successfully!');
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Admin Settings</h1>

            {/* Profile Settings */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <User className="text-primary" size={24} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Profile Information</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleProfileChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', outline: 'none' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', outline: 'none' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Role</label>
                        <input
                            type="text"
                            value={profile.role}
                            disabled
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: '#F1F5F9', color: 'var(--muted)' }}
                        />
                    </div>
                </div>
            </div>

            {/* Security Settings */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <Lock className="text-primary" size={24} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Security</h2>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Current Password</label>
                        <input
                            type="password"
                            name="current"
                            value={password.current}
                            onChange={handlePasswordChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', outline: 'none' }}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>New Password</label>
                            <input
                                type="password"
                                name="new"
                                value={password.new}
                                onChange={handlePasswordChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirm"
                                value={password.confirm}
                                onChange={handlePasswordChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', outline: 'none' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <Bell className="text-primary" size={24} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Notifications</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h4 style={{ fontWeight: '600' }}>Email Alerts</h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Receive daily summaries of system activity.</p>
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={notifications.emailAlerts} onChange={() => handleNotificationToggle('emailAlerts')} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h4 style={{ fontWeight: '600' }}>New User Signups</h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Get notified when a new user registers.</p>
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={notifications.newSignups} onChange={() => handleNotificationToggle('newSignups')} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleSave} style={{ gap: '0.5rem' }}>
                    <Save size={20} /> Save Changes
                </Button>
            </div>

            <style jsx>{`
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }
                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                    border-radius: 34px;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .slider {
                    background-color: var(--primary);
                }
                input:checked + .slider:before {
                    transform: translateX(26px);
                }
            `}</style>
        </div>
    );
}
