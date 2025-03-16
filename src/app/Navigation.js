import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-2xl font-bold mb-2 md:mb-0">
          Engineering Blog
        </Link>
        <div className="flex space-x-6">
          <Link href="/" className="hover:text-blue-300 transition-colors">
            Home
          </Link>
          <Link href="/blog" className="hover:text-blue-300 transition-colors">
            Blog
          </Link>
          <Link href="/about" className="hover:text-blue-300 transition-colors">
            About
          </Link>
        </div>
      </div>
    </nav>
  )
}