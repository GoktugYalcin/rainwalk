import { useEffect, useRef, useState } from "react";
import { PREVIEW } from "../env";
import { useCity, useStore } from "../store";
import { RainScene } from "./RainScene";

/* Minimal typings for the YouTube IFrame API */
type YTPlayer = {
  loadVideoById: (o: { videoId: string; startSeconds?: number }) => void;
  setVolume: (v: number) => void;
  mute: () => void;
  unMute: () => void;
  playVideo: () => void;
  destroy: () => void;
};
declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: unknown) => YTPlayer; PlayerState: Record<string, number> };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;
function loadYouTubeAPI() {
  if (window.YT?.Player) return Promise.resolve();
  apiPromise ??= new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(); };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.head.appendChild(s);
  });
  return apiPromise;
}

/**
 * The "window" onto the city. Nothing is ever drawn on top of the YouTube player
 * (YouTube API Required Minimum Functionality) — the procedural rain scene only
 * shows while the video is loading, then fades away underneath.
 */
export function VideoWindow() {
  const city = useCity();
  const started = useStore((s) => s.started);
  const street = useStore((s) => s.volumes.street);
  const muted = useStore((s) => s.muted);
  const reduceMotion = useStore((s) => s.settings.reduceMotion);
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  /** Last time we unmuted; a pause right after it means the browser refused sound (iOS). */
  const unmutedAt = useRef(0);
  const soundBlocked = useRef(false);
  const everPlayed = useRef(false);

  // create player once
  useEffect(() => {
    if (PREVIEW || !host.current) return;
    let disposed = false;
    loadYouTubeAPI().then(() => {
      if (disposed || !host.current || !window.YT) return;
      const mount = document.createElement("div");
      host.current.appendChild(mount);
      player.current = new window.YT.Player(mount, {
        videoId: city.videoId,
        playerVars: {
          autoplay: 1, mute: 1, controls: 0, playsinline: 1, rel: 0,
          iv_load_policy: 3, disablekb: 1, fs: 0, cc_load_policy: 0, start: city.start,
        },
        events: {
          onReady: () => { setReady(true); player.current?.mute(); player.current?.playVideo(); },
          onStateChange: (e: { data: number }) => {
            const p = player.current;
            switch (e.data) {
              case 1: // playing
                everPlayed.current = true;
                setPlaying(true);
                break;
              case 2: // paused — the user can't pause the walk, so this is the browser
                setPlaying(false);
                if (!p) break;
                if (Date.now() - unmutedAt.current < 2000 && !soundBlocked.current) {
                  // iOS pauses inline video that gains sound without a tap inside the frame
                  soundBlocked.current = true;
                  useStore.getState().showToast("Bu tarayıcı video sesine izin vermiyor, sokak sesi kapalı");
                  p.mute();
                }
                p.playVideo();
                break;
              case -1: case 5: // unstarted / cued: autoplay was blocked, keep nudging muted
                if (!everPlayed.current) setPlaying(false);
                p?.mute();
                p?.playVideo();
                break;
              case 0: // ended
                useStore.getState().stepCity(1);
                break;
            }
          },
          onError: () => {
            const s = useStore.getState();
            s.showToast("Bu yürüyüş şu an oynatılamıyor, sıradaki şehre geçildi");
            s.stepCity(1);
          },
        },
      });
    });
    return () => { disposed = true; player.current?.destroy(); player.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // switch city
  useEffect(() => {
    if (!ready || !player.current) return;
    setPlaying(false);
    everPlayed.current = false;
    player.current.loadVideoById({ videoId: city.videoId, startSeconds: city.start });
  }, [city.videoId, city.start, ready]);

  // street sound = the video's own audio (never separated from its picture)
  useEffect(() => {
    const p = player.current;
    if (!ready || !p) return;
    if (!started || !playing || muted || street === 0 || soundBlocked.current) p.mute();
    else {
      unmutedAt.current = Date.now();
      p.unMute();
      p.setVolume(Math.round(street * 100));
    }
  }, [ready, started, street, muted, playing]);

  // resume after the tab/app comes back to the foreground
  useEffect(() => {
    const onVis = () => { if (document.visibilityState === "visible") player.current?.playVideo(); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div className="window__media">
      <RainScene hue={city.hue} still={reduceMotion} className={`window__scene ${playing ? "is-hidden" : ""}`} />
      {!PREVIEW && <div ref={host} className={`window__yt ${playing ? "is-on" : ""}`} aria-hidden="true" />}
    </div>
  );
}
