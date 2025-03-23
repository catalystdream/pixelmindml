"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with ssr: false (only allowed in Client Components)
const MagnetosphereSimulation = dynamic(
  () => import('./MagnetosphereSimulation'),
  { 
    ssr: false,
    loading: () => <div className="h-96 bg-gray-100 flex items-center justify-center">Loading magnetosphere simulation...</div>
  }
);

export default function MagnetosphereSimulationWrapper() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div className="h-96 bg-gray-100 flex items-center justify-center">
        Loading magnetosphere simulation...
      </div>
    );
  }
  
  return <MagnetosphereSimulation />;
}
