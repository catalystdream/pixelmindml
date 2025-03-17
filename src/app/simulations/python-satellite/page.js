import Link from 'next/link';
import SatellitePythonOrbitWrapper from '../../components/SatellitePythonOrbitWrapper';

export default function PythonSatellitePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-5xl">
        <div className="mb-6">
          <Link href="/simulations" className="text-blue-600 hover:underline">
            ← Back to simulations
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Python-Powered Satellite Orbit</h1>
        <p className="mb-6">A 3D visualization of a satellite orbiting Earth, with orbital mechanics calculated by a Python backend.</p>
        
        <div className="border rounded-lg overflow-hidden shadow-lg p-4">
          <SatellitePythonOrbitWrapper />
        </div>
        
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <p>
            This simulation uses a Python backend with FastAPI to calculate accurate orbital mechanics using scipy's differential equation solver. The frontend visualizes the results using Three.js.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Python backend calculates satellite trajectory using real physics</li>
            <li>Parametric controls allow adjusting orbital characteristics</li>
            <li>Interactive 3D visualization renders the calculated orbit</li>
            <li>More accurate than purely client-side approximations</li>
          </ul>
        </div>
      </div>
    </main>
  );
}