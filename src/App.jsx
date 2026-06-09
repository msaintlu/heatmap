import { useState, useEffect } from "react";
import { rollups, mean } from "d3-array";
import { ResponsiveHeatmap } from "./vizcomponents/Heatmap";



const MARGIN = { top: 50, right: 0, bottom: 70, left: 50 };


const YEAR_START = new Date("2025-01-01");
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

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
  const [heatmapData, setHeatmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(url);
      const json = await response.json();

      // 1. Flatten the array of cities into long daily rows.
      //    Tag each row with its 7-day bucket index (0 = first week, 51 = last).
      //    The Math.min folds Dec 31 into week 51 so we get exactly 52 columns.
      const daily = json.flatMap((city, i) =>
        city.daily.time.map((t, j) => ({
          city: CITIES[i].name,
          week: Math.min(51, Math.floor((new Date(t) - YEAR_START) / WEEK_MS)),
          temp: city.daily.temperature_2m_mean[j],
        }))
      );

      // 2. Average the daily temperatures per city and per week.
      const dataForHeatmap = rollups(
        daily,
        (v) => mean(v, (d) => d.temp),
        (d) => d.city,
        (d) => d.week
      ).flatMap(([city, weeks]) =>
        weeks.map(([week, value]) => ({ city, week, value }))
      ); // -> [{ city: 'Reykjavik', week: 0, value: -0.4 }, ...] : 20 x 52 cells

      setHeatmapData(dataForHeatmap);
      setIsLoading(false);
     };
    fetchData();
  }, []);
  console.log(isLoading)
  console.log(heatmapData)

  if (isLoading) return <div style={{ marginLeft: 50}} > Loading... </div> ;

  return (
  <>
    <div
      style={{
        height: 70,
        fontWeight: "bolder",
        marginLeft: 50,
        fontSize: 26,
      }}
    >
      <p>
        Temperature heatmap
        </p>
    </div>
    <div
      style={{
        height: 600,
        backgroundColor: "lightgrey",
        marginLeft: 50,
      }}
    >
      <ResponsiveHeatmap
        data={heatmapData}
        MARGIN={MARGIN}
      />
    </div>
  </>
);
}

export default App
