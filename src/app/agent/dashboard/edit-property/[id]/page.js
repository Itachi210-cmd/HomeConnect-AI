"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload } from 'lucide-react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useProperties } from '@/context/PropertyContext';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

export default function EditPropertyPage({ params }) {
    const router = useRouter();
    const { properties, updateProperty } = useProperties();
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        // Find property by ID
        const property = properties.find(p => p.id === parseInt(params.id));
        if (property) {
            setFormData(property);
        } else {
            // Handle not found
            router.push('/agent/dashboard/properties');
        }
    }, [params.id, properties, router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProperty(parseInt(params.id), formData);
        router.push('/agent/dashboard/properties');
    };

    if (!formData) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/agent/dashboard/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                    <ArrowLeft size={18} /> Back to Properties
                </Link>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Edit Property</h1>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Input
                        label="Property Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <Input
                            label="Price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                        <Input
                            label="Bedrooms"
                            name="beds"
                            type="number"
                            value={formData.beds}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Bathrooms"
                            name="baths"
                            type="number"
                            value={formData.baths}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Square Feet"
                            name="sqft"
                            value={formData.sqft}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)',
                                background: 'var(--input)',
                                fontFamily: 'inherit'
                            }}
                        ></textarea>
                    </div>

                    <ImageUpload
                        currentImage={formData.image}
                        onImageSelect={(image) => setFormData({ ...formData, image })}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
