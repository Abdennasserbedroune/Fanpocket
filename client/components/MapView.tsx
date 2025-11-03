'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), {
  ssr: false,
});

const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), {
  ssr: false,
});

export function MapView() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[600px] bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[33.5731, -7.5898]}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}
