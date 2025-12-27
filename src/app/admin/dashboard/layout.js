"use client";
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { LayoutDashboard, Users, Settings, Menu, X, BarChart, CreditCard, ShieldCheck, Trophy, Home } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

const adminNavItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Properties', href: '/admin/dashboard/properties', icon: Home },
    { label: 'User Management', href: '/admin/dashboard/users', icon: Users },
    { label: 'Analytics', href: '/admin/dashboard/analytics', icon: BarChart },
    { label: 'Agent Board', href: '/admin/dashboard/agents', icon: Trophy },
    { label: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN' && session?.user?.role !== 'admin') {
            router.push('/');
        }
    }, [status, session, router]);

    if (status === 'loading') return <Loading fullScreen />;
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'admin')) return null;

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 4rem)', position: 'relative' }}>
            {/* Mobile Menu Button */}
            <button
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 50,
                    background: 'var(--input)',
                    color: 'var(--foreground)',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    boxShadow: 'var(--shadow)',
                    border: '1px solid var(--border)'
                }}
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <div className={`
                ${isMobileMenuOpen ? 'block' : 'hidden'} 
                md:block 
                fixed md:relative 
                z-40 
                h-full 
                border-r border-[var(--border)]
            `} style={{ background: 'var(--background)' }}>
                <Sidebar items={adminNavItems} />
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            <main style={{ flex: 1, padding: '2rem', background: 'var(--background)', width: '100%', transition: 'background 0.3s ease' }}>
                {children}
            </main>
        </div>
    );
}
