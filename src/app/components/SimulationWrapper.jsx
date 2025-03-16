"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with ssr: false (only allowed in Client Components)
const PendulumSimulation = dynamic(
  () => import('./PendulumSimulation'),
  { ssr: false }
);

export default function SimulationWrapper() {
  const [isClient, setIsClient] = useState(false);
  
  // This ensures hydration issues don't occur
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div className="w-full aspect-video bg-gray-100 border rounded-lg flex items-center justify-center">
        <p>Loading simulation...</p>
      </div>
    );
  }
  
  return <PendulumSimulation />;
}