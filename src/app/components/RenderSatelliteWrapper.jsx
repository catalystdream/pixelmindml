"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with ssr: false (only allowed in Client Components)
const RenderSatelliteOrbit = dynamic(
  () => import('./RenderSatelliteOrbit'),
  { 
    ssr: false,
    loading: () => <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center">Loading simulation...</div>
  }
);

export default function RenderSatelliteWrapper() {
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
  
  return <RenderSatelliteOrbit />;
}