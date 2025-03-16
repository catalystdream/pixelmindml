// import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getSortedPostsData } from '@/lib/blog';
import SimulationWrapper from './components/SimulationWrapper';


export default function Home() {
  const recentPosts = getSortedPostsData().slice(0, 2);
  
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Engineering & Simulation Blog</h1>
        
        <div className="mb-10">
          <p className="text-xl mb-4">
            Welcome to my blog where I explore engineering concepts, mathematical models, 
            and interactive simulations focused on scientific machine learning.
          </p>
          <p className="text-xl">
            I'll be sharing insights on neural networks for engineering applications,
            dynamical systems modeling, and computational techniques.
          </p>
        </div>
        
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Recent Articles</h2>
          <div className="grid gap-4">
            {recentPosts.map(({ id, title, date, excerpt }) => (
              <div key={id} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <Link href={`/blog/${id}`} className="no-underline">
                  <h3 className="text-xl font-medium hover:text-blue-600">{title}</h3>
                </Link>
                <p className="text-gray-600 mb-2">{new Date(date).toLocaleDateString()}</p>
                <p>{excerpt}</p>
                <Link 
                  href={`/blog/${id}`}
                  className="text-blue-600 hover:underline inline-block mt-3"
                >
                  Read more →
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/blog" className="text-blue-600 hover:underline">
              View all articles →
            </Link>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Featured Simulation</h2>
          <div className="p-6 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-medium mb-2">Pendulum Simulation</h3>
            <div className="aspect-video bg-gray-200 flex items-center justify-center mb-4">
              {/* This will be replaced with an actual simulation later */}
              <SimulationWrapper />
              <p>An interactive pendulum demonstrating simple harmonic motion. Click and drag to interact with the pendulum.</p>
            </div>
            <p>A visualization of coupled pendulums demonstrating the principles of harmonic motion and phase relationships.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
