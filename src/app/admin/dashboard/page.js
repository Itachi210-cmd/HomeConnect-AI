"use client";
import { useState, useEffect } from 'react';
import DashboardChart from "@/components/DashboardChart";
import { Users, Home, TrendingUp, DollarSign, Calendar, Clock, MapPin } from 'lucide-react';
import Loading from "@/components/Loading";
import FadeIn from "@/components/FadeIn";
import { useProperties } from '@/context/PropertyContext';

export default function AdminDashboard() {
    const { formatPrice } = useProperties();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleImageError = (e) => {
        e.target.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Loading />;
    if (!data) return <div>Error loading data.</div>;

    const stats = [
        { title: "Total Users", value: data.stats.totalUsers, icon: <Users size={24} />, change: "Total registered", color: "#6366F1" },
        { title: "Properties", value: data.stats.totalProperties, icon: <Home size={24} />, change: "Active listings", color: "#10B981" },
        { title: "Appointments", value: data.stats.totalAppointments, icon: <Calendar size={24} />, change: "Scheduled visits", color: "#F59E0B" },
        { title: "Global Leads", value: data.stats.totalLeads, icon: <TrendingUp size={24} />, change: "Sales inquiries", color: "#EC4899" },
    ];

    const chartData = {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'User Growth',
                data: [65, 59, 80, 81, 56, 55, 40],
                borderColor: '#6366F1',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    return (
        <FadeIn>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>Administrator Dashboard</h1>
                    <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>Global platform overview and real-time activity metrics.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="card glass hover-scale" style={{ padding: '1.75rem', border: '1px solid var(--border)', borderRadius: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                                <div style={{ padding: '0.85rem', background: `${stat.color}20`, borderRadius: '1rem', color: stat.color, boxShadow: `0 0 15px ${stat.color}30` }}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '0.5rem', fontWeight: '600' }}>{stat.title}</div>
                                <div style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--foreground)', letterSpacing: '-0.02em' }}>{stat.value}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <TrendingUp size={14} className="text-secondary" /> {stat.change}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="card glass" style={{ height: '100%', borderRadius: '1.5rem', border: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '2rem', color: 'var(--foreground)' }}>Platform Growth</h3>
                            <div style={{ height: '350px', position: 'relative' }}>
                                <DashboardChart data={chartData} />
                            </div>
                        </div>
                    </div>
                    <div className="card glass" style={{ borderRadius: '1.5rem', border: '1px solid var(--border)' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '2rem', color: 'var(--foreground)' }}>Recent Listings</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {data.recentProperties.map(prop => (
                                <div key={prop.id} style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '0.75rem', borderRadius: '1rem', background: 'var(--input)', border: '1px solid var(--border)' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, boxShadow: 'var(--shadow)' }}>
                                        <img
                                            src={(Array.isArray(prop.images) ? prop.images[0] : prop.images) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"}
                                            onError={handleImageError}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: '800', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--foreground)' }}>{prop.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '500' }}>{formatPrice(prop.price)} • <span style={{ color: 'var(--primary)' }}>{prop.agent?.name}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', letterSpacing: '-0.01em' }}>
                        <Clock className="text-primary" /> Recent Appointments
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.recentAppointments.map(appt => (
                            <div key={appt.id} className="card glass hover-scale" style={{ padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid var(--border)' }}>
                                <div style={{ fontWeight: '800', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--foreground)' }}>{appt.property.title}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: '500' }}>
                                        <Users size={16} className="text-secondary" /> <span style={{ color: 'var(--foreground)' }}>{appt.buyer.name}</span> (Buyer)
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: '500' }}>
                                        <MapPin size={16} className="text-primary" /> with <span style={{ color: 'var(--foreground)' }}>{appt.agent.name}</span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.6rem',
                                        marginTop: '1rem',
                                        color: 'var(--primary)',
                                        fontWeight: '800',
                                        background: 'var(--input)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.75rem',
                                        width: 'fit-content',
                                        border: '1px solid var(--border)'
                                    }}>
                                        <Calendar size={16} /> {new Date(appt.date).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </FadeIn>
    );
}
