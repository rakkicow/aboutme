// `weather` command — real conditions for wherever the visitor is, drawn as an
// animated ASCII scene inside the terminal.
//
// Location comes from IP (geojs), not the browser Geolocation API: city-level
// accuracy is plenty for weather and it costs the visitor no permission prompt.
// Conditions come from Open-Meteo, which is keyless and CORS-open.

type Scene = 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunder' | 'wind';

type Conditions = {
  place: string;
  /** Carried so the full-screen link points at this exact spot rather than
   *  whatever a fresh name search happens to return. */
  lat: number;
  lon: number;
  temp: number; // °C
  feels: number; // °C
  humidity: number;
  wind: number; // km/h
  isDay: boolean;
  /** That city's own wall clock, e.g. "10:23 PM". */
  time: string;
  code: number;
  label: string;
  scene: Scene;
  imperial: boolean;
  /** Set when a condition search had to settle for the next best thing. */
  fellBackFrom?: string;
};

// WMO weather codes → a human label and the scene we animate for it.
const WMO: Record<number, { label: string; scene: Scene }> = {
  0: { label: 'Clear sky', scene: 'clear' },
  1: { label: 'Mainly clear', scene: 'clear' },
  2: { label: 'Partly cloudy', scene: 'cloudy' },
  3: { label: 'Overcast', scene: 'cloudy' },
  45: { label: 'Fog', scene: 'fog' },
  48: { label: 'Rime fog', scene: 'fog' },
  51: { label: 'Light drizzle', scene: 'drizzle' },
  53: { label: 'Drizzle', scene: 'drizzle' },
  55: { label: 'Heavy drizzle', scene: 'drizzle' },
  56: { label: 'Freezing drizzle', scene: 'drizzle' },
  57: { label: 'Freezing drizzle', scene: 'drizzle' },
  61: { label: 'Light rain', scene: 'rain' },
  63: { label: 'Rain', scene: 'rain' },
  65: { label: 'Heavy rain', scene: 'rain' },
  66: { label: 'Freezing rain', scene: 'rain' },
  67: { label: 'Freezing rain', scene: 'rain' },
  71: { label: 'Light snow', scene: 'snow' },
  73: { label: 'Snow', scene: 'snow' },
  75: { label: 'Heavy snow', scene: 'snow' },
  77: { label: 'Snow grains', scene: 'snow' },
  80: { label: 'Rain showers', scene: 'rain' },
  81: { label: 'Rain showers', scene: 'rain' },
  82: { label: 'Violent showers', scene: 'rain' },
  85: { label: 'Snow showers', scene: 'snow' },
  86: { label: 'Heavy snow showers', scene: 'snow' },
  95: { label: 'Thunderstorm', scene: 'thunder' },
  96: { label: 'Thunderstorm, hail', scene: 'thunder' },
  99: { label: 'Thunderstorm, hail', scene: 'thunder' },
};

const C = {
  rain: '#5B9BD5',
  rainFar: '#3E6E99',
  splash: '#8FC4E8',
  storm: '#8A93A5',
  bolt: '#FFE066',
  snow: '#FFFFFF',
  snowFar: '#B9D4EC',
  drift: '#DCE6F5',
  sun: '#FFD34D',
  ray: '#FFB37A',
  moon: '#E6ECFF',
  star: '#9FB0D0',
  cloudNear: '#C8D0DE',
  cloudMid: '#98A3B6',
  cloudFar: '#6C7689',
  fog: '#8B93A6',
  gust: '#A8D8B9',
  leaf: '#C08A3E',
  ground: '#4A5468',
  dim: '#7CE57C',
  pink: '#DC9BB5',
};

// Only one scene may animate at a time — a second `weather` call kills the first.
let stopActive: (() => void) | null = null;

export function stopWeather() {
  if (stopActive) stopActive();
  stopActive = null;
}

const cToF = (c: number) => (c * 9) / 5 + 32;

/** Reads the clock off the ISO string. Open-Meteo's `timezone=auto` already
 *  returns local wall-clock for that city, so parsing it as a Date would only
 *  drag the visitor's own offset back in. */
const localTime = (iso: string) => {
  const m = /T(\d{2}):(\d{2})/.exec(iso || '');
  if (!m) return '';
  const h = parseInt(m[1], 10);
  return `${h % 12 || 12}:${m[2]} ${h >= 12 ? 'PM' : 'AM'}`;
};
const esc = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// US states by postal code, so `augusta ga` lands in Georgia rather than Maine.
const US_STATES: Record<string, string> = {
  al: 'Alabama', ak: 'Alaska', az: 'Arizona', ar: 'Arkansas', ca: 'California',
  co: 'Colorado', ct: 'Connecticut', de: 'Delaware', fl: 'Florida', ga: 'Georgia',
  hi: 'Hawaii', id: 'Idaho', il: 'Illinois', in: 'Indiana', ia: 'Iowa',
  ks: 'Kansas', ky: 'Kentucky', la: 'Louisiana', me: 'Maine', md: 'Maryland',
  ma: 'Massachusetts', mi: 'Michigan', mn: 'Minnesota', ms: 'Mississippi',
  mo: 'Missouri', mt: 'Montana', ne: 'Nebraska', nv: 'Nevada', nh: 'New Hampshire',
  nj: 'New Jersey', nm: 'New Mexico', ny: 'New York', nc: 'North Carolina',
  nd: 'North Dakota', oh: 'Ohio', ok: 'Oklahoma', or: 'Oregon', pa: 'Pennsylvania',
  ri: 'Rhode Island', sc: 'South Carolina', sd: 'South Dakota', tn: 'Tennessee',
  tx: 'Texas', ut: 'Utah', vt: 'Vermont', va: 'Virginia', wa: 'Washington',
  wv: 'West Virginia', wi: 'Wisconsin', wy: 'Wyoming', dc: 'District of Columbia',
  pr: 'Puerto Rico',
};

/**
 * Splits a trailing US state off a query — `augusta ga`, `augusta, ga` and
 * `augusta,ga` all become `{ name: 'augusta', state: 'Georgia' }`. A bare state
 * name is left alone, so `georgia` still searches for the country.
 */
function splitState(query: string): { name: string; state: string | null } {
  const cleaned = query.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
  const words = cleaned.split(' ');
  if (words.length < 2) return { name: cleaned, state: null };

  // Longest match wins, so "kansas city ks" beats a stray "kansas".
  for (let take = 3; take >= 1; take--) {
    if (words.length <= take) continue;
    const tail = words.slice(-take).join(' ').toLowerCase();
    const full = Object.values(US_STATES).find((s) => s.toLowerCase() === tail);
    const state = take === 1 ? US_STATES[tail] : undefined;
    if (full || state) {
      return { name: words.slice(0, words.length - take).join(' '), state: (full || state)! };
    }
  }
  return { name: cleaned, state: null };
}

async function locate(city: string): Promise<{ lat: number; lon: number; place: string; imperial: boolean }> {
  if (city) {
    const { name, state } = splitState(city);
    // Ask for several candidates when a state is named, so we can pick the one
    // that actually sits in it — the API orders purely by population.
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?count=${state ? 20 : 1}&language=en&format=json&name=${encodeURIComponent(name)}`
    );
    if (!res.ok) throw new Error('geocode');
    const results = (await res.json())?.results ?? [];
    const hit = state
      ? results.find(
          (r: any) => r.country_code === 'US' && String(r.admin1 || '').toLowerCase() === state.toLowerCase()
        ) ?? results[0]
      : results[0];
    if (!hit) throw new Error('nocity');
    const region = hit.admin1 && hit.country_code === 'US' ? hit.admin1 : hit.country;
    return {
      lat: hit.latitude,
      lon: hit.longitude,
      place: region ? `${hit.name}, ${region}` : hit.name,
      // US, plus the handful of other places that never took to Celsius.
      imperial: ['US', 'BS', 'KY', 'LR', 'PW', 'FM', 'MH'].includes(hit.country_code),
    };
  }

  const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
  if (!res.ok) throw new Error('geoip');
  const g = await res.json();
  const region = g.country_code === 'US' ? g.region : g.country;
  return {
    lat: parseFloat(g.latitude),
    lon: parseFloat(g.longitude),
    place: g.city ? (region ? `${g.city}, ${region}` : g.city) : region || 'somewhere',
    imperial: ['US', 'BS', 'KY', 'LR', 'PW', 'FM', 'MH'].includes(g.country_code),
  };
}

// Words you can type instead of a city. Everything maps onto a scene we draw.
const CONDITIONS: Record<string, Scene> = {
  sunny: 'clear', sun: 'clear', clear: 'clear',
  cloudy: 'cloudy', cloud: 'cloudy', overcast: 'cloudy',
  rainy: 'rain', rain: 'rain', raining: 'rain', wet: 'rain',
  drizzle: 'drizzle', drizzly: 'drizzle',
  snowy: 'snow', snow: 'snow', snowing: 'snow',
  stormy: 'thunder', storm: 'thunder', thunder: 'thunder', thunderstorm: 'thunder', lightning: 'thunder',
  windy: 'wind', wind: 'wind', gusty: 'wind',
  foggy: 'fog', fog: 'fog', mist: 'fog', misty: 'fog',
};

/** The canonical word we print for each scene, in the help listing. */
const CONDITION_WORDS = ['sunny', 'cloudy', 'rainy', 'drizzly', 'snowy', 'stormy', 'windy', 'foggy'];

// Cities scanned when you ask for a condition rather than a place. Spread over
// both hemispheres and heavy on the tropics and the poles, because that is
// where the storms and the snow actually are on any given day.
const SCAN: [string, number, number, boolean][] = [
  ['Reykjavik', 64.15, -21.94, false], ['Longyearbyen', 78.22, 15.65, false],
  ['Nuuk', 64.18, -51.72, false], ['Anchorage', 61.22, -149.9, true],
  ['Oslo', 59.91, 10.75, false], ['Helsinki', 60.17, 24.94, false],
  ['London', 51.51, -0.13, false], ['Dublin', 53.35, -6.26, false],
  ['Paris', 48.86, 2.35, false], ['Berlin', 52.52, 13.4, false],
  ['Lisbon', 38.72, -9.14, false], ['Cairo', 30.04, 31.24, false],
  ['Nairobi', -1.29, 36.82, false], ['Cape Town', -33.92, 18.42, false],
  ['Mumbai', 19.08, 72.88, false], ['Delhi', 28.61, 77.21, false],
  ['Bangkok', 13.76, 100.5, false], ['Singapore', 1.35, 103.82, false],
  ['Jakarta', -6.21, 106.85, false], ['Manila', 14.6, 120.98, false],
  ['Tokyo', 35.69, 139.69, false], ['Seoul', 37.57, 126.98, false],
  ['Lhasa', 29.65, 91.14, false], ['Kathmandu', 27.72, 85.32, false],
  ['Istanbul', 41.01, 28.98, false], ['Sydney', -33.87, 151.21, false],
  ['Wellington', -41.29, 174.78, false], ['Ushuaia', -54.8, -68.3, false],
  ['Punta Arenas', -53.16, -70.91, false], ['Santiago', -33.45, -70.67, false],
  ['Lima', -12.05, -77.04, false], ['Quito', -0.18, -78.47, false],
  ['Bogota', 4.71, -74.07, false], ['La Paz', -16.5, -68.15, false],
  ['Mexico City', 19.43, -99.13, false], ['Denver', 39.74, -104.99, true],
  ['Chicago', 41.88, -87.63, true], ['New York', 40.71, -74.01, true],
  ['Miami', 25.77, -80.19, true], ['Vancouver', 49.28, -123.12, false],
  ['Honolulu', 21.31, -157.86, true], ['Fairbanks', 64.84, -147.72, true],
  // Deep winter is always happening somewhere down here.
  ['McMurdo Station', -77.85, 166.67, false], ['Vostok Station', -78.46, 106.84, false],
  ['Concordia Station', -75.1, 123.33, false], ['Rothera Station', -67.57, -68.13, false],
  ['Summit Camp', 72.58, -38.46, false], ['Mount Washington', 44.27, -71.3, true],
  // …and the thunder belts.
  ['Maracaibo', 9.8, -71.55, false], ['Kampala', 0.31, 32.58, false],
  ['Bogor', -6.6, 106.8, false], ['Manaus', -3.12, -60.02, false],
  ['Kinshasa', -4.32, 15.31, false], ['Darwin', -12.46, 130.84, false],
  ['Panama City', 8.98, -79.52, false], ['Kuala Lumpur', 3.14, 101.69, false],
  ['Dhaka', 23.81, 90.41, false], ['Ho Chi Minh City', 10.82, 106.63, false],
  ['Cayenne', 4.92, -52.33, false], ['Colombo', 6.93, 79.86, false],
  // …and the places the wind never lets up. Deliberately deep: a condition is
  // only fun if pressing it twice can take you somewhere new, and wind needs
  // both a clear sky and 30km/h, which few places manage at any one moment.
  ['Cape Horn', -55.98, -67.27, false], ['Torshavn', 62.01, -6.77, false],
  ['Stanley', -51.7, -57.85, false], ['Wick', 58.44, -3.09, false],
  ['Perth', -31.95, 115.86, false], ['Hobart', -42.88, 147.33, false],
  ['Invercargill', -46.41, 168.35, false], ['Esperance', -33.86, 121.89, false],
  ['Port Elizabeth', -33.96, 25.6, false], ['Galway', 53.27, -9.05, false],
  ['Aberdeen', 57.15, -2.09, false], ['Bergen', 60.39, 5.32, false],
  ['Brest', 48.39, -4.49, false], ['Tarifa', 36.01, -5.6, false],
  ['Halifax', 44.65, -63.58, false], ["St John's", 47.56, -52.71, false],
  ['Iqaluit', 63.75, -68.52, false], ['Utqiagvik', 71.29, -156.79, true],
  ['Amarillo', 35.22, -101.83, true], ['Cheyenne', 41.14, -104.82, true],
  ['Dodge City', 37.75, -100.02, true], ['Casper', 42.85, -106.31, true],
  ['Wollongong', -34.42, 150.89, false], ['Napier', -39.49, 176.92, false],
  // Broader tropical sweep, so storms and showers vary too.
  ['Belem', -1.46, -48.5, false], ['Manaus North', -2.6, -60.7, false],
  ['Iquitos', -3.75, -73.25, false], ['Medellin', 6.24, -75.58, false],
  ['Havana', 23.11, -82.37, false], ['San Juan', 18.47, -66.11, true],
  ['Douala', 4.05, 9.77, false], ['Libreville', 0.42, 9.47, false],
  ['Addis Ababa', 9.03, 38.74, false], ['Dar es Salaam', -6.79, 39.21, false],
  ['Kolkata', 22.57, 88.36, false], ['Yangon', 16.87, 96.2, false],
  ['Medan', 3.6, 98.67, false], ['Pontianak', -0.02, 109.33, false],
  ['Port Moresby', -9.44, 147.18, false], ['Cairns', -16.92, 145.77, false],
  ['Suva', -18.14, 178.44, false], ['Davao', 7.19, 125.46, false],
];

// If nothing is doing the exact thing, fall back to the nearest relative
// rather than reporting that the world is out of weather.
const NEIGHBOURS: Partial<Record<Scene, Scene[]>> = {
  thunder: ['rain', 'drizzle'],
  snow: ['rain', 'cloudy'],
  wind: ['cloudy', 'clear'],
  rain: ['drizzle', 'thunder'],
  drizzle: ['rain', 'cloudy'],
  fog: ['cloudy'],
  clear: ['cloudy'],
  cloudy: ['clear'],
};

let lastCondPick: Partial<Record<Scene, string>> = {};

// One world scan covers every condition, so cache it. Open-Meteo bills a bulk
// request per location, and this list is long — re-scanning on every command
// burns through the rate limit fast enough to start failing.
let scanCache: Conditions[] | null = null;
let scanAt = 0;
const SCAN_TTL = 10 * 60 * 1000;

/** Finds a city somewhere on earth that is currently having `want`. */
async function fetchByCondition(want: Scene): Promise<Conditions> {
  if (scanCache && Date.now() - scanAt < SCAN_TTL) return choosePick(scanCache, want);

  const res = await fetch(
    'https://api.open-meteo.com/v1/forecast?' +
      new URLSearchParams({
        latitude: SCAN.map((c) => c[1]).join(','),
        longitude: SCAN.map((c) => c[2]).join(','),
        current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day',
        timezone: 'auto',
      })
  );
  if (!res.ok) throw new Error('weather');
  const raw = await res.json();
  const list: any[] = Array.isArray(raw) ? raw : [raw];

  const readings: Conditions[] = [];
  list.forEach((entry, i) => {
    const cur = entry?.current;
    if (!cur || !SCAN[i]) return;
    const code = Number(cur.weather_code);
    const known = WMO[code] ?? { label: 'Unknown', scene: 'cloudy' as Scene };
    const wind = Number(cur.wind_speed_10m) || 0;
    const scene: Scene =
      wind >= 30 && (known.scene === 'clear' || known.scene === 'cloudy') ? 'wind' : known.scene;
    readings.push({
      place: SCAN[i][0],
      lat: SCAN[i][1],
      lon: SCAN[i][2],
      temp: Number(cur.temperature_2m),
      feels: Number(cur.apparent_temperature),
      humidity: Number(cur.relative_humidity_2m),
      wind,
      isDay: cur.is_day === 1,
      time: localTime(cur.time),
      code,
      label: known.label,
      scene,
      imperial: SCAN[i][3],
    });
  });

  scanCache = readings;
  scanAt = Date.now();
  return choosePick(readings, want);
}

/** Picks a city for `want`, avoiding an immediate repeat of the last one. */
function choosePick(readings: Conditions[], want: Scene): Conditions {
  for (const scene of [want, ...(NEIGHBOURS[want] ?? [])]) {
    let pool = readings.filter((r) => r.scene === scene);
    if (!pool.length) continue;
    // Never hand back the same city twice in a row for the same word.
    const fresh = pool.filter((r) => r.place !== lastCondPick[want]);
    if (fresh.length) pool = fresh;
    const pick = { ...pool[Math.floor(Math.random() * pool.length)] };
    lastCondPick[want] = pick.place;
    // Say so when this isn't actually the condition that was asked for.
    if (scene !== want) pick.fellBackFrom = want;
    return pick;
  }
  throw new Error('nocondition');
}

async function fetchConditions(city: string): Promise<Conditions> {
  const loc = await locate(city);
  const res = await fetch(
    'https://api.open-meteo.com/v1/forecast?' +
      new URLSearchParams({
        latitude: String(loc.lat),
        longitude: String(loc.lon),
        current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day',
        timezone: 'auto',
      })
  );
  if (!res.ok) throw new Error('weather');
  const cur = (await res.json())?.current;
  if (!cur) throw new Error('weather');

  const code = Number(cur.weather_code);
  const known = WMO[code] ?? { label: 'Unknown', scene: 'cloudy' as Scene };
  const wind = Number(cur.wind_speed_10m) || 0;

  // A calm-but-windy day is more interesting as wind than as another cloud loop.
  const scene: Scene = wind >= 30 && (known.scene === 'clear' || known.scene === 'cloudy') ? 'wind' : known.scene;

  return {
    place: loc.place,
    lat: loc.lat,
    lon: loc.lon,
    temp: Number(cur.temperature_2m),
    feels: Number(cur.apparent_temperature),
    humidity: Number(cur.relative_humidity_2m),
    wind,
    isDay: cur.is_day === 1,
    time: localTime(cur.time),
    code,
    label: known.label,
    scene,
    imperial: loc.imperial,
  };
}

/** Character grid the scene renders into, serialized to colored spans per row. */
class Grid {
  chars: string[];
  colors: string[];
  constructor(public w: number, public h: number) {
    this.chars = new Array(w * h).fill(' ');
    this.colors = new Array(w * h).fill('');
  }
  clear() {
    this.chars.fill(' ');
    this.colors.fill('');
  }
  put(x: number, y: number, ch: string, color: string) {
    const xi = Math.round(x);
    const yi = Math.round(y);
    if (xi < 0 || yi < 0 || xi >= this.w || yi >= this.h) return;
    const i = yi * this.w + xi;
    this.chars[i] = ch;
    this.colors[i] = color;
  }
  text(x: number, y: number, s: string, color: string) {
    for (let i = 0; i < s.length; i++) this.put(x + i, y, s[i], color);
  }
  /** Runs of same-colored characters collapse into one span, so a frame is a
   *  few dozen DOM nodes instead of one per cell. Built into an array and
   *  joined once — this runs every frame, so it stays allocation-light. */
  html() {
    const parts: string[] = [];
    for (let y = 0; y < this.h; y++) {
      let run = '';
      let runColor = '';
      for (let x = 0; x < this.w; x++) {
        const i = y * this.w + x;
        const col = this.colors[i] || 'transparent';
        if (col !== runColor && run) {
          parts.push('<span style="color:', runColor, '">', escRun(run), '</span>');
          run = '';
        }
        runColor = col;
        run += this.chars[i];
      }
      if (run) parts.push('<span style="color:', runColor, '">', escRun(run), '</span>');
      parts.push('\n');
    }
    return parts.join('');
  }
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Escaping for a scene run. The glyph set is fixed and only ever contains one
 *  character that needs escaping, so skip the regex work in the common case. */
function escRun(s: string) {
  return s.indexOf('>') === -1 ? s : s.replace(/>/g, '&gt;');
}

type Drop = { x: number; y: number; vy: number; len: number; near: boolean };
type Flake = { x: number; y: number; vy: number; phase: number; sway: number; near: boolean };
type Splash = { x: number; y: number; life: number };
type Cloud = { x: number; y: number; w: number; speed: number; color: string };
type Streak = { x: number; y: number; vx: number; len: number };
type Leafy = { x: number; y: number; vx: number; phase: number };

/** Builds and runs the animation. Returns a stop function. */
function animate(pre: HTMLElement, cond: Conditions, w: number, h: number): () => void {
  const g = new Grid(w, h);
  const groundY = h - 1;
  const scene = cond.scene;

  const clouds: Cloud[] = [];
  const drops: Drop[] = [];
  const flakes: Flake[] = [];
  const splashes: Splash[] = [];
  const streaks: Streak[] = [];
  const leaves: Leafy[] = [];
  const stars: { x: number; y: number; phase: number }[] = [];
  const pile = new Array(w).fill(0); // snow depth per column

  let bolt: { pts: [number, number][]; life: number } | null = null;
  let boltAt = rand(1200, 3500);
  let flash = 0;

  // Wind pushes precipitation sideways; a stormy scene always feels blustery.
  const windPush = Math.max(-0.9, Math.min(0.9, (cond.wind / 60) * (scene === 'thunder' ? 1.6 : 1)));

  const cloudCount = scene === 'clear' ? 0 : scene === 'cloudy' || scene === 'wind' ? 3 : 4;
  for (let i = 0; i < cloudCount; i++) {
    clouds.push({
      x: rand(-w * 0.4, w),
      y: 1 + (i % 3),
      w: Math.round(rand(w * 0.22, w * 0.42)),
      speed: rand(1.4, 3.6) * (scene === 'wind' ? 3.2 : 1) * (windPush >= 0 ? 1 : -1),
      color: i % 3 === 0 ? C.cloudNear : i % 3 === 1 ? C.cloudMid : C.cloudFar,
    });
  }

  const dropTarget =
    scene === 'thunder' ? Math.round(w * 1.5) : scene === 'rain' ? Math.round(w * 0.9) : scene === 'drizzle' ? Math.round(w * 0.45) : 0;
  const flakeTarget = scene === 'snow' ? Math.round(w * 1.1) : 0;

  const spawnDrop = (fromTop: boolean): Drop => {
    const near = Math.random() > 0.45;
    return {
      x: rand(0, w),
      y: fromTop ? rand(-h, 4) : rand(3, 5),
      vy: (near ? rand(26, 34) : rand(16, 22)) * (scene === 'drizzle' ? 0.45 : 1),
      len: scene === 'thunder' ? (near ? 3 : 2) : near ? 2 : 1,
      near,
    };
  };
  const spawnFlake = (fromTop: boolean): Flake => {
    const near = Math.random() > 0.5;
    return {
      x: rand(0, w),
      y: fromTop ? rand(-h, 4) : rand(3, 5),
      vy: near ? rand(3.2, 5) : rand(1.8, 2.8),
      phase: rand(0, Math.PI * 2),
      sway: rand(0.6, 1.8),
      near,
    };
  };
  for (let i = 0; i < dropTarget; i++) drops.push(spawnDrop(true));
  for (let i = 0; i < flakeTarget; i++) flakes.push(spawnFlake(true));

  if (scene === 'wind') {
    for (let i = 0; i < Math.round(w * 0.35); i++)
      streaks.push({ x: rand(0, w), y: rand(1, groundY - 1), vx: rand(28, 55), len: Math.round(rand(3, 9)) });
    for (let i = 0; i < 5; i++) leaves.push({ x: rand(-w, w), y: rand(3, groundY - 1), vx: rand(12, 22), phase: rand(0, 6.28) });
  }

  if (!cond.isDay && (scene === 'clear' || scene === 'cloudy' || scene === 'wind')) {
    for (let i = 0; i < Math.round(w * 0.5); i++)
      stars.push({ x: rand(0, w), y: rand(0, groundY - 2), phase: rand(0, Math.PI * 2) });
  }

  const drawCloud = (c: Cloud) => {
    // Puffy top edge, flat-ish base — reads as a cloud at this resolution.
    const left = Math.round(c.x);
    const top = Math.round(c.y);
    for (let i = 0; i < c.w; i++) {
      const t = i / (c.w - 1);
      const bump = Math.sin(t * Math.PI);
      if (bump > 0.35) g.put(left + i, top, bump > 0.75 ? '_' : '.', c.color);
      g.put(left + i, top + 1, i === 0 ? '(' : i === c.w - 1 ? ')' : bump > 0.6 ? '@' : '#', c.color);
    }
  };

  const drawSun = (t: number, cx: number, cy: number) => {
    g.text(cx - 1, cy - 1, '\\|/', C.ray);
    g.text(cx - 2, cy, '-( )-', C.sun);
    g.put(cx, cy, '*', C.sun);
    g.text(cx - 1, cy + 1, '/|\\', C.ray);

    // Rays breathe on a slow cycle, and the diagonals run the cycle inverted —
    // so the corners reach out exactly as the straight rays pull in, and the
    // sun never sits still. They start flush against the disc (3 out
    // horizontally, 2 vertically) so there is no gap between it and its light.
    const wave = Math.sin(t / 700);
    const straightReach = Math.round(2 + 2 * wave);
    for (let r = 0; r <= straightReach; r++) {
      const dim = r === straightReach ? C.ray : C.sun;
      g.put(cx - 3 - r, cy, '-', dim);
      g.put(cx + 3 + r, cy, '-', dim);
      g.put(cx, cy - 2 - r, '|', dim);
      g.put(cx, cy + 2 + r, '|', dim);
    }
    // Opposite phase to the straight rays, but never below 1 — with the inner
    // `\|/` that keeps every diagonal at two slashes even at its shortest.
    const diagReach = Math.max(1, Math.round(2 - 1.5 * wave));
    for (let r = 0; r < diagReach; r++) {
      const d = 2 + r;
      const dim = r === diagReach - 1 ? C.ray : C.sun;
      g.put(cx - d, cy - d, '\\', dim);
      g.put(cx + d, cy - d, '/', dim);
      g.put(cx - d, cy + d, '/', dim);
      g.put(cx + d, cy + d, '\\', dim);
    }
  };

  // Crescent = a disc with a second disc bitten out of its right side. Drawn as
  // an outline: a cell is inked only when it is lit but has an unlit neighbour,
  // and the glyph follows the slope of the arc at that point.
  const drawMoon = (cx: number, cy: number) => {
    const R = Math.max(3, Math.min(5, Math.floor(h / 4)));
    // A shallow bite reads as a blob — offset it well left of the disc centre
    // so the lit sliver stays thin and tapers to points at both horns.
    const biteDx = R * 0.5;
    const biteR = R * 0.95;
    // Terminal cells are roughly twice as tall as they are wide, so squash x.
    const lit = (dx: number, dy: number) => {
      const x = dx / 2;
      return x * x + dy * dy <= R * R && (x - biteDx) ** 2 + dy * dy > biteR * biteR;
    };
    for (let dy = -R; dy <= R; dy++) {
      for (let dx = -R * 2; dx <= R * 2; dx++) {
        if (!lit(dx, dy)) continue;
        const edge = !lit(dx - 1, dy) || !lit(dx + 1, dy) || !lit(dx, dy - 1) || !lit(dx, dy + 1);
        if (!edge) {
          g.put(cx + dx, cy + dy, '#', C.moon); // lit face
          continue;
        }
        // The rim follows two different circles — the disc on the outside and
        // the bite on the inside. Measure the angle against whichever arc this
        // cell actually sits on, or the inner edge gets the outer edge's slope.
        const x = dx / 2;
        const onBite = Math.abs(Math.hypot(x - biteDx, dy) - biteR) < Math.abs(Math.hypot(x, dy) - R);
        const a = (Math.atan2(dy, onBite ? x - biteDx : x) * 180) / Math.PI;
        const abs = Math.abs(a);
        let ch: string;
        if (abs <= 25) ch = ')';
        else if (abs >= 155) ch = '(';
        else if (abs > 65 && abs < 115) ch = '_';
        else if (a > 0) ch = a < 90 ? '\\' : '/'; // upper half
        else ch = a > -90 ? '/' : '\\'; // lower half
        g.put(cx + dx, cy + dy, ch, C.moon);
      }
    }
  };

  const makeBolt = () => {
    const pts: [number, number][] = [];
    let x = rand(w * 0.2, w * 0.8);
    for (let y = 3; y <= groundY; y++) {
      x += rand(-1.6, 1.6);
      pts.push([x, y]);
    }
    return { pts, life: 320 };
  };

  let last = performance.now();
  let raf = 0;
  let stopped = false;
  let lastHtml = '';
  let lastShadow = '';

  const frame = (now: number) => {
    if (stopped) return;
    // Detached by `clear`, `exit`, or the scrollback trim — stop burning frames.
    if (!document.body.contains(pre)) return stop();

    const dt = Math.min(0.1, (now - last) / 1000);
    const t = now;
    last = now;
    g.clear();

    if (flash > 0) flash -= dt * 1000;

    // ── Sky ──
    for (const s of stars) {
      const tw = Math.sin(t / 420 + s.phase);
      if (tw > 0.1) g.put(s.x, s.y, tw > 0.75 ? '*' : tw > 0.4 ? '+' : '.', tw > 0.75 ? C.moon : C.star);
    }

    if (scene === 'clear' || scene === 'wind' || (scene === 'cloudy' && cond.code === 2)) {
      const cx = Math.round(w * 0.5);
      const cy = Math.max(3, Math.round(h * 0.4));
      if (cond.isDay) drawSun(t, cx, cy);
      else drawMoon(cx, cy);
    }

    // ── Clouds ──
    for (const c of clouds) {
      c.x += c.speed * dt;
      if (c.speed > 0 && c.x > w) c.x = -c.w;
      if (c.speed < 0 && c.x < -c.w) c.x = w;
      drawCloud(c);
    }

    // ── Fog ──
    if (scene === 'fog') {
      for (let band = 0; band < 5; band++) {
        const y = 2 + band * Math.max(1, Math.floor((h - 4) / 5));
        const off = (t / (90 + band * 45)) % (w * 2);
        for (let x = 0; x < w; x++) {
          const v = Math.sin((x + off) / 3.5 + band) + Math.sin((x - off) / 6 + band * 2);
          if (v > 0.9) g.put(x, y, '=', C.fog);
          else if (v > 0.2) g.put(x, y, '-', C.cloudFar);
        }
      }
    }

    // ── Wind ──
    for (const s of streaks) {
      s.x += s.vx * dt;
      if (s.x - s.len > w) {
        s.x = -rand(2, w * 0.5);
        s.y = rand(1, groundY - 1);
        s.len = Math.round(rand(3, 9));
      }
      for (let i = 0; i < s.len; i++) {
        const head = i === s.len - 1;
        g.put(s.x - i, s.y, head ? '>' : i < 2 ? '=' : '-', head ? C.gust : C.cloudFar);
      }
    }
    for (const l of leaves) {
      l.x += l.vx * dt;
      l.phase += dt * 6;
      if (l.x > w + 2) {
        l.x = -2;
        l.y = rand(3, groundY - 1);
      }
      const spin = ['/', '-', '\\', '|'][Math.floor(l.phase) % 4];
      g.put(l.x, l.y + Math.sin(l.phase / 2) * 1.2, spin, C.leaf);
    }

    // ── Rain / drizzle / storm ──
    for (const d of drops) {
      d.y += d.vy * dt;
      d.x += windPush * d.vy * dt * 0.5;
      if (d.y > groundY) {
        // Only the near, fat drops throw a visible splash.
        if (d.near && scene !== 'drizzle' && Math.random() > 0.55) splashes.push({ x: d.x, y: groundY, life: 260 });
        Object.assign(d, spawnDrop(false), { y: rand(-3, 1) });
        continue;
      }
      if (d.x < -2) d.x = w + 1;
      if (d.x > w + 2) d.x = -1;
      const col = scene === 'thunder' ? (d.near ? C.storm : C.cloudFar) : d.near ? C.rain : C.rainFar;
      const glyph = scene === 'drizzle' ? '.' : windPush > 0.25 ? '/' : windPush < -0.25 ? '\\' : '|';
      for (let i = 0; i < d.len; i++) g.put(d.x, d.y - i, glyph, col);
    }
    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i];
      s.life -= dt * 1000;
      if (s.life <= 0) {
        splashes.splice(i, 1);
        continue;
      }
      const stage = s.life > 170 ? 0 : s.life > 90 ? 1 : 2;
      if (stage === 0) g.put(s.x, s.y, 'v', C.splash);
      else if (stage === 1) {
        g.put(s.x - 1, s.y, '\\', C.splash);
        g.put(s.x + 1, s.y, '/', C.splash);
      } else {
        g.put(s.x - 1, s.y, '.', C.rainFar);
        g.put(s.x + 1, s.y, '.', C.rainFar);
      }
    }

    // ── Snow ──
    for (const f of flakes) {
      f.y += f.vy * dt;
      f.phase += dt * 1.6;
      f.x += (Math.sin(f.phase) * f.sway + windPush * 3) * dt;
      const col = Math.round(f.x);
      const landed = col >= 0 && col < w && f.y >= groundY - pile[col];
      if (landed || f.y > groundY) {
        // Cap the drift so it never swallows the scene, and let it settle
        // toward neighbours so the surface stays believable.
        if (col >= 0 && col < w && pile[col] < Math.min(3, h - 6)) {
          const l = pile[col - 1] ?? pile[col];
          const r = pile[col + 1] ?? pile[col];
          if (pile[col] - Math.min(l, r) >= 1) pile[col - 1 >= 0 && l <= r ? col - 1 : Math.min(w - 1, col + 1)] += 0.34;
          else pile[col] += 0.34;
        }
        Object.assign(f, spawnFlake(false), { y: rand(-3, 0) });
        continue;
      }
      if (f.x < -1) f.x = w;
      if (f.x > w + 1) f.x = -1;
      g.put(f.x, f.y, f.near ? '*' : '.', f.near ? C.snow : C.snowFar);
    }
    for (let x = 0; x < w; x++) {
      const d = Math.floor(pile[x]);
      for (let i = 0; i < d; i++) g.put(x, groundY - i, i === d - 1 ? '~' : '#', C.drift);
    }

    // ── Lightning ──
    if (scene === 'thunder') {
      boltAt -= dt * 1000;
      if (boltAt <= 0) {
        bolt = makeBolt();
        flash = 150;
        boltAt = rand(1400, 4200);
      }
      if (bolt) {
        bolt.life -= dt * 1000;
        if (bolt.life <= 0) bolt = null;
        else {
          // Flicker: the bolt blinks out briefly mid-life, like the real thing.
          const on = bolt.life > 240 || (bolt.life < 190 && bolt.life > 120) || bolt.life < 70;
          if (on) {
            for (let i = 1; i < bolt.pts.length; i++) {
              const [x, y] = bolt.pts[i];
              const [px] = bolt.pts[i - 1];
              g.put(x, y, x > px + 0.4 ? '\\' : x < px - 0.4 ? '/' : '|', C.bolt);
            }
          }
        }
      }
    }

    // ── Ground ──
    for (let x = 0; x < w; x++) if (!pile[x]) g.put(x, groundY, x % 2 ? '_' : '.', C.ground);

    // Reparsing identical markup is the single most expensive thing this loop
    // can do, and a mostly-still scene produces the same frame repeatedly.
    const html = g.html();
    if (html !== lastHtml) {
      lastHtml = html;
      pre.innerHTML = html;
    }
    const shadow = flash > 0 ? '0 0 14px rgba(255,224,102,0.75)' : '';
    if (shadow !== lastShadow) {
      lastShadow = shadow;
      pre.style.textShadow = shadow;
    }
    raf = requestAnimationFrame(frame);
  };

  const stop = () => {
    stopped = true;
    cancelAnimationFrame(raf);
    if (stopActive === stop) stopActive = null;
  };

  raf = requestAnimationFrame(frame);
  return stop;
}

// Cities the `try weather …` hint rotates through, so the argument form is
// discoverable without the help text having to spell it out. Deliberately
// spread across climates — half of these are having very different days.
const HINT_CITIES = [
  'tokyo', 'reykjavik', 'cairo', 'oslo', 'mumbai', 'lima', 'nairobi',
  'seoul', 'dublin', 'quito', 'kathmandu', 'marrakesh', 'ushuaia',
  'helsinki', 'hanoi', 'bogota', 'lisbon', 'tbilisi', 'honolulu', 'anchorage',
];

/** Swaps the city in the hint every 2s, cross-fading between names. */
function cycleCityHint(el: HTMLElement | null) {
  if (!el) return;
  let i = Math.floor(Math.random() * HINT_CITIES.length);
  el.textContent = HINT_CITIES[i];
  const timer = setInterval(() => {
    // Self-cleaning: the readout is gone once the terminal is cleared or exited.
    if (!document.body.contains(el)) return clearInterval(timer);
    el.style.opacity = '0';
    setTimeout(() => {
      if (!document.body.contains(el)) return;
      i = (i + 1) % HINT_CITIES.length;
      el.textContent = HINT_CITIES[i];
      el.style.opacity = '1';
    }, 350);
  }, 2000);
}

/**
 * Renders the `weather` command into `out`. `city` is optional — empty means
 * "wherever the visitor is".
 */
export function renderWeather(out: HTMLElement, termBody: HTMLElement, city: string) {
  stopWeather();

  const arg = city.trim().toLowerCase();

  // `weather help` — the subcommand listing.
  if (arg === 'help' || arg === '--help' || arg === '-h') {
    // Same shape as the top-level `help`: "- <name>: <what it does>".
    const pink = (s: string) => `<span style="color:${C.pink}">${s}</span>`;
    out.innerHTML =
      `Commands:<br/>` +
      `- ${pink('weather')}: the sky where you are<br/>` +
      `- ${pink('weather &lt;city&gt;')}: any city on earth — ` +
      `${pink('weather <span class="wx-city" style="transition:opacity 0.35s ease;">oslo</span>')}<br/>` +
      `- ${pink('weather &lt;condition&gt;')}: fetch city with condition<br/>` +
      `&nbsp;&nbsp;&nbsp;&nbsp;${CONDITION_WORDS.map(pink).join(' · ')}<br/>` +
      `- ${pink('weather help')}: this list` +
      `<br/><br/><span style="opacity:0.6">Tab after ${pink('weather')} to cycle the conditions.</span>`;

    cycleCityHint(out.querySelector<HTMLElement>('.wx-city'));
    setTimeout(() => {
      termBody.scrollTop = termBody.scrollHeight;
    }, 10);
    return;
  }

  const wantScene = CONDITIONS[arg];
  out.innerHTML = `<span style="color:${C.pink}">${
    wantScene ? `Looking for somewhere ${esc(arg)}…` : `Reading the sky${city ? ` over ${esc(city)}` : ''}…`
  }</span>`;

  (wantScene ? fetchByCondition(wantScene) : fetchConditions(city))
    .then((cond) => {
      if (!document.body.contains(out)) return;

      const unit = cond.imperial ? 'F' : 'C';
      const conv = (v: number) => Math.round(cond.imperial ? cToF(v) : v);
      const windUnit = cond.imperial ? 'mph' : 'km/h';
      const windVal = Math.round(cond.imperial ? cond.wind * 0.621371 : cond.wind);

      out.innerHTML = `
        <style>
          .wx-fullscreen {
            color: ${C.pink};
            text-decoration: none;
            font-size: 0.9em;
            white-space: nowrap;
            opacity: 0.85;
            transition: opacity 0.2s ease, color 0.2s ease;
          }
          .wx-fullscreen:hover {
            color: #FFFFFF;
            opacity: 1;
            text-decoration: underline;
          }
          .wx-temp {
            cursor: pointer;
            user-select: none;
            transition: opacity 0.2s ease;
          }
          .wx-temp:hover {
            opacity: 0.7;
          }
        </style>
        <div style="display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; margin-bottom:6px;">
          <span style="color:#FFFFFF; font-size:1.15em; font-weight:bold;">${esc(cond.place)}</span>
          <span style="color:${C.pink};">${esc(cond.label)}</span>
          <span style="flex:1"></span>
          <span style="color:${C.dim}; opacity:0.75;">${cond.isDay ? '☀' : '☾'} ${esc(cond.time)}</span>
        </div>
        ${
          cond.fellBackFrom
            ? `<div style="color:#FEBC2E; opacity:0.8; margin-bottom:6px;">nowhere on the list is ${esc(
                cond.fellBackFrom
              )} right now</div>`
            : ''
        }
        <pre class="wx-scene" style="margin:0; line-height:1.05; white-space:pre; overflow:hidden; font-family:inherit;"></pre>
        <div style="display:flex; gap:14px; flex-wrap:wrap; align-items:baseline; margin-top:6px;">
          <span class="wx-temp" title="Click to switch units" style="color:#FFFFFF; font-size:1.5em; font-weight:bold; line-height:1;">${conv(cond.temp)}°${unit}</span>
          <span style="color:${C.dim};">feels <span class="wx-feels" style="color:${C.pink}">${conv(cond.feels)}°${unit}</span></span>
          <span style="color:${C.dim};">humidity <span style="color:${C.pink}">${cond.humidity}%</span></span>
          <span style="color:${C.dim};">wind <span style="color:${C.pink}">${windVal} ${windUnit}</span></span>
          <span style="flex:1 1 auto;"></span>
          <a href="/weather?${new URLSearchParams({
            lat: String(cond.lat),
            lon: String(cond.lon),
            name: cond.place,
            imp: cond.imperial ? '1' : '0',
            // Night is known here, so the page can open already dark instead
            // of painting light and then transitioning.
            n: cond.isDay ? '0' : '1',
          })}" class="wx-fullscreen" target="_blank" rel="noopener" style="flex:0 0 auto;">see more</a>
        </div>
        <div style="margin-top:6px; opacity:0.55; color:${C.dim}; font-size:0.9em;">
          <span title="Weather data by Open-Meteo">weather</span> · try <span style="color:${C.pink}">weather <span class="wx-city" style="transition:opacity 0.35s ease;">tokyo</span></span>
        </div>`;

      // Click the temperature to swap units. Each city still opens in whatever
      // its own country uses.
      const tempEl = out.querySelector<HTMLElement>('.wx-temp');
      const feelsEl = out.querySelector<HTMLElement>('.wx-feels');
      if (tempEl && feelsEl) {
        let showF = cond.imperial;
        tempEl.addEventListener('click', (e) => {
          e.stopPropagation();
          showF = !showF;
          const u = showF ? 'F' : 'C';
          const t = Math.round(showF ? cToF(cond.temp) : cond.temp);
          const f = Math.round(showF ? cToF(cond.feels) : cond.feels);
          tempEl.textContent = `${t}°${u}`;
          feelsEl.textContent = `${f}°${u}`;
        });
      }

      const pre = out.querySelector<HTMLElement>('.wx-scene');
      if (!pre) return;
      cycleCityHint(out.querySelector<HTMLElement>('.wx-city'));

      /**
       * Measure, don't guess. With the scene emptied, everything else in the
       * readout collapses to its real height, so whatever is left over is
       * exactly what the scene may occupy — which keeps it to one screen at
       * any window size instead of pushing the header out of view.
       */
      const measure = () => {
        pre.innerHTML = '';
        pre.style.height = '0px';

        const probe = document.createElement('span');
        probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font:inherit;line-height:1.05;';
        probe.textContent = 'X'.repeat(50);
        pre.appendChild(probe);
        const box = probe.getBoundingClientRect();
        const charW = box.width / 50 || 7;
        const charH = box.height || 12;
        probe.remove();
        pre.style.height = '';

        const promptEl = document.getElementById('term-prompt-line');
        const chromeH = out.getBoundingClientRect().height; // header + readout + hint
        const promptH = promptEl ? promptEl.getBoundingClientRect().height : 0;

        // clientHeight includes the body's own padding, and getBoundingClientRect
        // excludes the prompt's margin — miss either and the prompt line ends up
        // clipped against the bottom of the window.
        const bodyStyle = getComputedStyle(termBody);
        const padY = parseFloat(bodyStyle.paddingTop) + parseFloat(bodyStyle.paddingBottom);
        const promptStyle = promptEl ? getComputedStyle(promptEl) : null;
        const promptMargin = promptStyle
          ? parseFloat(promptStyle.marginTop) + parseFloat(promptStyle.marginBottom)
          : 0;

        const availW = termBody.clientWidth - charW * 2;
        const availH = termBody.clientHeight - padY - chromeH - promptH - promptMargin - charH;
        return {
          w: Math.max(24, Math.min(140, Math.floor(availW / charW))),
          h: Math.max(6, Math.min(44, Math.floor(availH / charH))),
        };
      };

      const mount = () => {
        const { w, h } = measure();
        stopWeather();
        stopActive = animate(pre, cond, w, h);
        termBody.scrollTop = 0; // the scene fits, so there is nothing to scroll to
      };
      mount();

      // Re-fit on resize and when the terminal enters or leaves full screen.
      // Both listeners retire themselves once the readout is gone.
      let debounce = 0;
      const relayout = () => {
        if (!document.body.contains(pre)) {
          window.removeEventListener('resize', relayout);
          document.removeEventListener('fullscreenchange', relayout);
          return;
        }
        clearTimeout(debounce);
        debounce = window.setTimeout(mount, 120);
      };
      window.addEventListener('resize', relayout);
      document.addEventListener('fullscreenchange', relayout);
    })
    .catch((err) => {
      if (!document.body.contains(out)) return;
      out.innerHTML =
        err?.message === 'nocity'
          ? `<span style="color:#FF5F57">weather: no place called "${esc(city)}". Try <span style="color:${C.pink}">weather help</span>.</span>`
          : err?.message === 'nocondition'
            ? `<span style="color:#FF5F57">weather: nowhere on the list is ${esc(arg)} right now.</span>`
            : `<span style="color:#FF5F57">weather: could not reach the sky. Check your connection and retry.</span>`;
    });
}
