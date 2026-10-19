export interface FishSpecies {
  name: string;
  commonName?: string;
  type: 'saltwater' | 'freshwater' | 'both';
  seasons: ('spring' | 'summer' | 'fall' | 'winter')[];
  bestMonths: number[];     // 1-12
  bestTimeOfDay: string[];
  habitat: string[];
  topBaits: string[];
  topLures: string[];
  techniques: string[];
  waterTemp: { min: number; max: number };
  sizeInfo: string;
  notes: string;
  emoji: string;
}

// Current month → season
export function currentSeason(): 'spring' | 'summer' | 'fall' | 'winter' {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'fall';
  return 'winter';
}

export function isInSeason(fish: FishSpecies): boolean {
  const month = new Date().getMonth() + 1;
  return fish.bestMonths.includes(month);
}

export const NC_FISH: FishSpecies[] = [
  // === SALTWATER (Wilmington/Cape Fear area) ===
  {
    name: 'Red Drum',
    commonName: 'Redfish / Channel Bass',
    type: 'saltwater',
    seasons: ['spring', 'summer', 'fall', 'winter'],
    bestMonths: [9, 10, 11, 3, 4, 5],
    bestTimeOfDay: ['Early morning', 'Late afternoon', 'Incoming tide'],
    habitat: ['Inshore flats', 'Marshes', 'Inlets', 'Nearshore reefs'],
    topBaits: ['Live shrimp', 'Live mullet', 'Fiddler crabs', 'Cut menhaden'],
    topLures: ['Gold spoon', 'Soft plastic paddle tail', 'Popping cork + shrimp', 'Topwater'],
    techniques: ['Wade fishing flats', 'Sight casting to tailing fish', 'Popping cork', 'Free-lining live bait'],
    waterTemp: { min: 55, max: 85 },
    sizeInfo: '18–27" slot, up to 50+ lbs (bull reds)',
    notes: 'NC slot limit 18-27". Bull reds (>27") schooled up in fall near inlets.',
    emoji: '🐟',
  },
  {
    name: 'Speckled Trout',
    commonName: 'Spotted Seatrout',
    type: 'saltwater',
    seasons: ['fall', 'winter', 'spring'],
    bestMonths: [10, 11, 12, 1, 2, 3, 4],
    bestTimeOfDay: ['Early morning', 'Dusk', 'Outgoing tide'],
    habitat: ['Grass flats', 'Marshes', 'ICW edges', 'Oyster beds'],
    topBaits: ['Live shrimp under popping cork', 'Live finger mullet'],
    topLures: ['MirrOlure 52M', 'Gulp shrimp', 'Bass Assassin', 'Topwater (Z-Man Poppin Chatterbait)'],
    techniques: ['Popping cork', 'Slow retrieve on grass flats', 'Topwater at dawn'],
    waterTemp: { min: 50, max: 75 },
    sizeInfo: '12–20", trophy over 24"',
    notes: 'Peak Oct–Feb in NC. Cold snaps push them deep. 12" minimum in NC.',
    emoji: '🐠',
  },
  {
    name: 'Flounder',
    commonName: 'Summer Flounder',
    type: 'saltwater',
    seasons: ['summer', 'fall'],
    bestMonths: [6, 7, 8, 9, 10],
    bestTimeOfDay: ['Incoming tide', 'Moving tide', 'Overcast days'],
    habitat: ['Inlets', 'Nearshore structure', 'Sandy/muddy bottoms', 'Dock shadows'],
    topBaits: ['Live finger mullet', 'Live spot', 'Mud minnows', 'Squid strips'],
    topLures: ['Bucktail jig + Gulp shrimp', 'D.O.A. shrimp', 'Berkley Gulp! Alive'],
    techniques: ['Drift fishing', 'Jigging near structure', 'Live-lining under docks'],
    waterTemp: { min: 60, max: 80 },
    sizeInfo: '12" minimum in NC, up to 10+ lbs',
    notes: 'Tournament-quality flounder in Masonboro Inlet and New River areas.',
    emoji: '🫓',
  },
  {
    name: 'Spanish Mackerel',
    commonName: 'Spanish Mackerel',
    type: 'saltwater',
    seasons: ['spring', 'summer', 'fall'],
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    bestTimeOfDay: ['Morning', 'Afternoon bird activity'],
    habitat: ['Nearshore', 'Inlets', 'Nearshore wrecks/reefs', 'Surf zone'],
    topBaits: ['Live glass minnows', 'Cigar minnows', 'Pilchards'],
    topLures: ['Gotcha plug', 'Clark spoon + planer', 'Drone spoon', 'Silly Willy'],
    techniques: ['Trolling Clark spoons behind planer', 'Casting Gotcha plugs to breaking fish'],
    waterTemp: { min: 65, max: 82 },
    sizeInfo: '12" minimum, avg 1-3 lbs, up to 8+ lbs',
    notes: 'Follow birds and baitfish. Often schooling with bluefish.',
    emoji: '🐡',
  },
  {
    name: 'Bluefish',
    commonName: 'Bluefish',
    type: 'saltwater',
    seasons: ['spring', 'fall'],
    bestMonths: [3, 4, 5, 9, 10, 11],
    bestTimeOfDay: ['Dawn', 'Dusk', 'When birds are diving'],
    habitat: ['Surf', 'Nearshore', 'Inlets', 'Offshore wrecks'],
    topBaits: ['Cut menhaden', 'Mullet strips'],
    topLures: ['Metal jigs', 'Gotcha plug', 'X-Rap', 'Poppers'],
    techniques: ['Surf casting', 'Fast retrieve', 'Chumming from boat'],
    waterTemp: { min: 60, max: 78 },
    sizeInfo: 'No minimum, avg 2-5 lbs, up to 20+ lbs',
    notes: 'Extremely aggressive — use wire leader. Sharp teeth.',
    emoji: '🐬',
  },
  {
    name: 'Sheepshead',
    commonName: 'Sheepshead',
    type: 'saltwater',
    seasons: ['spring', 'winter', 'fall'],
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    bestTimeOfDay: ['Incoming tide', 'High tide near structure'],
    habitat: ['Bridge pilings', 'Jetties', 'Oyster rocks', 'Artificial reefs'],
    topBaits: ['Fiddler crabs', 'Sand fleas', 'Barnacles', 'Shrimp'],
    topLures: ['Small jig tipped with crab', 'Live shrimp on #1 hook'],
    techniques: ['Tight-line to structure', 'Feel for subtle "tap"', 'Fish right on barnacle-covered pilings'],
    waterTemp: { min: 50, max: 78 },
    sizeInfo: '10" minimum, avg 2-6 lbs',
    notes: 'Peak winter/spring near pilings. Must fish tight to structure.',
    emoji: '🦌',
  },
  {
    name: 'Cobia',
    commonName: 'Cobia',
    type: 'saltwater',
    seasons: ['spring', 'summer'],
    bestMonths: [4, 5, 6, 7],
    bestTimeOfDay: ['Morning', 'Near floating objects/rays'],
    habitat: ['Nearshore', 'Around cownose rays', 'Buoys', 'Wrecks'],
    topBaits: ['Live eel', 'Live menhaden', 'Crab'],
    topLures: ['DOA eel', 'Large jig 1-3oz', 'Bucktail'],
    techniques: ['Sight casting to free-swimming fish', 'Jigging wrecks', 'Follow rays'],
    waterTemp: { min: 68, max: 85 },
    sizeInfo: '33" minimum in NC, avg 20-50 lbs',
    notes: 'One of the most prized inshore species. April-June migration.',
    emoji: '🐟',
  },
  {
    name: 'Striped Bass (Coastal)',
    commonName: 'Rockfish',
    type: 'both',
    seasons: ['winter', 'spring', 'fall'],
    bestMonths: [11, 12, 1, 2, 3, 4],
    bestTimeOfDay: ['Low light', 'Dawn', 'Dusk', 'Nighttime'],
    habitat: ['Cape Fear River', 'Roanoke River', 'Nearshore surf'],
    topBaits: ['Live herring', 'Cut bunker', 'Eels'],
    topLures: ['Bucktail jig', 'Swimmer plug', 'Soft plastic swimbait'],
    techniques: ['Casting current seams', 'Trolling plugs', 'Surf casting'],
    waterTemp: { min: 40, max: 65 },
    sizeInfo: '18" minimum, trophy 30"+ (60+ lbs possible)',
    notes: 'Winter striped bass run in Cape Fear River is major local event.',
    emoji: '🐠',
  },

  // === FRESHWATER (Lake Norman / Charlotte area) ===
  {
    name: 'Largemouth Bass',
    commonName: 'Largemouth Bass',
    type: 'freshwater',
    seasons: ['spring', 'summer', 'fall', 'winter'],
    bestMonths: [3, 4, 5, 6, 9, 10],
    bestTimeOfDay: ['Early morning', 'Evening', 'Overcast days'],
    habitat: ['Dock shadows', 'Grass edges', 'Points', 'Creek arms', 'Laydowns'],
    topBaits: ['Live shiners', 'Nightcrawlers', 'Crayfish'],
    topLures: ['Senko worm', 'Spinnerbait', 'Crankbait', 'Topwater frog', 'Football jig'],
    techniques: ['Texas rig', 'Drop shot', 'Flipping dock pilings', 'Topwater early/late'],
    waterTemp: { min: 50, max: 85 },
    sizeInfo: '12" minimum, avg 1-4 lbs, up to 12+ lbs',
    notes: 'Lake Norman is one of NC\'s best bass lakes. Spring spawn = topwater magic.',
    emoji: '🎣',
  },
  {
    name: 'Striped Bass (Lake Norman)',
    commonName: 'Striper / Rockfish',
    type: 'freshwater',
    seasons: ['fall', 'winter', 'spring'],
    bestMonths: [10, 11, 12, 1, 2, 3, 4],
    bestTimeOfDay: ['Early morning', 'Late evening', 'Night (summer)'],
    habitat: ['Deep main lake channels', 'Points with baitfish', 'Creek mouths in fall'],
    topBaits: ['Live blueback herring', 'Live gizzard shad', 'Large golden shiner'],
    topLures: ['Umbrella rig', 'Large swimbait 6-10"', 'Big crankbait', 'Pencil popper'],
    techniques: ['Live bait under balloon', 'Deep trolling', 'Jigging over schools of shad'],
    waterTemp: { min: 50, max: 75 },
    sizeInfo: '20" minimum, avg 5-20 lbs, up to 40+ lbs',
    notes: 'Lake Norman holds trophy stripers. Follow shad schools on sonar.',
    emoji: '🐟',
  },
  {
    name: 'Crappie',
    commonName: 'Crappie (Speck)',
    type: 'freshwater',
    seasons: ['spring', 'winter', 'fall'],
    bestMonths: [2, 3, 4, 5, 11, 12],
    bestTimeOfDay: ['Early morning', 'Late afternoon', 'Night (summer)'],
    habitat: ['Brush piles', 'Standing timber', 'Dock pilings', 'Creek channels'],
    topBaits: ['Small minnows (1-2")', 'Waxworms'],
    topLures: ['1/16 oz tube jig', 'Bobby Garland Baby Shad', 'Curly tail grub (white/chartreuse)'],
    techniques: ['Vertical jigging brush piles', 'Slow trolling long-lining', 'Spider rigging'],
    waterTemp: { min: 50, max: 75 },
    sizeInfo: '9" minimum in some NC waters, avg 8-12"',
    notes: 'Pre-spawn crappie in March-April hit brush piles in 8-15 ft.',
    emoji: '🐠',
  },
  {
    name: 'Channel Catfish',
    commonName: 'Channel Cat',
    type: 'freshwater',
    seasons: ['spring', 'summer', 'fall', 'winter'],
    bestMonths: [4, 5, 6, 7, 8, 9],
    bestTimeOfDay: ['Night', 'Dusk', 'Dawn'],
    habitat: ['River channels', 'Deep holes', 'Below dams', 'Lake bottoms'],
    topBaits: ['Chicken liver', 'Punch bait', 'Cut skipjack', 'Nightcrawlers', 'Stink bait'],
    topLures: [],
    techniques: ['Bottom fishing', 'Slip-sinker rig', 'Drift fishing rivers'],
    waterTemp: { min: 55, max: 85 },
    sizeInfo: 'No minimum for channel cat, avg 2-8 lbs',
    notes: 'Catawba River below dams excellent for cats. Night fishing summer.',
    emoji: '😺',
  },
  {
    name: 'Blue Catfish',
    commonName: 'Blue Cat',
    type: 'freshwater',
    seasons: ['spring', 'summer', 'fall', 'winter'],
    bestMonths: [5, 6, 7, 8, 9, 10],
    bestTimeOfDay: ['Dawn', 'Dusk', 'Night'],
    habitat: ['Main lake channels', 'River ledges', 'Dam tailwaters'],
    topBaits: ['Fresh cut skipjack', 'Cut shad', 'Large night crawlers'],
    topLures: [],
    techniques: ['Anchor on ledge drops', 'Drift fishing main channel', 'Tailwater fishing'],
    waterTemp: { min: 55, max: 85 },
    sizeInfo: 'No minimum, avg 5-25 lbs, trophy 50+ lbs possible',
    notes: 'Lake Wylie and Catawba have large blue cat populations.',
    emoji: '😸',
  },
  {
    name: 'Bluegill',
    commonName: 'Bluegill / Bream',
    type: 'freshwater',
    seasons: ['spring', 'summer', 'fall'],
    bestMonths: [4, 5, 6, 7, 8, 9],
    bestTimeOfDay: ['Morning', 'Late afternoon'],
    habitat: ['Shallow coves', 'Dock edges', 'Weed beds', 'Sandy beds (spawn)'],
    topBaits: ['Crickets', 'Redworms', 'Waxworms', 'Small crayfish'],
    topLures: ['Tiny spinners', 'Small inline spinnerbait', '1/32 oz jig'],
    techniques: ['Float fishing with cricket 2-4 ft deep', 'Sight fishing beds in spring'],
    waterTemp: { min: 65, max: 85 },
    sizeInfo: 'No minimum, avg 5-8", trophy over 10"',
    notes: 'Great light-tackle fun. Spawn beds visible in May-June in shallows.',
    emoji: '🐠',
  },
  {
    name: 'White Bass',
    commonName: 'Sand Bass',
    type: 'freshwater',
    seasons: ['spring', 'winter'],
    bestMonths: [2, 3, 4, 5],
    bestTimeOfDay: ['Morning', 'Evening', 'When surface schooling'],
    habitat: ['River mouths', 'Rocky points', 'Creek arms', 'Open water schools'],
    topBaits: ['Small minnows'],
    topLures: ['White curly-tail grub', '1/4 oz white spinnerbait', 'Rooster tail', 'Tiny Torpedo'],
    techniques: ['Cast to breaking surface schools', 'Vertical jigging over schools', 'River drift'],
    waterTemp: { min: 55, max: 70 },
    sizeInfo: 'No minimum, avg 10-14"',
    notes: 'Spring run up rivers (Catawba tributaries). Find the school = fast action.',
    emoji: '🐟',
  },
];

export function getFishForLocation(
  lat: number,
  lon: number
): { saltwater: FishSpecies[]; freshwater: FishSpecies[] } {
  // Rough coastal check: Wilmington area is east of ~-78.5 longitude
  const isCoastal = lon > -79;
  const month = new Date().getMonth() + 1;

  const salt = NC_FISH.filter(f => f.type === 'saltwater' || f.type === 'both');
  const fresh = NC_FISH.filter(f => f.type === 'freshwater' || f.type === 'both');

  // Sort by current season relevance
  const sortByMonth = (fish: FishSpecies[]) =>
    fish.sort((a, b) => {
      const aIn = a.bestMonths.includes(month) ? 1 : 0;
      const bIn = b.bestMonths.includes(month) ? 1 : 0;
      return bIn - aIn;
    });

  return {
    saltwater: sortByMonth(salt),
    freshwater: sortByMonth(fresh),
  };
}
