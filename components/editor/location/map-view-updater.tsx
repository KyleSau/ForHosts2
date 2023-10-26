"use client"
import { useEffect } from "react";
import { useMap, Circle } from "react-leaflet";

interface MapViewUpdaterProps {
    lat: number;
    lng: number;
}

export default function MapViewUpdater({ lat, lng }: MapViewUpdaterProps) {
    const map = useMap();

    useEffect(() => {
        if (lat && lng) {
            map.setView({ lat, lng }, 12);
        }
    }, [lat, lng, map]);

    return <Circle center={[lat, lng]} radius={1000} />;
}
