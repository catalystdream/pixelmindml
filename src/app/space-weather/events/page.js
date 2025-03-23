import Link from 'next/link';

async function fetchDONKIData(endpoint, startDate, endDate) {
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  const url = `https://api.nasa.gov/DONKI/${endpoint}?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`;
  
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint} data`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint} data:`, error);
    return [];
  }
}

export default async function SpaceWeatherEventsPage() {
  // Calculate date range for the last 30 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  // Format dates for API
  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];
  
  // Fetch data from NASA DONKI API
  const [cmeData, flareData, solarWindData] = await Promise.all([
    fetchDONKIData('CME', startDateStr, endDateStr),
    fetchDONKIData('FLR', startDateStr, endDateStr),
    fetchDONKIData('HSS', startDateStr, endDateStr)
  ]);
  
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-6xl">
        <div className="mb-6">
          <Link href="/space-weather" className="text-blue-600 hover:underline">
            ← Back to Space Weather Dashboard
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-6">Recent Solar Events</h1>
        
        <p className="text-xl mb-8">
          Recent significant space weather events from NASA's DONKI (Space Weather Database Of Notifications, Knowledge, Information).
          Showing events from the last 30 days.
        </p>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Coronal Mass Ejections (CMEs)</h2>
          
          {cmeData && cmeData.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed (km/s)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cmeData.map((cme, index) => (
                      <tr key={`cme-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(cme.startTime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {cme.type || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {cme.cmeAnalyses && cme.cmeAnalyses[0]?.speed ? cme.cmeAnalyses[0].speed : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {cme.note || 'No details available'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg">
              <p>No CME events detected in the last 30 days.</p>
            </div>
          )}
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Solar Flares</h2>
          
          {flareData && flareData.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source Location</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Region</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {flareData.map((flare, index) => (
                      <tr key={`flare-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(flare.beginTime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={`px-2 py-1 rounded ${
                            flare.classType.startsWith('X') ? 'bg-red-100 text-red-800' : 
                            flare.classType.startsWith('M') ? 'bg-orange-100 text-orange-800' : 
                            flare.classType.startsWith('C') ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {flare.classType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {flare.sourceLocation || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {flare.activeRegionNum || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg">
              <p>No solar flare events detected in the last 30 days.</p>
            </div>
          )}
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">High Speed Solar Wind Streams</h2>
          
          {solarWindData && solarWindData.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {solarWindData.map((hss, index) => (
                      <tr key={`hss-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(hss.eventTime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {hss.link ? new Date(hss.link).toLocaleString() : 'Ongoing'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {hss.source || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {hss.impact || 'Data not available'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg">
              <p>No high-speed solar wind events detected in the last 30 days.</p>
            </div>
          )}
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">About Space Weather Events</h2>
          <div className="prose">
            <p>
              Space weather events are phenomena that occur in space which can impact Earth and its technological systems.
              The three main types of events tracked by NASA's DONKI system are:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <strong>Coronal Mass Ejections (CMEs):</strong> Massive bursts of solar wind and magnetic fields 
                rising above the solar corona that can trigger geomagnetic storms.
              </li>
              <li>
                <strong>Solar Flares:</strong> Sudden flashes of increased brightness on the Sun, classified by their 
                X-ray output (B, C, M, X classes, with X being the strongest).
              </li>
              <li>
                <strong>High Speed Solar Wind Streams:</strong> Fast-moving solar wind originating from coronal holes 
                on the Sun's surface.
              </li>
            </ul>
            <p className="mt-4 text-sm">
              Data provided by NASA's DONKI API. For more information, visit the <a href="https://kauai.ccmc.gsfc.nasa.gov/DONKI/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">DONKI website</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}