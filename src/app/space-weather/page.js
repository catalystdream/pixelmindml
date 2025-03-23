import Link from 'next/link';

// Import the wrapper components (not using dynamic imports here)
import SolarWindChartWrapper from '../components/SolarWindChartWrapper';
import MagnetosphereMapWrapper from '../components/MagnetosphereMapWrapper';
import MagnetosphereSimulationWrapper from '../components/MagnetosphereSimulationWrapper';
import XRayFluxChartWrapper from '../components/XRayFluxChartWrapper';

export default function SpaceWeatherPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-6">Space Weather Dashboard</h1>
        
        <p className="text-xl mb-8">
          Real-time monitoring of solar and geomagnetic activity affecting Earth's magnetosphere and space environment.
        </p>
         
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Solar Wind Parameters</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <SolarWindChartWrapper />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">X-Ray Flux (Solar Flares)</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <XRayFluxChartWrapper />
            </div>
          </div>
        </div>
       
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Magnetosphere Simulation</h2>
          <p className="mb-4">
            This 3D visualization shows how the solar wind interacts with Earth's magnetic field,
            creating the magnetosphere. Current solar wind conditions affect the simulation.
          </p>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <MagnetosphereSimulationWrapper />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Drag to rotate, scroll to zoom. The visualization shows how solar wind particles (yellow) 
            flow around Earth's magnetosphere and how the field lines (blue) are compressed on the day side.
          </p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Geomagnetic Activity & Aurora Forecast</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <MagnetosphereMapWrapper />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Recent Events</h2>
            <Link href="/space-weather/events" className="text-blue-600 hover:underline">
              View recent solar events (CMEs, solar flares, etc.) →
            </Link>
          </div>
          
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">SOHO Imagery</h2>
            <Link href="/space-weather/imagery" className="text-blue-600 hover:underline">
              View latest solar imagery →
            </Link>
          </div>
        </div> 
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">About Space Weather</h2>
          <div className="prose">
            <p>
              Space weather refers to the environmental conditions in space as influenced by the Sun and the solar wind.
              It can impact satellite operations, GPS accuracy, power grids, and create beautiful auroras.
            </p>
            <p>
              This dashboard displays real-time data from NOAA's Space Weather Prediction Center and NASA APIs,
              visualizing current conditions and providing alerts for significant space weather events.
            </p>
            <h3 className="text-lg font-medium text-blue-800 mt-4">Key Indicators</h3>
            <ul className="list-disc pl-6">
              <li><strong>Solar Wind:</strong> Stream of charged particles flowing from the Sun</li>
              <li><strong>Kp Index:</strong> Measure of geomagnetic activity (0-9 scale)</li>
              <li><strong>X-ray Flux:</strong> Indicator of solar flare activity</li>
              <li><strong>CMEs:</strong> Coronal Mass Ejections, massive eruptions of plasma from the Sun</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}