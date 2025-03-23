"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with ssr: false (only allowed in Client Components)
const SolarWindChart = dynamic(
  () => import('./SolarWindChart'),
  { 
    ssr: false,
    loading: () => <div className="h-80 bg-gray-100 flex items-center justify-center">Loading solar wind chart...</div>
  }
);

export default function SolarWindChartWrapper() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div className="h-80 bg-gray-100 flex items-center justify-center">
        Loading solar wind data...
      </div>
    );
  }
  
  return <SolarWindChart />;
}