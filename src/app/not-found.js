import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1rem' }}>
            <h1 style={{ fontSize: '6rem', fontWeight: '900', color: 'var(--primary)', lineHeight: 1 }}>404</h1>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Oops! Property Not Found</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--muted)', maxWidth: '500px', marginBottom: '2rem' }}>
                It looks like the page you are looking for has been sold, rented, or never existed in the first place.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Link href="/" style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'var(--primary)', color: 'white',
                    padding: '0.75rem 1.5rem', borderRadius: '0.5rem',
                    fontWeight: '600', textDecoration: 'none'
                }}>
                    <Home size={18} /> Go Home
                </Link>
                <Link href="/buyer/dashboard" style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: '#F1F5F9', color: 'var(--foreground)',
                    padding: '0.75rem 1.5rem', borderRadius: '0.5rem',
                    fontWeight: '600', textDecoration: 'none'
                }}>
                    <Search size={18} /> Browse Listings
                </Link>
            </div>
        </div>
    );
}
