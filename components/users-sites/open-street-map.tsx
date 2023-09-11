"use client"
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import Image from 'next/image'
import L from 'leaflet';

import iconUrl from "./ForHostsLogoWithoutSlug.svg";

console.log('WOAH! ' + iconUrl);

export const newicon = new L.Icon({
    iconUrl: "./logo.png",
    iconAnchor: [5, 55],
    popupAnchor: [10, -44],
    iconSize: [55, 55]
});

const center = {
    lat: 51.505,
    lng: -0.09
};

type Coords = [number, number];

export function ChangeView({ coords }: { coords: Coords }) {
    const map = useMap();
    map.setView(coords, 12);
    return null;
}

function approximateLocation(lat: number, lng: number, maxOffsetInKm: number) {
    // Convert latitude and longitude from degrees to radians
    const latRadian = lat * (Math.PI / 180);
    const lngRadian = lng * (Math.PI / 180);

    // Earth's radius in kilometers
    const earthRadius = 6371;

    // Random offset in a circular direction
    const randomDirection = Math.random() * 2 * Math.PI;

    // Random distance in specified range
    const randomDistance = Math.random() * maxOffsetInKm;

    // Calculate the offset in latitude and longitude
    const deltaLat = (randomDistance / earthRadius) * (180 / Math.PI) / Math.cos(latRadian);
    const deltaLng = (randomDistance / earthRadius) * (180 / Math.PI) / Math.cos(lngRadian);

    // Calculate the new approximated location
    const newLat = lat + deltaLat * Math.sin(randomDirection);
    const newLng = lng + deltaLng * Math.cos(randomDirection);

    return { lat: newLat, lng: newLng };
}


export default function Map() {

    const [geoData, setGeoData] = useState(approximateLocation(34.442270, -119.842010, 2)/*{ lat: 34.442270, lng: -119.842010 }*/);

    // const center = [geoData.lat, geoData.lng];

    return (
        <MapContainer center={geoData} zoom={13} style={{ height: '500px' }} scrollWheelZoom={false} >
            <TileLayer
                attribution=''
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geoData.lat && geoData.lng && (
                <Marker icon={newicon} position={[geoData.lat, geoData.lng]} />
            )}
        </MapContainer>
    );
}
