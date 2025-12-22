"use client";
import { useState } from 'react';
import FadeIn from '@/components/FadeIn';
import Button from '@/components/Button';
import {
    Trophy,
    TrendingUp,
    AlertTriangle,
    Star,
    Shield,
    Filter,
    Search,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight,
    Users,
    BadgeAlert
} from 'lucide-react';

export default function AgentPerformanceBoard() {
    const [filter, setFilter] = useState('all');

    // Mock Data for Agents
    const agents = [
        { id: 1, name: "Rajesh Khanna", rating: 4.8, deals: 45, revenue: "₹2.2 Cr", complaints: 0, status: "Top Performer", trend: "up", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" },
        { id: 2, name: "Priya Sharma", rating: 4.9, deals: 38, revenue: "₹1.8 Cr", complaints: 0, status: "Rising Star", trend: "up", avatar: "https://images.unsplash.com/photo-1573496359-136d47558bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" },
        { id: 3, name: "Amit Kumar", rating: 3.2, deals: 12, revenue: "₹45 L", complaints: 2, status: "Needs Improvement", trend: "down", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" },
        { id: 4, name: "Sneha Gupta", rating: 2.8, deals: 5, revenue: "₹15 L", complaints: 4, status: "At Risk", trend: "down", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" },
        { id: 5, name: "Vikram Malhotra", rating: 4.5, deals: 28, revenue: "₹1.1 Cr", complaints: 0, status: "Normal", trend: "stable", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" },
    ];

    const getStatusStyles = (status) => {
        switch (status) {
            case "Top Performer": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "Rising Star": return "bg-blue-50 text-blue-700 border-blue-200";
            case "Needs Improvement": return "bg-amber-50 text-amber-700 border-amber-200";
            case "At Risk": return "bg-red-50 text-red-700 border-red-200";
            default: return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <FadeIn>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Agent Performance Board</h1>
                        <p className="text-muted-foreground mt-1">Monitor rankings, enforce quality standards, and reward top performers.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search agents..."
                                className="pl-10 pr-4 py-2 border border-border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter size={18} /> Filter
                        </Button>
                    </div>
                </div>
            </FadeIn>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Top Performers", value: "12", icon: Trophy, color: "text-amber-500", bg: "bg-amber-50" },
                    { label: "Active Agents", value: "148", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: "At Risk", value: "3", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
                    { label: "Avg Rating", value: "4.6", icon: Star, color: "text-emerald-500", bg: "bg-emerald-50" },
                ].map((stat, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center justify-between group hover:border-primary/50 transition-colors">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <h3 className="text-3xl font-bold mt-1 text-gray-900">{stat.value}</h3>
                            </div>
                            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} fill={stat.label === "Avg Rating" ? "currentColor" : "none"} />
                            </div>
                        </div>
                    </FadeIn>
                ))}
            </div>

            {/* Critical Alerts */}
            <FadeIn delay={0.2}>
                <div className="bg-gradient-to-r from-red-50 via-white to-white border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-full h-fit">
                            <BadgeAlert size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Compliance Alert</h3>
                            <p className="text-gray-600 mt-1 max-w-2xl">
                                <span className="font-semibold text-red-600">Sneha Gupta</span> and <span className="font-semibold text-red-600">Amit Kumar</span> have received multiple complaints regarding "Response Time" this week. Immediate review required.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 flex-1 md:flex-none">Dismiss</Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white flex-1 md:flex-none">Review Cases</Button>
                    </div>
                </div>
            </FadeIn>

            {/* Main Ranking Table */}
            <FadeIn delay={0.4}>
                <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-border flex items-center justify-between bg-gray-50/50">
                        <div className="flex gap-2 text-sm font-medium text-muted-foreground overflow-x-auto">
                            {['All Agents', 'Top Rated', 'Lowest Rated', 'Highest Revenue'].map((tab) => (
                                <button
                                    key={tab}
                                    className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap ${filter === tab.toLowerCase() || (filter === 'all' && tab === 'All Agents')
                                        ? 'bg-white text-gray-900 shadow ring-1 ring-border'
                                        : 'hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    onClick={() => setFilter(tab.toLowerCase())}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <p className="hidden md:block text-xs text-muted-foreground">Showing top 5 of 148 agents</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border bg-gray-50/30 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="p-5 w-16 text-center">Rank</th>
                                    <th className="p-5">Agent Name</th>
                                    <th className="p-5">Performance Tier</th>
                                    <th className="p-5">Rating</th>
                                    <th className="p-5">Revenue (YTD)</th>
                                    <th className="p-5">Complaints</th>
                                    <th className="p-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {agents.map((agent, index) => (
                                    <tr key={agent.id} className="group hover:bg-gray-50/80 transition-colors">
                                        <td className="p-5 text-center font-bold text-gray-400 group-hover:text-primary">
                                            #{index + 1}
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                        index === 1 ? 'bg-gray-100 text-gray-700' :
                                                            index === 2 ? 'bg-orange-100 text-orange-700' :
                                                                'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {agent.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{agent.name}</div>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        {agent.deals} deals closed
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusStyles(agent.status)}`}>
                                                {agent.status}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center font-bold text-gray-800 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                                    <Star className="text-yellow-400 fill-yellow-400 mr-1.5" size={14} />
                                                    {agent.rating}
                                                </div>
                                                {agent.trend === 'up' && <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-0.5"><TrendingUp size={10} /> +2%</span>}
                                                {agent.trend === 'down' && <span className="text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded flex items-center gap-0.5"><TrendingUp size={10} className="rotate-180" /> -1%</span>}
                                            </div>
                                        </td>
                                        <td className="p-5 font-mono font-medium text-gray-700">
                                            {agent.revenue}
                                        </td>
                                        <td className="p-5">
                                            {agent.complaints > 0 ? (
                                                <div className="flex items-center gap-2 text-red-600 font-medium bg-red-50 px-3 py-1 rounded-full w-fit text-xs border border-red-100">
                                                    <AlertTriangle size={12} /> {agent.complaints} Open
                                                </div>
                                            ) : (
                                                <span className="text-emerald-600 text-xs font-medium flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-100">
                                                    <Shield size={12} /> Clean Record
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {agent.rating >= 4.5 && (
                                                    <button className="p-2 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors border border-green-200">
                                                        <TrendingUp size={14} /> Boost
                                                    </button>
                                                )}
                                                {agent.rating < 3 ? (
                                                    <button className="p-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors border border-red-200">
                                                        <Shield size={14} /> Restrict
                                                    </button>
                                                ) : (
                                                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors hover:text-gray-900">
                                                        <MoreHorizontal size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
