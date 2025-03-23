"use client";

import React, { useEffect, useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export default function SolarWindChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSolarWindData() {
      try {
        setLoading(true);
        const response = await fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json');
        
        if (!response.ok) {
          throw new Error('Failed to fetch solar wind data');
        }
        
        const rawData = await response.json();
        // The first element is the header, so we skip it
        const dataPoints = rawData.slice(1);
        
        // Transform the data for Chart.js
        const timestamps = dataPoints.map(point => new Date(point[0]));
        const density = dataPoints.map(point => parseFloat(point[1]));
        const speed = dataPoints.map(point => parseFloat(point[2]));
        const temperature = dataPoints.map(point => parseFloat(point[3]));
        
        setData({
          labels: timestamps,
          datasets: [
            {
              label: 'Density (p/cm³)',
              data: density,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              yAxisID: 'y',
            },
            {
              label: 'Speed (km/s)',
              data: speed,
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              yAxisID: 'y1',
            }
          ],
        });
      } catch (err) {
        console.error("Error fetching solar wind data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSolarWindData();
  }, []);

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          tooltipFormat: 'MMM d, h:mm a',
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
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Density (p/cm³)'
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Speed (km/s)'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Solar Wind Plasma Parameters (24 Hour)',
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            const date = new Date(context[0].parsed.x);
            return date.toLocaleString();
          }
        }
      }
    },
  };

  if (loading) return <div className="flex items-center justify-center h-80">Loading solar wind data...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Line options={options} data={data} height={300} />
    </div>
  );
}