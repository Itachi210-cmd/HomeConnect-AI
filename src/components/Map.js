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
        if (properties.length > 0) {
            const bounds = L.latLngBounds(properties.map(p => [p.lat || 0, p.lng || 0]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [properties, map]);

    return null;
}

export default function Map({ properties = [] }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div style={{ height: '100%', width: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>;
    }

    // Default center (Mumbai)
    const center = [19.0760, 72.8777];

    return (
        <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%', borderRadius: 'var(--radius)' }}>
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
                        <div style={{ minWidth: '200px' }}>
                            <img src={property.image} alt={property.title} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.5rem' }} />
                            <h3 style={{ fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{property.title}</h3>
                            <p style={{ margin: 0, color: 'var(--primary)', fontWeight: '600' }}>{property.price}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
