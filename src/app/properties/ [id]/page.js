"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProperties } from '@/context/PropertyContext';
import { MapPin, Bed, Bath, Square, ArrowLeft, Heart, Share2, Phone, Mail, Calendar, Star, ThumbsUp, MessageSquare } from 'lucide-react';
import Button from '@/components/Button';
import FadeIn from '@/components/FadeIn';
import dynamic from 'next/dynamic';

// Dynamically import Map to avoid SSR issues
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function PropertyDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { properties, toggleWishlist, wishlist } = useProperties();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showBooking, setShowBooking] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingNotes, setBookingNotes] = useState('');
    const [isBooking, setIsBooking] = useState(false);

    const handleBookVisit = async () => {
        if (!bookingDate) return;
        setIsBooking(true);
        // TODO: Get actual logged-in user ID. mocking for now
        const mockBuyerId = "user_2pXyZ123";

        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: bookingDate,
                    propertyId: property.id,
                    buyerId: mockBuyerId,
                    // FORCE agent_default for demo purposes so it shows up in your dashboard
                    agentId: "agent_default",
                    notes: bookingNotes
                })
            });

            if (res.ok) {
                alert("Visit Request Sent! The agent will confirm shortly.");
                setShowBooking(false);
                setBookingDate('');
                setBookingNotes('');
            } else {
                alert("Failed to book visit.");
            }
        } catch (error) {
            console.error("Booking error:", error);
            alert("Something went wrong.");
        } finally {
            setIsBooking(false);
        }
    };

    useEffect(() => {
        if (params?.id) {
            const found = properties.find(p => p.id === params.id);
            if (found) {
                setProperty(found);
            }
            setLoading(false);
        }
    }, [params, properties]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', textAlign: 'center', padding: '1rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Property Not Found</h2>
                <p style={{ color: 'var(--muted)' }}>The property you are looking for seems to have been removed.</p>
                <Button onClick={() => router.push('/')}>Back to Home</Button>
            </div>
        );
    }

    const isWishlisted = wishlist.includes(property.id);

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '5rem' }}>
            {/* Hero Image Section */}
            <div style={{ position: 'relative', height: '60vh', width: '100%', overflow: 'hidden' }}>
                <img
                    src={property.images?.[0] || property.image || "https://images.unsplash.com/photo-1600596542815-2251c3052068?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"}
                    alt={property.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))'
                }}></div>

                <div className="max-w-7xl mx-auto" style={{ position: 'absolute', top: '2rem', left: '0', right: '0', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        onClick={() => router.back()}
                        style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)', border: 'none', borderRadius: '50%', width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => toggleWishlist(property.id)}
                            style={{ background: 'white', border: 'none', borderRadius: '50%', width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isWishlisted ? 'red' : 'gray', cursor: 'pointer' }}
                        >
                            <Heart size={20} fill={isWishlisted ? 'red' : 'none'} />
                        </button>
                        <button
                            style={{ background: 'white', border: 'none', borderRadius: '50%', width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'gray', cursor: 'pointer' }}
                        >
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto" style={{ position: 'absolute', bottom: '3rem', left: '0', right: '0', padding: '0 1rem', color: 'white' }}>
                    <FadeIn delay={0.2}>
                        <div style={{ display: 'inline-block', background: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem' }}>
                            {property.status || 'For Sale'}
                        </div>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 'bold', lineHeight: 1.1, marginBottom: '0.5rem' }}>{property.title}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem', opacity: 0.9 }}>
                            <MapPin size={20} /> {property.location}
                        </div>
                    </FadeIn>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Key Stats */}
                    <FadeIn delay={0.4}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-card rounded-2xl border border-border text-center">
                            <div>
                                <div style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}><Bed className="mx-auto" size={24} /></div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{property.beds}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Beds</div>
                            </div>
                            <div className="border-l border-border md:border-l-0">
                                <div style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}><Bath className="mx-auto" size={24} /></div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{property.baths}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Baths</div>
                            </div>
                            <div className="border-l border-border md:border-l">
                                <div style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}><Square className="mx-auto" size={24} /></div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{property.area}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Area</div>
                            </div>
                            <div className="border-l border-border md:border-l-0">
                                <div style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}><Calendar className="mx-auto" size={24} /></div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>2023</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Built</div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Description */}
                    <FadeIn delay={0.6}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Description</h2>
                            <p style={{ lineHeight: 1.8, color: 'var(--muted)', fontSize: '1.05rem' }}>
                                {property.description || "Welcome to this magnificent property that perfectly blends modern luxury with comfort. Featuring spacious interiors, high-end finishes, and an abundance of natural light, this home is designed for those who appreciate the finer things in life. The open-concept living area is perfect for entertaining, while the private master suite offers a serene retreat. Located in a sought-after neighborhood, you are just minutes away from top-rated schools, shopping, and dining. Don't miss the opportunity to make this dream home yours!"}
                            </p>
                        </div>
                    </FadeIn>

                    {/* Map */}
                    <FadeIn delay={0.8}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Location</h2>
                            <div style={{ height: '400px', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                <Map properties={[property]} center={[property.lat, property.lng]} />
                            </div>
                            <div style={{ marginTop: '1rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={18} /> {property.address}
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Price Card */}
                    <FadeIn delay={0.5} direction="left">
                        <div style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', background: 'white', position: 'sticky', top: '6rem' }}>
                            <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>Price</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                                {typeof property.price === 'number'
                                    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.price)
                                    : property.price}
                            </div>

                            <Button fullWidth size="lg" className="mb-3" onClick={() => setShowBooking(!showBooking)}>
                                {showBooking ? 'Cancel Booking' : 'Schedule a Tour'}
                            </Button>

                            <Button
                                fullWidth
                                variant="outline"
                                size="lg"
                                className="mb-3"
                                onClick={() => window.location.href = `/messages?agentId=agent_default&name=${encodeURIComponent(property.agent?.name || "Agent")}`}
                            >
                                <MessageSquare size={18} style={{ marginRight: '0.5rem' }} /> Message Agent
                            </Button>

                            {showBooking && (
                                <div className="animate-fade-in-up" style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Select Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', marginBottom: '0.75rem' }}
                                    />
                                    <textarea
                                        placeholder="Any notes for the agent?"
                                        value={bookingNotes}
                                        onChange={(e) => setBookingNotes(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', marginBottom: '0.75rem', minHeight: '80px' }}
                                    />
                                    <Button fullWidth onClick={handleBookVisit} disabled={isBooking || !bookingDate} style={{ background: '#10B981' }}>
                                        {isBooking ? 'Booking...' : 'Confirm Request'}
                                    </Button>
                                </div>
                            )}

                            <Button fullWidth size="lg" variant="outline">Request Info</Button>
                        </div>
                    </FadeIn>

                    {/* Agent Card */}
                    <FadeIn delay={0.7} direction="left">
                        <div style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', background: '#F8FAFC' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem' }}>Listing Agent</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: '#CBD5E1', overflow: 'hidden' }}>
                                    <img src={property.agent?.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"} alt="Agent" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>{property.agent?.name || "Rajesh Khanna"}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#F59E0B' }}>
                                            <Star size={14} fill="#F59E0B" />
                                            <span style={{ fontWeight: 'bold', color: '#B45309' }}>4.8</span>
                                        </div>
                                        <span style={{ width: '4px', height: '4px', background: '#CBD5E1', borderRadius: '50%' }}></span>
                                        <span style={{ textDecoration: 'underline' }}>124 reviews</span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#10B981', background: '#ECFDF5', padding: '0.125rem 0.5rem', borderRadius: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                                        <ThumbsUp size={12} />
                                        <span>45 Deals Closed</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
                                    <Phone size={18} /> {property.agent?.phone || "+91 98765 43210"}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
                                    <Mail size={18} /> {property.agent?.email || "rajesh.k@homeconnect.in"}
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* Sticky Mobile Footer Action */}
            <div className="lg:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'white', borderTop: '1px solid var(--border)', zIndex: 40, display: 'flex', gap: '1rem', boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Price</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        {typeof property.price === 'number'
                            ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.price)
                            : property.price}
                    </div>
                </div>
                <Button>Contact Agent</Button>
            </div>
        </div>
    );
}
