import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{ background: '#0F172A', color: 'white', paddingTop: '5rem', paddingBottom: '2rem', marginTop: 'auto', borderTop: '1px solid var(--border)' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #fff, #94A3B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>HomeConnect</span>
                        </div>
                        <p style={{ color: '#94A3B8', lineHeight: '1.7', marginBottom: '2rem', maxWidth: '300px' }}>
                            Smart real estate lead management and property matching system for modern buyers and agents.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href="#" style={{ color: '#94A3B8', transition: 'color 0.2s' }} className="hover:text-white"><Facebook size={20} /></a>
                            <a href="#" style={{ color: '#94A3B8', transition: 'color 0.2s' }} className="hover:text-white"><Twitter size={20} /></a>
                            <a href="#" style={{ color: '#94A3B8', transition: 'color 0.2s' }} className="hover:text-white"><Instagram size={20} /></a>
                            <a href="#" style={{ color: '#94A3B8', transition: 'color 0.2s' }} className="hover:text-white"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '1.5rem', fontSize: '1.125rem' }}>Quick Links</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#94A3B8' }}>
                            <Link href="/properties" style={{ transition: 'color 0.2s' }} className="hover:text-white">Search Properties</Link>
                            <Link href="/buyer/dashboard" style={{ transition: 'color 0.2s' }} className="hover:text-white">For Buyers</Link>
                            <Link href="/agent/dashboard" style={{ transition: 'color 0.2s' }} className="hover:text-white">For Agents</Link>
                            <Link href="/about" style={{ transition: 'color 0.2s' }} className="hover:text-white">About Us</Link>
                            <Link href="/contact" style={{ transition: 'color 0.2s' }} className="hover:text-white">Contact</Link>
                            <Link href="/privacy" style={{ transition: 'color 0.2s' }} className="hover:text-white">Privacy Policy</Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '1.5rem', fontSize: '1.125rem' }}>Contact Us</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#94A3B8' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Mail size={20} className="text-primary" />
                                <span>support@homeconnect.com</span>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Phone size={20} className="text-primary" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <MapPin size={20} className="text-primary" />
                                <span>123 Real Estate Blvd, City, State</span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter in Footer */}
                    <div>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '1.5rem', fontSize: '1.125rem' }}>Stay Updated</h4>
                        <p style={{ color: '#94A3B8', marginBottom: '1rem', fontSize: '0.9rem' }}>Subscribe to get the latest news and offers.</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="email"
                                placeholder="Email address"
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    color: 'white',
                                    width: '100%',
                                    outline: 'none'
                                }}
                            />
                            <button style={{
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                cursor: 'pointer'
                            }}>
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #1E293B', paddingTop: '2rem', textAlign: 'center', color: '#64748B', fontSize: '0.875rem' }}>
                    <p>&copy; {new Date().getFullYear()} HomeConnect. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
