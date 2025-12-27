"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Briefcase, ShieldCheck, Check, Star, ArrowRight } from 'lucide-react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import FadeIn from '@/components/FadeIn';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [role, setRole] = useState('buyer'); // 'buyer' or 'agent'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const testimonials = [
        { text: "HomeConnect helped me find my dream villa in under a week. The AI matching is incredible!", author: "Priya Sharma", role: "Happy Homeowner" },
        { text: "As an agent, this platform has doubled my leads. The CRM tools are top-notch.", author: "Rajesh Kumar", role: "Top Rated Agent" },
        { text: "The most seamless property buying experience I've ever had. Highly recommended!", author: "Amit Patel", role: "Property Investor" }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
                role: role.toUpperCase(), // Send selected role to backend
            });

            if (result.error) {
                // NextAuth wraps errors, so we try to get the thrown message if possible
                setError(result.error);
                setIsLoading(false);
                return;
            }

            if (result.ok) {
                // In a real app, we'd fetch the session to get the definitive role
                // But since we just verified it on backend, we can trust the current 'role' state
                if (role === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push(role === 'agent' ? '/agent/dashboard' : '/buyer/dashboard');
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex' }}>
            {/* Left Side - Image & Testimonials */}
            <div className="hidden md:flex" style={{
                flex: 1,
                background: 'url("https://images.unsplash.com/photo-1600596542815-2251c3052068?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80") center/cover no-repeat',
                position: 'relative',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '4rem'
            }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))' }}></div>

                <div style={{ position: 'relative', zIndex: 10, color: 'white', maxWidth: '600px' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {[...Array(5)].map((_, i) => <Star key={i} fill="#F59E0B" color="#F59E0B" size={20} />)}
                    </div>
                    <p style={{ fontSize: '1.5rem', fontWeight: '500', lineHeight: 1.4, marginBottom: '1.5rem', minHeight: '100px', transition: 'opacity 0.5s ease' }}>
                        "{testimonials[currentTestimonial].text}"
                    </p>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{testimonials[currentTestimonial].author}</div>
                        <div style={{ opacity: 0.8 }}>{testimonials[currentTestimonial].role}</div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentTestimonial(i)}
                                style={{
                                    width: '3rem',
                                    height: '4px',
                                    background: i === currentTestimonial ? 'white' : 'rgba(255,255,255,0.3)',
                                    borderRadius: '2px',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--background)', transition: 'background 0.3s ease' }}>
                <div style={{ width: '100%', maxWidth: '420px' }}>
                    <FadeIn>
                        <div style={{ marginBottom: '2.5rem' }}>
                            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--foreground)' }}>Welcome Back</h1>
                            <p style={{ color: 'var(--muted)', fontSize: '1.125rem' }}>Sign in to access your personalized dashboard.</p>
                        </div>

                        {/* Role Toggle */}
                        <div style={{ display: 'flex', background: 'var(--input)', padding: '0.5rem', borderRadius: '1rem', marginBottom: '2.5rem', border: '1px solid var(--border)' }}>
                            {['buyer', 'agent', 'admin'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        borderRadius: '0.75rem',
                                        background: role === r ? 'var(--background)' : 'transparent',
                                        color: role === r ? 'var(--primary)' : 'var(--muted)',
                                        boxShadow: role === r ? 'var(--shadow)' : 'none',
                                        fontWeight: '800',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        textTransform: 'uppercase',
                                        fontSize: '0.75rem',
                                        letterSpacing: '1px',
                                        border: role === r ? '1px solid var(--border)' : '1px solid transparent'
                                    }}
                                >
                                    {r === 'buyer' && <User size={14} />}
                                    {r === 'agent' && <Briefcase size={14} />}
                                    {r === 'admin' && <ShieldCheck size={14} />}
                                    {r}
                                </button>
                            ))}
                        </div>

                        {error && (
                            <div style={{
                                padding: '0.75rem 1rem',
                                background: '#FEF2F2',
                                border: '1px solid #FEE2E2',
                                borderRadius: '0.75rem',
                                color: '#B91C1C',
                                fontSize: '0.875rem',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <div style={{ width: '6px', height: '6px', background: '#EF4444', borderRadius: '50%' }}></div>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Input
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="username"
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.9rem' }}>
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        border: rememberMe ? 'none' : '2px solid var(--border)',
                                        borderRadius: '4px',
                                        background: rememberMe ? 'var(--primary)' : 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {rememberMe && <Check size={12} color="white" />}
                                    </div>
                                    <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} style={{ display: 'none' }} />
                                    Remember me
                                </label>
                                <Link href="/forgot-password" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600' }}>
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                style={{ width: '100%', borderRadius: '0.75rem', fontSize: '1rem', padding: '1rem' }}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                            </Button>
                        </form>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
                            <div style={{ height: '1px', flex: 1, background: 'var(--border)' }}></div>
                            <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Or continue with</span>
                            <div style={{ height: '1px', flex: 1, background: 'var(--border)' }}></div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                padding: '1rem',
                                border: '1px solid var(--border)',
                                borderRadius: '1rem',
                                background: 'var(--input)',
                                fontWeight: '700',
                                color: 'var(--foreground)',
                                transition: 'all 0.2s ease',
                                fontFamily: 'var(--font-body)'
                            }} className="hover-scale glass">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem',
                                border: '1px solid var(--border)',
                                borderRadius: '0.75rem',
                                background: 'white',
                                fontWeight: '600',
                                color: 'var(--foreground)',
                                transition: 'background 0.2s'
                            }} className="hover:bg-gray-50">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.93 3.23-.93.63 0 2.45.41 3.24 1.51-3.02 1.8-2.52 5.43.34 6.66-.6 1.7-1.44 3.4-2.89 4.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.16 2.29-2.02 4.2-3.74 4.25z" />
                                </svg>
                                Apple
                            </button>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
                            Don't have an account?{' '}
                            <Link href="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>
                                Create account
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </div >
            <style jsx>{`
                @media (max-width: 768px) {
                    .hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </div >
    );
}
