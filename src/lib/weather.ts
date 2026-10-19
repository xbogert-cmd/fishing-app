export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  windSpeed: number;
  windDir: number;
  windDirLabel: string;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  description: string;
  uv: number;
  sunrise: string;
  sunset: string;
  pressure: number;
  visibility: number;
}

export interface HourlyWeather {
  time: string;
  temp: number;
  windSpeed: number;
  precipProb: number;
  weatherCode: number;
}

export interface TidePrediction {
  time: string;
  height: number;
  type: 'H' | 'L';
}

export interface MarineConditions {
  waveHeight: number;
  waveDirection: number;
  wavePeriod: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyWeather[];
  tides: TidePrediction[];
  marine: MarineConditions | null;
  fishingRating: number;   // 1-5
  fishingNotes: string[];
}

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
  80: 'Rain showers', 81: 'Showers', 82: 'Heavy showers',
  95: 'Thunderstorm', 96: 'Thunderstorm w/ hail', 99: 'Severe thunderstorm',
};

function windDirLabel(deg: number): string {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

function assessFishingConditions(w: CurrentWeather, tides: TidePrediction[]): { rating: number; notes: string[] } {
  const notes: string[] = [];
  let score = 5;

  // Wind: 5-15 mph ideal; <5 can mean calm/slow; >20 mph tough
  if (w.windSpeed < 5) { notes.push('Light winds — fish may be less active'); score -= 0.5; }
  else if (w.windSpeed <= 15) notes.push(`Good wind ${w.windSpeed} mph ${w.windDirLabel} — ideal chop`);
  else if (w.windSpeed <= 25) { notes.push(`Moderate wind ${w.windSpeed} mph — manageable`); score -= 1; }
  else { notes.push(`High winds ${w.windSpeed} mph — tough conditions`); score -= 2; }

  // Pressure: stable or rising is good, rapidly falling = feeding frenzy before storm
  if (w.pressure > 1015) notes.push('High pressure — bass may be deeper');
  else if (w.pressure < 1005) { notes.push('Low/falling pressure — pre-frontal feeding! 🔥'); score += 0.5; }

  // Weather
  if (w.weatherCode >= 80) { notes.push('Rain/storm — seek shelter, fish may still bite'); score -= 1; }
  else if (w.weatherCode >= 3) notes.push('Overcast — topwater and bright lures work great');
  else notes.push('Clear sky — fish deeper or in shade');

  // UV/time of day
  if (w.uv > 8) notes.push('High UV — fish deep, dawn/dusk best');

  // Next tide info
  const nextTide = tides.find(t => new Date(t.time) > new Date());
  if (nextTide) {
    const tideType = nextTide.type === 'H' ? 'High' : 'Low';
    const hours = Math.round((new Date(nextTide.time).getTime() - Date.now()) / 3600000 * 10) / 10;
    notes.push(`Next ${tideType} tide in ${hours}h — fish the transition!`);
    if (hours < 1) { notes.push('Tidal transition NOW — prime fishing window! 🔥'); score += 1; }
  }

  return { rating: Math.max(1, Math.min(5, Math.round(score))), notes };
}

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
    + `&current=temperature_2m,apparent_temperature,relative_humidity_2m,windspeed_10m,winddirection_10m,precipitation,weathercode,surface_pressure`
    + `&hourly=temperature_2m,windspeed_10m,precipitation_probability,weathercode`
    + `&daily=sunrise,sunset,uv_index_max`
    + `&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch`
    + `&timezone=America%2FNew_York&forecast_days=2`;

  const [weatherRes] = await Promise.all([fetch(weatherUrl)]);
  const weather = await weatherRes.json();

  const c = weather.current;
  const daily = weather.daily;
  const isCoastal = lon > -79;

  // Marine data for coastal areas
  let marine: MarineConditions | null = null;
  if (isCoastal) {
    try {
      const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}`
        + `&current=wave_height,wave_direction,wave_period`
        + `&length_unit=imperial`;
      const marineRes = await fetch(marineUrl);
      const marineData = await marineRes.json();
      if (marineData.current) {
        marine = {
          waveHeight: Math.round(marineData.current.wave_height * 10) / 10,
          waveDirection: marineData.current.wave_direction,
          wavePeriod: marineData.current.wave_period,
        };
      }
    } catch { /* marine data unavailable */ }
  }

  // Tide predictions from NOAA — Wilmington station 8658120
  let tides: TidePrediction[] = [];
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10).replace(/-/g, '');
  try {
    const tideUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter`
      + `?begin_date=${today}&end_date=${tomorrow}&station=8658120`
      + `&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&format=json`;
    const tideRes = await fetch(tideUrl);
    const tideData = await tideRes.json();
    if (tideData.predictions) {
      tides = tideData.predictions.map((p: { t: string; v: string; type: string }) => ({
        time: p.t,
        height: parseFloat(p.v),
        type: p.type as 'H' | 'L',
      }));
    }
  } catch { /* tides unavailable */ }

  const current: CurrentWeather = {
    temp: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    windSpeed: Math.round(c.windspeed_10m),
    windDir: c.winddirection_10m,
    windDirLabel: windDirLabel(c.winddirection_10m),
    humidity: c.relative_humidity_2m,
    precipitation: c.precipitation,
    weatherCode: c.weathercode,
    description: WMO_DESCRIPTIONS[c.weathercode] ?? 'Unknown',
    uv: daily?.uv_index_max?.[0] ?? 0,
    sunrise: daily?.sunrise?.[0] ?? '',
    sunset: daily?.sunset?.[0] ?? '',
    pressure: Math.round(c.surface_pressure * 0.02953), // hPa to inHg
    visibility: 10,
  };

  const nowHour = new Date().getHours();
  const hourly: HourlyWeather[] = weather.hourly.time
    .map((t: string, i: number) => ({
      time: t,
      temp: Math.round(weather.hourly.temperature_2m[i]),
      windSpeed: Math.round(weather.hourly.windspeed_10m[i]),
      precipProb: weather.hourly.precipitation_probability[i],
      weatherCode: weather.hourly.weathercode[i],
    }))
    .slice(nowHour, nowHour + 24);

  const { rating, notes } = assessFishingConditions(current, tides);

  return { current, hourly, tides, marine, fishingRating: rating, fishingNotes: notes };
}
