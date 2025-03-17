import Link from 'next/link';
import RenderSatelliteWrapper from '../../components/RenderSatelliteWrapper';

export default function RenderSatellitePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-5xl">
        <div className="mb-6">
          <Link href="/simulations" className="text-blue-600 hover:underline">
            ← Back to simulations
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Render.com Satellite Orbit</h1>
        <p className="mb-6">A 3D visualization of a satellite orbiting Earth, with orbital mechanics calculated by a Python backend hosted on Render.com.</p>
        
        <div className="border rounded-lg overflow-hidden shadow-lg p-4">
          <RenderSatelliteWrapper />
        </div>
        
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <p>
            This simulation uses a Python backend with FastAPI deployed on Render.com to calculate accurate orbital mechanics. The Next.js frontend visualizes the results using Three.js.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Python backend calculates satellite trajectory using real physics (deployed on Render.com)</li>
            <li>Parametric controls allow adjusting orbital characteristics</li>
            <li>Interactive 3D visualization renders the calculated orbit</li>
            <li>Cloud-hosted solution that scales automatically</li>
          </ul>
          
          <div className="bg-blue-50 p-4 rounded-lg mt-8">
            <h3 className="text-lg font-medium text-blue-800 mb-2">About Render.com Free Tier</h3>
            <p className="text-blue-700">
              This simulation uses Render.com&apos;s free tier, which spins down after 15 minutes of inactivity. 
              If this is the first request in a while, it may take up to 1 minute for the server to restart 
              and respond. Subsequent requests will be much faster.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}