export type Station = {
  id: string;
  name: string;
  url: string;
  favicon?: string;
  tags: string[];
  codec?: string;
  bitrate?: number;
};

export const GENRES = [
  { id: "all", label: "Hepsi", tag: "" },
  { id: "pop", label: "Pop", tag: "pop" },
  { id: "jazz", label: "Caz", tag: "jazz" },
  { id: "lofi", label: "Chill", tag: "chillout" },
  { id: "classical", label: "Klasik", tag: "classical" },
  { id: "rock", label: "Rock", tag: "rock" },
] as const;

export type GenreId = (typeof GENRES)[number]["id"];

// radio-browser.info is a community API with several mirrors; try them in order.
const MIRRORS = [
  "https://de1.api.radio-browser.info",
  "https://de2.api.radio-browser.info",
  "https://fi1.api.radio-browser.info",
  "https://nl1.api.radio-browser.info",
];

type RawStation = {
  stationuuid: string;
  name: string;
  url_resolved: string;
  favicon: string;
  tags: string;
  codec: string;
  bitrate: number;
};

const cache = new Map<string, Station[]>();

export async function fetchStations(countryCode: string, genre: GenreId, signal?: AbortSignal): Promise<Station[]> {
  const key = `${countryCode}:${genre}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const tag = GENRES.find((g) => g.id === genre)?.tag ?? "";
  const params = new URLSearchParams({
    countrycode: countryCode,
    limit: "40",
    hidebroken: "true",
    is_https: "true",
    order: "clickcount",
    reverse: "true",
  });
  if (tag) params.set("tag", tag);

  let lastError: unknown;
  for (const base of MIRRORS) {
    try {
      const res = await fetch(`${base}/json/stations/search?${params}`, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw: RawStation[] = await res.json();
      const seen = new Set<string>();
      const stations = raw
        .filter((s) => s.url_resolved?.startsWith("https://"))
        .filter((s) => {
          const n = s.name.trim().toLowerCase();
          if (seen.has(n)) return false;
          seen.add(n);
          return true;
        })
        .map<Station>((s) => ({
          id: s.stationuuid,
          name: s.name.trim(),
          url: s.url_resolved,
          favicon: s.favicon || undefined,
          tags: s.tags ? s.tags.split(",").filter(Boolean).slice(0, 3) : [],
          codec: s.codec,
          bitrate: s.bitrate,
        }));
      cache.set(key, stations);
      return stations;
    } catch (err) {
      if (signal?.aborted) throw err;
      lastError = err;
    }
  }
  throw lastError ?? new Error("Radyo listesi alınamadı");
}

/** Ping a station so it counts towards radio-browser's popularity (polite API usage). */
export function reportClick(id: string) {
  fetch(`${MIRRORS[0]}/json/url/${id}`).catch(() => {});
}
