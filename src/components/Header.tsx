import { MapPin, RefreshCw } from 'lucide-react';

interface Props {
  lat: number;
  lon: number;
  loading: boolean;
  onRefresh: () => void;
  fishingRating: number;
  lastUpdated: Date | null;
}

const RATING_COLORS = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
const RATING_LABELS = ['', 'Slow', 'Fair', 'Good', 'Excellent', 'Outstanding'];

export default function Header({ lat, lon, loading, onRefresh, fishingRating, lastUpdated }: Props) {
  const isWilmington = lon > -79;
  const area = isWilmington ? 'Wilmington / Coast' : 'Charlotte / Lake Norman';

  return (
    <header className="bg-slate-900 border-b border-slate-700 px-4 py-2 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🎣</span>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">Carolina Fishing Guide</h1>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <MapPin size={11} />
            <span>{area}</span>
            <span className="text-slate-600 ml-1">{lat.toFixed(3)}, {lon.toFixed(3)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {fishingRating > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Today's Fishing:</span>
            <div className={`${RATING_COLORS[fishingRating]} text-white text-xs font-bold px-2 py-1 rounded-full`}>
              {RATING_LABELS[fishingRating]}
            </div>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <div
                  key={i}
                  className={`w-2 h-4 rounded-sm ${i <= fishingRating ? RATING_COLORS[fishingRating] : 'bg-slate-700'}`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="text-slate-500 text-xs">
          {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}` : ''}
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-slate-400 hover:text-cyan-400 transition-colors p-1 rounded"
          title="Refresh data"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
    </header>
  );
}
