import { Wind, Droplets, Thermometer, Eye, Waves, Sun } from 'lucide-react';
import type { WeatherData } from '../lib/weather';

interface Props {
  data: WeatherData | null;
  loading: boolean;
}

const WMO_EMOJI: Record<number, string> = {
  0: '☀️', 1: '🌤', 2: '⛅', 3: '☁️',
  45: '🌫', 48: '🌫',
  51: '🌦', 53: '🌧', 55: '🌧',
  61: '🌧', 63: '🌧', 65: '⛈',
  80: '🌧', 81: '🌧', 82: '⛈',
  95: '⛈', 96: '⛈', 99: '⛈',
};

function windBeaufort(mph: number): string {
  if (mph < 1) return 'Calm';
  if (mph < 8) return 'Light';
  if (mph < 15) return 'Gentle';
  if (mph < 25) return 'Moderate';
  if (mph < 32) return 'Fresh';
  return 'Strong';
}

function windArrow(deg: number): string {
  return `rotate(${deg}deg)`;
}

export default function WeatherPanel({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-3 animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-24 mb-3" />
        <div className="h-12 bg-slate-700 rounded mb-2" />
        <div className="h-4 bg-slate-700 rounded w-full mb-1" />
        <div className="h-4 bg-slate-700 rounded w-3/4" />
      </div>
    );
  }

  if (!data) return null;
  const { current, hourly, tides, marine, fishingNotes } = data;

  const weatherEmoji = WMO_EMOJI[current.weatherCode] ?? '🌤';

  const sunriseTime = current.sunrise
    ? new Date(current.sunrise).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : '--';
  const sunsetTime = current.sunset
    ? new Date(current.sunset).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : '--';

  return (
    <div className="space-y-2">
      {/* Main weather card */}
      <div className="bg-slate-800 rounded-xl p-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-3xl font-bold text-white">{current.temp}°F</div>
            <div className="text-slate-400 text-xs">{current.description}</div>
            <div className="text-slate-500 text-xs">Feels {current.feelsLike}°F</div>
          </div>
          <div className="text-4xl">{weatherEmoji}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Wind size={12} className="text-cyan-400" />
            <span>
              <span className="inline-block" style={{ transform: windArrow(current.windDir) }}>↑</span>
              {' '}{current.windSpeed} mph {current.windDirLabel}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Droplets size={12} className="text-blue-400" />
            <span>{current.humidity}% humidity</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Sun size={12} className="text-yellow-400" />
            <span>UV {current.uv} · {current.pressure}" Hg</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Thermometer size={12} className="text-orange-400" />
            <span>Precip {current.precipitation}"</span>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between text-xs text-slate-400">
          <span>🌅 {sunriseTime}</span>
          <span>🌇 {sunsetTime}</span>
        </div>
      </div>

      {/* Marine conditions */}
      {marine && (
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-2 flex items-center gap-1">
            <Waves size={11} /> Marine Conditions
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div>
              <div className="text-cyan-400 font-bold text-base">{marine.waveHeight}'</div>
              <div className="text-slate-500">Wave Ht</div>
            </div>
            <div>
              <div className="text-cyan-400 font-bold text-base">{marine.wavePeriod}s</div>
              <div className="text-slate-500">Period</div>
            </div>
            <div>
              <div className="text-cyan-400 font-bold text-base">{marine.waveDirection}°</div>
              <div className="text-slate-500">Direction</div>
            </div>
          </div>
        </div>
      )}

      {/* Tide predictions */}
      {tides.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">
            🌊 Tide Predictions (Wilmington)
          </div>
          <div className="space-y-1">
            {tides.slice(0, 6).map((tide, i) => {
              const t = new Date(tide.time);
              const isPast = t < new Date();
              const isNext = !isPast && tides.findIndex(t2 => new Date(t2.time) > new Date()) === i;
              return (
                <div
                  key={i}
                  className={`flex justify-between items-center text-xs px-2 py-1 rounded ${
                    isNext ? 'bg-cyan-900/40 border border-cyan-700/40' : isPast ? 'opacity-40' : ''
                  }`}
                >
                  <span className={`font-medium ${tide.type === 'H' ? 'text-blue-400' : 'text-slate-400'}`}>
                    {tide.type === 'H' ? '▲ High' : '▼ Low'}
                  </span>
                  <span className="text-slate-300">
                    {t.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </span>
                  <span className="text-slate-400">{tide.height.toFixed(1)} ft</span>
                  {isNext && <span className="text-cyan-400 text-xs">Next</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hourly forecast mini */}
      <div className="bg-slate-800 rounded-xl p-3">
        <div className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">
          24-Hour Forecast
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {hourly.slice(0, 12).map((h, i) => {
            const t = new Date(h.time);
            const hour = t.getHours();
            const label = hour === 0 ? '12a' : hour < 12 ? `${hour}a` : hour === 12 ? '12p' : `${hour - 12}p`;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5 min-w-[32px] text-center">
                <span className="text-slate-500 text-[9px]">{label}</span>
                <span className="text-xs">{WMO_EMOJI[h.weatherCode] ?? '🌤'}</span>
                <span className="text-slate-300 text-[10px]">{h.temp}°</span>
                <span className="text-cyan-400 text-[9px]">{h.windSpeed}</span>
                {h.precipProb > 20 && (
                  <span className="text-blue-400 text-[9px]">{h.precipProb}%</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fishing condition notes */}
      <div className="bg-slate-800 rounded-xl p-3">
        <div className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">
          📋 Condition Notes
        </div>
        <ul className="space-y-1">
          {fishingNotes.map((note, i) => (
            <li key={i} className="text-slate-300 text-xs flex items-start gap-1.5">
              <span className="text-cyan-500 mt-0.5">•</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
