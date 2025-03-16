import "./globals.css";
import "./prism-theme.css";
import "katex/dist/katex.min.css";  
import Navigation from './Navigation'

export const metadata = {
  title: 'Engineering & Simulation Blog',
  description: 'A blog about engineering, scientific machine learning, and simulations',
}

function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 p-6 mt-12">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Engineering & Simulation Blog</h3>
            <p>Exploring the intersection of engineering, scientific machine learning, and simulations.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Links</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="/about" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p>© {new Date().getFullYear()} Engineering & Simulation Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navigation />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}