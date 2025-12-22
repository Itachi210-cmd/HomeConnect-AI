"use client";
import { useState } from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import Button from '@/components/Button';

export default function FilterBar({ onFilterChange }) {
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        beds: '',
        baths: '',
        type: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const resetFilters = {
            minPrice: '',
            maxPrice: '',
            beds: '',
            baths: '',
            type: ''
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--muted)', fontSize: '0.875rem', fontWeight: '600' }}>
                <Filter size={16} /> Advanced Filters
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                {/* Price Range */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem', color: 'var(--muted)' }}>Min Price (₹)</label>
                    <select
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', outline: 'none' }}
                    >
                        <option value="">Any</option>
                        <option value="5000000">50 Lakhs</option>
                        <option value="10000000">1 Cr</option>
                        <option value="20000000">2 Cr</option>
                        <option value="50000000">5 Cr</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem', color: 'var(--muted)' }}>Max Price (₹)</label>
                    <select
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', outline: 'none' }}
                    >
                        <option value="">Any</option>
                        <option value="10000000">1 Cr</option>
                        <option value="30000000">3 Cr</option>
                        <option value="50000000">5 Cr</option>
                        <option value="100000000">10 Cr+</option>
                    </select>
                </div>

                {/* Beds */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem', color: 'var(--muted)' }}>Beds</label>
                    <select
                        name="beds"
                        value={filters.beds}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', outline: 'none' }}
                    >
                        <option value="">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                        <option value="5">5+</option>
                    </select>
                </div>

                {/* Baths */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem', color: 'var(--muted)' }}>Baths</label>
                    <select
                        name="baths"
                        value={filters.baths}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', outline: 'none' }}
                    >
                        <option value="">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                    </select>
                </div>

                {/* Reset Button */}
                <div>
                    <button
                        onClick={handleReset}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            background: 'white',
                            cursor: 'pointer',
                            color: 'var(--muted)',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}
                    >
                        <RotateCcw size={14} /> Reset Filters
                    </button>
                </div>
            </div>
        </div>
    );
}
