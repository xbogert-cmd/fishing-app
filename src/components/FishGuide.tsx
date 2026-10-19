import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { getFishForLocation, isInSeason, type FishSpecies } from '../lib/fishData';
import type { FishingSpot } from '../lib/spots';

interface Props {
  lat: number;
  lon: number;
  selectedSpot: FishingSpot | null;
}

function FishCard({ fish, expanded, onToggle }: { fish: FishSpecies; expanded: boolean; onToggle: () => void }) {
  const inSeason = isInSeason(fish);
  return (
    <div className={`rounded-lg border transition-colors ${
      inSeason ? 'border-cyan-700/40 bg-slate-700/40' : 'border-slate-700/30 bg-slate-800/30'
    }`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{fish.emoji}</span>
          <div>
            <div className="text-sm font-medium text-slate-200">{fish.name}</div>
            {fish.commonName && fish.commonName !== fish.name && (
              <div className="text-xs text-slate-500">{fish.commonName}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {inSeason ? (
            <span className="text-xs bg-green-900/50 text-green-400 border border-green-700/40 px-1.5 py-0.5 rounded-full">
              In Season
            </span>
          ) : (
            <span className="text-xs bg-slate-700/50 text-slate-500 px-1.5 py-0.5 rounded-full">
              Off Season
            </span>
          )}
          {expanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 text-xs">
          <div className="border-t border-slate-700/50 pt-2" />

          <div>
            <div className="text-slate-400 font-medium mb-1">Best Baits</div>
            <div className="flex flex-wrap gap-1">
              {fish.topBaits.map(b => (
                <span key={b} className="bg-amber-900/30 text-amber-300 border border-amber-700/30 px-1.5 py-0.5 rounded">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {fish.topLures.length > 0 && (
            <div>
              <div className="text-slate-400 font-medium mb-1">Top Lures</div>
              <div className="flex flex-wrap gap-1">
                {fish.topLures.map(l => (
                  <span key={l} className="bg-purple-900/30 text-purple-300 border border-purple-700/30 px-1.5 py-0.5 rounded">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="text-slate-400 font-medium mb-1">Techniques</div>
            <ul className="space-y-0.5">
              {fish.techniques.map(t => (
                <li key={t} className="text-slate-300 flex items-start gap-1">
                  <span className="text-cyan-500 mt-0.5">•</span>{t}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-slate-400 font-medium mb-0.5">Best Time</div>
              <div className="text-slate-300">{fish.bestTimeOfDay.join(', ')}</div>
            </div>
            <div>
              <div className="text-slate-400 font-medium mb-0.5">Water Temp</div>
              <div className="text-slate-300">{fish.waterTemp.min}–{fish.waterTemp.max}°F</div>
            </div>
          </div>

          <div>
            <div className="text-slate-400 font-medium mb-0.5">Size / Limits</div>
            <div className="text-slate-300">{fish.sizeInfo}</div>
          </div>

          <div className="bg-slate-700/30 rounded p-1.5 text-slate-400 italic">{fish.notes}</div>
        </div>
      )}
    </div>
  );
}

export default function FishGuide({ lat, lon, selectedSpot }: Props) {
  const [activeTab, setActiveTab] = useState<'saltwater' | 'freshwater'>(() =>
    lon > -79 ? 'saltwater' : 'freshwater'
  );
  const [expandedFish, setExpandedFish] = useState<string | null>(null);

  const { saltwater, freshwater } = getFishForLocation(lat, lon);
  const fish = activeTab === 'saltwater' ? saltwater : freshwater;

  const spotFish = selectedSpot?.targetSpecies ?? [];

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-slate-700">
        <div className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">
          🐟 Fish Guide
        </div>

        {selectedSpot && (
          <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-lg p-2 mb-2 text-xs">
            <div className="text-cyan-400 font-medium">{selectedSpot.name}</div>
            <div className="text-slate-400">Target: {spotFish.join(', ')}</div>
          </div>
        )}

        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('saltwater')}
            className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${
              activeTab === 'saltwater'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            🌊 Saltwater
          </button>
          <button
            onClick={() => setActiveTab('freshwater')}
            className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${
              activeTab === 'freshwater'
                ? 'bg-cyan-700 text-white'
                : 'bg-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            🏞 Freshwater
          </button>
        </div>
      </div>

      <div className="p-2 space-y-1 max-h-[420px] overflow-y-auto">
        {fish.map(f => (
          <FishCard
            key={f.name}
            fish={f}
            expanded={expandedFish === f.name}
            onToggle={() => setExpandedFish(expandedFish === f.name ? null : f.name)}
          />
        ))}
      </div>
    </div>
  );
}
