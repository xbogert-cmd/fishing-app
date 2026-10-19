// Solunar theory: fishing activity peaks when moon is overhead/underfoot and at moonrise/moonset.
// Best days are near new moon and full moon.

export interface SolunarPeriod {
  label: string;
  start: Date;
  end: Date;
  type: 'major' | 'minor';
}

export interface SolunarResult {
  moonPhaseAngle: number;    // 0-360 (0=new, 180=full)
  moonPhaseName: string;
  moonPhaseEmoji: string;
  illumination: number;      // 0-100
  periods: SolunarPeriod[];
  dayRating: number;         // 1-5 stars
  dayRatingLabel: string;
  currentPeriod: SolunarPeriod | null;
  nextPeriod: SolunarPeriod | null;
}

function daysFromJ2000(date: Date): number {
  return (date.getTime() / 86400000) - 10957.5;
}

function degToRad(d: number): number { return d * Math.PI / 180; }

function normalizeDeg(d: number): number { return ((d % 360) + 360) % 360; }

function moonPhaseAngle(date: Date): number {
  const d = daysFromJ2000(date);
  const moonLon = normalizeDeg(218.316 + 13.176396 * d + 6.289 * Math.sin(degToRad(normalizeDeg(134.963 + 13.064993 * d))));
  const sunLon = normalizeDeg(280.460 + 0.985647 * d + 1.915 * Math.sin(degToRad(normalizeDeg(357.529 + 0.985600 * d))));
  return normalizeDeg(moonLon - sunLon);
}

function solarNoon(date: Date, lon: number): Date {
  // Approximate solar noon for longitude (timezone-agnostic)
  const d = daysFromJ2000(date);
  const eot = -7.655 * Math.sin(degToRad(0.9856 * d - 3.289)); // Equation of time minutes approx
  const noonUTC = 12 - lon / 15 - eot / 60;
  const result = new Date(date);
  const h = Math.floor(noonUTC);
  const m = Math.round((noonUTC - h) * 60);
  result.setUTCHours(h, m, 0, 0);
  return result;
}

function hoursToMs(h: number): number { return h * 3600000; }

function moonPhaseName(angle: number): { name: string; emoji: string } {
  if (angle < 22.5 || angle >= 337.5) return { name: 'New Moon', emoji: '🌑' };
  if (angle < 67.5) return { name: 'Waxing Crescent', emoji: '🌒' };
  if (angle < 112.5) return { name: 'First Quarter', emoji: '🌓' };
  if (angle < 157.5) return { name: 'Waxing Gibbous', emoji: '🌔' };
  if (angle < 202.5) return { name: 'Full Moon', emoji: '🌕' };
  if (angle < 247.5) return { name: 'Waning Gibbous', emoji: '🌖' };
  if (angle < 292.5) return { name: 'Last Quarter', emoji: '🌗' };
  return { name: 'Waning Crescent', emoji: '🌘' };
}

function dayRating(angle: number): { stars: number; label: string } {
  // Peak activity near new (0°) and full (180°) moon
  const distFromOptimal = Math.min(
    Math.abs(angle),
    Math.abs(angle - 180),
    Math.abs(angle - 360)
  );
  if (distFromOptimal < 15) return { stars: 5, label: 'Outstanding' };
  if (distFromOptimal < 30) return { stars: 4, label: 'Excellent' };
  if (distFromOptimal < 60) return { stars: 3, label: 'Good' };
  if (distFromOptimal < 90) return { stars: 2, label: 'Fair' };
  return { stars: 1, label: 'Slow' };
}

export function getSolunar(date: Date, lat: number, lon: number): SolunarResult {
  const angle = moonPhaseAngle(date);
  const phaseInfo = moonPhaseName(angle);
  const illumination = Math.round((1 - Math.cos(degToRad(angle))) / 2 * 100);
  const rating = dayRating(angle);

  // Moon's age in synodic cycle (0-29.53 days)
  const moonAge = (angle / 360) * 29.53059;

  // Upper transit: moon crosses meridian overhead
  // At age=0 (new), transits ~solar noon. At age=14.77 (full), transits ~midnight.
  // Shift: +24.8206h per full cycle ≈ +50 min/day
  const noon = solarNoon(date, lon);
  const upperTransitMs = noon.getTime() + hoursToMs((moonAge / 29.53059) * 24.8206);
  const lowerTransitMs = upperTransitMs + hoursToMs(12.4103);

  // Moonrise/moonset approximate (upper transit ± 6.2h)
  const moonriseMs = upperTransitMs - hoursToMs(6.2);
  const moonsetMs = upperTransitMs + hoursToMs(6.2);

  const periods: SolunarPeriod[] = ([
    {
      label: 'Major (Overhead)',
      start: new Date(upperTransitMs - hoursToMs(1)),
      end: new Date(upperTransitMs + hoursToMs(1)),
      type: 'major' as const,
    },
    {
      label: 'Minor (Moonrise)',
      start: new Date(moonriseMs - hoursToMs(0.5)),
      end: new Date(moonriseMs + hoursToMs(0.5)),
      type: 'minor' as const,
    },
    {
      label: 'Major (Underfoot)',
      start: new Date(lowerTransitMs - hoursToMs(1)),
      end: new Date(lowerTransitMs + hoursToMs(1)),
      type: 'major' as const,
    },
    {
      label: 'Minor (Moonset)',
      start: new Date(moonsetMs - hoursToMs(0.5)),
      end: new Date(moonsetMs + hoursToMs(0.5)),
      type: 'minor' as const,
    },
  ] as SolunarPeriod[]).sort((a, b) => a.start.getTime() - b.start.getTime());

  const now = date.getTime();
  const currentPeriod = periods.find(p => now >= p.start.getTime() && now <= p.end.getTime()) ?? null;
  const nextPeriod = periods.find(p => p.start.getTime() > now) ?? null;

  return {
    moonPhaseAngle: angle,
    moonPhaseName: phaseInfo.name,
    moonPhaseEmoji: phaseInfo.emoji,
    illumination,
    periods,
    dayRating: rating.stars,
    dayRatingLabel: rating.label,
    currentPeriod,
    nextPeriod,
  };
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function timeUntil(date: Date): string {
  const diff = date.getTime() - Date.now();
  if (diff < 0) return 'past';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 0) return `in ${h}h ${m}m`;
  return `in ${m}m`;
}
