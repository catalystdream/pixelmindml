"use client";

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';

// Earth component with texture
function Earth({ radius }) {
  const earthRef = useRef();
  const texture = useTexture('/earth_texture.jpg');
  
  useFrame(() => {
    earthRef.current.rotation.y += 0.001;
  });
  
  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial map={texture}
      emissive="#004080" 
        emissiveIntensity={0.1} 
        metalness={0.1} 
        roughness={0.7}  />
    </mesh>
  );
}

function EarthGlow({ radius }) {
    return (
      <mesh>
        <sphereGeometry args={[radius * 1.05, 32, 32]} />
        <meshBasicMaterial color="#004080" transparent opacity={0.15} />
      </mesh>
    );
  }
  
// Satellite orbit visualization using data from API
function SatelliteOrbit({ orbitData }) {
  const { positions, earth_radius } = orbitData;
  const satRef = useRef();
  const [pathPoints, setPathPoints] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Create points for path visualization
  useEffect(() => {
    if (positions) {
      const points = positions.x.map((x, i) => 
        new THREE.Vector3(
          positions.x[i], 
          positions.y[i], 
          positions.z[i]
        )
      );
      setPathPoints(points);
    }
  }, [positions]);
  
  // Animate satellite along the path
  useFrame(() => {
    if (pathPoints.length > 0) {
      const nextIndex = (currentIndex + 1) % pathPoints.length;
      setCurrentIndex(nextIndex);
      
      // Update satellite position
      if (satRef.current && pathPoints[currentIndex]) {
        satRef.current.position.copy(pathPoints[currentIndex]);
        
        // Calculate direction of motion for satellite orientation
        const nextPos = pathPoints[(currentIndex + 1) % pathPoints.length];
        satRef.current.lookAt(nextPos);
      }
    }
  });
  
  return (
    <>
      {/* Orbital path */}
      {pathPoints.length > 0 && (
        <line>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attachObject={['attributes', 'position']}
              array={new Float32Array(pathPoints.flatMap(p => [p.x, p.y, p.z]))}
              count={pathPoints.length}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial 
      attach="material" 
      color="#000000" 
      linewidth={3} 
      opacity={1.0} 
      
    />
        </line>
      )}
      
      {/* Satellite */}
      {pathPoints.length > 0 && (
        <mesh ref={satRef}>
          <boxGeometry args={[0.5, 0.5, 1.0]} />
          <meshStandardMaterial 
      color="#ffffff" 
      emissive="#ff0000" 
      emissiveIntensity={1.0} 
    /> 
        </mesh>
      )}
      
      {/* Earth */}
      <Earth radius={earth_radius / 1000} />
      <EarthGlow radius={earth_radius / 1000} />

    </>
  );
}

export default function RenderSatelliteOrbit() {
  const [orbitData, setOrbitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parameters, setParameters] = useState({
    semi_major_axis: 8000,
    eccentricity: 0.1,
    inclination: 30,
    simulation_time: 10000,
    time_steps: 1000
  });
  
  const RENDER_API_URL = "https://satellite-orbit-api.onrender.com/api/satellite-orbit";
  
  const fetchOrbitData = async () => {
    setLoading(true);
    try {
      const response = await fetch(RENDER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parameters),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orbit data');
      }
      
      const data = await response.json();
      setOrbitData(data);
    } catch (err) {
      setError(err.message);
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch orbit data on component mount
  useEffect(() => {
    fetchOrbitData();
  }, []);
  
  // Handle parameter changes
  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setParameters(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3 space-y-4">
          <h3 className="text-lg font-medium">Orbital Parameters</h3>
          
          <div>
            <label className="block text-sm">Semi-major axis (km)</label>
            <input
              type="range"
              name="semi_major_axis"
              min="6500"
              max="20000"
              value={parameters.semi_major_axis}
              onChange={handleParamChange}
              className="w-full"
            />
            <span className="text-sm">{parameters.semi_major_axis} km</span>
          </div>
          
          <div>
            <label className="block text-sm">Eccentricity</label>
            <input
              type="range"
              name="eccentricity"
              min="0"
              max="0.9"
              step="0.01"
              value={parameters.eccentricity}
              onChange={handleParamChange}
              className="w-full"
            />
            <span className="text-sm">{parameters.eccentricity}</span>
          </div>
          
          <div>
            <label className="block text-sm">Inclination (degrees)</label>
            <input
              type="range"
              name="inclination"
              min="0"
              max="90"
              value={parameters.inclination}
              onChange={handleParamChange}
              className="w-full"
            />
            <span className="text-sm">{parameters.inclination}°</span>
          </div>
          
          <button
            onClick={fetchOrbitData}
            className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Orbit
          </button>
        </div>
        
        <div className="md:w-2/3 h-[500px] bg-gray-950 rounded-lg overflow-hidden">
          {loading && <div className="w-full h-full flex items-center justify-center text-white">Loading simulation...</div>}
          {error && (
            <div className="w-full h-full flex flex-col items-center justify-center text-red-500 p-4">
              <p>Error: {error}</p>
              <p className="text-sm mt-2">The Render.com free tier may take up to 1 minute to wake up if it hasn't been used recently.</p>
              <button 
                onClick={fetchOrbitData} 
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          )}
          {!loading && !error && orbitData && (
            <Canvas 
            camera={{ position: [0, 0, 20], fov: 60 }}>
                
              <ambientLight intensity={1} />
              <pointLight position={[10, 10, 10]} intensity={2.5} />
              <pointLight position={[-10, -10, -10]} intensity={1.0} /> {/* Added second light */}
            <Stars radius={100} depth={50} count={3000} factor={4} /> {/* Reduced star count */}
              <SatelliteOrbit orbitData={orbitData} />
              <OrbitControls enableZoom={true} />
            </Canvas>
          )}
        </div>
      </div>
    </div>
  );
}