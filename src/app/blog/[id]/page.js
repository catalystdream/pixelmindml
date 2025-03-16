import { getAllPostIds, getPostData } from '@/lib/blog';
import Link from 'next/link';

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths;
}

export default async function Post({ params }) {
  const postData = await getPostData(params.id);
  
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <div className="mb-6">
          <Link href="/blog" className="text-blue-600 hover:underline">
            ← Back to all posts
          </Link>
        </div>
        
        <article>
          <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
          <div className="text-gray-600 mb-8">
            Published on {new Date(postData.date).toLocaleDateString()} by {postData.author}
          </div>
          
          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
        />
        </article>
      </div>
    </main>
  );
}