"use client";
import { useEffect, useState, useRef, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProperties } from '@/context/PropertyContext';
import {
    MapPin, Bed, Bath, Square, ArrowLeft, Heart, Share2,
    Phone, Mail, Calendar, Star, ThumbsUp, MessageSquare,
    ChevronRight, CheckCircle2, ShieldCheck, Clock, Navigation,
    Sparkles, Zap, Award, Home
} from 'lucide-react';
import Button from '@/components/Button';
import FadeIn from '@/components/FadeIn';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function PropertyDetailsPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const router = useRouter();
    const { properties, toggleWishlist, wishlist, formatPrice, estimateValue } = useProperties();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [estimating, setEstimating] = useState(false);
    const [showBooking, setShowBooking] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingNotes, setBookingNotes] = useState('');
    const [isBooking, setIsBooking] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const viewIncremented = useRef(false);

    const handleImageError = (e) => {
        e.target.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 100);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMessageAgent = () => {
        const agentId = "agent_default";
        const agentName = property.agent?.name || "Rajesh Khanna";
        window.location.href = `/messages?agentId=${agentId}&name=${encodeURIComponent(agentName)}`;
    };

    const handleBookVisit = async () => {
        if (!bookingDate) return;
        setIsBooking(true);
        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: bookingDate,
                    propertyId: property.id,
                    buyerId: "buyer_default",
                    agentId: "agent_default",
                    notes: bookingNotes
                })
            });
            if (res.ok) {
                alert("Visit Request Sent Sucessfully!");
                setShowBooking(false);
            }
        } catch (error) {
            console.error("Booking error:", error);
        } finally {
            setIsBooking(false);
        }
    };

    useEffect(() => {
        if (params?.id) {
            const found = properties.find(p => p.id === params.id);
            if (found) {
                setProperty(found);

                // Increment view count
                if (!viewIncremented.current) {
                    fetch(`/api/properties/${params.id}/view`, { method: 'POST' })
                        .catch(err => console.error("Failed to increment view:", err));
                    viewIncremented.current = true;
                }
            }
            setLoading(false);
        }
    }, [params, properties]);

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (!property) return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', background: 'var(--background)', color: 'var(--foreground)' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Property Not Found</h2>
            <Button onClick={() => router.push('/')} size="lg">Go Home</Button>
        </div>
    );

    const handleEstimate = async () => {
        if (estimating) return;
        setEstimating(true);
        await estimateValue(property.id);
        setEstimating(false);
    };

    const isWishlisted = wishlist.includes(property.id);
    const defaultImg = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', paddingBottom: '120px', transition: 'background 0.3s ease' }}>
            {/* Floating Premium Top Bar */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: scrolled ? 'translateY(0)' : 'translateY(-100%)',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid var(--glass-border)',
                padding: '12px 24px'
            }}>
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontWeight: '900', fontSize: '1.25rem', color: 'var(--foreground)' }}>{formatPrice(property.price)}</div>
                            {property.marketValue && (
                                <div style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Sparkles size={10} /> Market: {formatPrice(property.marketValue)}
                                </div>
                            )}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: '600' }}>{property.title}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Button size="sm" variant="outline" onClick={() => toggleWishlist(property.id)}>
                            <Heart size={16} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : 'currentColor'} />
                        </Button>
                        <Button size="sm" onClick={handleMessageAgent}>Contact Expert</Button>
                    </div>
                </div>
            </div>

            {/* 1. Immersive Hero Gallery */}
            <div style={{ position: 'relative', background: '#0F172A', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: '550px', gap: '4px' }}>
                    <div style={{ gridColumn: 'span 2', position: 'relative', overflow: 'hidden' }} className="group">
                        <img
                            src={property.images?.[0] || property.image || defaultImg}
                            onError={handleImageError}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            className="ken-burns"
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}></div>
                    </div>
                    <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                        <img src={property.images?.[1] || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800"} onError={handleImageError} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <img src={property.images?.[2] || "https://images.unsplash.com/photo-1600566753086-00f18fb6f3ea?auto=format&fit=crop&w=800"} onError={handleImageError} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <img src={property.images?.[3] || "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=800"} onError={handleImageError} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'relative', overflow: 'hidden' }}>
                            <img src={property.images?.[4] || "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800"} onError={handleImageError} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>View More</div>
                        </div>
                    </div>
                </div>

                {/* Floating Back Button */}
                <button
                    onClick={() => router.back()}
                    style={{ position: 'absolute', top: '32px', left: '32px', zIndex: 10, background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-lg)', color: 'var(--foreground)' }}
                    className="hover-scale"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            {/* 2. Content Sections */}
            <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Title and Badge */}
                    <FadeIn direction="up">
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--input)', borderRadius: '100px', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '800', marginBottom: '24px', border: '1px solid var(--border)', boxShadow: '0 0 15px rgba(99, 102, 241, 0.1)' }}>
                            <Award size={18} /> ELITE SELECTION PREFERRED
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '950', color: 'var(--foreground)', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '24px' }}>
                            {property.title}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--muted)', fontSize: '1.5rem', fontWeight: '600' }}>
                            <MapPin size={28} className="text-secondary" /> {property.location}
                        </div>
                    </FadeIn>

                    {/* Quick Insights Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px' }}>
                        {[
                            { icon: Bed, val: property.beds, l: 'Bedrooms', color: 'var(--input)', iconCol: 'var(--primary)' },
                            { icon: Bath, val: property.baths, l: 'Bathrooms', color: 'var(--input)', iconCol: 'var(--secondary)' },
                            { icon: Square, val: property.area, l: 'Living Sqft', color: 'var(--input)', iconCol: 'var(--primary)' },
                            { icon: Star, val: '4.9', l: 'Elite Rating', color: 'var(--input)', iconCol: 'var(--secondary)' }
                        ].map((s, i) => (
                            <div key={i} className="card glass hover-scale" style={{ padding: '24px', background: s.color, borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow)' }}>
                                <s.icon size={32} style={{ color: s.iconCol }} />
                                <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--foreground)' }}>{s.val}</div>
                                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{s.l}</div>
                            </div>
                        ))}
                    </div>

                    {/* AI Smart Summary - THE WOW FACTOR */}
                    <div className="glass" style={{
                        background: 'var(--gradient-primary)',
                        padding: '40px', borderRadius: '40px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--glass-border)'
                    }}>
                        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'white', opacity: 0.1, borderRadius: '50%', filter: 'blur(60px)' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.3)' }}>
                                <Sparkles size={24} color="#FFF" />
                            </div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Antigravity AI Insights</h3>
                        </div>
                        <p style={{ fontSize: '1.25rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.95)', marginBottom: '32px', fontWeight: '500' }}>
                            Based on local trends, this {property.title} in {property.location.split(',')[0]} is seeing a <span style={{ color: '#4ADE80', fontWeight: '900', textShadow: '0 0 10px rgba(74, 222, 128, 0.4)' }}>12% increase</span> in year-over-year value. The architectural style perfectly matches current high-end buyer preferences.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: '800', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.2)' }}>
                                <Zap size={18} color="#FBBF24" /> High ROI Potential
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: '800', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.2)' }}>
                                <CheckCircle2 size={18} color="#4ADE80" /> Neighborhood A+
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="card glass" style={{ padding: '48px', borderRadius: '40px', border: '1px solid var(--border)' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '950', marginBottom: '28px', color: 'var(--foreground)', letterSpacing: '-0.03em' }}>The Residence</h2>
                        <p style={{ fontSize: '1.25rem', lineHeight: 1.9, color: 'var(--muted)', marginBottom: '40px', fontWeight: '500' }}>
                            {property.description || "Discover unparalleled living in this designer-perfect residence. Boasting floor-to-ceiling glass walls, premium Italian marble flooring, and a bespoke kitchen that would delight any gourmet chef. This is not just a house; it's an architectural statement."}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            {['Private Helipad', 'Infinity Edge Pool', 'Home Cinema', 'Wine Cellar', 'Smart Security', 'Guest Wing'].map((f, i) => (
                                <div key={i} className="hover-scale" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '20px 24px', background: 'var(--input)', borderRadius: '20px', fontWeight: '700', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
                                    <div style={{ width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--primary)' }}></div> {f}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional Details Section */}
                    {property.additionalDetails && (
                        <div className="card glass" style={{ padding: '48px', borderRadius: '40px', border: '1px solid var(--border)' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '950', marginBottom: '28px', color: 'var(--foreground)', letterSpacing: '-0.03em' }}>Additional Details</h2>
                            <div style={{
                                fontSize: '1.25rem',
                                lineHeight: 1.9,
                                color: 'var(--muted)',
                                whiteSpace: 'pre-wrap',
                                fontWeight: '500'
                            }}>
                                {property.additionalDetails}
                            </div>
                        </div>
                    )}

                    {/* Map & Context - IMPROVED FOCUS */}
                    <div className="space-y-8">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '950', color: 'var(--foreground)', letterSpacing: '-0.03em' }}>Exact Location</h2>
                            <Button variant="outline" size="lg" style={{ borderRadius: '100px' }}>
                                <Navigation size={20} style={{ marginRight: '10px' }} /> Get Directions
                            </Button>
                        </div>
                        <div style={{
                            height: '550px', borderRadius: '48px', overflow: 'hidden',
                            border: '12px solid var(--input)',
                            boxShadow: 'var(--shadow-2xl)',
                            position: 'relative'
                        }}>
                            {/* Map adjusted to property coordinates */}
                            <Map
                                properties={[property]}
                                center={[property.lat || 19.1170, property.lng || 72.8250]}
                                zoom={15}
                            />
                            {/* Overlay Badge */}
                            <div className="glass" style={{ position: 'absolute', bottom: '32px', left: '32px', padding: '16px 24px', borderRadius: '20px', boxShadow: 'var(--shadow-xl)', display: 'flex', alignItems: 'center', gap: '14px', fontWeight: '800', border: '1px solid var(--glass-border)', color: 'var(--foreground)' }}>
                                <Home size={24} color="var(--primary)" /> {property.location}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Elite Sidebar */}
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="card glass" style={{
                            padding: '40px', borderRadius: '48px',
                            border: '1px solid var(--border)',
                            boxShadow: 'var(--shadow-2xl)',
                            textAlign: 'center',
                            background: 'var(--glass-bg)'
                        }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: '800', letterSpacing: '3px', marginBottom: '12px' }}>ELITE LISTING VALUE</div>
                            <div style={{ fontSize: '3.5rem', fontWeight: '950', color: 'var(--foreground)', marginBottom: '12px', letterSpacing: '-0.04em' }}>
                                {formatPrice(property.price)}
                            </div>

                            {/* AI Market Valuation Card */}
                            <div style={{
                                background: 'var(--input)',
                                border: '1px solid var(--border)',
                                borderRadius: '28px',
                                padding: '24px',
                                marginBottom: '32px',
                                textAlign: 'left',
                                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)', fontWeight: '900', fontSize: '0.85rem', letterSpacing: '1px' }}>
                                        <Sparkles size={18} /> AI ESTIMATE
                                    </div>
                                    {!property.marketValue && (
                                        <button
                                            onClick={handleEstimate}
                                            disabled={estimating}
                                            style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--secondary)', fontSize: '0.75rem', fontWeight: '800', padding: '6px 14px', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                                            className="hover-scale"
                                        >
                                            {estimating ? 'Analyzing...' : 'Analyze Now'}
                                        </button>
                                    )}
                                </div>

                                {property.marketValue ? (
                                    <>
                                        <div style={{ fontSize: '1.75rem', fontWeight: '950', color: 'var(--foreground)', letterSpacing: '-0.02em' }}>{formatPrice(property.marketValue)}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '8px', lineHeight: 1.5, fontWeight: '500' }}>
                                            {property.valuationNotes || "Optimized based on square footage and neighborhood trends."}
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
                                        Check if this property is priced at fair market value with Antigravity AI.
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <Button fullWidth size="lg" style={{ height: '64px', fontSize: '1.1rem' }} onClick={() => setShowBooking(!showBooking)}>
                                    {showBooking ? 'Close Inquiry' : 'Schedule VIP Viewing'}
                                </Button>
                                <Button fullWidth variant="outline" size="lg" style={{ height: '64px', fontSize: '1.1rem' }} onClick={handleMessageAgent}>
                                    <MessageSquare size={20} style={{ marginRight: '10px' }} /> Message Agent
                                </Button>
                            </div>

                            {showBooking && (
                                <FadeIn direction="up">
                                    <div style={{ marginTop: '32px', padding: '32px', background: 'var(--input)', borderRadius: '32px', border: '2px dashed var(--border)' }}>
                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '800', color: 'var(--muted)', marginBottom: '12px', textAlign: 'left', letterSpacing: '1px' }}>SELECT PREFERRED DATE</label>
                                        <input
                                            type="datetime-local"
                                            value={bookingDate}
                                            onChange={(e) => setBookingDate(e.target.value)}
                                            style={{ width: '100%', padding: '18px', borderRadius: '18px', border: '1px solid var(--border)', marginBottom: '20px', fontWeight: '700', background: 'var(--background)', color: 'var(--foreground)' }}
                                        />

                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '800', color: 'var(--muted)', marginBottom: '12px', textAlign: 'left', letterSpacing: '1px' }}>MESSAGE TO AGENT (OPTIONAL)</label>
                                        <textarea
                                            placeholder="Write a message or specific requirements..."
                                            value={bookingNotes}
                                            onChange={(e) => setBookingNotes(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '18px',
                                                borderRadius: '18px',
                                                border: '1px solid var(--border)',
                                                marginBottom: '24px',
                                                minHeight: '120px',
                                                resize: 'none',
                                                fontFamily: 'inherit',
                                                background: 'var(--background)',
                                                color: 'var(--foreground)',
                                                fontWeight: '600'
                                            }}
                                        />

                                        <Button fullWidth size="lg" onClick={handleBookVisit} disabled={isBooking}>
                                            {isBooking ? 'Securing Slot...' : 'Secure Viewing'}
                                        </Button>
                                    </div>
                                </FadeIn>
                            )}

                            <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '1px solid var(--border)', textAlign: 'left' }}>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ position: 'relative' }}>
                                        <img src={property.agent?.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a"} style={{ width: '72px', height: '72px', borderRadius: '24px', objectFit: 'cover', boxShadow: 'var(--shadow)' }} />
                                        <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#10B981', width: '20px', height: '20px', borderRadius: '50%', border: '4px solid var(--background)' }}></div>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '900', fontSize: '1.25rem', color: 'var(--foreground)' }}>{property.agent?.name || "Rajesh Khanna"}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: '700' }}>Senior Luxury Portfolio Advisor</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Proof Mini Card */}
                        <div className="card glass" style={{ background: 'var(--foreground)', padding: '24px', borderRadius: '32px', display: 'flex', alignItems: 'center', gap: '16px', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px' }}>
                                <ThumbsUp size={24} color="#60A5FA" />
                            </div>
                            <div>
                                <div style={{ fontWeight: '900', fontSize: '1rem', letterSpacing: '0.5px' }}>45 Active Inquiries</div>
                                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>High-demand property</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile Bar - IMPROVED */}
            <div className="lg:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '24px', background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--glass-border)', zIndex: 1100, display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '950', color: 'var(--foreground)', fontSize: '1.75rem', letterSpacing: '-0.02em' }}>{formatPrice(property.price)}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '700' }}>Total Value</div>
                </div>
                <Button size="lg" style={{ flex: 1, borderRadius: '16px' }} onClick={handleMessageAgent}>Inquire Now</Button>
            </div>
        </div>
    );
}
