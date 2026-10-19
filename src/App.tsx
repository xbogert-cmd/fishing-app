import { useEffect, useState, useCallback } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import WeatherPanel from './components/WeatherPanel';
import SolunarPanel from './components/SolunarPanel';
import FishGuide from './components/FishGuide';
import SocialFeed from './components/SocialFeed';
import { fetchWeatherData, type WeatherData } from './lib/weather';
import type { FishingSpot } from './lib/spots';

// Default to Wilmington, NC if GPS unavailable
const WILMINGTON: [number, number] = [34.2257, -77.9447];

export default function App() {
  const [location, setLocation] = useState<[number, number]>(WILMINGTON);
  const [locationName, setLocationName] = useState('Detecting location...');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<FishingSpot | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activePanel, setActivePanel] = useState<'left' | 'right' | null>(null);

  // Get GPS location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationName('Wilmington, NC (default)');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLocation([lat, lon]);
        // Determine area name
        if (lon > -79) setLocationName('Wilmington Area');
        else if (lat > 35) setLocationName('Charlotte / Lake Norman');
        else setLocationName(`${lat.toFixed(2)}, ${lon.toFixed(2)}`);
      },
      () => setLocationName('Wilmington, NC (default)'),
      { timeout: 8000, enableHighAccuracy: false }
    );
  }, []);

  const loadWeather = useCallback(async () => {
    setWeatherLoading(true);
    try {
      const data = await fetchWeatherData(location[0], location[1]);
      setWeather(data);
      setLastUpdated(new Date());
    } catch (e) {
      console.error('Weather fetch failed:', e);
    } finally {
      setWeatherLoading(false);
    }
  }, [location]);

  // Load weather when location changes
  useEffect(() => { loadWeather(); }, [loadWeather]);

  // Auto-refresh every 15 minutes
  useEffect(() => {
    const interval = setInterval(loadWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadWeather]);

  void locationName;

  return (
    <div className="h-screen bg-slate-900 text-slate-100 flex flex-col overflow-hidden">
      <Header
        lat={location[0]}
        lon={location[1]}
        loading={weatherLoading}
        onRefresh={loadWeather}
        fishingRating={weather?.fishingRating ?? 0}
        lastUpdated={lastUpdated}
      />

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar */}
        <div
          className={`
            transition-all duration-200 overflow-y-auto bg-slate-900 border-r border-slate-700/50
            hidden md:block md:w-[270px] space-y-2 p-2
          `}
        >
          <WeatherPanel data={weather} loading={weatherLoading} />
          <SolunarPanel lat={location[0]} lon={location[1]} />
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapView center={location} onSpotSelect={setSelectedSpot} />

          {/* Mobile panel toggles */}
          <div className="absolute top-2 left-2 z-[1000] flex gap-1 md:hidden">
            <button
              onClick={() => setActivePanel(activePanel === 'left' ? null : 'left')}
              className="bg-slate-800/90 backdrop-blur border border-slate-700 text-xs px-2 py-1 rounded"
            >
              🌤 Weather
            </button>
            <button
              onClick={() => setActivePanel(activePanel === 'right' ? null : 'right')}
              className="bg-slate-800/90 backdrop-blur border border-slate-700 text-xs px-2 py-1 rounded"
            >
              🐟 Fish
            </button>
          </div>

          {/* Mobile overlays */}
          {activePanel === 'left' && (
            <div className="absolute inset-0 z-[999] bg-slate-900/95 overflow-y-auto p-3 md:hidden">
              <button onClick={() => setActivePanel(null)} className="mb-2 text-slate-400 text-sm">✕ Close</button>
              <WeatherPanel data={weather} loading={weatherLoading} />
              <div className="mt-2">
                <SolunarPanel lat={location[0]} lon={location[1]} />
              </div>
            </div>
          )}
          {activePanel === 'right' && (
            <div className="absolute inset-0 z-[999] bg-slate-900/95 overflow-y-auto p-3 md:hidden">
              <button onClick={() => setActivePanel(null)} className="mb-2 text-slate-400 text-sm">✕ Close</button>
              <FishGuide lat={location[0]} lon={location[1]} selectedSpot={selectedSpot} />
              <div className="mt-2">
                <SocialFeed />
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="hidden md:block md:w-[300px] overflow-y-auto bg-slate-900 border-l border-slate-700/50 space-y-2 p-2">
          <FishGuide lat={location[0]} lon={location[1]} selectedSpot={selectedSpot} />
          <SocialFeed />
        </div>
      </div>
    </div>
  );
}
