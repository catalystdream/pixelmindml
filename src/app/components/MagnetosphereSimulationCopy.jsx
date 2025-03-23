"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';

function Earth({ solarWindSpeed }) {
  const earthRef = useRef();
  const fieldLinesRef = useRef();
  const texture = useTexture('/earth_texture.jpg');
  
  // Solar wind pressure affects magnetosphere shape
  const compressionFactor = Math.min(1.5, Math.max(0.7, 1 + (solarWindSpeed - 400) / 600));
  
  useFrame(() => {
    // Slowly rotate Earth
    earthRef.current.rotation.y += 0.001;
  });
  
  // Create magnetic field lines
  useEffect(() => {
    if (fieldLinesRef.current) {
      const fieldLines = fieldLinesRef.current;
      
      // Clear any existing children
      while (fieldLines.children.length) {
        fieldLines.remove(fieldLines.children[0]);
      }
      
      // Create magnetic field lines
      const fieldLineCount = 16;
      const radius = 1; // Earth radius
      
      for (let i = 0; i < fieldLineCount; i++) {
        const angle = (i / fieldLineCount) * Math.PI * 2;
        const startX = Math.cos(angle) * 0.1;
        const startZ = Math.sin(angle) * 0.1;
        
        const points = [];
        const segments = 50;
        
        // North hemisphere
        for (let j = 0; j <= segments; j++) {
          const t = j / segments;
          const lat = Math.PI / 2 - t * Math.PI;
          const lng = angle;
          
          // Calculate dipole field line
          const r = radius * Math.pow(Math.cos(lat), 2);
          
          // Adjust for solar wind compression on dayside
          let adjustedR = r;
          if (lng > -Math.PI/2 && lng < Math.PI/2) {
            // Day side - more compressed
            adjustedR = r * (1 / compressionFactor);
          } else {
            // Night side - stretched
            adjustedR = r * compressionFactor;
          }
          
          const x = adjustedR * Math.cos(lat) * Math.cos(lng);
          const y = adjustedR * Math.sin(lat);
          const z = adjustedR * Math.cos(lat) * Math.sin(lng);
          
          points.push(new THREE.Vector3(x, y, z));
        }
        
        // Create the line
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0x2080ff, transparent: true, opacity: 0.5 });
        const line = new THREE.Line(geometry, material);
        
        fieldLines.add(line);
        
        // Add South hemisphere line (mirror of north)
        const southPoints = points.map(p => new THREE.Vector3(p.x, -p.y, p.z));
        const southGeometry = new THREE.BufferGeometry().setFromPoints(southPoints);
        const southLine = new THREE.Line(southGeometry, material);
        
        fieldLines.add(southLine);
      }
    }
  }, [compressionFactor]);
  
  return (
    <>
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      
      {/* Magnetosphere field lines */}
      <group ref={fieldLinesRef} />
      
      {/* Magnetopause boundary - simplified as an ellipsoid */}
      <mesh position={[compressionFactor * 0.5, 0, 0]} rotation={[0, Math.PI/2, 0]}>
        <sphereGeometry args={[3 / compressionFactor, 3, 3 * compressionFactor, 32, 32]} />
        <meshBasicMaterial color="#4080ff" transparent opacity={0.05} />
      </mesh>
      
      {/* Solar wind particles */}
      <SolarWindParticles speed={solarWindSpeed} />
    </>
  );
}


// Solar wind particles flowing around magnetosphere
function SolarWindParticles({ speed }) {
  const particlesRef = useRef();
  const particleCount = 200;
  const baseSpeed = speed / 500; // Normalize speed for animation
  
  useEffect(() => {
    try{
    if (particlesRef.current) {
      const particles = particlesRef.current;
      
      // Create solar wind particles
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      
      for (let i = 0; i < particleCount; i++) {
        // Start particles from far away in the +X direction (sun side)
        const i3 = i * 3;
        positions[i3] = 15 + Math.random() * 5;
        positions[i3 + 1] = (Math.random() - 0.5) * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;
        
        // Color by speed (hotter = faster)
        const speedNormalized = Math.min(1, speed / 700);
        colors[i3] = 0.5 + 0.5 * speedNormalized;
        colors[i3 + 1] = 0.3 * (1 - speedNormalized);
        colors[i3 + 2] = 0.2;
        
        // Randomize sizes
        sizes[i] = 0.05 + Math.random() * 0.05;
      }
      
      // Update geometry
      particles.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particles.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particles.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    }
  } catch (error) {
    console.error("Error animating particles:", error);
    // Don't throw the error - this allows the animation to try again next frame
  }
  }, [particleCount, speed]);
  
  useFrame(() => {
    if (particlesRef.current) {
      const particles = particlesRef.current;
      const positions = particles.geometry.attributes.position.array;
      
      // Move particles from right to left (solar wind direction)
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] -= baseSpeed * (0.1 + 0.05 * Math.random());
        
        // Deflect particles around magnetosphere
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];
        const distanceFromCenter = Math.sqrt(y*y + z*z);
        const distanceFromOrigin = Math.sqrt(x*x + y*y + z*z);
        
        // If particle is close to the magnetosphere boundary, deflect it
        if (x < 5 && x > -5 && distanceFromCenter < 3 + 2 * Math.abs(x) / 5) {
          // Push away from the center
          const angle = Math.atan2(z, y);
          positions[i3 + 1] += 0.05 * Math.cos(angle) * (3 - distanceFromCenter);
          positions[i3 + 2] += 0.05 * Math.sin(angle) * (3 - distanceFromCenter);
        }
        
        // Reset particles that go too far
        if (x < -15 || distanceFromOrigin > 20) {
          positions[i3] = 15 + Math.random() * 5;
          positions[i3 + 1] = (Math.random() - 0.5) * 10;
          positions[i3 + 2] = (Math.random() - 0.5) * 10;
        }
      }
      
      particles.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial 
        size={0.1} 
        vertexColors 
        transparent 
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}


export default function MagnetosphereSimulation() {
  const [solarWindData, setSolarWindData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Handle WebGL context loss/recovery
    const handleContextLost = (event) => {
      event.preventDefault();
      console.log("WebGL context lost - will attempt to recover");
      // You could set some state here to show a recovery message
    };
    
    const handleContextRestored = () => {
      console.log("WebGL context restored");
      // Force a re-render of the component
      setIsClient(false);
      setTimeout(() => setIsClient(true), 100);
    };
    
    // Add event listeners to the canvas
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost, false);
      canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
    }
    
    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      }
    };
  }, []);
  
  useEffect(() => {
    async function fetchSolarWindData() {
      try {
        setLoading(true);
        const response = await fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json');
        
        if (!response.ok) {
          throw new Error('Failed to fetch solar wind data');
        }
        
        const rawData = await response.json();
        // Get the most recent speed (last element, third column)
        const latestSpeed = parseFloat(rawData[rawData.length - 1][2]);
        
        if (isNaN(latestSpeed)) {
          setSolarWindData({ speed: 400 }); // Default fallback
        } else {
          setSolarWindData({ speed: latestSpeed });
        }
      } catch (err) {
        console.error("Error fetching solar wind data:", err);
        setError(err.message);
        setSolarWindData({ speed: 400 }); // Default fallback
      } finally {
        setLoading(false);
      }
    }

    fetchSolarWindData();
  }, []);
  
  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        Loading solar wind data for simulation...
      </div>
    );
  }
  
  return (
    <div className="h-96 bg-black rounded-lg overflow-hidden">
      <Canvas camera={{ position: [5, 3, 10], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[15, 0, 0]} intensity={1.5} color="#fffaf0" />
        <Stars radius={100} depth={50} count={1000} factor={4} />
        
        <Earth solarWindSpeed={solarWindData?.speed || 400} />
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={true}
          minDistance={2.5}
          maxDistance={20}
        />
      </Canvas>
      
      {/* <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
        Solar Wind Speed: {solarWindData?.speed.toFixed(0) || '400'} km/s
      </div> */}
    </div>
  );
}