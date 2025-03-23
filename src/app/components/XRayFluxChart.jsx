"use client";

import React, { useEffect, useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export default function XRayFluxChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchXRayData() {
      try {
        setLoading(true);
        const response = await fetch('https://services.swpc.noaa.gov/json/goes/primary/xrays-3-day.json');
        
        if (!response.ok) {
          throw new Error('Failed to fetch X-ray flux data');
        }
        
        const rawData = await response.json();
        
        // Transform the data for Chart.js
        const timestamps = rawData.map(point => new Date(point.time_tag));
        const shortXray = rawData.map(point => point.flux * 1e9); // Convert to nanowatts for better scale
        
        setData({
          labels: timestamps,
          datasets: [
            {
              label: 'X-ray Flux (0.1-0.8 nm)',
              data: shortXray,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              pointRadius: 1,
              borderWidth: 1,
            }
          ],
        });
      } catch (err) {
        console.error("Error fetching X-ray flux data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchXRayData();
  }, []);

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'MMM d, HH:mm'
          }
        },
        title: {
          display: true,
          text: 'Time (UTC)'
        }
      },
      y: {
        type: 'logarithmic',
        title: {
          display: true,
          text: 'X-ray Flux (nW/m²)'
        },
        min: 0.1,
        max: 10000,
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'GOES X-ray Flux (Last 3 Days)',
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            const date = new Date(context[0].parsed.x);
            return date.toLocaleString();
          },
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            
            const value = context.parsed.y;
            
            // Determine flare classification
            let classification = '';
            if (value >= 1000) classification = 'X-class';
            else if (value >= 100) classification = 'M-class';
            else if (value >= 10) classification = 'C-class';
            else if (value >= 1) classification = 'B-class';
            else classification = 'A-class';
            
            label += value.toExponential(2) + ' nW/m² (' + classification + ')';
            return label;
          }
        }
      },
      annotation: {
        annotations: {
          mLine: {
            type: 'line',
            yMin: 100,
            yMax: 100,
            borderColor: 'orange',
            borderWidth: 1,
            borderDash: [5, 5],
            label: {
              content: 'M-class threshold',
              enabled: true,
              position: 'right',
            }
          },
          xLine: {
            type: 'line',
            yMin: 1000,
            yMax: 1000,
            borderColor: 'red',
            borderWidth: 1,
            borderDash: [5, 5],
            label: {
              content: 'X-class threshold',
              enabled: true,
              position: 'right',
            }
          }
        }
      }
    },
  };

  if (loading) return <div className="flex items-center justify-center h-80">Loading X-ray flux data...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Line options={options} data={data} height={300} />
      <div className="mt-4 grid grid-cols-5 gap-2 text-sm text-center">
        <div className="p-1 bg-gray-100 rounded">A-class <br/>&lt;1 nW/m²</div>
        <div className="p-1 bg-blue-100 rounded">B-class <br/>1-10 nW/m²</div>
        <div className="p-1 bg-green-100 rounded">C-class <br/>10-100 nW/m²</div>
        <div className="p-1 bg-yellow-100 rounded">M-class <br/>100-1000 nW/m²</div>
        <div className="p-1 bg-red-100 rounded">X-class <br/>&gt;1000 nW/m²</div>
      </div>
    </div>
  );
}