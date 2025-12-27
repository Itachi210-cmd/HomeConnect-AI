"use client";
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, User, Mail, Phone, MessageSquare } from 'lucide-react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useLeads } from '@/context/LeadContext';
import Link from 'next/link';
import FadeIn from '@/components/FadeIn';

export default function EditLeadPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const router = useRouter();
    const { leads, updateLead, loading } = useLeads();
    const [formData, setFormData] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!loading) {
            const lead = leads.find(l => l.id === params.id);
            if (lead) {
                setFormData(lead);
            } else {
                router.push('/agent/dashboard/leads');
            }
        }
    }, [params.id, leads, router, loading]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Clean data for API
        const cleanedData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            status: formData.status
        };

        const res = await updateLead(formData.id, cleanedData);
        setSaving(false);
        if (res.success) {
            router.push('/agent/dashboard/leads');
        } else {
            alert("Failed to update lead. Please try again.");
        }
    };

    if (loading || !formData) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

    return (
        <FadeIn>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/agent/dashboard/leads" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                        <ArrowLeft size={18} /> Back to Leads
                    </Link>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--foreground)' }}>Edit Lead Details</h1>
                    <p style={{ color: 'var(--muted)' }}>Update information for {formData.name}</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                icon={<User size={18} />}
                                required
                            />
                            <Input
                                label="Phone Number"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                icon={<Phone size={18} />}
                                required
                            />
                        </div>

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            icon={<Mail size={18} />}
                            required
                        />

                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                                <MessageSquare size={16} /> Inquiry / Message
                            </label>
                            <textarea
                                name="message"
                                value={formData.message || ''}
                                onChange={handleChange}
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid var(--border)',
                                    background: 'var(--input)',
                                    fontFamily: 'inherit',
                                    resize: 'none'
                                }}
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>Lead Status</label>
                            <select
                                name="status"
                                value={formData.status || 'New'}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid var(--border)',
                                    background: 'var(--input)',
                                    fontFamily: 'inherit',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="New">New Lead</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={saving} style={{ gap: '0.5rem' }}>
                                <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </FadeIn>
    );
}
