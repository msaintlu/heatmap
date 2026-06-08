import { useState, useEffect } from "react";

// 20 cities, ordered from the far north to the far south.
// Keeping them sorted by latitude is what makes the heatmap readable.
const CITIES = [
  { name: 'Reykjavik', lat: 64.15, lon: -21.94 },
  { name: 'Anchorage', lat: 61.22, lon: -149.9 },
  { name: 'Oslo', lat: 59.91, lon: 10.75 },
  { name: 'Moscow', lat: 55.75, lon: 37.62 },
  { name: 'London', lat: 51.51, lon: -0.13 },
  { name: 'Paris', lat: 48.85, lon: 2.35 },
  { name: 'New York', lat: 40.71, lon: -74.01 },
  { name: 'Tokyo', lat: 35.68, lon: 139.65 },
  { name: 'Los Angeles', lat: 34.05, lon: -118.24 },
  { name: 'Cairo', lat: 30.04, lon: 31.24 },
  { name: 'Delhi', lat: 28.61, lon: 77.21 },
  { name: 'Mexico City', lat: 19.43, lon: -99.13 },
  { name: 'Mumbai', lat: 19.08, lon: 72.88 },
  { name: 'Bangkok', lat: 13.76, lon: 100.5 },
  { name: 'Singapore', lat: 1.35, lon: 103.82 },
  { name: 'Nairobi', lat: -1.29, lon: 36.82 },
  { name: 'Jakarta', lat: -6.21, lon: 106.85 },
  { name: 'Lima', lat: -12.05, lon: -77.04 },
  { name: 'Rio de Janeiro', lat: -22.91, lon: -43.17 },
  { name: 'Cape Town', lat: -33.92, lon: 18.42 },
];

// The Archive API serves historical data (not the forecast one).
// Comma-separated coordinates = all 20 cities in ONE request.
const url =
  'https://archive-api.open-meteo.com/v1/archive' +
  '?latitude=' + CITIES.map((c) => c.lat).join(',') +
  '&longitude=' + CITIES.map((c) => c.lon).join(',') +
  '&start_date=2025-01-01&end_date=2025-12-31' +
  '&daily=temperature_2m_mean&timezone=auto';

console.log(url)

function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(url);
      const json = await response.json();
      setData(json);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  console.log(data);

  return (
    <>
      <div>
        <p
          style={{
            fontWeight: "bolder",
            fontSize: 26,
            marginLeft: 50,
            marginTop: 50,
            marginBottom: 20,
          }}
        >
          Temperature heatmap
        </p>
      </div>
    </>
  );
}

export default App
