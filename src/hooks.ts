import { useEffect, useRef, useState } from "react";
import { PREVIEW } from "./env";
import { sampleStations } from "./data/sampleStations";
import { fetchStations } from "./lib/radio";
import { fetchWeather, type Weather } from "./lib/weather";
import { ambient } from "./lib/ambient";
import { useCity, useStore } from "./store";
import type { City } from "./data/cities";

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export function localTime(now: number, timeZone: string) {
  return new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit", timeZone }).format(now);
}

/** True after `ms` without pointer/keyboard activity. */
export function useIdle(ms = 3500) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    let t = 0;
    const wake = () => {
      setIdle(false);
      clearTimeout(t);
      t = window.setTimeout(() => {
        // never hide while a control has keyboard focus
        if (document.activeElement && document.activeElement !== document.body && document.activeElement.matches(":focus-visible")) return;
        setIdle(true);
      }, ms);
    };
    wake();
    const evs = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"] as const;
    evs.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    return () => {
      clearTimeout(t);
      evs.forEach((e) => window.removeEventListener(e, wake));
    };
  }, [ms]);
  return idle;
}

/** Loads the station list whenever city or genre changes. */
export function useStationLoader() {
  const city = useCity();
  const genre = useStore((s) => s.genre);
  const setStations = useStore((s) => s.setStations);
  useEffect(() => {
    if (PREVIEW) {
      const list = sampleStations(city.countryCode);
      const t = setTimeout(() => setStations(list, "ready"), 450);
      return () => clearTimeout(t);
    }
    const ctl = new AbortController();
    setStations([], "loading");
    fetchStations(city.countryCode, genre, ctl.signal)
      .then((list) => setStations(list, list.length ? "ready" : "error"))
      .catch(() => !ctl.signal.aborted && setStations([], "error"));
    return () => ctl.abort();
  }, [city.countryCode, genre, setStations]);
}

const weatherCache = new Map<string, Weather>();
const sampleWeather: Record<string, Weather> = {};

export function useWeather(city: City) {
  const [w, setW] = useState<Weather | null>(weatherCache.get(city.id) ?? null);
  useEffect(() => {
    if (PREVIEW) {
      sampleWeather[city.id] ??= { temp: Math.round(4 + ((city.lat * 7) % 14)), code: [61, 63, 3, 80, 53][city.id.length % 5], isDay: false };
      setW(sampleWeather[city.id]);
      return;
    }
    const hit = weatherCache.get(city.id);
    if (hit) { setW(hit); return; }
    const ctl = new AbortController();
    fetchWeather(city.lat, city.lon, ctl.signal)
      .then((res) => { weatherCache.set(city.id, res); setW(res); })
      .catch(() => {});
    return () => ctl.abort();
  }, [city]);
  return w;
}

/** Keeps the Web Audio ambient engine in sync with store levels. */
export function useAmbientSync() {
  const started = useStore((s) => s.started);
  const levels = useStore((s) => s.ambient);
  const muted = useStore((s) => s.muted);
  useEffect(() => {
    if (!started) return;
    (Object.keys(levels) as (keyof typeof levels)[]).forEach((k) => ambient.set(k, muted ? 0 : levels[k]));
  }, [started, levels, muted]);
}

/** Drives the focus timer and plays a chime at phase changes. */
export function useTimerTick() {
  const timer = useStore((s) => s.timer);
  const advance = useStore((s) => s.timerAdvance);
  useEffect(() => {
    if (!timer.running || !timer.endsAt) return;
    const ms = timer.endsAt - Date.now();
    const t = setTimeout(() => {
      ambient.chime();
      advance();
    }, Math.max(0, ms));
    return () => clearTimeout(t);
  }, [timer.running, timer.endsAt, advance]);
}

export function timerRemaining(t: ReturnType<typeof useStore.getState>["timer"], now: number) {
  return t.running && t.endsAt ? Math.max(0, Math.round((t.endsAt - now) / 1000)) : t.remaining;
}

export function fmtMMSS(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Global keyboard shortcuts. */
export function useHotkeys() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [contenteditable]") && e.key !== "Escape") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const s = useStore.getState();
      if (!s.started) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ambient.resume(); s.start(); }
        return;
      }
      switch (e.key) {
        case " ":
          if (el.closest("button, [role=slider]")) return;
          e.preventDefault(); s.setRadioPlaying(!s.radioPlaying); break;
        case "ArrowRight": if (!el.closest("[role=slider]")) s.stepCity(1); break;
        case "ArrowLeft": if (!el.closest("[role=slider]")) s.stepCity(-1); break;
        case "ArrowDown": if (!el.closest("[role=slider]")) { e.preventDefault(); s.stepStation(1); } break;
        case "ArrowUp": if (!el.closest("[role=slider]")) { e.preventDefault(); s.stepStation(-1); } break;
        case "f": case "F": s.toggleFocus(); break;
        case "m": case "M": s.toggleMute(); s.showToast(s.muted ? "Ses açıldı" : "Sessiz"); break;
        case "s": case "S": s.shuffleCity(); break;
        case "t": case "T": s.timerToggle(); break;
        case "c": case "C": s.togglePanel("cities"); break;
        case "r": case "R": s.togglePanel("stations"); break;
        case "x": case "X": s.togglePanel("mixer"); break;
        case "?": s.togglePanel("settings"); break;
        case "Escape": if (s.panel) s.setPanel(null); else if (s.focus) s.toggleFocus(); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

export function usePrevious<T>(v: T) {
  const r = useRef<T>(v);
  useEffect(() => { r.current = v; }, [v]);
  return r.current;
}
