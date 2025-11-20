// components/UI/web/Map/LeafletMap.tsx
"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Don't forget to import Leaflet CSS!
import L from 'leaflet';
import { MdLocationPin } from 'react-icons/md'; // We can use the icon here too

// Fix for default marker icon issue in Leaflet
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to handle map center changes (important for dynamic data)
const ChangeMapView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

interface LeafletMapProps {
    latitude: number;
    longitude: number;
    height: string;
}

const LeafletMap = ({ latitude, longitude, height }: LeafletMapProps) => {
    const position: [number, number] = [latitude, longitude];

    if (!latitude || !longitude) return null;

    return (
        <MapContainer 
            center={position} 
            zoom={13} 
            scrollWheelZoom={false} // Disable zoom scroll for better UX
            className={`z-0 ${height}`} // Use dynamic height and ensure it's not on top of other elements
        >
            <ChangeMapView center={position} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={icon}></Marker>
        </MapContainer>
    );
};

export default LeafletMap;