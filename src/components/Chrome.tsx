import { CITIES } from "../data/cities";
import { fmtMMSS, localTime, timerRemaining, useNow, useWeather } from "../hooks";
import { isRainy, weatherLabel } from "../lib/weather";
import { useCity, useStore } from "../store";
import { Icon, type IconName } from "./icons";
import { Eq, IconButton, Slider } from "./ui";

export function weatherIcon(code: number): IconName {
  if (code === 0) return "sun";
  if (code >= 71 && code <= 86 && !(code >= 80 && code <= 82)) return "snow";
  if (isRainy(code)) return "rain";
  return "cloud";
}

export function Brand() {
  return (
    <div className="brand">
      <span className="brand__mark" aria-hidden="true"><Icon name="drop" size={14} /></span>
      <span className="brand__word">Rainwalk</span>
    </div>
  );
}

export function TopBar() {
  const panel = useStore((s) => s.panel);
  const focus = useStore((s) => s.focus);
  const timer = useStore((s) => s.timer);
  const muted = useStore((s) => s.muted);
  const s = useStore.getState;
  const now = useNow();
  const remaining = timerRemaining(timer, now);
  const timerTouched = timer.running || remaining !== timer.focusMin * 60;

  return (
    <header className="topbar">
      <Brand />
      <nav className="topbar__nav" aria-label="Paneller">
        <button className={`tab ${panel === "cities" ? "is-active" : ""}`} onClick={() => s().togglePanel("cities")}>
          <Icon name="pin" size={16} /> <span>Şehirler</span>
        </button>
        <button className={`tab ${panel === "stations" ? "is-active" : ""}`} onClick={() => s().togglePanel("stations")}>
          <Icon name="radio" size={16} /> <span>Radyolar</span>
        </button>
        <button className={`tab ${panel === "mixer" ? "is-active" : ""}`} onClick={() => s().togglePanel("mixer")}>
          <Icon name="mixer" size={16} /> <span>Mikser</span>
        </button>
        <button className={`tab ${panel === "timer" ? "is-active" : ""} ${timer.running ? "is-live" : ""}`} onClick={() => s().togglePanel("timer")}>
          <Icon name="timer" size={16} />
          <span className={timerTouched ? "mono" : ""}>{timerTouched ? fmtMMSS(remaining) : "Odak"}</span>
        </button>
      </nav>
      <div className="topbar__actions">
        <IconButton icon={muted ? "mute" : "volume"} label={muted ? "Sesi aç" : "Sessize al"} kbd="M" active={muted}
          onClick={() => s().toggleMute()} />
        <IconButton icon="keyboard" label="Ayarlar ve kısayollar" kbd="?" active={panel === "settings"} onClick={() => s().togglePanel("settings")} />
        <IconButton icon={focus ? "collapse" : "expand"} label={focus ? "Odak modundan çık" : "Odak modu"} kbd="F" onClick={() => s().toggleFocus()} />
      </div>
    </header>
  );
}

export function Caption() {
  const city = useCity();
  const now = useNow(15000);
  const weather = useWeather(city);
  const s = useStore.getState;
  const i = CITIES.findIndex((c) => c.id === city.id);
  const coords = `${Math.abs(city.lat).toFixed(2)}°${city.lat >= 0 ? "N" : "S"} ${Math.abs(city.lon).toFixed(2)}°${city.lon >= 0 ? "E" : "W"}`;

  return (
    <div className="caption">
      <div className="caption__eyebrow mono">
        <span>{String(i + 1).padStart(2, "0")}/{String(CITIES.length).padStart(2, "0")}</span>
        <span className="sep" />
        <span>{coords}</span>
      </div>
      <div className="caption__row">
        <h1 className="caption__city" key={city.id}>{city.name}</h1>
        <div className="caption__pager">
          <IconButton icon="left" label="Önceki şehir" kbd="←" onClick={() => s().stepCity(-1)} />
          <IconButton icon="right" label="Sonraki şehir" kbd="→" onClick={() => s().stepCity(1)} />
          <IconButton icon="shuffle" label="Rastgele şehir" kbd="S" onClick={() => s().shuffleCity()} />
        </div>
      </div>
      <div className="caption__meta">
        <span>{city.country}</span>
        <span className="dot" />
        <span className="mono">{localTime(now, city.timeZone)}</span>
        {weather && (
          <>
            <span className="dot" />
            <span className="caption__wx"><Icon name={weatherIcon(weather.code)} size={15} /> {weather.temp}° {weatherLabel(weather.code)}</span>
          </>
        )}
      </div>
    </div>
  );
}

export function Dock() {
  const stations = useStore((s) => s.stations);
  const status = useStore((s) => s.stationsStatus);
  const index = useStore((s) => s.stationIndex);
  const playing = useStore((s) => s.radioPlaying);
  const buffering = useStore((s) => s.radioBuffering);
  const volume = useStore((s) => s.volumes.radio);
  const favorites = useStore((s) => s.favorites);
  const s = useStore.getState;
  const st = stations[index];
  const fav = !!st && favorites.some((f) => f.id === st.id);

  return (
    <div className="dock" role="region" aria-label="Canlı radyo">
      <button className="dock__art" onClick={() => s().togglePanel("stations")} aria-label="İstasyon listesini aç">
        <span className="dock__initial">{st ? st.name.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 2) : "··"}</span>
      </button>
      <div className="dock__info">
        <div className="dock__label mono">
          <span className={`live ${playing && !buffering ? "is-on" : ""}`}>CANLI</span>
          <span className="dock__tags" lang="en">{st ? st.tags.slice(0, 2).join(" · ") : status === "error" ? "istasyon bulunamadı" : "aranıyor"}</span>
        </div>
        <div className="dock__name" aria-live="polite">
          {st ? st.name : status === "error" ? "Bu ülke için yayın yok" : "Yayınlar taranıyor…"}
        </div>
      </div>
      <Eq on={playing && !buffering && !!st} />
      <div className="dock__controls">
        <IconButton icon="prev" size={16} label="Önceki istasyon" kbd="↑" onClick={() => s().stepStation(-1)} disabled={!st} />
        <button className="play" onClick={() => s().setRadioPlaying(!playing)} disabled={!st}
          aria-label={playing ? "Radyoyu duraklat" : "Radyoyu çal"} title="Boşluk">
          {buffering && playing ? <span className="spinner" /> : <Icon name={playing ? "pause" : "play"} size={18} />}
        </button>
        <IconButton icon="next" size={16} label="Sonraki istasyon" kbd="↓" onClick={() => s().stepStation(1)} disabled={!st} />
      </div>
      <div className="dock__vol">
        <Icon name="volume" size={16} />
        <Slider label="Radyo sesi" value={volume} onChange={(v) => s().setVolume("radio", v)} />
      </div>
      <IconButton className="dock__fav" icon={fav ? "heartFill" : "heart"} label={fav ? "Favorilerden çıkar" : "Favorilere ekle"}
        active={fav} disabled={!st} onClick={() => st && s().toggleFavorite(st)} />
    </div>
  );
}

/** Slim strip shown under the video in focus mode — lives in the letterbox, never over the player. */
export function FocusStrip() {
  const city = useCity();
  const now = useNow();
  const timer = useStore((s) => s.timer);
  const st = useStore((s) => s.stations[s.stationIndex]);
  const playing = useStore((s) => s.radioPlaying);
  const s = useStore.getState;
  return (
    <div className="strip mono">
      <span>{city.name.toLocaleUpperCase("tr")}</span>
      <span className="sep" />
      <span>{localTime(now, city.timeZone)}</span>
      <span className="sep" />
      <button className="strip__radio" onClick={() => s().setRadioPlaying(!playing)}>
        <Eq on={playing} /> {st?.name ?? "—"}
      </button>
      <span className="strip__grow" />
      {(timer.running || timer.remaining !== timer.focusMin * 60) && (
        <span className={`strip__timer ${timer.phase}`}>{timer.phase === "focus" ? "ODAK" : "MOLA"} {fmtMMSS(timerRemaining(timer, now))}</span>
      )}
      <button className="strip__exit" onClick={() => s().toggleFocus()}>ÇIK · ESC</button>
    </div>
  );
}
