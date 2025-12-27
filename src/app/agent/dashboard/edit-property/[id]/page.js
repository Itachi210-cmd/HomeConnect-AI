"use client";
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload } from 'lucide-react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useProperties } from '@/context/PropertyContext';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

export default function EditPropertyPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const router = useRouter();
    const { properties, updateProperty, loading, parsePrice } = useProperties();
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        if (!loading && !formData) {
            // Find property by ID
            const property = properties.find(p => p.id === params.id);
            if (property) {
                // Initialize with property data, mapping images array to a single image for the UI
                setFormData({
                    ...property,
                    image: property.images?.[0] || ''
                });
            } else {
                // Handle not found
                router.push('/agent/dashboard/properties');
            }
        }
    }, [params.id, properties, router, loading, formData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare data for API - ONLY send property fields, NO relation objects (like 'agent')
        const dataToSave = {
            title: formData.title,
            description: formData.description,
            price: parsePrice(String(formData.price)),
            address: formData.address,
            location: formData.address ? formData.address.split(',')[0].trim() : (formData.location || ''),
            area: parseFloat(formData.area) || 0,
            beds: parseInt(formData.beds) || 0,
            baths: parseInt(formData.baths) || 0,
            type: formData.type || 'Apartment',
            status: formData.status || 'Active',
            additionalDetails: formData.additionalDetails || '',
            // Map single image back to images array
            images: formData.image ? [formData.image] : (formData.images || [])
        };

        const res = await updateProperty(params.id, dataToSave);
        if (res.success) {
            router.push('/agent/dashboard/properties');
        } else {
            const detail = res.error || "Please try again.";
            const message = res.message ? `\nDetails: ${res.message}` : "";
            alert(`Failed to save changes: ${detail}${message}`);
        }
    };

    if (loading || !formData) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

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
                        value={formData.title || ''}
                        onChange={handleChange}
                        required
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <Input
                            label="Price"
                            name="price"
                            value={formData.price || ''}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Address"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                        <Input
                            label="Bedrooms"
                            name="beds"
                            type="number"
                            value={formData.beds || ''}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Bathrooms"
                            name="baths"
                            type="number"
                            value={formData.baths || ''}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Square Feet"
                            name="area"
                            value={formData.area || ''}
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

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Additional Details & Description</label>
                        <textarea
                            name="additionalDetails"
                            value={formData.additionalDetails || ''}
                            onChange={handleChange}
                            rows={6}
                            placeholder="Provide more in-depth details about the property, amenities, neighborhood, etc."
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
