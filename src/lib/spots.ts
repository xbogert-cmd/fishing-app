export type SpotType = 'inlet' | 'surf' | 'pier' | 'river' | 'lake' | 'marsh' | 'icw' | 'offshore';

export interface FishingSpot {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: SpotType;
  region: 'wilmington' | 'charlotte' | 'outer-banks';
  targetSpecies: string[];
  bestSeason: string;
  bestTide?: 'incoming' | 'outgoing' | 'high' | 'low' | 'any';
  notes: string;
  publicAccess: boolean;
  boatNeeded: boolean;
  rating: number; // 1-5 community rating
}

export const FISHING_SPOTS: FishingSpot[] = [
  // === WILMINGTON AREA ===
  {
    id: 'masonboro-inlet',
    name: 'Masonboro Inlet',
    lat: 34.1644,
    lon: -77.8536,
    type: 'inlet',
    region: 'wilmington',
    targetSpecies: ['Red Drum', 'Flounder', 'Speckled Trout', 'Cobia', 'Bluefish'],
    bestSeason: 'Spring & Fall',
    bestTide: 'outgoing',
    notes: 'One of the best inlets in NC. Outgoing tide moves baitfish = predators follow.',
    publicAccess: true,
    boatNeeded: false,
    rating: 5,
  },
  {
    id: 'carolina-beach-inlet',
    name: 'Carolina Beach Inlet / Snow\'s Cut',
    lat: 34.0615,
    lon: -77.9107,
    type: 'inlet',
    region: 'wilmington',
    targetSpecies: ['Flounder', 'Red Drum', 'Speckled Trout', 'Bluefish'],
    bestSeason: 'Summer & Fall',
    bestTide: 'outgoing',
    notes: 'Active inlet with bank fishing access. Snook\'s Cut great for flounder.',
    publicAccess: true,
    boatNeeded: false,
    rating: 4,
  },
  {
    id: 'cape-fear-river-wil',
    name: 'Cape Fear River (Downtown Wilmington)',
    lat: 34.2333,
    lon: -77.9440,
    type: 'river',
    region: 'wilmington',
    targetSpecies: ['Striped Bass', 'Red Drum', 'Sheepshead', 'Black Drum', 'Flounder'],
    bestSeason: 'Winter & Spring (Stripers)',
    bestTide: 'incoming',
    notes: 'World-class winter striper run. Boat ramps at Battleship park.',
    publicAccess: true,
    boatNeeded: false,
    rating: 5,
  },
  {
    id: 'surf-city-pier',
    name: 'Surf City Ocean Pier',
    lat: 34.4380,
    lon: -77.5536,
    type: 'pier',
    region: 'wilmington',
    targetSpecies: ['Spanish Mackerel', 'Bluefish', 'Flounder', 'Sheepshead', 'King Mackerel'],
    bestSeason: 'Spring–Fall',
    bestTide: 'any',
    notes: 'Fee pier ($10-15/day). Extends 937 ft. King mackerel in summer.',
    publicAccess: true,
    boatNeeded: false,
    rating: 4,
  },
  {
    id: 'johnny-mercer-pier',
    name: 'Johnnie Mercer\'s Pier (Wrightsville Beach)',
    lat: 34.2192,
    lon: -77.7949,
    type: 'pier',
    region: 'wilmington',
    targetSpecies: ['Spanish Mackerel', 'Bluefish', 'Pompano', 'Flounder'],
    bestSeason: 'Spring–Fall',
    bestTide: 'any',
    notes: 'Right at Wrightsville Beach. Good spring pompano run in March-April.',
    publicAccess: true,
    boatNeeded: false,
    rating: 4,
  },
  {
    id: 'masonboro-island',
    name: 'Masonboro Island (Barrier Island)',
    lat: 34.1430,
    lon: -77.8227,
    type: 'surf',
    region: 'wilmington',
    targetSpecies: ['Red Drum', 'Speckled Trout', 'Flounder', 'Pompano'],
    bestSeason: 'Fall',
    bestTide: 'incoming',
    notes: 'Pristine undeveloped barrier island. Boat or kayak required. Amazing fall red drum.',
    publicAccess: true,
    boatNeeded: true,
    rating: 5,
  },
  {
    id: 'wrightsville-icw',
    name: 'Wrightsville Beach ICW Drawbridge',
    lat: 34.2139,
    lon: -77.7973,
    type: 'icw',
    region: 'wilmington',
    targetSpecies: ['Speckled Trout', 'Red Drum', 'Flounder', 'Sheepshead'],
    bestSeason: 'Year round',
    bestTide: 'outgoing',
    notes: 'Wade or bank fish near bridge pilings. Great sheepshead spot in winter.',
    publicAccess: true,
    boatNeeded: false,
    rating: 4,
  },
  {
    id: 'topsail-beach',
    name: 'Topsail Beach Surf',
    lat: 34.4520,
    lon: -77.5920,
    type: 'surf',
    region: 'wilmington',
    targetSpecies: ['Red Drum', 'Pompano', 'Bluefish', 'Striped Bass'],
    bestSeason: 'Fall & Spring',
    bestTide: 'incoming',
    notes: 'Surf fishing gold. Bull reds in October legendary. Pompano March-April.',
    publicAccess: true,
    boatNeeded: false,
    rating: 4,
  },
  {
    id: 'pages-creek',
    name: 'Pages Creek / Middle Sound',
    lat: 34.2863,
    lon: -77.7798,
    type: 'marsh',
    region: 'wilmington',
    targetSpecies: ['Red Drum', 'Speckled Trout', 'Flounder'],
    bestSeason: 'Fall',
    bestTide: 'high',
    notes: 'Back-country marshes. Wade fish grass flats on high incoming tide.',
    publicAccess: true,
    boatNeeded: false,
    rating: 4,
  },
  {
    id: 'wilmington-offshore',
    name: 'AR-320 / Frying Pan Tower (Offshore)',
    lat: 33.4943,
    lon: -77.0066,
    type: 'offshore',
    region: 'wilmington',
    targetSpecies: ['Mahi', 'Wahoo', 'Yellowfin Tuna', 'Marlin'],
    bestSeason: 'Summer',
    bestTide: 'any',
    notes: 'Deep sea 35-50 miles offshore. Charter boat or large vessel required.',
    publicAccess: false,
    boatNeeded: true,
    rating: 5,
  },

  // === CHARLOTTE / LAKE NORMAN AREA ===
  {
    id: 'lake-norman-ramsey',
    name: 'Lake Norman – Ramsey Creek Park',
    lat: 35.5144,
    lon: -80.9094,
    type: 'lake',
    region: 'charlotte',
    targetSpecies: ['Largemouth Bass', 'Striped Bass', 'Crappie', 'Bluegill'],
    bestSeason: 'Year round',
    bestTide: 'any',
    notes: 'Popular bank and kayak access. Dock fishing and coves excellent.',
    publicAccess: true,
    boatNeeded: false,
    rating: 4,
  },
  {
    id: 'lake-norman-blythe',
    name: 'Lake Norman – Blythe Landing',
    lat: 35.5678,
    lon: -80.8789,
    type: 'lake',
    region: 'charlotte',
    targetSpecies: ['Largemouth Bass', 'Striped Bass', 'Crappie'],
    bestSeason: 'Spring & Fall',
    bestTide: 'any',
    notes: 'Free public launch and shoreline access. North end of lake = great structure.',
    publicAccess: true,
    boatNeeded: false,
    rating: 4,
  },
  {
    id: 'lake-norman-denver',
    name: 'Lake Norman – Denver Area (South)',
    lat: 35.5200,
    lon: -80.9700,
    type: 'lake',
    region: 'charlotte',
    targetSpecies: ['Striped Bass', 'Largemouth Bass', 'Hybrid Bass'],
    bestSeason: 'Fall & Winter',
    bestTide: 'any',
    notes: 'Deep water near dam. Big stripers winter here near shad schools.',
    publicAccess: true,
    boatNeeded: true,
    rating: 5,
  },
  {
    id: 'lake-wylie-buster-boyd',
    name: 'Lake Wylie – Buster Boyd Bridge',
    lat: 35.1228,
    lon: -81.0578,
    type: 'lake',
    region: 'charlotte',
    targetSpecies: ['Largemouth Bass', 'Blue Catfish', 'Crappie', 'Striped Bass'],
    bestSeason: 'Year round',
    bestTide: 'any',
    notes: 'Bridge pilings hold big bass and crappie. Catfish below bridge.',
    publicAccess: true,
    boatNeeded: false,
    rating: 4,
  },
  {
    id: 'mountain-island-lake',
    name: 'Mountain Island Lake',
    lat: 35.3503,
    lon: -80.9695,
    type: 'lake',
    region: 'charlotte',
    targetSpecies: ['Largemouth Bass', 'Crappie', 'Bluegill', 'Catfish'],
    bestSeason: 'Spring',
    bestTide: 'any',
    notes: 'Between Norman and Wylie. Less pressure = bigger fish. Great crappie.',
    publicAccess: true,
    boatNeeded: false,
    rating: 4,
  },
  {
    id: 'catawba-river-landsford',
    name: 'Catawba River – Landsford Canal SP',
    lat: 34.9617,
    lon: -80.9144,
    type: 'river',
    region: 'charlotte',
    targetSpecies: ['Channel Catfish', 'Blue Catfish', 'Largemouth Bass', 'Striped Bass'],
    bestSeason: 'Spring & Summer',
    bestTide: 'any',
    notes: 'Historic canal. Spider lily blooms May = gorgeous. Big cats below shoals.',
    publicAccess: true,
    boatNeeded: false,
    rating: 4,
  },
  {
    id: 'lake-james',
    name: 'Lake James (Nebo, NC)',
    lat: 35.7428,
    lon: -81.9022,
    type: 'lake',
    region: 'charlotte',
    targetSpecies: ['Largemouth Bass', 'Smallmouth Bass', 'Striped Bass', 'Trout'],
    bestSeason: 'Spring',
    bestTide: 'any',
    notes: 'Mountain lake, 1.5h from Charlotte. Excellent smallmouth and trout. Clearer water.',
    publicAccess: true,
    boatNeeded: false,
    rating: 5,
  },
  {
    id: 'south-fork-catawba',
    name: 'South Fork Catawba River (Belmont)',
    lat: 35.2675,
    lon: -81.1444,
    type: 'river',
    region: 'charlotte',
    targetSpecies: ['Largemouth Bass', 'Smallmouth Bass', 'Crappie', 'Catfish'],
    bestSeason: 'Spring & Fall',
    bestTide: 'any',
    notes: 'Wading river fishing. Smallmouth in rocky shoals. Spring topwater.',
    publicAccess: true,
    boatNeeded: false,
    rating: 4,
  },
];

export function getSpotTypeColor(type: SpotType): string {
  const colors: Record<SpotType, string> = {
    inlet: '#f97316',
    surf: '#eab308',
    pier: '#8b5cf6',
    river: '#06b6d4',
    lake: '#3b82f6',
    marsh: '#22c55e',
    icw: '#14b8a6',
    offshore: '#ef4444',
  };
  return colors[type];
}

export function getSpotTypeIcon(type: SpotType): string {
  const icons: Record<SpotType, string> = {
    inlet: '🌊',
    surf: '🏖',
    pier: '🚶',
    river: '🏞',
    lake: '⛵',
    marsh: '🌿',
    icw: '⚓',
    offshore: '🚢',
  };
  return icons[type];
}

export function getNearbySpots(lat: number, lon: number, radiusMiles = 80): FishingSpot[] {
  return FISHING_SPOTS.filter(spot => {
    const dist = Math.sqrt(
      Math.pow((spot.lat - lat) * 69, 2) + Math.pow((spot.lon - lon) * 53, 2)
    );
    return dist <= radiusMiles;
  }).sort((a, b) => {
    const da = Math.sqrt(Math.pow((a.lat - lat) * 69, 2) + Math.pow((a.lon - lon) * 53, 2));
    const db = Math.sqrt(Math.pow((b.lat - lat) * 69, 2) + Math.pow((b.lon - lon) * 53, 2));
    return da - db;
  });
}
