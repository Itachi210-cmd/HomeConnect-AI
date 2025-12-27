"use client";
import { useState } from 'react';
import { useProperties } from '@/context/PropertyContext';
import { useLeads } from '@/context/LeadContext';
import Button from '@/components/Button';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Users, Home } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ImportPage() {
    const { addProperties, parsePrice } = useProperties();
    const { addLeads } = useLeads();
    const [importType, setImportType] = useState('properties'); // 'properties' or 'leads'
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

                    // Auto-detect mode
                    const firstRow = jsonData[0];
                    const hasLeadFields = firstRow.Email || firstRow.Name || firstRow.Phone;
                    const hasPropFields = firstRow.Title || firstRow.Price || firstRow.Location;

                    if (hasLeadFields && !hasPropFields && importType === 'properties') {
                        setImportType('leads');
                        setSuccess("Switched to 'Leads' mode automatically based on file content.");
                    } else if (hasPropFields && !hasLeadFields && importType === 'leads') {
                        setImportType('properties');
                        setSuccess("Switched to 'Properties' mode automatically based on file content.");
                    }
                }
            } catch (err) {
                setError("Failed to parse file. Please ensure it's a valid Excel file.");
                console.error(err);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleImport = async () => {
        if (previewData.length > 0) {
            setError('');
            setSuccess('');

            if (importType === 'properties') {
                const formattedData = previewData.map(row => ({
                    title: row.Title || row.title || row.Property || row.Name || row["Property Name"] || row.Project || row.Listing || row["Apartment Name"] || "Untitled Property",
                    description: row.Description || row.description || row.Details || row.About || "Beautiful property imported via Excel.",
                    price: parsePrice(row.Price || row.price || row.Cost || row.Value || row.Rate || row["Listing Price"] || row["Total Price"] || row.Asking),
                    location: row.Location || row.location || row.City || row.Area || row.Region || row.Neighborhood || row.Sector || "Unknown Location",
                    address: row.Address || row.address || row.Street || "",
                    type: row.Type || row.type || row.Category || "Apartment",
                    status: row.Status || row.status || "Active",
                    beds: parseInt(row.Beds || row.beds || row.Bedrooms || row.BHK) || 0,
                    baths: parseInt(row.Baths || row.baths || row.Bathrooms || row.Toilets) || 0,
                    area: parseFloat(row.Area || row.area || row.Sqft || row.sqft || row.Size || row["Total Area"]) || 0,
                    images: row.Image || row.image || row.Photo || row.Picture ? [row.Image || row.image || row.Photo || row.Picture] : [],
                    lat: row.Lat || row.lat || 19.0760,
                    lng: row.Lng || row.lng || 72.8777
                }));

                const count = await addProperties(formattedData);
                if (count > 0) {
                    setSuccess(`Successfully imported ${count} properties!`);
                } else {
                    setError("Import failed. Please ensure the file contains valid property data.");
                }
            } else {
                // Mapping for Leads
                const formattedData = previewData.map(row => ({
                    name: row.Name || row.name || row.FullName || row.Client || "Unknown Client",
                    email: row.Email || row.email || "",
                    phone: row.Phone || row.phone || row.Mobile || "",
                    message: row.Message || row.message || row.Notes || row.Interest || "Imported via Excel",
                    status: "New" // Match dashboard "New" category
                }));

                const count = await addLeads(formattedData);
                if (count > 0) {
                    setSuccess(`Successfully imported ${count} leads!`);
                } else {
                    setError("Import failed. Please ensure the file contains valid lead data.");
                }
            }

            if (!error) {
                setFile(null);
                setPreviewData([]);
            }
        }
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileSpreadsheet className="text-primary" /> Data Import
                </h1>

                <div style={{ display: 'flex', background: '#F1F5F9', padding: '0.25rem', borderRadius: '0.75rem' }}>
                    <button
                        onClick={() => { setImportType('properties'); setPreviewData([]); setFile(null); }}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: importType === 'properties' ? 'white' : 'transparent',
                            boxShadow: importType === 'properties' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Home size={16} /> Properties
                    </button>
                    <button
                        onClick={() => { setImportType('leads'); setPreviewData([]); setFile(null); }}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: importType === 'leads' ? 'white' : 'transparent',
                            boxShadow: importType === 'leads' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Users size={16} /> Leads
                    </button>
                </div>
            </div>

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
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Preview ({previewData.length} {importType === 'properties' ? 'Properties' : 'Leads'})</h3>
                        <Button onClick={handleImport}>Confirm Import</Button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ background: '#F1F5F9', textAlign: 'left' }}>
                                    {importType === 'properties' ? (
                                        <>
                                            <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Title</th>
                                            <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Price</th>
                                            <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Location</th>
                                            <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Beds</th>
                                            <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Baths</th>
                                        </>
                                    ) : (
                                        <>
                                            <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Name</th>
                                            <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Email</th>
                                            <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Phone</th>
                                            <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Message</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.slice(0, 5).map((row, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                                        {importType === 'properties' ? (
                                            <>
                                                <td style={{ padding: '0.75rem' }}>{row.Title || row.title}</td>
                                                <td style={{ padding: '0.75rem' }}>{row.Price || row.price}</td>
                                                <td style={{ padding: '0.75rem' }}>{row.Location || row.location}</td>
                                                <td style={{ padding: '0.75rem' }}>{row.Beds || row.beds}</td>
                                                <td style={{ padding: '0.75rem' }}>{row.Baths || row.baths}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td style={{ padding: '0.75rem' }}>{row.Name || row.name || row.FullName}</td>
                                                <td style={{ padding: '0.75rem' }}>{row.Email || row.email}</td>
                                                <td style={{ padding: '0.75rem' }}>{row.Phone || row.phone}</td>
                                                <td style={{ padding: '0.75rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.Message || row.message || row.Notes}</td>
                                            </>
                                        )}
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
