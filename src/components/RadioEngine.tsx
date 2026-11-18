import { useEffect, useRef } from "react";
import { PREVIEW } from "../env";
import { reportClick } from "../lib/radio";
import { useCity, useStore } from "../store";

/** Headless <audio> controller for the live radio + Media Session (lock-screen) wiring. */
export function RadioEngine() {
  const audio = useRef<HTMLAudioElement>(null);
  const city = useCity();
  const started = useStore((s) => s.started);
  const stations = useStore((s) => s.stations);
  const index = useStore((s) => s.stationIndex);
  const playing = useStore((s) => s.radioPlaying);
  const volume = useStore((s) => s.volumes.radio);
  const muted = useStore((s) => s.muted);
  const phase = useStore((s) => s.timer.phase);
  const timerRunning = useStore((s) => s.timer.running);
  const autoAdvance = useStore((s) => s.settings.autoAdvance);
  const station = stations[index];

  // Break time lowers the radio instead of stopping it.
  const duck = timerRunning && phase === "break" ? 0.4 : 1;

  useEffect(() => {
    const el = audio.current;
    if (!el || PREVIEW) return;
    el.volume = Math.min(1, volume * duck) ** 1.5;
    el.muted = muted;
  }, [volume, muted, duck]);

  useEffect(() => {
    const el = audio.current;
    if (!el || PREVIEW || !started) return;
    if (!station) { el.removeAttribute("src"); el.load(); return; }
    if (el.dataset.id !== station.id) {
      el.src = station.url;
      el.dataset.id = station.id;
      reportClick(station.id);
    }
    if (playing) {
      useStore.getState().setRadioBuffering(true);
      el.play().catch(() => useStore.getState().setRadioPlaying(false));
    } else el.pause();
  }, [station, playing, started]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    ms.metadata = station
      ? new MediaMetadata({ title: station.name, artist: `${city.name} · Rainwalk`, album: "Canlı radyo" })
      : null;
    const s = useStore.getState;
    ms.setActionHandler("play", () => s().setRadioPlaying(true));
    ms.setActionHandler("pause", () => s().setRadioPlaying(false));
    ms.setActionHandler("nexttrack", () => s().stepStation(1));
    ms.setActionHandler("previoustrack", () => s().stepStation(-1));
  }, [station, city.name]);

  if (PREVIEW) return null;
  return (
    <audio
      ref={audio}
      preload="none"
      onPlaying={() => useStore.getState().setRadioBuffering(false)}
      onWaiting={() => useStore.getState().setRadioBuffering(true)}
      onError={() => {
        const s = useStore.getState();
        s.setRadioBuffering(false);
        if (autoAdvance && s.stations.length > 1) {
          s.showToast("İstasyon yanıt vermedi, sıradakine geçildi");
          s.stepStation(1);
        }
      }}
    />
  );
}
