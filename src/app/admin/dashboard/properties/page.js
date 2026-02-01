"use client";
import { useState, useEffect } from 'react';
import { Trash2, Edit, CheckCircle, XCircle, Search, ExternalLink } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import Link from 'next/link';
import { useProperties } from '@/context/PropertyContext';

export default function AdminProperties() {
    const { formatPrice } = useProperties();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const handleImageError = (e) => {
        e.target.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
    };

    const fetchData = async () => {
        try {
            const res = await fetch('/api/properties');
            if (res.ok) {
                const data = await res.json();
                setProperties(data);
            }
        } catch (error) {
            console.error("Admin fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this property?")) return;
        try {
            const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProperties(properties.filter(p => p.id !== id));
            } else {
                alert("Failed to delete property.");
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'For Sale' ? 'Sold' : 'For Sale';
        try {
            const res = await fetch(`/api/properties/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setProperties(properties.map(p => p.id === id ? { ...p, status: newStatus } : p));
            }
        } catch (error) {
            console.error("Status update failed:", error);
        }
    };

    const filteredProperties = properties.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loading />;

    return (
        <FadeIn>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Property Management</h1>
                    <p style={{ color: '#64748B' }}>Monitor and manage all real estate listings on the platform.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '300px' }}>
                        <Search size={18} color="#94A3B8" />
                        <input
                            type="text"
                            placeholder="Search properties..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                        />
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'var(--input)', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th className="th" style={{ color: 'var(--muted)' }}>Property</th>
                            <th className="th" style={{ color: 'var(--muted)' }}>Location</th>
                            <th className="th" style={{ color: 'var(--muted)' }}>Price</th>
                            <th className="th" style={{ color: 'var(--muted)' }}>Status</th>
                            <th className="th" style={{ color: 'var(--muted)' }}>Agent</th>
                            <th className="th" style={{ color: 'var(--muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProperties.length > 0 ? filteredProperties.map(prop => (
                            <tr key={prop.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td className="td" style={{ fontWeight: '700', color: 'var(--foreground)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', background: 'var(--input)' }}>
                                            <img
                                                src={(Array.isArray(prop.images) ? prop.images[0] : prop.images) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"}
                                                onError={handleImageError}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                        {prop.title}
                                    </div>
                                </td>
                                <td className="td">{prop.location}</td>
                                <td className="td">{formatPrice(prop.price)}</td>
                                <td className="td">
                                    <span className="status-badge" style={{
                                        background: prop.status === 'For Sale' ? '#DCFCE7' : '#FEE2E2',
                                        color: prop.status === 'For Sale' ? '#166534' : '#991B1B'
                                    }}>
                                        {prop.status}
                                    </span>
                                </td>
                                <td className="td">{prop.agent?.name || 'Unassigned'}</td>
                                <td className="td">
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Link href={`/properties/${prop.id}`} target="_blank">
                                            <button className="action-btn" title="View Listing"><ExternalLink size={16} /></button>
                                        </Link>
                                        <button className="action-btn" onClick={() => toggleStatus(prop.id, prop.status)} title="Toggle Status">
                                            {prop.status === 'For Sale' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                        </button>
                                        <button className="action-btn delete" onClick={() => handleDelete(prop.id)} title="Delete Property"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>No properties found matching your search.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .th { padding: 1rem 1.5rem; text-transform: uppercase; font-size: 0.75rem; font-weight: 800; color: #64748B; letter-spacing: 0.5px; }
                .td { padding: 1rem 1.5rem; font-size: 0.9rem; }
                .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; white-space: nowrap; }
                .action-btn { background: white; border: 1px solid #E2E8F0; padding: 6px; border-radius: 8px; cursor: pointer; color: #64748B; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
                .action-btn:hover { background: #F8FAFC; color: var(--primary); border-color: var(--primary); }
                .action-btn.delete:hover { color: #EF4444; border-color: #EF4444; background: #FEF2F2; }
            `}</style>
        </FadeIn>
    );
}
