"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';

// Earth component with texture
function Earth(props) {
  const earthRef = useRef();
  const texture = useTexture('/earth_texture.jpg');
  
  useFrame(() => {
    // Slow rotation
    earthRef.current.rotation.y += 0.001;
  });
  
  return (
    <mesh ref={earthRef} {...props}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

// Satellite component with orbital motion
function Satellite() {
  const satRef = useRef();
  
  // Orbital parameters
  const orbitalRadius = 2;
  const orbitalSpeed = 0.01;
  const orbitalInclination = Math.PI / 6; // 30 degrees
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Calculate position based on orbital equations
    const x = orbitalRadius * Math.cos(t * orbitalSpeed);
    const y = orbitalRadius * Math.sin(t * orbitalSpeed) * Math.sin(orbitalInclination);
    const z = orbitalRadius * Math.sin(t * orbitalSpeed) * Math.cos(orbitalInclination);
    
    satRef.current.position.set(x, y, z);
    
    // Make satellite look in direction of motion
    satRef.current.lookAt(0, 0, 0);
  });
  
  return (
    <mesh ref={satRef}>
      <boxGeometry args={[0.1, 0.1, 0.2]} />
      <meshStandardMaterial color="silver" />
    </mesh>
  );
}

// Orbital path visualization
function OrbitalPath() {
  const curve = new THREE.EllipseCurve(
    0, 0,             // Center x, y
    2, 2,             // x radius, y radius
    0, 2 * Math.PI,   // Start angle, end angle
    false,            // Clockwise
    Math.PI / 6       // Rotation
  );
  
  const points = curve.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints(
    points.map(p => new THREE.Vector3(p.x, 0, p.y))
  );
  
  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="white" opacity={0.5} transparent />
    </line>
  );
}

// Main component
export default function SatelliteOrbit() {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} />
        <Earth position={[0, 0, 0]} />
        <Satellite />
        <OrbitalPath />
        
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}