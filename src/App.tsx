import { useEffect } from "react";
import { Caption, Dock, FocusStrip, TopBar } from "./components/Chrome";
import { Panel } from "./components/Panels";
import { RadioEngine } from "./components/RadioEngine";
import { Splash } from "./components/Splash";
import { VideoWindow } from "./components/VideoWindow";
import { PREVIEW } from "./env";
import { useAmbientSync, useHotkeys, useIdle, useStationLoader, useTimerTick } from "./hooks";
import { useCity, useStore } from "./store";

export default function App() {
  const city = useCity();
  const started = useStore((s) => s.started);
  const focus = useStore((s) => s.focus);
  const panel = useStore((s) => s.panel);
  const settings = useStore((s) => s.settings);
  const toast = useStore((s) => s.toast);
  const phase = useStore((s) => s.timer.phase);
  const timerRunning = useStore((s) => s.timer.running);
  const idle = useIdle(focus ? 2500 : 6000);

  useStationLoader();
  useAmbientSync();
  useTimerTick();
  useHotkeys();

  // follow the OS motion preference on first run
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) useStore.getState().setSetting("reduceMotion", true);
    if (window.matchMedia?.("(prefers-reduced-transparency: reduce)").matches) useStore.getState().setSetting("solid", true);
  }, []);

  useEffect(() => { document.title = started ? `${city.name} · Rainwalk` : "Rainwalk"; }, [city.name, started]);

  return (
    <div
      className="app"
      style={{ ["--city-h" as string]: city.hue }}
      data-started={started}
      data-focus={focus}
      data-panel={!!panel}
      data-solid={settings.solid}
      data-reduce={settings.reduceMotion}
      data-idle={idle}
      data-break={timerRunning && phase === "break"}
    >
      <div className="glow" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <RadioEngine />

      {!started ? (
        <Splash />
      ) : (
        <>
          <TopBar />
          <main className="stage">
            <section className="window" aria-label={`${city.name} yürüyüşü`}>
              <div className="window__frame">
                <VideoWindow />
                {PREVIEW && <span className="window__badge mono">ÖNİZLEME · burada YouTube şehir yürüyüşü oynar</span>}
              </div>
            </section>
            <Panel />
          </main>
          <footer className="bottom">
            {focus ? <FocusStrip /> : (<><Caption /><Dock /></>)}
          </footer>
        </>
      )}

      <div className={`toast ${toast ? "is-on" : ""}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
