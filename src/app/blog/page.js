import Link from 'next/link';
import { getSortedPostsData } from '@/lib/blog';

export default function Blog() {
  const allPostsData = getSortedPostsData();
  
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Blog</h1>
        
        <div className="mb-10">
          <p className="text-xl mb-8">
            Exploring engineering concepts, scientific machine learning, and interactive simulations.
          </p>
          
          <div className="grid gap-6">
            {allPostsData.map(({ id, date, title, excerpt }) => (
              <div key={id} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                <Link href={`/blog/${id}`} className="no-underline">
                  <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600">{title}</h2>
                </Link>
                <p className="text-gray-600 mb-3">{new Date(date).toLocaleDateString()}</p>
                <p className="mb-3">{excerpt}</p>
                <Link 
                  href={`/blog/${id}`}
                  className="text-blue-600 hover:underline"
                >
                  Read more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}