"use client";
import { useState, useEffect } from 'react';
import './russia.css';
import { CircleMarker, MapContainer, TileLayer, Marker, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';

export const newicon = new L.Icon({
    iconUrl: "./logo.png",
    iconAnchor: [5, 55],
    popupAnchor: [10, -44],
    iconSize: [55, 55]
});

type Coords = [number, number];

export function ChangeView({ coords }: { coords: Coords }) {
    const map = useMap();
    map.setView(coords, 12);

    return null;
}

function approximateLocation(lat: number, lng: number, maxOffsetInKm: number) {
    const latRadian = lat * (Math.PI / 180);
    const lngRadian = lng * (Math.PI / 180);
    const earthRadius = 6371;
    const randomDirection = Math.random() * 2 * Math.PI;
    const randomDistance = Math.random() * maxOffsetInKm;
    const deltaLat = (randomDistance / earthRadius) * (180 / Math.PI) / Math.cos(latRadian);
    const deltaLng = (randomDistance / earthRadius) * (180 / Math.PI) / Math.cos(lngRadian);
    const newLat = lat + deltaLat * Math.sin(randomDirection);
    const newLng = lng + deltaLng * Math.cos(randomDirection);

    return { lat: newLat, lng: newLng };
}

export default function Map() {
    const [geoData, setGeoData] = useState(approximateLocation(34.442270, -119.842010, 2));

    return (
        <MapContainer center={geoData} zoom={13} style={{ height: '500px' }} scrollWheelZoom={false} className="rounded-lg z-20">
            <TileLayer
                attribution=''
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geoData.lat && geoData.lng && (
                <>
                    {/* <Marker icon={newicon} position={[geoData.lat, geoData.lng]} /> */}
                    <Circle center={[geoData.lat, geoData.lng]} radius={1000} /> {/* Added radius */}
                </>
            )}
        </MapContainer>
    );
}
