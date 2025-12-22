"use client";
import { useProperties } from '@/context/PropertyContext';
import PropertyCard from '@/components/PropertyCard';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
    const { properties, wishlist } = useProperties();

    const wishlistedProperties = properties.filter(prop => wishlist.includes(prop.id));

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Heart className="text-primary" fill="var(--primary)" /> My Wishlist
            </h1>

            {wishlistedProperties.length > 0 ? (
                <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ display: 'grid', gap: '2rem' }}>
                    {wishlistedProperties.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <Heart size={48} style={{ color: 'var(--muted)', marginBottom: '1rem', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Your wishlist is empty</h3>
                    <p style={{ color: 'var(--muted)' }}>Start exploring properties and save your favorites here.</p>
                </div>
            )}
        </div>
    );
}
