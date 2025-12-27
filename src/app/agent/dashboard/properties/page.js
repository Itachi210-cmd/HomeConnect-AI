"use client";
import { Plus, MapPin, Bed, Bath, Square, Eye, Edit, Trash2 } from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';
import { useProperties } from '@/context/PropertyContext';
import { useSession } from 'next-auth/react';

export default function PropertiesPage() {
    const { data: session } = useSession();
    const { properties, deleteProperty, formatPrice } = useProperties();

    // Filter properties to only show those belonging to the current agent
    const filteredProperties = properties.filter(prop =>
        prop.agentId === session?.user?.id ||
        prop.agentId === session?.user?.email
    );


    const handleImageError = (e) => {
        e.target.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
    };

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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {filteredProperties.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', background: '#F8FAFC', borderRadius: 'var(--radius)', border: '2px dashed var(--border)' }}>
                        <p style={{ color: 'var(--muted)', fontSize: '1.125rem', marginBottom: '1rem' }}>You haven't added any properties yet.</p>
                        <Link href="/agent/dashboard/add-property">
                            <Button variant="outline">Add your first property &rarr;</Button>
                        </Link>
                    </div>
                ) : (
                    filteredProperties.map((property) => (
                        <div key={property.id} className="card hover-scale" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ position: 'relative', height: '220px' }}>
                                <img
                                    src={property.images?.[0] || property.image || "https://images.unsplash.com/photo-1600596542815-2251c3052068?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                                    alt={property.title}
                                    onError={handleImageError}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    display: 'flex',
                                    gap: '0.5rem'
                                }}>
                                    <span style={{
                                        background: property.status === 'Active' ? '#10B981' : '#F59E0B',
                                        color: 'white',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}>
                                        {property.status}
                                    </span>
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--foreground)', lineHeight: 1.2 }}>{property.title}</h3>
                                        <p style={{ fontSize: '1.125rem', fontWeight: '900', color: 'var(--primary)', whiteSpace: 'nowrap' }}>{formatPrice(property.price)}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                        <MapPin size={14} />
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{property.address || property.location}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#475569', fontWeight: '500' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Bed size={16} className="text-primary" /> {property.beds} <span style={{ color: 'var(--muted)', fontWeight: 'normal' }}>Beds</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Bath size={16} className="text-primary" /> {property.baths} <span style={{ color: 'var(--muted)', fontWeight: 'normal' }}>Baths</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Square size={16} className="text-primary" /> {property.area || 0} <span style={{ color: 'var(--muted)', fontWeight: 'normal' }}>Sqft</span>
                                    </div>
                                </div>

                                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                                    <Link href={`/properties/${property.id}`} style={{ flex: 1 }}>
                                        <Button variant="outline" size="sm" fullWidth style={{ gap: '0.4rem' }}>
                                            <Eye size={16} /> View
                                        </Button>
                                    </Link>
                                    <Link href={`/agent/dashboard/edit-property/${property.id}`} style={{ flex: 1 }}>
                                        <Button variant="outline" size="sm" fullWidth style={{ gap: '0.4rem' }}>
                                            <Edit size={16} /> Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        style={{ color: '#EF4444', borderColor: '#FEE2E2', background: '#FEF2F2' }}
                                        onClick={() => {
                                            if (confirm("Are you sure you want to delete this listing?")) {
                                                deleteProperty(property.id);
                                            }
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
