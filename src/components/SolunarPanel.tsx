import { getSolunar, formatTime, timeUntil } from '../lib/solunar';

interface Props {
  lat: number;
  lon: number;
}

const STAR_COLORS = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-lime-400', 'text-green-400'];

function Stars({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`text-sm ${i < count ? 'text-yellow-400' : 'text-slate-700'}`}>★</span>
      ))}
    </div>
  );
}

export default function SolunarPanel({ lat, lon }: Props) {
  const now = new Date();
  const sol = getSolunar(now, lat, lon);

  const illuminationBar = Math.round(sol.illumination);

  return (
    <div className="space-y-2">
      {/* Moon Phase */}
      <div className="bg-slate-800 rounded-xl p-3">
        <div className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-3">
          🌙 Moon & Solunar
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="text-5xl">{sol.moonPhaseEmoji}</div>
          <div>
            <div className="text-white font-semibold text-sm">{sol.moonPhaseName}</div>
            <div className="text-slate-400 text-xs">{sol.illumination}% illuminated</div>
            <div className="mt-1">
              <Stars count={sol.dayRating} />
            </div>
            <div className={`text-xs font-medium mt-0.5 ${STAR_COLORS[sol.dayRating]}`}>
              {sol.dayRatingLabel} Fishing Day
            </div>
          </div>
        </div>

        {/* Illumination bar */}
        <div className="rating-bar mb-3">
          <div
            className="rating-fill bg-gradient-to-r from-slate-600 to-yellow-300"
            style={{ width: `${illuminationBar}%` }}
          />
        </div>

        {/* Current period alert */}
        {sol.currentPeriod && (
          <div className="active-period bg-green-900/30 border border-green-600/40 rounded-lg p-2 mb-2 text-xs">
            <div className="text-green-400 font-semibold">🔥 Active Now: {sol.currentPeriod.label}</div>
            <div className="text-green-300">Ends {formatTime(sol.currentPeriod.end)}</div>
          </div>
        )}

        {/* Next period */}
        {sol.nextPeriod && !sol.currentPeriod && (
          <div className="bg-slate-700/40 border border-slate-600/40 rounded-lg p-2 mb-2 text-xs">
            <div className="text-slate-300 font-medium">
              Next: {sol.nextPeriod.label}
            </div>
            <div className="text-cyan-400">{formatTime(sol.nextPeriod.start)} · {timeUntil(sol.nextPeriod.start)}</div>
          </div>
        )}
      </div>

      {/* Solunar periods */}
      <div className="bg-slate-800 rounded-xl p-3">
        <div className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">
          Solunar Periods Today
        </div>
        <div className="space-y-1.5">
          {sol.periods.map((period, i) => {
            const now_ts = Date.now();
            const isActive = now_ts >= period.start.getTime() && now_ts <= period.end.getTime();
            const isPast = now_ts > period.end.getTime();
            return (
              <div
                key={i}
                className={`flex items-center justify-between text-xs rounded-lg px-2 py-1.5 ${
                  isActive
                    ? 'bg-green-900/40 border border-green-600/30'
                    : isPast
                    ? 'opacity-40 bg-slate-700/30'
                    : 'bg-slate-700/30'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={period.type === 'major' ? 'text-yellow-400' : 'text-slate-400'}>
                    {period.type === 'major' ? '●' : '○'}
                  </span>
                  <span className={`font-medium ${isActive ? 'text-green-300' : 'text-slate-300'}`}>
                    {period.label}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-slate-300">{formatTime(period.start)} – {formatTime(period.end)}</div>
                  {isActive && <div className="text-green-400 font-semibold">NOW</div>}
                  {!isActive && !isPast && (
                    <div className="text-slate-500">{timeUntil(period.start)}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-2 pt-2 border-t border-slate-700 text-xs text-slate-500">
          <span className="text-yellow-400">●</span> Major = 2hr window ·
          <span className="text-slate-400 ml-1">○</span> Minor = 1hr window
        </div>
      </div>
    </div>
  );
}
