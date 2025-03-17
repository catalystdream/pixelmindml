import Link from 'next/link';
import SatelliteOrbitWrapper from '../../components/SatelliteOrbitWrapper';

export default function SatellitePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <div className="mb-6">
          <Link href="/simulations" className="text-blue-600 hover:underline">
            ← Back to simulations
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Satellite Orbit Simulation</h1>
        <p className="mb-6">A 3D visualization of a satellite orbiting Earth. Use your mouse to rotate, zoom, and pan the view.</p>
        
        <div className="border rounded-lg overflow-hidden shadow-lg">
          <SatelliteOrbitWrapper />
        </div>
        
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <p>
            This simulation uses Three.js and React Three Fiber to create a 3D scene with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>A textured Earth that slowly rotates on its axis</li>
            <li>A satellite following an elliptical orbit with realistic orbital mechanics</li>
            <li>A visualization of the orbital path</li>
            <li>Interactive controls for exploring the simulation</li>
          </ul>
        </div>
      </div>
    </main>
  );
}