"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with ssr: false (only allowed in Client Components)
const XRayFluxChart = dynamic(
  () => import('./XRayFluxChart').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => <div className="h-80 bg-gray-100 flex items-center justify-center">Loading X-ray flux chart...</div>
  }
);

export default function XRayFluxChartWrapper() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div className="h-80 bg-gray-100 flex items-center justify-center">
        Loading X-ray flux data...
      </div>
    );
  }
  
  return <XRayFluxChart />;
}