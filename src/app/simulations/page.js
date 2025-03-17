import Link from 'next/link';

export default function SimulationsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Satellite Orbit Simulations</h1>
        
        <p className="text-xl mb-8">
          Explore different approaches to implementing 3D satellite orbit simulations.
          Each implementation has different strengths and trade-offs.
        </p>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Next.js Only</h2>
            <p className="mb-4">Direct implementation using Three.js in Next.js without any backend.</p>
            <ul className="mb-4 text-sm text-gray-600 space-y-1">
              <li>✅ Fully client-side</li>
              <li>✅ Seamless UI integration</li>
              <li>✅ Fast loading</li>
              <li>❌ Less precise physics</li>
            </ul>
            <Link href="/simulations/satellite" className="text-blue-600 hover:underline">
              View simulation →
            </Link>
          </div>
          
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Python + Next.js</h2>
            <p className="mb-4">Python backend for calculations with Next.js frontend for visualization.</p>
            <ul className="mb-4 text-sm text-gray-600 space-y-1">
              <li>✅ Accurate physics</li>
              <li>✅ Seamless UI integration</li>
              <li>✅ Separation of concerns</li>
              <li>❌ Requires API setup</li>
            </ul>
            <Link href="/simulations/python-satellite" className="text-blue-600 hover:underline">
              View simulation →
            </Link>
          </div>
          
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Streamlit Embedded</h2>
            <p className="mb-4">Full Python implementation with Streamlit embedded in an iframe.</p>
            <ul className="mb-4 text-sm text-gray-600 space-y-1">
              <li>✅ Rapid prototyping</li>
              <li>✅ Full Python ecosystem</li>
              <li>✅ Built-in UI controls</li>
              <li>❌ Iframe limitations</li>
            </ul>
            <Link href="/simulations/streamlit-satellite" className="text-blue-600 hover:underline">
              View simulation →
            </Link>
          </div>
        </div>
        
        <div className="mt-10 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Choosing the Right Approach</h2>
          <p className="mb-4">
            Each implementation approach has different trade-offs. Here's when to use each:
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Direct Next.js Implementation</h3>
              <p>Best for simpler visualizations where you want seamless integration with your site design and don't need complex physics calculations.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Python Backend + Next.js Frontend</h3>
              <p>Ideal for scientifically accurate simulations that need Python's numerical libraries while maintaining a polished, integrated UI experience.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Streamlit Embedding</h3>
              <p>Perfect for rapid prototyping, data exploration, or when you need the full Python data science stack with minimal JavaScript development.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}