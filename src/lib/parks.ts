export type ParkType = 'state_park' | 'national' | 'wma' | 'local' | 'bait_shop';

export interface MapPlace {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: ParkType;
  fishing: boolean;
  notes: string;
}

export const PLACES: MapPlace[] = [
  // === NC STATE PARKS ===
  { id: 'cb-sp', name: 'Carolina Beach State Park', lat: 34.0562, lon: -77.9077, type: 'state_park', fishing: true, notes: 'Great fishing in lake and Cape Fear River. Campground on site.' },
  { id: 'ff-sra', name: 'Fort Fisher State Rec Area', lat: 33.9580, lon: -77.9279, type: 'state_park', fishing: true, notes: 'Surf fishing for red drum, pompano, bluefish. Free access.' },
  { id: 'hb-sp', name: 'Hammocks Beach State Park', lat: 34.6578, lon: -77.1254, type: 'state_park', fishing: true, notes: 'Pristine barrier island. Ferry required. Excellent surf & inshore fishing.' },
  { id: 'jl-sp', name: 'Jones Lake State Park', lat: 34.6782, lon: -78.5944, type: 'state_park', fishing: true, notes: 'Blackwater lake. Bass, crappie, catfish. Canoe/kayak rentals.' },
  { id: 'lw-sp', name: 'Lake Waccamaw State Park', lat: 34.2839, lon: -78.5014, type: 'state_park', fishing: true, notes: 'Unique Carolina bay lake. Bass, crappie, chain pickerel.' },
  { id: 'sl-sp', name: 'Singletary Lake State Park', lat: 34.5906, lon: -78.4167, type: 'state_park', fishing: true, notes: 'Pristine blackwater lake. Guided paddling programs.' },
  { id: 'cn-sp', name: 'Cliffs of the Neuse SP', lat: 35.2389, lon: -77.8900, type: 'state_park', fishing: true, notes: 'Neuse River access. Bass, crappie, catfish.' },
  { id: 'gs-sp', name: 'Goose Creek State Park', lat: 35.4728, lon: -76.9464, type: 'state_park', fishing: true, notes: 'Pamlico River estuary. Red drum, flounder, speckled trout.' },
  { id: 'cm-sp', name: 'Crowders Mountain State Park', lat: 35.2133, lon: -81.2953, type: 'state_park', fishing: true, notes: 'Crowders Creek access. Bass, bream, catfish.' },
  { id: 'sm-sp', name: 'South Mountains State Park', lat: 35.6028, lon: -81.6028, type: 'state_park', fishing: true, notes: 'Jacob Fork River. Wild trout. Catch & release upstream.' },
  { id: 'mm-sp', name: 'Morrow Mountain State Park', lat: 35.3506, lon: -80.0764, type: 'state_park', fishing: true, notes: 'Pee Dee River & Lake Tillery access. Striped bass, catfish, crappie.' },
  { id: 'lj-sp', name: 'Lake James State Park', lat: 35.7428, lon: -81.9022, type: 'state_park', fishing: true, notes: 'Mountain lake. Smallmouth bass, trout, stripers.' },
  { id: 'pm-sp', name: 'Pilot Mountain State Park', lat: 36.3428, lon: -80.4680, type: 'state_park', fishing: false, notes: 'Scenic park near Yadkin River corridor.' },
  { id: 'hr-sp', name: 'Hanging Rock State Park', lat: 36.3931, lon: -80.2672, type: 'state_park', fishing: true, notes: 'Lake for swimming & fishing. Bass, bream, catfish.' },
  { id: 'er-sp', name: 'Eno River State Park', lat: 36.0403, lon: -79.0056, type: 'state_park', fishing: true, notes: 'Eno River smallmouth bass and rock bass. Great wade fishing.' },
  { id: 'um-sp', name: 'William B. Umstead SP', lat: 35.8864, lon: -78.7456, type: 'state_park', fishing: true, notes: '3 fishing lakes near Raleigh. Bass, crappie, catfish.' },
  { id: 'pg-sp', name: 'Pettigrew State Park', lat: 35.8056, lon: -76.4208, type: 'state_park', fishing: true, notes: 'Lake Phelps — bass, crappie, chain pickerel. Canoe access.' },

  // === NATIONAL PARKS / FORESTS ===
  { id: 'cnf', name: 'Croatan National Forest', lat: 34.8156, lon: -77.1064, type: 'national', fishing: true, notes: 'Massive coastal plain forest. Lakes, creeks, and streams with bass, pickerel, catfish.' },
  { id: 'chn', name: 'Cape Hatteras National Seashore', lat: 35.2327, lon: -75.5291, type: 'national', fishing: true, notes: 'World-class surf fishing. Red drum, striped bass, bluefish, Spanish mackerel.' },
  { id: 'cln', name: 'Cape Lookout National Seashore', lat: 34.6197, lon: -76.5416, type: 'national', fishing: true, notes: 'Undeveloped barrier islands. Ferry required. Excellent fishing.' },
  { id: 'uwf', name: 'Uwharrie National Forest', lat: 35.4342, lon: -79.9989, type: 'national', fishing: true, notes: 'Badin Lake. Striped bass, largemouth bass, crappie. Dense forest.' },

  // === WILDLIFE MANAGEMENT AREAS ===
  { id: 'hs-wma', name: 'Holly Shelter Game Land', lat: 34.4833, lon: -77.8167, type: 'wma', fishing: true, notes: 'Large WMA near Wilmington. Black creek swamps, bass, pickerel. ATVs allowed in designated areas.' },
  { id: 'ab-wma', name: 'Angola Bay Game Land', lat: 34.6167, lon: -77.9000, type: 'wma', fishing: true, notes: 'Blackwater swamp streams. Chain pickerel, bass, sunfish. Very remote.' },
  { id: 'grn-wma', name: 'Green Swamp Preserve', lat: 34.0833, lon: -78.4167, type: 'wma', fishing: true, notes: 'Rare Carolina bays. Blackwater bass and pickerel fishing.' },
  { id: 'uw-wma', name: 'Uwharrie WMA / Badin Lake', lat: 35.5667, lon: -79.9500, type: 'wma', fishing: true, notes: 'Public land with Badin Lake access. Striped bass, crappie, bass.' },

  // === LOCAL / COUNTY PARKS ===
  { id: 'lnp-nc', name: 'Lake Norman State Park', lat: 35.6039, lon: -80.9386, type: 'local', fishing: true, notes: 'State park on Lake Norman. Shore fishing, boat launch, swimming beach.' },
  { id: 'mcp', name: 'McDowell Nature Preserve', lat: 35.0617, lon: -80.9917, type: 'local', fishing: true, notes: 'Mecklenburg County park. Lake Wylie shore fishing. Free.' },
  { id: 'rc-park', name: 'Ramsey Creek Park (Lake Norman)', lat: 35.5144, lon: -80.9094, type: 'local', fishing: true, notes: 'Free Mecklenburg county boat launch and fishing access on Lake Norman.' },
  { id: 'cbs-park', name: 'Carolina Beach Waterway Park', lat: 34.0406, lon: -77.9106, type: 'local', fishing: true, notes: 'ICW bank fishing access. Speckled trout, red drum, flounder.' },
  { id: 'wrangle', name: 'Airlie Gardens / Bradley Creek', lat: 34.2103, lon: -77.8411, type: 'local', fishing: false, notes: 'Scenic gardens near Bradley Creek. Limited fishing access.' },

  // === BAIT SHOPS ===
  { id: 'bs-ia', name: 'Intracoastal Angler (Wilmington)', lat: 34.2133, lon: -77.8889, type: 'bait_shop', fishing: false, notes: 'Full-service saltwater tackle shop. Live bait, rods, reels, guided trips.' },
  { id: 'bs-tw', name: 'Tackle World (Wilmington)', lat: 34.2389, lon: -77.9144, type: 'bait_shop', fishing: false, notes: 'Large tackle shop. Live bait, lures, licenses.' },
  { id: 'bs-cbm', name: 'Carolina Beach Marine', lat: 34.0406, lon: -77.8978, type: 'bait_shop', fishing: false, notes: 'Live shrimp, mullet, bait, tackle, ice.' },
  { id: 'bs-hls', name: 'Hook, Line & Sinker (Wrightsville)', lat: 34.2292, lon: -77.7994, type: 'bait_shop', fishing: false, notes: 'Waterfront tackle. Live bait, surf rigs, local knowledge.' },
  { id: 'bs-lnt', name: 'Lake Norman Tackle (Mooresville)', lat: 35.5775, lon: -80.8153, type: 'bait_shop', fishing: false, notes: 'Norman bass specialists. Swimbaits, live bait, tournament gear.' },
  { id: 'bs-pb', name: 'Pro Bass Tackle (Charlotte)', lat: 35.2200, lon: -80.8400, type: 'bait_shop', fishing: false, notes: 'Full freshwater tackle. Live bait, lures, rods & reels.' },
  { id: 'bs-lw', name: 'Lake Wylie Bait & Tackle', lat: 35.1189, lon: -81.0511, type: 'bait_shop', fishing: false, notes: 'Right on Lake Wylie. Live bait, ice, rental boats.' },
];

export const PARK_TYPE_ICON: Record<ParkType, string> = {
  state_park: '🌲',
  national: '🏞',
  wma: '🦌',
  local: '🌿',
  bait_shop: '🪣',
};

export const PARK_TYPE_COLOR: Record<ParkType, string> = {
  state_park: '#22c55e',
  national: '#16a34a',
  wma: '#84cc16',
  local: '#4ade80',
  bait_shop: '#f59e0b',
};
