"use client";
import { useEffect, useState, useRef } from 'react';
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
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (!property) return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Property Not Found</h2>
            <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
    );

    const isWishlisted = wishlist.includes(property.id);
    const defaultImg = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: '120px' }}>
            {/* Floating Premium Top Bar */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: scrolled ? 'translateY(0)' : 'translateY(-100%)',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                padding: '12px 24px'
            }}>
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontWeight: '900', fontSize: '1.25rem', color: '#0F172A' }}>{property.price}</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: '500' }}>{property.title}</div>
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
                    style={{ position: 'absolute', top: '32px', left: '32px', zIndex: 10, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            {/* 2. Content Sections */}
            <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Title and Badge */}
                    <FadeIn direction="up">
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#F0F9FF', borderRadius: '100px', color: '#0369A1', fontSize: '0.8rem', fontWeight: '700', marginBottom: '24px', border: '1px solid #BAE6FD' }}>
                            <Award size={16} /> ELITE SELECTION PREFERRED
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900', color: '#0F172A', letterSpacing: '-2px', lineHeight: 1, marginBottom: '20px' }}>
                            {property.title}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748B', fontSize: '1.25rem', fontWeight: '500' }}>
                            <MapPin size={24} color="#0EA5E9" /> {property.location}
                        </div>
                    </FadeIn>

                    {/* Quick Insights Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                        {[
                            { icon: Bed, val: property.beds, l: 'Bedrooms', color: '#FDF2F8', iconCol: '#DB2777' },
                            { icon: Bath, val: property.baths, l: 'Bathrooms', color: '#F0F9FF', iconCol: '#0284C7' },
                            { icon: Square, val: property.area, l: 'Living Sqft', color: '#F0FDF4', iconCol: '#16A34A' },
                            { icon: Star, val: '4.9', l: 'Elite Rating', color: '#FFFBEB', iconCol: '#D97706' }
                        ].map((s, i) => (
                            <div key={i} style={{ padding: '24px', background: s.color, borderRadius: '24px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <s.icon size={28} color={s.iconCol} />
                                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1E293B' }}>{s.val}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: s.iconCol, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.l}</div>
                            </div>
                        ))}
                    </div>

                    {/* AI Smart Summary - THE WOW FACTOR */}
                    <div style={{
                        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                        padding: '32px', borderRadius: '32px', color: 'white', position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'var(--primary)', opacity: 0.1, borderRadius: '50%', filter: 'blur(40px)' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '12px' }}>
                                <Sparkles size={20} color="#60A5FA" />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Antigravity AI Insights</h3>
                        </div>
                        <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#CBD5E1', marginBottom: '24px' }}>
                            Based on local trends, this {property.title} in {property.location.split(',')[0]} is seeing a <span style={{ color: '#4ADE80', fontWeight: '700' }}>12% increase</span> in year-over-year value. The architectural style perfectly matches current high-end buyer preferences.
                        </p>
                        <div style={{ display: 'flex', gap: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                                <Zap size={16} color="#FBBF24" /> High ROI Potential
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                                <CheckCircle2 size={16} color="#4ADE80" /> Neighborhood A+
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div style={{ padding: '40px', background: 'white', borderRadius: '32px', border: '1px solid #E2E8F0' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '24px', color: '#0F172A' }}>The Residence</h2>
                        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: '#475569', marginBottom: '32px' }}>
                            {property.description || "Discover unparalleled living in this designer-perfect residence. Boasting floor-to-ceiling glass walls, premium Italian marble flooring, and a bespoke kitchen that would delight any gourmet chef. This is not just a house; it's an architectural statement."}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            {['Privated Helipad', 'Infinity Edge Pool', 'Home Cinema', 'Wine Cellar', 'Smart Security', 'Guest Wing'].map((f, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: '#F8FAFC', borderRadius: '16px', fontWeight: '600', color: '#334155' }}>
                                    <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div> {f}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Map & Context - IMPROVED FOCUS */}
                    <div className="space-y-6">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '900' }}>Exact Location</h2>
                            <Button variant="outline" size="sm" style={{ borderRadius: '100px' }}>
                                <Navigation size={18} style={{ marginRight: '8px' }} /> Get Directions
                            </Button>
                        </div>
                        <div style={{
                            height: '500px', borderRadius: '40px', overflow: 'hidden',
                            border: '12px solid white',
                            boxShadow: '0 30px 60px -12px rgba(0,0,0,0.1)',
                            position: 'relative'
                        }}>
                            {/* Map adjusted to property coordinates */}
                            <Map
                                properties={[property]}
                                center={[property.lat || 19.1170, property.lng || 72.8250]}
                                zoom={15}
                            />
                            {/* Overlay Badge */}
                            <div style={{ position: 'absolute', bottom: '24px', left: '24px', background: 'white', padding: '12px 20px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '700' }}>
                                <Home size={20} color="var(--primary)" /> {property.location}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Elite Sidebar */}
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{
                            background: 'white', padding: '40px', borderRadius: '40px',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 40px 80px -20px rgba(0,0,0,0.12)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: '700', letterSpacing: '2px', marginBottom: '8px' }}>ELITE LISTING VALUE</div>
                            <div style={{ fontSize: '3rem', fontWeight: '950', color: '#0F172A', marginBottom: '32px' }}>
                                ₹{new Intl.NumberFormat('en-IN').format(property.price?.toString().replace(/[^0-9]/g, '') || 25000000)}
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
                                    <div style={{ marginTop: '24px', padding: '24px', background: '#F8FAFC', borderRadius: '24px', border: '2px dashed #E2E8F0' }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#64748B', marginBottom: '8px', textAlign: 'left' }}>SELECT PREFERRED DATE</label>
                                        <input
                                            type="datetime-local"
                                            value={bookingDate}
                                            onChange={(e) => setBookingDate(e.target.value)}
                                            style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '16px', fontWeight: '600' }}
                                        />

                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#64748B', marginBottom: '8px', textAlign: 'left' }}>MESSAGE TO AGENT (OPTIONAL)</label>
                                        <textarea
                                            placeholder="Write a message or specific requirements..."
                                            value={bookingNotes}
                                            onChange={(e) => setBookingNotes(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '16px',
                                                borderRadius: '16px',
                                                border: '1px solid #E2E8F0',
                                                marginBottom: '16px',
                                                minHeight: '100px',
                                                resize: 'none',
                                                fontFamily: 'inherit'
                                            }}
                                        />

                                        <Button fullWidth onClick={handleBookVisit} disabled={isBooking}>
                                            {isBooking ? 'Securing Slot...' : 'Secure Viewing'}
                                        </Button>
                                    </div>
                                </FadeIn>
                            )}

                            <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '1px solid #F1F5F9', textAlign: 'left' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{ position: 'relative' }}>
                                        <img src={property.agent?.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a"} style={{ width: '64px', height: '64px', borderRadius: '20px', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#10B981', width: '16px', height: '16px', borderRadius: '50%', border: '3px solid white' }}></div>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{property.agent?.name || "Rajesh Khanna"}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '600' }}>Senior Luxury Portfolio Advisor</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Proof Mini Card */}
                        <div style={{ background: '#0F172A', padding: '20px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px' }}>
                                <ThumbsUp size={20} color="#60A5FA" />
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>45 Active Inquiries</div>
                                <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>High-demand property</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile Bar - IMPROVED */}
            <div className="lg:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '24px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid #E2E8F0', zIndex: 1100, display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '900', color: '#0F172A', fontSize: '1.5rem' }}>{property.price}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>Total Value</div>
                </div>
                <Button size="lg" style={{ flex: 1 }} onClick={handleMessageAgent}>Inquire Now</Button>
            </div>
        </div>
    );
}
