import { useState, type ReactNode } from "react";
import { CITIES } from "../data/cities";
import { fmtMMSS, localTime, timerRemaining, useNow, useWeather } from "../hooks";
import { AMBIENTS } from "../lib/ambient";
import { GENRES } from "../lib/radio";
import { useStore } from "../store";
import type { City } from "../data/cities";
import { weatherIcon } from "./Chrome";
import { Icon } from "./icons";
import { Chip, Eq, IconButton, Kbd, Slider } from "./ui";

function PanelShell({ title, kicker, children }: { title: string; kicker: string; children: ReactNode }) {
  const s = useStore.getState;
  return (
    <div className="panel__inner">
      <div className="panel__head">
        <div>
          <div className="panel__kicker mono">{kicker}</div>
          <h2 className="panel__title">{title}</h2>
        </div>
        <IconButton icon="close" label="Paneli kapat" kbd="Esc" onClick={() => s().setPanel(null)} />
      </div>
      <div className="panel__body">{children}</div>
    </div>
  );
}

function CityCard({ city, active, now }: { city: City; active: boolean; now: number }) {
  const w = useWeather(city);
  return (
    <button className={`city ${active ? "is-active" : ""}`} style={{ ["--h" as string]: city.hue }}
      onClick={() => useStore.getState().setCity(city.id)} aria-current={active}>
      <span className="city__glow" aria-hidden="true" />
      <span className="city__top mono">
        <span>{city.countryCode}</span>
        <span>{localTime(now, city.timeZone)}</span>
      </span>
      <span className="city__name">{city.name}</span>
      <span className="city__wx">
        {w ? <><Icon name={weatherIcon(w.code)} size={14} /> {w.temp}°</> : <span className="mono">—</span>}
      </span>
    </button>
  );
}

export function CitiesPanel() {
  const cityId = useStore((s) => s.cityId);
  const now = useNow(30000);
  return (
    <PanelShell title="Nereye yürüyelim?" kicker={`${CITIES.length} ŞEHİR · CANLI SAAT`}>
      <div className="cities">
        {CITIES.map((c) => <CityCard key={c.id} city={c} active={c.id === cityId} now={now} />)}
      </div>
      <button className="wide-btn" onClick={() => useStore.getState().shuffleCity()}>
        <Icon name="shuffle" size={16} /> Beni şaşırt
      </button>
    </PanelShell>
  );
}

export function StationsPanel() {
  const stations = useStore((s) => s.stations);
  const status = useStore((s) => s.stationsStatus);
  const index = useStore((s) => s.stationIndex);
  const genre = useStore((s) => s.genre);
  const favorites = useStore((s) => s.favorites);
  const playing = useStore((s) => s.radioPlaying);
  const [tab, setTab] = useState<"local" | "fav">("local");
  const s = useStore.getState;
  const current = stations[index];
  const list = tab === "local" ? stations : favorites;

  return (
    <PanelShell title="Yerel radyolar" kicker="RADIO-BROWSER · CANLI">
      <div className="seg" role="tablist">
        <button role="tab" aria-selected={tab === "local"} className={tab === "local" ? "is-active" : ""} onClick={() => setTab("local")}>Bu ülke</button>
        <button role="tab" aria-selected={tab === "fav"} className={tab === "fav" ? "is-active" : ""} onClick={() => setTab("fav")}>
          Favoriler {favorites.length > 0 && <span className="count">{favorites.length}</span>}
        </button>
      </div>
      {tab === "local" && (
        <div className="chips">
          {GENRES.map((g) => <Chip key={g.id} active={genre === g.id} onClick={() => s().setGenre(g.id)}>{g.label}</Chip>)}
        </div>
      )}
      <ul className="stations">
        {tab === "local" && status === "loading" && Array.from({ length: 6 }, (_, i) => <li key={i} className="station is-skeleton" />)}
        {tab === "local" && status === "error" && <li className="empty">Bu filtrede yayın bulunamadı. Başka bir tür dene.</li>}
        {tab === "fav" && favorites.length === 0 && <li className="empty">Beğendiğin istasyonları ♥ ile buraya ekle.</li>}
        {list.map((st) => {
          const on = current?.id === st.id;
          const fav = favorites.some((f) => f.id === st.id);
          return (
            <li key={st.id} className={`station ${on ? "is-active" : ""}`}>
              <button className="station__main" onClick={() => (tab === "fav" ? s().playStation(st) : s().setStationIndex(stations.indexOf(st)))}>
                <span className="station__initial">{st.name.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 2)}</span>
                <span className="station__text">
                  <span className="station__name">{st.name}</span>
                  <span className="station__meta mono" lang="en">{[st.tags[0], st.bitrate ? `${st.bitrate}k` : null].filter(Boolean).join(" · ")}</span>
                </span>
                {on && <Eq on={playing} />}
              </button>
              <IconButton icon={fav ? "heartFill" : "heart"} size={16} label={fav ? "Favorilerden çıkar" : "Favorilere ekle"}
                active={fav} onClick={() => s().toggleFavorite(st)} />
            </li>
          );
        })}
      </ul>
    </PanelShell>
  );
}

function MixRow({ label, hint, value, onChange }: { label: string; hint?: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="mix">
      <div className="mix__label">
        <span>{label}</span>
        {hint && <span className="mix__hint mono">{hint}</span>}
        <span className="mix__val mono">{Math.round(value * 100)}</span>
      </div>
      <Slider label={label} value={value} onChange={onChange} />
    </div>
  );
}

export function MixerPanel() {
  const volumes = useStore((s) => s.volumes);
  const amb = useStore((s) => s.ambient);
  const s = useStore.getState;
  return (
    <PanelShell title="Ses mikseri" kicker="KATMANLAR">
      <div className="mix-group">
        <MixRow label="Sokak sesi" hint="video" value={volumes.street} onChange={(v) => s().setVolume("street", v)} />
        <MixRow label="Radyo" value={volumes.radio} onChange={(v) => s().setVolume("radio", v)} />
      </div>
      <div className="mix-sub mono">ATMOSFER · tarayıcıda üretilir</div>
      <div className="mix-group">
        {AMBIENTS.map((a) => <MixRow key={a.id} label={a.label} value={amb[a.id]} onChange={(v) => s().setAmbient(a.id, v)} />)}
      </div>
      <div className="presets">
        <Chip onClick={() => { s().setAmbient("rain", 0.55); s().setAmbient("thunder", 0.35); s().setAmbient("wind", 0.15); s().setAmbient("cafe", 0); s().setAmbient("brown", 0); }}>Fırtınalı gece</Chip>
        <Chip onClick={() => { s().setAmbient("rain", 0.3); s().setAmbient("thunder", 0); s().setAmbient("wind", 0); s().setAmbient("cafe", 0.45); s().setAmbient("brown", 0); }}>Kafe penceresi</Chip>
        <Chip onClick={() => { s().setAmbient("rain", 0); s().setAmbient("thunder", 0); s().setAmbient("wind", 0); s().setAmbient("cafe", 0); s().setAmbient("brown", 0.5); }}>Derin odak</Chip>
        <Chip onClick={() => (Object.keys(amb) as (keyof typeof amb)[]).forEach((k) => s().setAmbient(k, 0))}>Kapat</Chip>
      </div>
    </PanelShell>
  );
}

export function TimerPanel() {
  const timer = useStore((s) => s.timer);
  const now = useNow(250);
  const s = useStore.getState;
  const rem = timerRemaining(timer, now);
  const total = (timer.phase === "focus" ? timer.focusMin : timer.breakMin) * 60;
  const pct = 1 - rem / total;
  const R = 92, C = 2 * Math.PI * R;
  const presets: [number, number][] = [[25, 5], [50, 10], [90, 20]];
  return (
    <PanelShell title="Odak zamanlayıcı" kicker={`${timer.sessions} SEANS TAMAMLANDI`}>
      <div className={`ring ${timer.phase}`}>
        <svg viewBox="0 0 220 220" aria-hidden="true">
          <circle cx="110" cy="110" r={R} className="ring__track" />
          <circle cx="110" cy="110" r={R} className="ring__fill" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} />
        </svg>
        <div className="ring__center">
          <div className="ring__phase mono">{timer.phase === "focus" ? "ODAK" : "MOLA"}</div>
          <div className="ring__time" role="timer" aria-live="off">{fmtMMSS(rem)}</div>
        </div>
      </div>
      <div className="timer-ctl">
        <IconButton icon="reset" label="Sıfırla" onClick={() => s().timerReset()} />
        <button className="play play--lg" onClick={() => s().timerToggle()} aria-label={timer.running ? "Duraklat" : "Başlat"} title="T">
          <Icon name={timer.running ? "pause" : "play"} size={22} />
        </button>
        <IconButton icon="next" label="Sonraki evreye geç" onClick={() => s().timerAdvance()} />
      </div>
      <div className="chips chips--center">
        {presets.map(([f, b]) => (
          <Chip key={f} active={timer.focusMin === f} onClick={() => s().timerPreset(f, b)}>{f} / {b}</Chip>
        ))}
      </div>
      <p className="note">Mola başladığında radyo kısılır, durmaz. Seans bitince yumuşak bir zil çalar.</p>
    </PanelShell>
  );
}

type SettingKey = keyof ReturnType<typeof useStore.getState>["settings"];
function Toggle({ k, label, hint }: { k: SettingKey; label: string; hint: string }) {
  const on = useStore((st) => st.settings[k]);
  return (
    <label className="toggle">
      <span className="toggle__text"><span>{label}</span><span className="toggle__hint">{hint}</span></span>
      <input type="checkbox" role="switch" checked={on} onChange={(e) => useStore.getState().setSetting(k, e.target.checked)} />
      <span className="toggle__ui" aria-hidden="true" />
    </label>
  );
}

export function SettingsPanel() {
  const keys: [string, string][] = [
    ["Boşluk", "Radyoyu çal / duraklat"], ["← →", "Şehir değiştir"], ["↑ ↓", "İstasyon değiştir"], ["S", "Rastgele şehir"],
    ["F", "Odak modu"], ["T", "Zamanlayıcıyı başlat"], ["M", "Tümünü sessize al"], ["C · R · X", "Şehirler · Radyolar · Mikser"], ["Esc", "Kapat"],
  ];
  return (
    <PanelShell title="Ayarlar" kicker="TERCİHLER · KISAYOLLAR">
      <div className="toggles">
        <Toggle k="solid" label="Opak paneller" hint="Cam efektini kapatır, okunurluğu artırır" />
        <Toggle k="reduceMotion" label="Hareketi azalt" hint="Animasyonları ve yağmur efektini durdurur" />
        <Toggle k="autoAdvance" label="Bozuk yayını atla" hint="Yanıt vermeyen istasyonda sıradakine geç" />
      </div>
      <dl className="keys">
        {keys.map(([k, v]) => <div key={k}><dt><Kbd>{k}</Kbd></dt><dd>{v}</dd></div>)}
      </dl>
      <p className="note">
        Videolar YouTube'dan, radyolar topluluk tarafından tutulan radio-browser.info'dan, hava durumu Open-Meteo'dan gelir.
      </p>
    </PanelShell>
  );
}

export function Panel() {
  const panel = useStore((s) => s.panel);
  return (
    <aside className="panel" aria-label="Panel" data-open={!!panel}>
      {panel === "cities" && <CitiesPanel />}
      {panel === "stations" && <StationsPanel />}
      {panel === "mixer" && <MixerPanel />}
      {panel === "timer" && <TimerPanel />}
      {panel === "settings" && <SettingsPanel />}
    </aside>
  );
}
