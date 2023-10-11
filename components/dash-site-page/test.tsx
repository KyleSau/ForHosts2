import React, { useEffect } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false, // Disable server-side rendering
  },
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  {
    ssr: false, // Disable server-side rendering
  },
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  {
    ssr: false, // Disable server-side rendering
  },
);

export default function TestPage({}) {
  return (
    <>
      {/* Other components in your DashPage */}
      {/* ... */}

      <div className="flex justify-center">
        Map
        <MapContainer
          zoom={13} // You can adjust the zoom level as needed
          style={{ width: "100%", height: "400px" }} // Adjust the dimensions as needed
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      </div>

      {/* ... */}
    </>
  );
}
