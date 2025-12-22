"use client";
import { useState, useEffect } from 'react';
import { Heart, Home, ArrowLeft, Loader2 } from 'lucide-react';
import Button from '@/components/Button';
import PropertyCard from '@/components/PropertyCard';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';
import { useProperties } from '@/context/PropertyContext';

export default function WishlistPage() {
    const { wishlist } = useProperties(); // This has only IDs
    const [savedProperties, setSavedProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSaved = async () => {
            try {
                const res = await fetch('/api/wishlist?userId=buyer_default');
                if (res.ok) {
                    const data = await res.json();
                    setSavedProperties(data);
                }
            } catch (error) {
                console.error("Failed to fetch wishlist:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSaved();
    }, [wishlist]); // Re-fetch if wishlist IDs change (e.g. un-hearting)

    return (
        <FadeIn>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <Link href="/buyer/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Link>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>Saved Properties</h1>
                        <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>You have {savedProperties.length} properties in your collection.</p>
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: '1rem' }}>
                        <Loader2 size={40} className="animate-spin text-primary" />
                        <p style={{ color: 'var(--muted)', fontWeight: '600' }}>Loading your collection...</p>
                    </div>
                ) : savedProperties.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 40px', background: 'white', borderRadius: '32px', border: '1px solid var(--border)' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: '#F1F5F9',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: '#94A3B8'
                        }}>
                            <Heart size={40} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Your wishlist is empty</h2>
                        <p style={{ color: 'var(--muted)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                            Start exploring properties and click the heart icon to save your favorites here for later.
                        </p>
                        <Link href="/buyer/dashboard">
                            <Button>Explore Properties</Button>
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {savedProperties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}

                {/* Recommendations Call to Action */}
                {!loading && savedProperties.length > 0 && (
                    <div style={{
                        marginTop: '4rem',
                        padding: '3rem',
                        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                        borderRadius: '32px',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '2rem'
                    }}>
                        <div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Want more like these?</h3>
                            <p style={{ color: '#94A3B8', fontSize: '1.1rem' }}>Our AI can find similar high-ROI properties based on your wishlist.</p>
                        </div>
                        <Button style={{ background: 'white', color: '#0F172A', fontWeight: '800', border: 'none' }}>
                            Run AI Discovery
                        </Button>
                    </div>
                )}
            </div>
        </FadeIn>
    );
}
