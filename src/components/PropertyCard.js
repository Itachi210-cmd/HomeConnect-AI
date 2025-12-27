import Link from 'next/link';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import { useProperties } from '@/context/PropertyContext';

export default function PropertyCard({ property }) {
    const { wishlist, toggleWishlist, compareList, toggleCompare, formatPrice } = useProperties();

    // Fallback data if property is missing fields
    const {
        id = 1,
        title = "Modern Apartment",
        price: rawPrice = 5000000,
        location = "New York, NY",
        beds = 2,
        baths = 2,
        area = 1200,
        images = [],
        image: legacyImage
    } = property || {};

    const image = images && images.length > 0 ? images[0] : (legacyImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80");

    const handleImageError = (e) => {
        e.target.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
    };

    const price = formatPrice(rawPrice);

    const isWishlisted = wishlist.includes(id);

    return (
        <div className="card hover-scale" style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', position: 'relative', background: 'var(--background)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(id);
                }}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 10,
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '50%',
                    padding: '0.5rem',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--shadow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: isWishlisted ? '#EF4444' : 'var(--foreground)'
                }}
            >
                <Heart size={20} fill={isWishlisted ? '#EF4444' : 'none'} />
            </button>

            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleCompare(property);
                }}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 10,
                    background: compareList.find(p => p.id === id) ? 'var(--primary)' : 'var(--glass-bg)',
                    backdropFilter: 'blur(8px)',
                    color: compareList.find(p => p.id === id) ? 'white' : 'var(--foreground)',
                    borderRadius: '20px',
                    padding: '4px 12px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    boxShadow: 'var(--shadow)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    border: '1px solid var(--glass-border)'
                }}
            >
                {compareList.find(p => p.id === id) ? '✓ Compared' : '+ Compare'}
            </button>

            <Link href={`/properties/${id}`} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '240px', width: '100%', overflow: 'hidden' }}>
                    <img
                        src={image}
                        alt={title}
                        onError={handleImageError}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease'
                        }}
                        className="hover-scale"
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                        padding: '2rem 1rem 1rem',
                        color: 'white'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{price}</div>
                            <div style={{
                                background: property.matchScore > 80 ? 'rgba(16, 185, 129, 0.9)' : property.matchScore > 50 ? 'rgba(245, 158, 11, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                                color: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.5rem',
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                backdropFilter: 'blur(4px)'
                            }}>
                                <span style={{ fontSize: '1rem' }}>✨</span> {property.matchScore}% Match
                            </div>
                        </div>
                    </div>
                </div>

                {property.matchReason && (
                    <div style={{ padding: '0.5rem 1rem', background: 'var(--input)', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600' }}>
                        💡 {property.matchReason}
                    </div>
                )}

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--foreground)', lineHeight: 1.3 }}>
                        {title}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        <MapPin size={16} />
                        <span>{location}</span>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: 'auto',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--border)',
                        color: 'var(--muted)',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Bed size={18} className="text-primary" />
                            <span>{beds} Beds</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Bath size={18} className="text-primary" />
                            <span>{baths} Baths</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Square size={18} className="text-primary" />
                            <span>{area}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
