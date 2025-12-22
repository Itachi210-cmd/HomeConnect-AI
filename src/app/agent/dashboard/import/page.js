"use client";
import { useState } from 'react';
import { useProperties } from '@/context/PropertyContext';
import Button from '@/components/Button';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ImportPropertiesPage() {
    const { addProperties } = useProperties();
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError('');
            setSuccess('');
            parseFile(selectedFile);
        }
    };

    const parseFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                if (jsonData.length === 0) {
                    setError("The file appears to be empty.");
                    setPreviewData([]);
                } else {
                    setPreviewData(jsonData);
                }
            } catch (err) {
                setError("Failed to parse file. Please ensure it's a valid Excel file.");
                console.error(err);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleImport = () => {
        if (previewData.length > 0) {
            // Map Excel columns to our property structure if needed
            // For now, assuming columns match: title, price, location, address, beds, baths, area
            const formattedData = previewData.map(row => ({
                title: row.Title || row.title || "Untitled Property",
                price: row.Price || row.price || "Price on Request",
                location: row.Location || row.location || "Unknown Location",
                address: row.Address || row.address || "",
                beds: row.Beds || row.beds || 0,
                baths: row.Baths || row.baths || 0,
                area: row.Area || row.area || "N/A",
                lat: row.Lat || row.lat || 19.0760,
                lng: row.Lng || row.lng || 72.8777
            }));

            addProperties(formattedData);
            setSuccess(`Successfully imported ${formattedData.length} properties!`);
            setFile(null);
            setPreviewData([]);
        }
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileSpreadsheet className="text-primary" /> Import Properties
            </h1>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{
                    border: '2px dashed var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '3rem',
                    textAlign: 'center',
                    background: '#F8FAFC',
                    cursor: 'pointer',
                    position: 'relative'
                }}>
                    <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileChange}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0,
                            cursor: 'pointer'
                        }}
                    />
                    <Upload size={48} style={{ color: 'var(--muted)', marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        {file ? file.name : "Click or Drag to Upload Excel File"}
                    </h3>
                    <p style={{ color: 'var(--muted)' }}>Supports .xlsx, .xls, .csv</p>
                </div>

                {error && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#FEF2F2', color: '#B91C1C', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                {success && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#F0FDF4', color: '#15803D', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={20} /> {success}
                    </div>
                )}
            </div>

            {previewData.length > 0 && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Preview ({previewData.length} Properties)</h3>
                        <Button onClick={handleImport}>Confirm Import</Button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ background: '#F1F5F9', textAlign: 'left' }}>
                                    <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Title</th>
                                    <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Price</th>
                                    <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Location</th>
                                    <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Beds</th>
                                    <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Baths</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.slice(0, 5).map((row, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '0.75rem' }}>{row.Title || row.title}</td>
                                        <td style={{ padding: '0.75rem' }}>{row.Price || row.price}</td>
                                        <td style={{ padding: '0.75rem' }}>{row.Location || row.location}</td>
                                        <td style={{ padding: '0.75rem' }}>{row.Beds || row.beds}</td>
                                        <td style={{ padding: '0.75rem' }}>{row.Baths || row.baths}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {previewData.length > 5 && (
                            <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                                ...and {previewData.length - 5} more rows
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
