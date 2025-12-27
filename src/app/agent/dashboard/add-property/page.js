"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload } from 'lucide-react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useProperties } from '@/context/PropertyContext';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

export default function AddPropertyPage() {
    const router = useRouter();
    const { addProperty, parsePrice } = useProperties();
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        address: '',
        beds: '',
        baths: '',
        area: '',
        description: '',
        additionalDetails: '',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Default image for now
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await addProperty({
            ...formData,
            area: parseFloat(formData.area) || 0,
            price: parsePrice(String(formData.price)),
            images: [formData.image],
            status: 'Active',
            views: 0,
            location: formData.address.split(',')[0], // Simple city extraction or use address as location
            type: 'Apartment' // Default or add dropdown
        });

        router.push('/agent/dashboard/properties');
    };

    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateDescription = async () => {
        if (!formData.title || !formData.address) {
            alert("Please enter a Title and Address first.");
            return;
        }

        setIsGenerating(true);
        try {
            const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title,
                    location: formData.address,
                    type: formData.type || 'Property',
                    beds: formData.beds,
                    baths: formData.baths,
                    area: formData.area,
                    features: [] // Pass features if we had a field for it
                })
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, description: data.description }));
            } else {
                alert("Failed to generate description. Please try again.");
            }
        } catch (error) {
            console.error("Generation failed:", error);
            alert("An error occurred while generating.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/agent/dashboard/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                    <ArrowLeft size={18} /> Back to Properties
                </Link>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Add New Property</h1>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Input
                        label="Property Title"
                        name="title"
                        placeholder="e.g. Modern Downtown Loft"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <Input
                            label="Price"
                            name="price"
                            placeholder="e.g. ₹1.5 Cr"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Address"
                            name="address"
                            placeholder="Full address"
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
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ display: 'block', fontWeight: '500', fontSize: '0.875rem' }}>Description</label>
                            <button
                                type="button"
                                onClick={handleGenerateDescription}
                                disabled={isGenerating}
                                style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--primary)',
                                    background: '#DBEAFE',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.25rem',
                                    border: 'none',
                                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                                    fontWeight: '600',
                                    opacity: isGenerating ? 0.7 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}
                            >
                                {isGenerating ? (
                                    <>
                                        <span className="animate-spin">✨</span> Generating...
                                    </>
                                ) : (
                                    <>✨ Generate with AI</>
                                )}
                            </button>
                        </div>
                        <textarea
                            name="description"
                            value={formData.description}
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
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Additional Details & Description</label>
                        <textarea
                            name="additionalDetails"
                            value={formData.additionalDetails}
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

                    {/* Image Upload */}
                    <ImageUpload
                        currentImage={formData.image}
                        onImageSelect={(image) => setFormData({ ...formData, image })}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit">Create Listing</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
