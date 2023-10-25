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

interface MapProps {
    lat: number;
    lng: number;
    children?: React.ReactNode;
}

export default function Map({ lat, lng, children }: MapProps) {
    const [geoData, setGeoData] = useState();

    return (
        <MapContainer center={geoData} zoom={13} style={{ height: '500px' }} scrollWheelZoom={false} className="rounded-lg z-20">
            <TileLayer
                attribution=''
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {lat && lng && (
                <>
                    {/* <Marker icon={newicon} position={[geoData.lat, geoData.lng]} /> */}
                    <Circle center={[lat, lng]} radius={1000} /> {/* Added radius */}
                    {children}
                </>
            )}
        </MapContainer>
    );
}
