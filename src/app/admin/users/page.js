"use client";
import { useState, useEffect } from 'react';
import FadeIn from "@/components/FadeIn";
import Loading from "@/components/Loading";
import { Search, Shield, Briefcase, User, MoreVertical, Check, X, AlertTriangle } from 'lucide-react';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(null); // ID of user being updated

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId, newRole) => {
        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        setActionLoading(userId);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole })
            });

            if (res.ok) {
                // Optimistic update
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            } else {
                alert("Failed to update role");
            }
        } catch (error) {
            console.error("Error updating role", error);
            alert("An error occurred");
        } finally {
            setActionLoading(null);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (role) => {
        switch (role) {
            case 'ADMIN': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 flex items-center gap-1"><Shield size={12} /> Admin</span>;
            case 'AGENT': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1"><Briefcase size={12} /> Agent</span>;
            default: return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 flex items-center gap-1"><User size={12} /> Buyer</span>;
        }
    };

    if (loading) return <Loading />;

    return (
        <FadeIn>
            <div className="container mx-auto py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
                        <p className="text-slate-500">Manage user roles and permissions.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="card glass overflow-hidden rounded-2xl border border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-500 uppercase tracking-wider">Current Role</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-slate-900">{user.name || 'Unknown'}</div>
                                                    <div className="text-xs text-slate-500">ID: {user.id.substring(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            <div className="flex items-center gap-2">
                                                {actionLoading === user.id ? (
                                                    <span className="text-xs text-indigo-600 animate-pulse font-bold">Updating...</span>
                                                ) : (
                                                    <>
                                                        {user.role !== 'ADMIN' && (
                                                            <button
                                                                onClick={() => handleRoleUpdate(user.id, 'ADMIN')}
                                                                className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors tooltip"
                                                                title="Promote to Admin"
                                                            >
                                                                <Shield size={18} />
                                                            </button>
                                                        )}
                                                        {user.role !== 'AGENT' && (
                                                            <button
                                                                onClick={() => handleRoleUpdate(user.id, 'AGENT')}
                                                                className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors tooltip"
                                                                title="Promote to Agent"
                                                            >
                                                                <Briefcase size={18} />
                                                            </button>
                                                        )}
                                                        {user.role !== 'BUYER' && (
                                                            <button
                                                                onClick={() => handleRoleUpdate(user.id, 'BUYER')}
                                                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors tooltip"
                                                                title="Demote to Buyer"
                                                            >
                                                                <User size={18} />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div className="p-12 text-center text-slate-400">
                                No users found matching your search.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FadeIn>
    );
}
