"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { signOut } from "next-auth/react";

export default function Sidebar({ items = [] }) {
    const pathname = usePathname();

    return (
        <aside style={{
            width: '280px',
            background: 'var(--background)',
            borderRight: '1px solid var(--border)',
            height: 'calc(100vh - 4rem)',
            position: 'sticky',
            top: '4rem',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            transition: 'background 0.3s ease'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius)',
                                color: isActive ? 'var(--primary)' : 'var(--muted)',
                                background: isActive ? '#F0FDFA' : 'transparent',
                                fontWeight: isActive ? '600' : '500',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        width: '100%',
                        color: '#EF4444',
                        fontWeight: '500',
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none'
                    }}
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
