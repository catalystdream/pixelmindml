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
      <meshStandardMaterial map={texture} />
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
          <lineBasicMaterial attach="material" color="#ffffff" linewidth={1} opacity={0.7} transparent />
        </line>
      )}
      
      {/* Satellite */}
      {pathPoints.length > 0 && (
        <mesh ref={satRef}>
          <boxGeometry args={[0.2, 0.2, 0.4]} />
          <meshStandardMaterial color="silver" />
        </mesh>
      )}
      
      {/* Earth */}
      <Earth radius={earth_radius / 1000} />
    </>
  );
}

export default function SatellitePythonOrbit() {
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
  
  const fetchOrbitData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/satellite-orbit', {
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
        
        <div className="md:w-2/3 h-[500px] bg-black rounded-lg overflow-hidden">
          {loading && <div className="w-full h-full flex items-center justify-center text-white">Loading simulation...</div>}
          {error && <div className="w-full h-full flex items-center justify-center text-red-500">Error: {error}</div>}
          {!loading && !error && orbitData && (
            <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
              <ambientLight intensity={0.2} />
              <pointLight position={[10, 10, 10]} intensity={1.5} />
              <Stars radius={100} depth={50} count={5000} factor={4} />
              <SatelliteOrbit orbitData={orbitData} />
              <OrbitControls enableZoom={true} />
            </Canvas>
          )}
        </div>
      </div>
    </div>
  );
}