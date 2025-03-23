
export async function fetchSolarWindData() {
    const response = await fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json');
    return response.json();
  }
  
  export async function fetchGeomagneticIndices() {
    const response = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
    return response.json();
  }
  
  export async function fetchXrayFlux() {
    const response = await fetch('https://services.swpc.noaa.gov/json/goes/primary/xrays-3-day.json');
    return response.json();
  }
  
  export async function fetchDONKIData(endpoint = 'CME', startDate, endDate) {
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    const url = `https://api.nasa.gov/DONKI/${endpoint}?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`;
    const response = await fetch(url);
    return response.json();
  }