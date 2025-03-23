import Link from 'next/link';
import Image from 'next/image';

export default async function SOHOImageryPage() {
  // We'll use server-side data fetching since these are static images
  // that don't require client-side interactivity
  
  // Define image sources
  const imageSources = [
    {
      title: "LASCO C2 Coronagraph",
      url: "https://soho.nascom.nasa.gov/data/LATEST/current_c2.gif",
      description: "Shows the solar corona from 2 to 6 solar radii"
    },
    {
      title: "LASCO C3 Coronagraph",
      url: "https://soho.nascom.nasa.gov/data/LATEST/current_c3.gif",
      description: "Shows the solar corona from 3.7 to 30 solar radii"
    },
    {
      title: "EIT 304",
      url: "https://soho.nascom.nasa.gov/data/LATEST/current_eit_304.gif",
      description: "Shows the chromosphere and transition region"
    },
    {
      title: "EIT 171",
      url: "https://soho.nascom.nasa.gov/data/LATEST/current_eit_171.gif",
      description: "Shows the upper transition region and quiet corona"
    },
    {
      title: "EIT 195",
      url: "https://soho.nascom.nasa.gov/data/LATEST/current_eit_195.gif",
      description: "Shows the corona and hot flare plasma"
    },
    {
      title: "EIT 284",
      url: "https://soho.nascom.nasa.gov/data/LATEST/current_eit_284.gif",
      description: "Shows the active region corona"
    }
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-6xl">
        <div className="mb-6">
          <Link href="/space-weather" className="text-blue-600 hover:underline">
            ← Back to Space Weather Dashboard
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-6">Solar Imagery</h1>
        
        <p className="text-xl mb-8">
          Latest imagery from the Solar and Heliospheric Observatory (SOHO) mission.
          These images help scientists monitor solar activity and predict space weather events.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {imageSources.map((img) => (
            <div key={img.title} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{img.title}</h2>
                <p className="text-sm text-gray-600 mb-4">{img.description}</p>
                <div className="bg-black rounded-lg overflow-hidden">
                  {/* Use a regular img tag for external URLs */}
                  <img
                    src={img.url}
                    alt={img.title}
                    width={400}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Image updates approximately every 12 minutes
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">About SOHO</h2>
          <p>
            The Solar and Heliospheric Observatory (SOHO) is a space-based observatory, launched on 
            December 2, 1995, dedicated to studying the Sun from its deep core to the outer corona 
            and the solar wind.
          </p>
          <p className="mt-2">
            SOHO has revolutionized our understanding of the Sun and its influence on Earth by providing
            continuous monitoring of solar activity, helping scientists predict space weather events.
          </p>
          <p className="mt-4 text-sm">
            Images courtesy of NASA/ESA SOHO mission. SOHO is a project of international cooperation between ESA and NASA.
          </p>
        </div>
      </div>
    </main>
  );
}