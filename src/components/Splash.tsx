import { localTime, useNow, useWeather } from "../hooks";
import { ambient } from "../lib/ambient";
import { weatherLabel } from "../lib/weather";
import { useCity, useStore } from "../store";
import { Brand } from "./Chrome";
import { Icon } from "./icons";
import { RainScene } from "./RainScene";
import { Kbd } from "./ui";

/** The start screen doubles as the user gesture browsers require before playing sound. */
export function Splash() {
  const city = useCity();
  const now = useNow(10000);
  const w = useWeather(city);
  const reduce = useStore((s) => s.settings.reduceMotion);
  const go = () => { ambient.resume(); useStore.getState().start(); };

  return (
    <div className="splash">
      <RainScene hue={city.hue} still={reduce} className="splash__scene" />
      <div className="splash__veil" />
      <div className="splash__top"><Brand /></div>
      <div className="splash__content">
        <p className="splash__eyebrow mono">
          {city.name.toLocaleUpperCase("tr")} · {localTime(now, city.timeZone)}{w ? ` · ${w.temp}° ${weatherLabel(w.code).toLocaleUpperCase("tr")}` : ""}
        </p>
        <h1 className="splash__title">Şehir yağmurda,<br /><em>sen işinde.</em></h1>
        <p className="splash__lede">
          Dünyanın bir köşesinde sakin bir yürüyüş, o şehrin canlı radyosu ve camdaki yağmur. Odaklanmak için gereken her şey.
        </p>
        <button className="cta" onClick={go} autoFocus>
          <Icon name="play" size={16} /> Yürüyüşe başla
        </button>
        <p className="splash__hint">ya da <Kbd>Enter</Kbd> · kulaklık önerilir</p>
      </div>
    </div>
  );
}
