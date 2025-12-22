"use client";
import { useState } from 'react';
import Link from 'next/link';
import { User, Briefcase } from 'lucide-react';
import Button from '@/components/Button';
import Input from '@/components/Input';

import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [role, setRole] = useState('buyer'); // 'buyer' or 'agent'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agencyName: '', // For agents
        licenseNumber: '' // For agents
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: role,
                }),
            });

            if (res.ok) {
                alert("Registration successful! Please log in.");
                router.push('/login');
            } else {
                const data = await res.json();
                alert(data.message || "Registration failed.");
            }
        } catch (error) {
            console.error("Registration failed", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 4rem - 300px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', background: '#F8FAFC' }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Create Account</h1>
                    <p style={{ color: 'var(--muted)' }}>Join HomeConnect today</p>
                </div>

                {/* Role Toggle */}
                <div style={{ display: 'flex', background: 'var(--input)', padding: '0.25rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setRole('buyer')}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: 'var(--radius)',
                            background: role === 'buyer' ? 'white' : 'transparent',
                            color: role === 'buyer' ? 'var(--primary)' : 'var(--muted)',
                            boxShadow: role === 'buyer' ? 'var(--shadow-sm)' : 'none',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <User size={18} /> Buyer
                    </button>
                    <button
                        onClick={() => setRole('agent')}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: 'var(--radius)',
                            background: role === 'agent' ? 'white' : 'transparent',
                            color: role === 'agent' ? 'var(--secondary)' : 'var(--muted)',
                            boxShadow: role === 'agent' ? 'var(--shadow-sm)' : 'none',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <Briefcase size={18} /> Agent
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Input
                        label="Full Name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    {role === 'agent' && (
                        <>
                            <Input
                                label="Agency Name"
                                name="agencyName"
                                placeholder="Real Estate Agency LLC"
                                value={formData.agencyName}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="License Number"
                                name="licenseNumber"
                                placeholder="RE-123456"
                                value={formData.licenseNumber}
                                onChange={handleChange}
                                required
                            />
                        </>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Button type="submit" size="lg" style={{ width: '100%' }}>
                        Create Account
                    </Button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
                    Already have an account?{' '}
                    <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
