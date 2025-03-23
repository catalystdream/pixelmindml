"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with ssr: false (only allowed in Client Components)
const MagnetosphereMap = dynamic(
  () => import('./MagnetosphereMap'),
  { 
    ssr: false,
    loading: () => <div className="h-96 bg-gray-100 flex items-center justify-center">Loading magnetosphere map...</div>
  }
);

export default function MagnetosphereMapWrapper() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div className="h-96 bg-gray-100 flex items-center justify-center">
        Loading magnetosphere map...
      </div>
    );
  }
  
  return <MagnetosphereMap />;
}
// In MagnetosphereMapWrapper.jsx
// "use client";

// import { useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';

// export default function MagnetosphereMapWrapper() {
//   const [isClient, setIsClient] = useState(false);
//   const [error, setError] = useState(null);
  
//   useEffect(() => {
//     setIsClient(true);
    
//     // Test the import directly
//     import('./MagnetosphereMap')
//       .then(module => {
//         console.log("Successfully imported module:", module);
//       })
//       .catch(err => {
//         console.error("Failed to import MagnetosphereMap:", err);
//         setError(err.message);
//       });
//   }, []);
  
//   if (error) {
//     return (
//       <div className="h-96 bg-gray-100 flex items-center justify-center text-red-500">
//         Error loading map component: {error}
//       </div>
//     );
//   }
  
//   if (!isClient) {
//     return (
//       <div className="h-96 bg-gray-100 flex items-center justify-center">
//         Loading magnetosphere map...
//       </div>
//     );
//   }
  
//   // For debugging, just return a placeholder instead of the dynamic component
//   return (
//     <div className="h-96 bg-gray-100 flex items-center justify-center">
//       Map component placeholder - dynamic import test in console
//     </div>
//   );
// }