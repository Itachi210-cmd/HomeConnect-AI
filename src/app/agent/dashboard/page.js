"use client";
import { useState, useEffect } from 'react';
import { Users, TrendingUp, DollarSign, CheckCircle, MoreHorizontal, Calendar, Plus, Home, Clock } from 'lucide-react';
import DashboardChart from '@/components/DashboardChart';
import Button from '@/components/Button';
import Link from 'next/link';
import { StatSkeleton } from '@/components/Skeleton';

export default function AgentDashboard() {
    const [stats, setStats] = useState([
        { label: 'My Listings', value: '0', icon: Home, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Pending Visits', value: '0', icon: Calendar, color: 'text-red-500', bg: 'bg-red-50' },
        { label: 'Closed Deals', value: '0', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
        { label: 'Total Leads', value: '0', icon: Users, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    ]);
    const [leads, setLeads] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [performance, setPerformance] = useState([]);
    const [loading, setLoading] = useState(true);

    const agentId = "agent_default";

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Stats & Leads
                const statsRes = await fetch(`/api/agent/stats?agentId=${agentId}`);
                if (statsRes.ok) {
                    const data = await statsRes.json();

                    // Map API stats to UI structure
                    const iconMap = { home: Home, calendar: Calendar, check: CheckCircle, users: Users };
                    const mappedStats = data.stats.map(s => ({
                        ...s,
                        icon: iconMap[s.icon] || Home
                    }));
                    setStats(mappedStats);
                    setLeads(data.recentLeads);
                    setPerformance(data.performance || []);
                }

                // Fetch Appointments for Schedule section
                const apptRes = await fetch(`/api/appointments?role=AGENT&userId=${agentId}`);
                if (apptRes.ok) {
                    const apptData = await apptRes.json();
                    setAppointments(apptData.slice(0, 3)); // Only top 3 for dashboard
                }

            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Leads',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.5)',
                useGradient: true,
                gradientColors: ['rgba(79, 70, 229, 0)', 'rgba(79, 70, 229, 0.4)']
            },
            {
                label: 'Sales',
                data: [2, 3, 20, 5, 1, 4],
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                useGradient: true,
                gradientColors: ['rgba(16, 185, 129, 0)', 'rgba(16, 185, 129, 0.4)']
            },
        ],
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '900', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>Agent Dashboard</h1>
                    <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>Welcome back, here's what's happening today.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/agent/dashboard/add-property">
                        <Button style={{ borderRadius: '12px', gap: '8px' }}>
                            <Plus size={20} /> Add Property
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                {loading ? (
                    <>
                        <StatSkeleton />
                        <StatSkeleton />
                        <StatSkeleton />
                        <StatSkeleton />
                    </>
                ) : stats.map((stat, index) => (
                    <div key={index} className="card glass hover-scale" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.25rem',
                        border: 'none',
                    }}>
                        <div style={{
                            padding: '1rem',
                            borderRadius: '16px',
                            background: 'var(--input)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--foreground)' }}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid-cols-1 lg:grid-cols-3" style={{ display: 'grid', gap: '2rem' }}>
                {/* Performance Chart */}
                <div className="card" style={{ gridColumn: 'span 2', borderRadius: '24px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TrendingUp size={24} color="var(--primary)" /> Performance Overview
                    </h3>
                    <div style={{ height: '320px' }}>
                        <DashboardChart type="line" data={chartData} />
                    </div>
                </div>

                {/* Upcoming Schedule */}
                <div className="card" style={{ borderRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Calendar size={24} color="var(--primary)" /> My Schedule
                        </h3>
                        <Link href="/agent/dashboard/schedule" style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--primary)' }}>View All</Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {loading ? <p>Loading schedule...</p> : appointments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
                                <Calendar size={40} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                                <p>No upcoming visits</p>
                            </div>
                        ) : appointments.map((appt, i) => (
                            <div key={i} style={{
                                padding: '1rem',
                                background: 'var(--input)',
                                borderRadius: '16px',
                                borderLeft: '4px solid var(--primary)'
                            }}>
                                <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>{appt.property?.title}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--muted)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={14} /> {new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Users size={14} /> {appt.buyer?.name}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Listing Performance */}
                <div className="card" style={{ gridColumn: 'span 3', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Listing Performance</h3>
                        <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Top performing listings by views</div>
                    </div>

                    {loading ? <p>Loading performance data...</p> : performance.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>No performance data available yet.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--input)' }}>
                                        <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: '600' }}>Property Title</th>
                                        <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: '600' }}>Total Views</th>
                                        <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: '600' }}>Inquiries</th>
                                        <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: '600' }}>Conversion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {performance.map(p => (
                                        <tr key={p.id} style={{ borderBottom: '1px solid var(--input)' }}>
                                            <td style={{ padding: '16px 12px', fontWeight: '700' }}>{p.title}</td>
                                            <td style={{ padding: '16px 12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {p.views}
                                                    <div style={{ flex: 1, height: '4px', maxWidth: '100px', background: '#E2E8F0', borderRadius: '2px' }}>
                                                        <div style={{ height: '100%', width: `${Math.min(100, (p.views / 20) * 100)}%`, background: 'var(--primary)', borderRadius: '2px' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 12px' }}>{p.leads}</td>
                                            <td style={{ padding: '16px 12px' }}>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '6px',
                                                    background: parseFloat(p.conversion) > 10 ? '#ECFDF5' : '#F1F5F9',
                                                    color: parseFloat(p.conversion) > 10 ? '#059669' : 'var(--muted)',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '700'
                                                }}>
                                                    {p.conversion}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Recent Leads */}
                <div className="card" style={{ gridColumn: 'span 3', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Recent Inquiries</h3>
                        <Button variant="outline" size="sm">Download Report</Button>
                    </div>

                    {loading ? <p>Loading leads...</p> : leads.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                            <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                            <p>No new inquiries yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                            {leads.map(lead => (
                                <div key={lead.id} style={{
                                    padding: '1.25rem',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    borderRadius: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    background: '#FDFDFD'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div>
                                            <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{lead.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{lead.email}</div>
                                        </div>
                                        <div style={{
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            background: '#DBEAFE',
                                            color: '#1E40AF',
                                            fontSize: '0.75rem',
                                            fontWeight: '800'
                                        }}>NEW</div>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--muted)', background: 'var(--input)', padding: '8px 12px', borderRadius: '10px' }}>
                                        Interested in: <strong>{lead.property?.title || 'Unknown Property'}</strong>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                        <Button size="sm" fullWidth>Contact</Button>
                                        <Button size="sm" variant="outline">Ignore</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Floating Action Button */}
                <Link href="/agent/dashboard/add-property" className="fab" style={{ background: 'var(--primary)' }}>
                    <Plus size={24} />
                </Link>
            </div>
        </div>
    );
}
