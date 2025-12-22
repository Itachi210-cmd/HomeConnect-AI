"use client";
import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Button from '@/components/Button';

export default function ImageUpload({ onImageSelect, currentImage }) {
    const [preview, setPreview] = useState(currentImage);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                onImageSelect(reader.result); // In a real app, you'd upload the file here
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onImageSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Property Image</label>

            {preview ? (
                <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                        type="button"
                        onClick={handleRemove}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        border: '2px dashed var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '3rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: '#F8FAFC',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Upload size={32} style={{ margin: '0 auto 1rem', color: 'var(--muted)' }} />
                    <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Click to upload or drag and drop</p>
                    <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
        </div>
    );
}
