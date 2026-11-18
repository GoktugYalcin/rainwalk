import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CITIES } from "./data/cities";
import type { AmbientId } from "./lib/ambient";
import type { GenreId, Station } from "./lib/radio";

export type PanelId = "cities" | "stations" | "mixer" | "timer" | "settings" | null;
export type TimerPhase = "focus" | "break";

type State = {
  started: boolean;
  cityId: string;
  genre: GenreId;
  stations: Station[];
  stationsStatus: "idle" | "loading" | "ready" | "error";
  stationIndex: number;
  radioPlaying: boolean;
  radioBuffering: boolean;
  favorites: Station[];
  volumes: { street: number; radio: number };
  ambient: Record<AmbientId, number>;
  muted: boolean;
  panel: PanelId;
  focus: boolean;
  settings: { solid: boolean; reduceMotion: boolean; autoAdvance: boolean };
  timer: {
    focusMin: number;
    breakMin: number;
    phase: TimerPhase;
    running: boolean;
    endsAt: number | null;
    remaining: number; // seconds, used while paused
    sessions: number;
  };
  toast: string | null;
};

type Actions = {
  start: () => void;
  setCity: (id: string) => void;
  stepCity: (dir: 1 | -1) => void;
  shuffleCity: () => void;
  setGenre: (g: GenreId) => void;
  setStations: (s: Station[], status: State["stationsStatus"]) => void;
  setStationIndex: (i: number) => void;
  stepStation: (dir: 1 | -1) => void;
  setRadioPlaying: (p: boolean) => void;
  setRadioBuffering: (b: boolean) => void;
  toggleFavorite: (s: Station) => void;
  playStation: (s: Station) => void;
  setVolume: (k: keyof State["volumes"], v: number) => void;
  setAmbient: (k: AmbientId, v: number) => void;
  toggleMute: () => void;
  setPanel: (p: PanelId) => void;
  togglePanel: (p: Exclude<PanelId, null>) => void;
  toggleFocus: () => void;
  setSetting: <K extends keyof State["settings"]>(k: K, v: State["settings"][K]) => void;
  timerToggle: () => void;
  timerReset: () => void;
  timerPreset: (focusMin: number, breakMin: number) => void;
  timerAdvance: () => void;
  showToast: (t: string) => void;
};

const idx = (id: string) => Math.max(0, CITIES.findIndex((c) => c.id === id));

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      started: false,
      cityId: CITIES[0].id,
      genre: "all",
      stations: [],
      stationsStatus: "idle",
      stationIndex: 0,
      radioPlaying: false,
      radioBuffering: false,
      favorites: [],
      volumes: { street: 0.35, radio: 0.6 },
      ambient: { rain: 0.4, thunder: 0, wind: 0, cafe: 0, brown: 0 },
      muted: false,
      panel: null,
      focus: false,
      settings: { solid: false, reduceMotion: false, autoAdvance: true },
      timer: { focusMin: 25, breakMin: 5, phase: "focus", running: false, endsAt: null, remaining: 25 * 60, sessions: 0 },
      toast: null,

      start: () => set({ started: true, radioPlaying: true }),
      setCity: (id) => set({ cityId: id, stationIndex: 0, stations: [], stationsStatus: "loading" }),
      stepCity: (dir) => {
        const i = (idx(get().cityId) + dir + CITIES.length) % CITIES.length;
        get().setCity(CITIES[i].id);
      },
      shuffleCity: () => {
        const cur = get().cityId;
        const pool = CITIES.filter((c) => c.id !== cur);
        get().setCity(pool[Math.floor(Math.random() * pool.length)].id);
      },
      setGenre: (genre) => set({ genre, stationIndex: 0, stations: [], stationsStatus: "loading" }),
      setStations: (stations, stationsStatus) => set({ stations, stationsStatus }),
      setStationIndex: (stationIndex) => set({ stationIndex, radioPlaying: true }),
      stepStation: (dir) => {
        const { stations, stationIndex } = get();
        if (!stations.length) return;
        set({ stationIndex: (stationIndex + dir + stations.length) % stations.length, radioPlaying: true });
      },
      setRadioPlaying: (radioPlaying) => set({ radioPlaying }),
      setRadioBuffering: (radioBuffering) => set({ radioBuffering }),
      toggleFavorite: (s) => {
        const favs = get().favorites;
        const has = favs.some((f) => f.id === s.id);
        set({ favorites: has ? favs.filter((f) => f.id !== s.id) : [s, ...favs].slice(0, 30) });
        get().showToast(has ? "Favorilerden çıkarıldı" : "Favorilere eklendi");
      },
      playStation: (s) => {
        const { stations } = get();
        const i = stations.findIndex((x) => x.id === s.id);
        if (i >= 0) set({ stationIndex: i, radioPlaying: true });
        else set({ stations: [s, ...stations], stationIndex: 0, radioPlaying: true });
      },
      setVolume: (k, v) => set({ volumes: { ...get().volumes, [k]: v }, muted: false }),
      setAmbient: (k, v) => set({ ambient: { ...get().ambient, [k]: v }, muted: false }),
      toggleMute: () => set({ muted: !get().muted }),
      setPanel: (panel) => set({ panel }),
      togglePanel: (p) => set({ panel: get().panel === p ? null : p, focus: false }),
      toggleFocus: () => set({ focus: !get().focus, panel: null }),
      setSetting: (k, v) => set({ settings: { ...get().settings, [k]: v } }),

      timerToggle: () => {
        const t = get().timer;
        if (t.running) {
          const remaining = Math.max(0, Math.round(((t.endsAt ?? Date.now()) - Date.now()) / 1000));
          set({ timer: { ...t, running: false, endsAt: null, remaining } });
        } else {
          set({ timer: { ...t, running: true, endsAt: Date.now() + t.remaining * 1000 } });
        }
      },
      timerReset: () => {
        const t = get().timer;
        set({ timer: { ...t, running: false, endsAt: null, phase: "focus", remaining: t.focusMin * 60 } });
      },
      timerPreset: (focusMin, breakMin) => {
        const t = get().timer;
        set({ timer: { ...t, focusMin, breakMin, phase: "focus", running: false, endsAt: null, remaining: focusMin * 60 } });
      },
      timerAdvance: () => {
        const t = get().timer;
        const phase: TimerPhase = t.phase === "focus" ? "break" : "focus";
        const secs = (phase === "focus" ? t.focusMin : t.breakMin) * 60;
        set({
          timer: {
            ...t,
            phase,
            remaining: secs,
            endsAt: Date.now() + secs * 1000,
            running: true,
            sessions: t.phase === "focus" ? t.sessions + 1 : t.sessions,
          },
        });
        get().showToast(phase === "break" ? "Mola zamanı — radyo kısıldı" : "Odak zamanı");
      },
      showToast: (toast) => {
        set({ toast });
        window.clearTimeout((get() as unknown as { _tt?: number })._tt);
        (get() as unknown as { _tt?: number })._tt = window.setTimeout(() => set({ toast: null }), 2600);
      },
    }),
    {
      name: "rainwalk:v2",
      partialize: (s) => ({
        cityId: s.cityId,
        genre: s.genre,
        favorites: s.favorites,
        volumes: s.volumes,
        ambient: s.ambient,
        settings: s.settings,
        timer: { ...s.timer, running: false, endsAt: null },
      }),
      storage: {
        getItem: (k) => {
          try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; }
        },
        setItem: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
        removeItem: (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
      },
    },
  ),
);

export const useCity = () => {
  const id = useStore((s) => s.cityId);
  return CITIES.find((c) => c.id === id) ?? CITIES[0];
};
