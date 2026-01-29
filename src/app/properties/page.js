"use client";
import { useState, useEffect } from 'react';
import { useProperties } from '@/context/PropertyContext';
import { Search, MapPin, DollarSign, Home as HomeIcon, Filter, Layers, SlidersHorizontal } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import Button from '@/components/Button';
import FadeIn from '@/components/FadeIn';

export default function PropertiesPage() {
    const { properties, loading, formatPrice } = useProperties();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterPrice, setFilterPrice] = useState('All');
    const [filterLocation, setFilterLocation] = useState('All');
    const [filteredProperties, setFilteredProperties] = useState([]);

    // Get unique types and locations for filters
    const types = ['All', ...new Set(properties.map(p => p.type))];
    const locations = ['All', ...new Set(properties.map(p => p.location.split(',')[0].trim()))];

    useEffect(() => {
        let result = properties;

        if (searchTerm) {
            result = result.filter(p =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== 'All') {
            result = result.filter(p => p.type === filterType);
        }

        if (filterLocation !== 'All') {
            result = result.filter(p => p.location.includes(filterLocation));
        }

        if (filterPrice !== 'All') {
            if (filterPrice === 'Under 1Cr') result = result.filter(p => p.price < 10000000);
            if (filterPrice === '1Cr - 5Cr') result = result.filter(p => p.price >= 10000000 && p.price <= 50000000);
            if (filterPrice === 'Over 5Cr') result = result.filter(p => p.price > 50000000);
        }

        setFilteredProperties(result);
    }, [searchTerm, filterType, filterPrice, filterLocation, properties]);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', paddingBottom: '5rem', transition: 'background 0.3s ease' }}>
            {/* Header Section */}
            <div style={{
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', // Always dark for white text
                color: 'white',
                padding: '6rem 0 10rem', // Increased padding for better spacing
                marginBottom: '-6rem', // Increased negative margin for better overlap
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: 'var(--primary)', opacity: 0.2, filter: 'blur(100px)' }}></div>
                <div className="container">
                    <FadeIn>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                            Discover Your <span className="text-gradient">Perfect Space</span>
                        </h1>
                        <p style={{ color: 'var(--muted)', fontSize: '1.25rem', maxWidth: '600px' }}>
                            Browse our curated collection of luxury properties across India's most sought-after neighborhoods.
                        </p>
                    </FadeIn>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="container" style={{ position: 'relative', zIndex: 20 }}>
                <FadeIn delay={0.2}>
                    <div className="glass" style={{
                        padding: '1.5rem',
                        borderRadius: '2rem',
                        boxShadow: 'var(--shadow-xl)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        alignItems: 'center',
                        border: '1px solid var(--border)',
                        background: 'var(--glass-bg)',
                        maxWidth: '1100px', // Constrain width for better aesthetic
                        margin: '0 auto' // Center it
                    }}>
                        {/* Search Input */}
                        <div style={{ flex: '2 1 300px', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.5rem', background: 'var(--input)', borderRadius: '1.25rem', border: '1px solid var(--border)' }}>
                            <Search size={20} className="text-primary" />
                            <input
                                type="text"
                                placeholder="Search by title, location, or features..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '1rem', color: 'var(--foreground)' }}
                            />
                        </div>

                        {/* Type Filter */}
                        <div style={{ flex: '1 1 150px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.25rem', background: 'var(--input)', borderRadius: '1.25rem', border: '1px solid var(--border)' }}>
                            <HomeIcon size={18} className="text-muted" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', background: 'transparent', color: 'var(--foreground)' }}
                            >
                                {types.map(t => <option key={t} value={t} style={{ background: 'var(--background)' }}>{t}</option>)}
                            </select>
                        </div>

                        {/* Price Filter */}
                        <div style={{ flex: '1 1 150px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.25rem', background: 'var(--input)', borderRadius: '1.25rem', border: '1px solid var(--border)' }}>
                            <DollarSign size={18} className="text-muted" />
                            <select
                                value={filterPrice}
                                onChange={(e) => setFilterPrice(e.target.value)}
                                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', background: 'transparent', color: 'var(--foreground)' }}
                            >
                                <option value="All" style={{ background: 'var(--background)' }}>All Prices</option>
                                <option value="Under 1Cr" style={{ background: 'var(--background)' }}>Under 1 Cr</option>
                                <option value="1Cr - 5Cr" style={{ background: 'var(--background)' }}>1 Cr - 5 Cr</option>
                                <option value="Over 5Cr" style={{ background: 'var(--background)' }}>Over 5 Cr</option>
                            </select>
                        </div>

                        <Button style={{ padding: '0.85rem 2.5rem', borderRadius: '1.25rem' }}>
                            Apply Filters
                        </Button>
                    </div>
                </FadeIn>
            </div>

            {/* Results Section */}
            <div className="container" style={{ marginTop: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--foreground)' }}>
                        Showing {filteredProperties.length} Properties
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button variant="outline" size="sm" style={{ borderRadius: '10px' }}><SlidersHorizontal size={16} /></Button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>
                        <div className="animate-pulse" style={{ color: 'var(--muted)' }}>Loading amazing homes...</div>
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <div className="card glass" style={{ textAlign: 'center', padding: '8rem 2rem', borderRadius: '2.5rem', border: '2px dashed var(--border)' }}>
                        <div style={{ background: 'var(--input)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', boxShadow: 'var(--shadow)' }}>
                            <Search size={48} className="text-muted" />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1.25rem', color: 'var(--foreground)' }}>No properties found</h2>
                        <p style={{ color: 'var(--muted)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Try adjusting your search terms or filters to find what you're looking for.</p>
                        <Button variant="outline" onClick={() => { setSearchTerm(''); setFilterType('All'); setFilterPrice('All'); }}>Clear All Filters</Button>
                    </div>
                ) : (
                    <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ display: 'grid', gap: '2.5rem' }}>
                        {filteredProperties.map((prop, index) => (
                            <FadeIn key={prop.id} delay={index * 0.1}>
                                <PropertyCard property={prop} />
                            </FadeIn>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
