import dynamic from 'next/dynamic';
import React, { useState } from 'react'
import { Circle } from 'react-leaflet'
// import Map from '../users-sites/open-street-map'
const Map = dynamic(() => import("../users-sites/open-street-map"), {
    ssr: false, // Disable server-side rendering
});
export default function MapWrapper({ coordinates }: any) {

    return (
        <div>
            < Map lat={coordinates.lat} lng={coordinates.lng} >
                <Circle center={[coordinates.lat, coordinates.lng]} radius={1000} />
            </Map >
        </div>
    )
}
