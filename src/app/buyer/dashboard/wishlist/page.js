"use client";
import { useProperties } from '@/context/PropertyContext';
import PropertyCard from '@/components/PropertyCard';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
    const { properties, wishlist } = useProperties();

    const wishlistedProperties = properties.filter(prop => wishlist.includes(prop.id));

    return (
        <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '950', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
                <Heart className="text-primary" fill="var(--primary)" size={32} /> My Wishlist
            </h1>

            {wishlistedProperties.length > 0 ? (
                <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ display: 'grid', gap: '2rem' }}>
                    {wishlistedProperties.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            ) : (
                <div className="card glass" style={{ textAlign: 'center', padding: '8rem 2rem', borderRadius: '2.5rem', border: '2px dashed var(--border)' }}>
                    <div style={{ background: 'var(--input)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', boxShadow: 'var(--shadow)' }}>
                        <Heart size={48} style={{ color: 'var(--muted)', opacity: 0.5 }} />
                    </div>
                    <h3 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1.25rem', color: 'var(--foreground)' }}>Your wishlist is empty</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>Start exploring properties and save your favorites here.</p>
                </div>
            )}
        </div>
    );
}
