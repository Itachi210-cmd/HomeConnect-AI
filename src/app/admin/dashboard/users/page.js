"use client";
import { useState, useEffect } from 'react';
import { Search, MoreHorizontal, Check, X, Trash2, Shield, User as UserIcon, Mail, Phone, Calendar } from 'lucide-react';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import FadeIn from '@/components/FadeIn';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleUpdate = async (id, newRole) => {
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });
            if (res.ok) fetchUsers();
        } catch (error) {
            console.error("Role update failed:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers(users.filter(user => user.id !== id));
            }
        } catch (error) {
            console.error("Delete user failed:", error);
        }
    };

    const filteredUsers = users.filter((user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loading />;

    return (
        <FadeIn>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em' }}>User Management</h1>
                    <p style={{ color: 'var(--muted)' }}>Manage platform access, roles, and user permissions.</p>
                </div>
                <div className="card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '300px' }}>
                    <Search size={18} color="var(--muted)" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                    />
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th className="th" style={{ textAlign: 'left' }}>User Info</th>
                            <th className="th" style={{ textAlign: 'left' }}>Role</th>
                            <th className="th" style={{ textAlign: 'left' }}>Joined Date</th>
                            <th className="th" style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#EEF2FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {user.image ? <img src={user.image} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : <UserIcon size={20} color="var(--primary)" />}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '700', fontSize: '1rem' }}>{user.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Mail size={12} /> {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: '800',
                                        background: user.role === 'ADMIN' ? '#FEE2E2' : user.role === 'AGENT' ? '#DBEAFE' : '#ECFDF5',
                                        color: user.role === 'ADMIN' ? '#991B1B' : user.role === 'AGENT' ? '#1E40AF' : '#065F46',
                                        textTransform: 'uppercase'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={14} /> {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        {user.role === 'BUYER' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleRoleUpdate(user.id, 'AGENT')}
                                                style={{ fontSize: '0.75rem' }}
                                            >
                                                Make Agent
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            style={{ color: '#EF4444', borderColor: '#EF4444', padding: '0.25rem 0.5rem' }}
                                            onClick={() => handleDelete(user.id)}
                                            title="Delete User"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .th { padding: 1rem 1.25rem; text-transform: uppercase; font-size: 0.75rem; font-weight: 800; color: #64748B; letter-spacing: 0.5px; }
            `}</style>
        </FadeIn>
    );
}
