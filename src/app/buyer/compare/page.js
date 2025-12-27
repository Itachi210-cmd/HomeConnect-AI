"use client";
import { useProperties } from '@/context/PropertyContext';
import { ArrowLeft, Trash2, Check, X, Ruler, Bed, Bath, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/Button';
import FadeIn from '@/components/FadeIn';

export default function ComparePage() {
    const { compareList, toggleCompare, parsePrice, formatPrice } = useProperties();

    const handleImageError = (e) => {
        e.target.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
    };

    if (compareList.length === 0) {
        return (
            <div style={{ padding: '80px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1rem' }}>No properties selected</h1>
                <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Go back to the listings and select up to 3 properties to compare them side-by-side.</p>
                <Link href="/buyer/dashboard">
                    <Button>Browse Properties</Button>
                </Link>
            </div>
        );
    }

    return (
        <FadeIn>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/buyer/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', fontWeight: '600', marginBottom: '1rem' }}>
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Property Comparison</h1>
                    <p style={{ color: 'var(--muted)' }}>Comparing {compareList.length} properties</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `250px repeat(${compareList.length}, 1fr)`,
                    background: 'white',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow)'
                }}>
                    {/* Header Images */}
                    <div style={{ padding: '2rem', background: '#F8FAFC', borderRight: '1px solid var(--border)', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                        Property
                    </div>
                    {compareList.map(item => (
                        <div key={item.id} style={{ padding: '1rem', borderRight: '1px solid var(--border)', position: 'relative' }}>
                            <button
                                onClick={() => toggleCompare(item)}
                                style={{ position: 'absolute', top: '1rem', right: '1.5rem', zIndex: 10, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', color: '#EF4444' }}
                            >
                                <X size={20} />
                            </button>
                            <img
                                src={item.images?.[0] || item.image || "https://images.unsplash.com/photo-1600596542815-2251c3052068"}
                                onError={handleImageError}
                                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }}
                            />
                            <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{item.title}</div>
                        </div>
                    ))}

                    {/* Price Row */}
                    <div className="compare-label">Price</div>
                    {compareList.map(item => (
                        <div key={item.id} className="compare-value" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                            {formatPrice(item.price)}
                        </div>
                    ))}

                    {/* Location Row */}
                    <div className="compare-label">Location</div>
                    {compareList.map(item => (
                        <div key={item.id} className="compare-value">{item.location}</div>
                    ))}

                    {/* Features Row */}
                    <div className="compare-label">Bedrooms</div>
                    {compareList.map(item => (
                        <div key={item.id} className="compare-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Bed size={18} /> {item.beds}
                        </div>
                    ))}

                    <div className="compare-label">Bathrooms</div>
                    {compareList.map(item => (
                        <div key={item.id} className="compare-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Bath size={18} /> {item.baths}
                        </div>
                    ))}

                    <div className="compare-label">Area</div>
                    {compareList.map(item => (
                        <div key={item.id} className="compare-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Ruler size={18} /> {item.area} Sq Ft
                        </div>
                    ))}

                    <div className="compare-label">Type</div>
                    {compareList.map(item => (
                        <div key={item.id} className="compare-value">{item.type}</div>
                    ))}

                    <div className="compare-label">Status</div>
                    {compareList.map(item => (
                        <div key={item.id} className="compare-value">
                            <span style={{
                                background: item.status === 'Active' ? '#DCFCE7' : '#FEF9C3',
                                color: item.status === 'Active' ? '#166534' : '#854D0E',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: '700'
                            }}>
                                {item.status}
                            </span>
                        </div>
                    ))}

                    <div className="compare-label">AI Match Score</div>
                    {compareList.map(item => (
                        <div key={item.id} className="compare-value">
                            {item.matchScore ? (
                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#8B5CF6' }}>✨ {item.matchScore}%</div>
                            ) : '-'}
                        </div>
                    ))}

                    {/* Footer Actions */}
                    <div style={{ padding: '2rem', background: '#F8FAFC', borderRight: '1px solid var(--border)' }}></div>
                    {compareList.map(item => (
                        <div key={item.id} style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                            <Link href={`/properties/${item.id}`}>
                                <Button size="sm">View Details</Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .compare-label {
                    padding: 1.5rem 2rem;
                    background: #F8FAFC;
                    border-right: 1px solid var(--border);
                    border-top: 1px solid var(--border);
                    font-weight: 700;
                    color: #64748B;
                    font-size: 0.9rem;
                }
                .compare-value {
                    padding: 1.5rem;
                    border-right: 1px solid var(--border);
                    border-top: 1px solid var(--border);
                    color: var(--foreground);
                    font-weight: 600;
                }
            `}</style>
        </FadeIn>
    );
}
