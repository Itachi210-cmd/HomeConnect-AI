"use client";
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function MapUpdater({ properties }) {
    const map = useMap();

    useEffect(() => {
        if (!map || properties.length === 0) return;

        try {
            const validProps = properties.filter(p => p.lat && p.lng);
            if (validProps.length === 0) return;

            const bounds = L.latLngBounds(validProps.map(p => [p.lat, p.lng]));
            map.fitBounds(bounds, { padding: [50, 50], animate: true });
        } catch (e) {
            console.error("Leaflet bounds error:", e);
        }
    }, [properties, map]);

    return null;
}

export default function Map({ properties = [], center: initialCenter, zoom: initialZoom }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    if (!isMounted) {
        return <div style={{ height: '100%', width: '100%', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius)' }}>
            <div className="animate-pulse" style={{ color: '#94A3B8', fontWeight: '500' }}>Initializing Map...</div>
        </div>;
    }

    // Default center (Mumbai)
    const center = initialCenter || [19.0760, 72.8777];
    const zoom = initialZoom || 11;

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater properties={properties} />
            {properties.map((property) => (
                <Marker
                    key={property.id}
                    position={[property.lat || 19.0760, property.lng || 72.8777]}
                    icon={icon}
                >
                    <Popup>
                        <div style={{ minWidth: '200px', padding: '4px' }}>
                            <img
                                src={property.images?.[0] || property.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"}
                                alt={property.title}
                                style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '12px', marginBottom: '8px' }}
                            />
                            <h3 style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '4px', color: '#0F172A' }}>{property.title}</h3>
                            <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 'bold' }}>{property.location}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
