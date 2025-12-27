"use client";
import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Calculator, Sparkles, ArrowRight, Heart } from 'lucide-react';
import Button from '@/components/Button';
import PropertyCard from '@/components/PropertyCard';
import FilterBar from '@/components/FilterBar';
import Loading from '@/components/Loading';
import FadeIn from '@/components/FadeIn';
import MortgageCalculator from '@/components/MortgageCalculator';
import dynamic from 'next/dynamic';
import { useProperties } from '@/context/PropertyContext';
import Link from 'next/link';
import { StatSkeleton, PropertyCardSkeleton } from '@/components/Skeleton';

// Dynamically import Map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function BuyerDashboard() {
    const { properties, parsePrice } = useProperties();
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCalculator, setShowCalculator] = useState(false);
    const [calculatedPropertyPrice, setCalculatedPropertyPrice] = useState(0);
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        beds: '',
        baths: '',
        type: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('split'); // 'list', 'map', or 'split'

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const openCalculator = (price) => {
        setCalculatedPropertyPrice(price ? parsePrice(price) : 5000000); // Default to 50L if no price
        setShowCalculator(true);
    };

    const filteredProperties = properties.filter(property => {
        // Text Search
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            (property.title || '').toLowerCase().includes(searchLower) ||
            (property.address || '').toLowerCase().includes(searchLower) ||
            (property.location || '').toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;

        // Advanced Filters
        const price = parsePrice(property.price);
        if (filters.minPrice && price < parseFloat(filters.minPrice)) return false;
        if (filters.maxPrice && price > parseFloat(filters.maxPrice)) return false;
        if (filters.beds && property.beds < parseInt(filters.beds)) return false;
        if (filters.baths && property.baths < parseInt(filters.baths)) return false;

        return true;
    });

    // AI Matching Logic
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [matchResults, setMatchResults] = useState({}); // { id: { score, reason } }

    const handleAnalyzeMatch = async () => {
        setIsAnalyzing(true);
        try {
            // Send current list (top 5 max) + user search to API
            const targetProperties = filteredProperties.slice(0, 5);

            const res = await fetch('/api/ai/match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    preferences: {
                        search: searchTerm,
                        ...filters
                    },
                    properties: targetProperties.map(p => ({
                        id: p.id,
                        title: p.title,
                        price: p.price,
                        type: p.type,
                        features: p.features || [],
                        location: p.location
                    }))
                })
            });

            if (res.ok) {
                const data = await res.json();
                setMatchResults(data); // { "1": { score: 90, reason: "..." } }
            } else {
                alert("Failed to analyze matches.");
            }
        } catch (error) {
            console.error("Match analysis failed:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Merge match results into properties for display
    const propertiesWithScores = filteredProperties.map(p => {
        const match = matchResults[p.id];
        return match ? { ...p, matchScore: match.score, matchReason: match.reason } : p;
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)); // Sort by score if available

    const recommendedProperties = properties.slice(0, 3); // Mock recommendations

    if (isLoading) {
        return <Loading fullScreen />;
    }

    return (
        <FadeIn>
            <MortgageCalculator
                isOpen={showCalculator}
                onClose={() => setShowCalculator(false)}
                propertyPrice={calculatedPropertyPrice}
            />

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {isLoading ? (
                    <>
                        <StatSkeleton />
                        <StatSkeleton />
                        <StatSkeleton />
                    </>
                ) : (
                    <>
                        <Link href="/buyer/wishlist" style={{ textDecoration: 'none' }}>
                            <div className="card glass hover-scale" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)', color: 'white', cursor: 'pointer', border: 'none' }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.6rem', borderRadius: '12px' }}>
                                    <Heart size={24} color="white" fill="white" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', opacity: 0.9, fontWeight: '500' }}>Saved Properties</div>
                                    <div style={{ fontSize: '1.75rem', fontWeight: '800' }}>{properties.filter(p => p.isWishlisted).length || 3}</div>
                                </div>
                            </div>
                        </Link>
                        <div className="card glass hover-scale" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'var(--input)', padding: '0.6rem', borderRadius: '12px' }}>
                                <Search size={24} className="text-primary" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--muted)', fontWeight: '500' }}>Recent Searches</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--foreground)' }}>12</div>
                            </div>
                        </div>
                        <div className="card glass hover-scale" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => openCalculator()}>
                            <div style={{ background: 'var(--input)', padding: '0.6rem', borderRadius: '12px' }}>
                                <Calculator size={24} className="text-secondary" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--muted)', fontWeight: '500' }}>Mortgage Est.</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--secondary)' }}>Calculate Now</div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Recommended Section (New) */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sparkles size={20} color="#F59E0B" fill="#F59E0B" /> Recommended for You
                    </h2>
                    <Link href="/properties" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        View all <ArrowRight size={16} />
                    </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {recommendedProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </div>

            {/* Search Header */}
            <div className="card glass" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', border: '1px solid var(--border)' }}>
                <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                    <input
                        type="text"
                        placeholder="Search by location, price, or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 3rem',
                            borderRadius: '1rem',
                            border: '1px solid var(--border)',
                            outline: 'none',
                            fontSize: '1rem',
                            background: 'var(--input)',
                            color: 'var(--foreground)'
                        }}
                    />
                </div>
                <Button
                    variant={showFilters ? "primary" : "outline"}
                    onClick={() => setShowFilters(!showFilters)}
                    style={{ gap: '0.5rem' }}
                >
                    <Filter size={18} /> {showFilters ? 'Hide Filters' : 'Filters'}
                </Button>
                <Button
                    variant={viewMode === 'map' ? "primary" : "outline"}
                    onClick={() => setViewMode(viewMode === 'map' ? 'split' : 'map')}
                    style={{ gap: '0.5rem' }}
                >
                    <MapPin size={18} /> Map View
                </Button>
                <Button variant="outline" onClick={() => openCalculator()} style={{ gap: '0.5rem' }}>
                    <Calculator size={18} /> Calculator
                </Button>
                <Button
                    onClick={handleAnalyzeMatch}
                    disabled={isAnalyzing}
                    style={{
                        gap: '0.5rem',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)', // Special gradient for AI
                        color: 'white',
                        border: 'none',
                        marginLeft: 'auto'
                    }}
                >
                    {isAnalyzing ? (
                        <><span className="animate-spin">✨</span> Analyzing...</>
                    ) : (
                        <><Sparkles size={18} /> Analyze with AI</>
                    )}
                </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && <FilterBar onFilterChange={handleFilterChange} />}

            <div style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'split' ? '1fr 1fr' : '1fr',
                gap: '2rem',
                height: 'calc(100vh - 12rem)',
                marginTop: '1.5rem'
            }}>
                {/* Property List */}
                {(viewMode === 'list' || viewMode === 'split') && (
                    <div style={{ overflowY: 'auto', paddingRight: '0.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1.5rem', color: 'var(--foreground)' }}>
                            {filteredProperties.length > 0 ? `Found ${filteredProperties.length} Properties` : 'No Properties Found'}
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {propertiesWithScores.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Map View */}
                {(viewMode === 'map' || viewMode === 'split') && (
                    <div className="card" style={{ padding: 0, overflow: 'hidden', height: '100%', minHeight: '400px', position: 'relative', zIndex: 1, border: '1px solid var(--border)' }}>
                        <Map properties={filteredProperties} />
                    </div>
                )}
            </div>
            {/* Floating Action Button */}
            <div className="fab" onClick={handleAnalyzeMatch} style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                animation: isAnalyzing ? 'pulse 2s infinite' : 'none'
            }}>
                {isAnalyzing ? <span className="animate-spin">✨</span> : <Sparkles size={24} />}
            </div>
        </FadeIn>
    );
}
