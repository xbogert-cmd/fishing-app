import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { FISHING_SPOTS, getSpotTypeColor, getSpotTypeIcon, type FishingSpot, type SpotType } from '../lib/spots';
import { NC_FISH } from '../lib/fishData';
import { PLACES, PARK_TYPE_ICON, PARK_TYPE_COLOR, type ParkType } from '../lib/parks';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Props {
  center: [number, number];
  onSpotSelect: (spot: FishingSpot | null) => void;
}

const SPOT_TYPES: SpotType[] = ['inlet', 'surf', 'pier', 'river', 'lake', 'marsh', 'icw', 'offshore'];
const FISH_SHOW_ZOOM = 11;

// ── Helpers ──────────────────────────────────────────────────────────────────

function hashNum(s: string): number {
  return s.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 0);
}

function spotRatingScore(spot: FishingSpot): number {
  const month = new Date().getMonth() + 1;
  const n = spot.targetSpecies.filter(name => NC_FISH.find(f => f.name === name)?.bestMonths.includes(month)).length;
  return n / Math.max(spot.targetSpecies.length, 1);
}

// ── Marker factories ──────────────────────────────────────────────────────────

function createSpotMarker(spot: FishingSpot): L.DivIcon {
  const color = getSpotTypeColor(spot.type);
  const icon = getSpotTypeIcon(spot.type);
  const score = spotRatingScore(spot);
  const glow = score > 0.6 ? '#22c55e' : score > 0.3 ? '#eab308' : '#94a3b8';
  const size = spot.rating >= 5 ? 34 : spot.rating >= 4 ? 30 : 26;
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;background:${color}22;border:2px solid ${color};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${size * 0.5}px;cursor:pointer;box-shadow:0 0 8px ${glow}60;" title="${spot.name}">${icon}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function createUserMarker(): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(59,130,246,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function createFishMarker(emoji: string, dur: number, delay: number): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div class="fish-swim" style="--dur:${dur}s;--delay:${delay}s"><span class="fish-face">${emoji}</span></div>`,
    iconSize: [28, 20],
    iconAnchor: [14, 10],
  });
}

function createParkMarker(type: ParkType): L.DivIcon {
  const color = PARK_TYPE_COLOR[type];
  const icon = PARK_TYPE_ICON[type];
  const size = type === 'bait_shop' ? 24 : 26;
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;background:${color}18;border:1.5px solid ${color}88;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;">${icon}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// ── Popup HTML ────────────────────────────────────────────────────────────────

function spotPopup(spot: FishingSpot): string {
  const month = new Date().getMonth() + 1;
  const inSeason = spot.targetSpecies.filter(n => NC_FISH.find(f => f.name === n)?.bestMonths.includes(month));
  const stars = '★'.repeat(spot.rating) + '☆'.repeat(5 - spot.rating);
  const boat = spot.boatNeeded
    ? `<span style="background:#7f1d1d;color:#fca5a5;padding:2px 6px;border-radius:4px;font-size:10px">Boat needed</span>`
    : `<span style="background:#14532d;color:#86efac;padding:2px 6px;border-radius:4px;font-size:10px">Shore access</span>`;
  return `
    <div style="min-width:200px;max-width:260px">
      <div style="font-weight:700;font-size:13px;color:#f1f5f9;margin-bottom:4px">${spot.name}</div>
      <div style="color:#eab308;font-size:12px;margin-bottom:6px">${stars}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">${boat}<span style="background:#1e3a5f;color:#7dd3fc;padding:2px 6px;border-radius:4px;font-size:10px">${spot.type}</span></div>
      <div style="color:#94a3b8;font-size:11px;margin-bottom:4px">Best: ${spot.bestSeason}${spot.bestTide ? ` · Tide: ${spot.bestTide}` : ''}</div>
      ${inSeason.length > 0 ? `<div style="color:#4ade80;font-size:11px;margin-top:4px">🔥 In season: ${inSeason.join(', ')}</div>` : ''}
      <div style="color:#64748b;font-size:10px;margin-top:6px;border-top:1px solid #334155;padding-top:6px">Target: ${spot.targetSpecies.join(', ')}</div>
      <div style="color:#94a3b8;font-size:11px;margin-top:4px;font-style:italic">${spot.notes}</div>
    </div>`;
}

function parkPopup(p: (typeof PLACES)[0]): string {
  const typeLabel = p.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  return `
    <div style="min-width:180px;max-width:240px">
      <div style="font-weight:700;font-size:13px;color:#f1f5f9;margin-bottom:4px">${p.name}</div>
      <div style="display:inline-block;background:${PARK_TYPE_COLOR[p.type]}22;color:${PARK_TYPE_COLOR[p.type]};border:1px solid ${PARK_TYPE_COLOR[p.type]}55;padding:1px 8px;border-radius:4px;font-size:10px;margin-bottom:8px">${PARK_TYPE_ICON[p.type]} ${typeLabel}</div>
      ${p.fishing ? '<div style="color:#4ade80;font-size:11px;margin-bottom:4px">🎣 Fishing available</div>' : ''}
      <div style="color:#94a3b8;font-size:11px;font-style:italic">${p.notes}</div>
    </div>`;
}

// ── Fish positions near each spot (deterministic) ─────────────────────────────

const SALTWATER_FISH = ['🐟', '🐠', '🦈'];
const FRESHWATER_FISH = ['🐟', '🐡', '🦑'];
const SALT_TYPES: SpotType[] = ['inlet', 'surf', 'pier', 'marsh', 'icw', 'offshore'];

function fishForSpot(spot: FishingSpot): Array<{ lat: number; lon: number; emoji: string; dur: number; delay: number }> {
  const h = hashNum(spot.id);
  const pool = SALT_TYPES.includes(spot.type) ? SALTWATER_FISH : FRESHWATER_FISH;
  const scale = 0.0020;
  return [
    { lat: spot.lat + ((h & 7) - 3) * scale * 0.9,         lon: spot.lon + ((h >> 3 & 7) - 3) * scale * 1.2,  emoji: pool[0], dur: 5 + (h & 3), delay: -(h % 3) },
    { lat: spot.lat + ((h >> 6 & 7) - 3) * scale * 0.7,    lon: spot.lon + ((h >> 9 & 7) - 3) * scale * 0.8,  emoji: pool[1], dur: 7 + (h >> 2 & 2), delay: -((h >> 4) % 5) },
    { lat: spot.lat + ((h >> 12 & 7) - 3) * scale * 0.55,  lon: spot.lon + ((h >> 15 & 7) - 3) * scale * 1.0, emoji: pool[2], dur: 4 + (h >> 1 & 3), delay: -((h >> 6) % 4) },
  ];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MapView({ center, onSpotSelect }: Props) {
  const mapRef        = useRef<L.Map | null>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const spotMarkersRef  = useRef<L.Marker[]>([]);
  const fishMarkersRef  = useRef<L.Marker[]>([]);
  const parkMarkersRef  = useRef<L.Marker[]>([]);
  const userMarkerRef   = useRef<L.Marker | null>(null);

  const [visibleTypes, setVisibleTypes] = useState<Set<SpotType>>(new Set(SPOT_TYPES));
  const [mapStyle, setMapStyle]     = useState<'street' | 'satellite' | 'terrain'>('street');
  const [showParks, setShowParks]   = useState(true);
  const [showBait, setShowBait]     = useState(true);
  const [showFish, setShowFish]     = useState(true);

  const tiles = {
    street:    { url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attr: '© CartoDB' },
    satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attr: '© Esri' },
    terrain:   { url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', attr: '© OpenTopoMap' },
  };

  // ── Init map ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center,
      zoom: 10,
      zoomControl: true,
      zoomSnap: 0.25,          // allow fractional zoom levels
      zoomDelta: 0.5,          // each scroll step = 0.5 zoom
      wheelPxPerZoomLevel: 100, // more pixels needed → finer control
    });
    L.tileLayer(tiles[mapStyle].url, { attribution: tiles[mapStyle].attr, maxZoom: 19 }).addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // ── Tile layer swap ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.eachLayer(l => { if (l instanceof L.TileLayer) mapRef.current!.removeLayer(l); });
    L.tileLayer(tiles[mapStyle].url, { attribution: tiles[mapStyle].attr, maxZoom: 19 }).addTo(mapRef.current);
  }, [mapStyle]);

  // ── User location ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    userMarkerRef.current?.remove();
    userMarkerRef.current = L.marker(center, { icon: createUserMarker() })
      .addTo(mapRef.current)
      .bindTooltip('You are here', { permanent: false, direction: 'top' });
  }, [center]);

  // ── Fishing spot markers ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    spotMarkersRef.current.forEach(m => m.remove());
    spotMarkersRef.current = [];
    FISHING_SPOTS.filter(s => visibleTypes.has(s.type)).forEach(spot => {
      const m = L.marker([spot.lat, spot.lon], { icon: createSpotMarker(spot) })
        .addTo(mapRef.current!)
        .bindPopup(spotPopup(spot), { maxWidth: 280 });
      m.on('click', () => onSpotSelect(spot));
      m.on('popupclose', () => onSpotSelect(null));
      spotMarkersRef.current.push(m);
    });
  }, [visibleTypes, onSpotSelect]);

  // ── Fish markers (zoom-dependent) ───────────────────────────────────────────
  const syncFish = useCallback(() => {
    if (!mapRef.current) return;
    fishMarkersRef.current.forEach(m => m.remove());
    fishMarkersRef.current = [];
    if (!showFish || mapRef.current.getZoom() < FISH_SHOW_ZOOM) return;

    FISHING_SPOTS.filter(s => visibleTypes.has(s.type)).forEach(spot => {
      fishForSpot(spot).forEach(f => {
        const m = L.marker([f.lat, f.lon], {
          icon: createFishMarker(f.emoji, f.dur, f.delay),
          interactive: false,
          keyboard: false,
          zIndexOffset: -200,
        }).addTo(mapRef.current!);
        fishMarkersRef.current.push(m);
      });
    });
  }, [showFish, visibleTypes]);

  useEffect(() => { syncFish(); }, [syncFish]);

  // Re-sync fish on zoom change
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    map.on('zoomend', syncFish);
    return () => { map.off('zoomend', syncFish); };
  }, [syncFish]);

  // ── Park / bait shop markers ─────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    parkMarkersRef.current.forEach(m => m.remove());
    parkMarkersRef.current = [];

    PLACES.forEach(p => {
      const isBait = p.type === 'bait_shop';
      if (isBait && !showBait) return;
      if (!isBait && !showParks) return;

      const m = L.marker([p.lat, p.lon], { icon: createParkMarker(p.type) })
        .addTo(mapRef.current!)
        .bindPopup(parkPopup(p), { maxWidth: 260 });
      parkMarkersRef.current.push(m);
    });
  }, [showParks, showBait]);

  function toggleType(type: SpotType) {
    setVisibleTypes(prev => { const s = new Set(prev); s.has(type) ? s.delete(type) : s.add(type); return s; });
  }

  return (
    <div className="relative flex flex-col h-full">

      {/* Top-right: map style + layer toggles */}
      <div className="absolute top-2 right-2 z-[1000] flex flex-col gap-1.5">
        <div className="bg-slate-800/90 backdrop-blur rounded-lg border border-slate-700 p-1 flex gap-1">
          {(['street', 'satellite', 'terrain'] as const).map(s => (
            <button key={s} onClick={() => setMapStyle(s)}
              className={`text-xs px-2 py-1 rounded transition-colors ${mapStyle === s ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              {s === 'street' ? '🗺' : s === 'satellite' ? '🛰' : '⛰'}
            </button>
          ))}
        </div>

        {/* Layer toggles */}
        <div className="bg-slate-800/90 backdrop-blur rounded-lg border border-slate-700 p-1.5 flex flex-col gap-1">
          <div className="text-slate-500 text-[9px] uppercase tracking-wide px-1">Layers</div>
          {[
            { label: '🌲 Parks', value: showParks, set: setShowParks },
            { label: '🪣 Bait', value: showBait, set: setShowBait },
            { label: '🐟 Fish', value: showFish, set: setShowFish },
          ].map(({ label, value, set }) => (
            <button key={label} onClick={() => set(v => !v)}
              className={`text-[10px] px-2 py-0.5 rounded text-left transition-colors ${
                value ? 'bg-slate-600 text-slate-100' : 'text-slate-500 hover:text-slate-300'
              }`}>
              {label}
            </button>
          ))}
          <div className="text-slate-600 text-[9px] px-1">Fish show at zoom 11+</div>
        </div>
      </div>

      {/* Bottom-left: spot type filter */}
      <div className="absolute bottom-4 left-2 z-[1000]">
        <div className="bg-slate-800/90 backdrop-blur rounded-lg border border-slate-700 p-2">
          <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-1.5">Fishing Spots</div>
          <div className="flex flex-wrap gap-1 max-w-[220px]">
            {SPOT_TYPES.map(type => (
              <button key={type} onClick={() => toggleType(type)}
                className={`text-[10px] px-1.5 py-0.5 rounded-full border transition-colors ${
                  visibleTypes.has(type) ? 'border-transparent text-white' : 'border-slate-600 text-slate-500'
                }`}
                style={visibleTypes.has(type) ? { background: getSpotTypeColor(type) + '99' } : {}}>
                {getSpotTypeIcon(type)} {type}
              </button>
            ))}
          </div>

          {/* Park legend */}
          <div className="mt-2 pt-2 border-t border-slate-700/50 space-y-0.5">
            {(['state_park', 'national', 'wma', 'local', 'bait_shop'] as ParkType[]).map(t => (
              <div key={t} className="flex items-center gap-1 text-[10px]" style={{ color: PARK_TYPE_COLOR[t] }}>
                <span>{PARK_TYPE_ICON[t]}</span>
                <span className="text-slate-400">{t.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 w-full" />
    </div>
  );
}
