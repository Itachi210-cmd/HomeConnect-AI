"use client";
import { useState, useEffect } from 'react';
import DashboardChart from "@/components/DashboardChart";
import { Users, Home, TrendingUp, DollarSign, Calendar, Clock, MapPin } from 'lucide-react';
import Loading from "@/components/Loading";
import FadeIn from "@/components/FadeIn";

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

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
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Administrator Dashboard</h1>
                    <p style={{ color: 'var(--muted)' }}>Global platform overview and real-time activity metrics.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="card" style={{ padding: '1.5rem', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ padding: '0.75rem', background: `${stat.color}15`, borderRadius: '0.75rem', color: stat.color }}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>{stat.title}</div>
                                <div style={{ fontSize: '2rem', fontWeight: '800' }}>{stat.value}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.5rem' }}>{stat.change}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="card" style={{ height: '100%' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Platform Growth</h3>
                            <DashboardChart data={chartData} />
                        </div>
                    </div>
                    <div className="card">
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Recent Listings</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {data.recentProperties.map(prop => (
                                <div key={prop.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={(Array.isArray(prop.images) ? prop.images[0] : prop.images) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: '700', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prop.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>₹{(prop.price / 10000000).toFixed(2)} Cr • {prop.agent?.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Clock className="text-primary" /> Recent Appointments
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.recentAppointments.map(appt => (
                            <div key={appt.id} className="card" style={{ padding: '1.25rem' }}>
                                <div style={{ fontWeight: '700', marginBottom: '0.5rem' }}>{appt.property.title}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Users size={14} /> {appt.buyer.name} (Buyer)
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <MapPin size={14} /> with {appt.agent.name}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: 'var(--primary)', fontWeight: '600' }}>
                                        <Calendar size={14} /> {new Date(appt.date).toLocaleDateString()}
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
