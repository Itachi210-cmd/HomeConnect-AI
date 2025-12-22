"use client";
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Search, Heart, MessageSquare, Settings, Menu, X } from 'lucide-react';

const buyerNavItems = [
    { label: 'Browse Properties', href: '/buyer/dashboard', icon: Search },
    { label: 'My Wishlist', href: '/buyer/dashboard/wishlist', icon: Heart },
    { label: 'Inquiries', href: '/buyer/dashboard/inquiries', icon: MessageSquare },
    { label: 'Profile Settings', href: '/buyer/dashboard/settings', icon: Settings },
];

export default function BuyerLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                    background: 'white',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    boxShadow: 'var(--shadow)'
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
                bg-white
            `}>
                <Sidebar items={buyerNavItems} />
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            <main style={{ flex: 1, padding: '2rem', background: '#F8FAFC', width: '100%' }}>
                {children}
            </main>
        </div>
    );
}
