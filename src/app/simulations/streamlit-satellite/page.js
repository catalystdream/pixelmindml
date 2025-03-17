import React from 'react';
import StreamlitEmbed from '../../components/StreamlitEmbed';
import Link from 'next/link';

export default function StreamlitSatellitePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-5xl">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to home
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Streamlit Satellite Orbit Simulation</h1>
        <p className="mb-6">A 3D visualization of satellite orbits created with Streamlit and embedded in our Next.js site.</p>
        
        <div className="border rounded-lg overflow-hidden shadow-lg">
          <StreamlitEmbed 
            src="http://localhost:8501" 
            title="Satellite Orbit Simulator"
            height="850px"
          />
        </div>
        
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <p>
            This simulation is built using Streamlit, a Python framework for data applications, and embedded in our Next.js site.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Full Python-based implementation with Streamlit</li>
            <li>Interactive controls built with Streamlit components</li>
            <li>3D visualization using Plotly</li>
            <li>Simple iframe embedding in our Next.js site</li>
          </ul>
        </div>
      </div>
    </main>
  );
}