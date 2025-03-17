"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with ssr: false (only allowed in Client Components)
const SatelliteOrbit = dynamic(
  () => import('./SatelliteOrbit'),
  { 
    ssr: false,
    loading: () => <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center">Loading simulation...</div>
  }
);

export default function SatelliteOrbitWrapper() {
  // This ensures proper client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center">
        Loading simulation...
      </div>
    );
  }
  
  return <SatelliteOrbit />;
}