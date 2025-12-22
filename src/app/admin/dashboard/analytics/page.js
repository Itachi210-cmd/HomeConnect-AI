"use client";
import { useState, useEffect } from 'react';
import FadeIn from '@/components/FadeIn';
import Loading from '@/components/Loading';
import { TrendingUp, Users, MapPin, DollarSign, Calendar } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function PlatformAnalytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/admin/analytics');
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <Loading />;
    if (!data) return <div className="p-8 text-center">Failed to load analytics.</div>;

    const lineChartData = {
        labels: data.growth.labels,
        datasets: [
            {
                label: 'Buyer Signups',
                data: data.growth.buyerData,
                borderColor: '#818CF8',
                backgroundColor: 'rgba(129, 140, 248, 0.5)',
                tension: 0.4
            },
            {
                label: 'Agent Signups',
                data: data.growth.agentData,
                borderColor: '#34D399',
                backgroundColor: 'rgba(52, 211, 153, 0.5)',
                tension: 0.4
            },
        ],
    };

    const barChartData = {
        labels: data.locations.labels,
        datasets: [
            {
                label: 'Properties',
                data: data.locations.counts,
                backgroundColor: '#F59E0B',
                borderRadius: 8
            },
        ],
    };

    const pieChartData = {
        labels: data.priceDistribution.labels,
        datasets: [
            {
                data: data.priceDistribution.data,
                backgroundColor: [
                    '#60A5FA',
                    '#34D399',
                    '#F472B6',
                    '#A78BFA'
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="space-y-6">
            <FadeIn>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Platform Analytics</h1>
                        <p className="text-muted-foreground">Deep insights into user behavior and market trends.</p>
                    </div>
                </div>
            </FadeIn>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FadeIn delay={0.1}>
                    <div className="card p-6 bg-white border border-border rounded-xl shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Recent Signups</p>
                                <h3 className="text-2xl font-bold">{data.growth.buyerData.reduce((a, b) => a + b, 0) + data.growth.agentData.reduce((a, b) => a + b, 0)}</h3>
                            </div>
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.2}>
                    <div className="card p-6 bg-white border border-border rounded-xl shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Market Activity</p>
                                <h3 className="text-2xl font-bold">High</h3>
                            </div>
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.3}>
                    <div className="card p-6 bg-white border border-border rounded-xl shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Top City</p>
                                <h3 className="text-2xl font-bold">{data.locations.labels[0] || 'N/A'}</h3>
                            </div>
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.4}>
                    <div className="card p-6 bg-white border border-border rounded-xl shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Report Period</p>
                                <h3 className="text-2xl font-bold">7 Days</h3>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FadeIn delay={0.5}>
                    <div className="card p-6 bg-white border border-border rounded-xl shadow-sm">
                        <h3 className="text-lg font-bold mb-4">User Growth Trend</h3>
                        <div className="h-64">
                            <Line options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} data={lineChartData} />
                        </div>
                    </div>
                </FadeIn>

                <FadeIn delay={0.6}>
                    <div className="card p-6 bg-white border border-border rounded-xl shadow-sm">
                        <h3 className="text-lg font-bold mb-4">Most Demanded Locations</h3>
                        <div className="h-64">
                            <Bar options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} data={barChartData} />
                        </div>
                    </div>
                </FadeIn>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <FadeIn delay={0.7}>
                        <div className="card p-6 bg-white border border-border rounded-xl shadow-sm h-full">
                            <h3 className="text-lg font-bold mb-4">Price Range Interest</h3>
                            <div className="h-64 flex justify-center">
                                <Doughnut options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} data={pieChartData} />
                            </div>
                        </div>
                    </FadeIn>
                </div>
                <div className="lg:col-span-2">
                    <FadeIn delay={0.8}>
                        <div className="card p-6 bg-white border border-border rounded-xl shadow-sm h-full">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold">Trending Properties</h3>
                            </div>
                            <div className="space-y-4">
                                {data.mostViewed.map((prop) => (
                                    <div key={prop.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                        <div className="w-16 h-12 bg-gray-200 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${prop.image})` }}></div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-sm">{prop.title}</div>
                                            <div className="text-xs text-muted-foreground">{prop.location}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-sm">{prop.views}</div>
                                            <div className="text-xs text-muted-foreground">Views</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
