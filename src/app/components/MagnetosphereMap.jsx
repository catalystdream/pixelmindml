"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

export default function MagnetosphereMap() {
  const [kpIndex, setKpIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    
    // Fetch geomagnetic data
    async function fetchGeomagneticData() {
      try {
        setLoading(true);
        const response = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
        
        if (!response.ok) {
          throw new Error('Failed to fetch geomagnetic data');
        }
        
        const data = await response.json();
        // Get the most recent Kp index (last item in the array, skipping header)
        const latestKp = parseFloat(data[data.length - 1][1]);
        setKpIndex(latestKp);
      } catch (err) {
        console.error("Error fetching geomagnetic data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGeomagneticData();
  }, []);

  // Generate auroral oval based on Kp index (simplified model)
  const generateAuroralOvalPoints = (kpValue) => {
    // This is a simplified model - in a real application, you'd use a more accurate model
    const points = [];
    const baseLatitude = 67 - (kpValue * 2); // Simplistic approximation - oval expands southward as Kp increases
    
    for (let longitude = -180; longitude <= 180; longitude += 10) {
      // Northern hemisphere
      points.push({
        lat: baseLatitude + 3 * Math.sin((longitude * Math.PI) / 180),
        lng: longitude
      });
      
      // Southern hemisphere
      points.push({
        lat: -(baseLatitude + 3 * Math.sin((longitude * Math.PI) / 180)),
        lng: longitude
      });
    }
    
    return points;
  };

  // Get color based on Kp index
  const getKpColor = (kp) => {
    if (kp <= 3) return "green";
    if (kp <= 5) return "yellow";
    if (kp <= 7) return "orange";
    return "red";
  };

  if (!isClient) {
    return <div className="h-96 bg-gray-100 flex items-center justify-center">Loading map...</div>;
  }

  if (loading) return <div className="h-96 flex items-center justify-center">Loading geomagnetic data...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (kpIndex === null) return <div>No data available</div>;

  const auroralPoints = generateAuroralOvalPoints(kpIndex);
  const kpColor = getKpColor(kpIndex);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Current Planetary Kp Index: <span style={{color: kpColor}}>{kpIndex.toFixed(1)}</span></h3>
        <p className="text-sm text-gray-600">
          {kpIndex <= 3 ? "Quiet geomagnetic conditions" :
           kpIndex <= 5 ? "Minor to moderate geomagnetic storm" :
           kpIndex <= 7 ? "Strong geomagnetic storm" :
           "Severe to extreme geomagnetic storm"}
        </p>
      </div>
      
      <div className="h-96">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {auroralPoints.map((point, index) => (
            <CircleMarker
              key={index}
              center={[point.lat, point.lng]}
              radius={5}
              pathOptions={{ 
                fillColor: kpColor,
                fillOpacity: 0.5,
                color: kpColor,
                weight: 1
              }}
            >
              <Popup>
                Potential aurora visibility region
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>This is a simplified auroral oval visualization based on the current Kp index. For professional space weather forecasting, refer to <a href="https://www.swpc.noaa.gov/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NOAA SWPC</a>.</p>
      </div>
    </div>
  );
}