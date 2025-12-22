"use client";
import { Plus, MapPin, Bed, Bath, Square, Edit, Trash2, Eye } from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';
import { useProperties } from '@/context/PropertyContext';

export default function PropertiesPage() {
    const { properties, deleteProperty } = useProperties();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--foreground)' }}>My Properties</h1>
                    <p style={{ color: 'var(--muted)' }}>Manage your property listings</p>
                </div>
                <Link href="/agent/dashboard/add-property">
                    <Button style={{ gap: '0.5rem' }}>
                        <Plus size={18} /> Add Property
                    </Button>
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {properties.map((property) => (
                    <div key={property.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ position: 'relative', height: '200px' }}>
                            <img
                                src={property.image}
                                alt={property.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <span style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: property.status === 'Active' ? '#10B981' : '#F59E0B',
                                color: 'white',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                            }}>
                                {property.status}
                            </span>
                        </div>

                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--foreground)' }}>{property.title}</h3>
                                <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--primary)' }}>{property.price}</p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                <MapPin size={16} />
                                {property.address}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--foreground)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Bed size={16} className="text-muted" /> {property.beds}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Bath size={16} className="text-muted" /> {property.baths}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Square size={16} className="text-muted" /> {property.sqft}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
