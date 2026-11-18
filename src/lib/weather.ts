export type Weather = { temp: number; code: number; isDay: boolean };

export async function fetchWeather(lat: number, lon: number, signal?: AbortSignal): Promise<Weather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return {
    temp: Math.round(data.current.temperature_2m),
    code: data.current.weather_code,
    isDay: data.current.is_day === 1,
  };
}

/** WMO weather code → short Turkish label. */
export function weatherLabel(code: number): string {
  if (code === 0) return "Açık";
  if (code <= 2) return "Parçalı bulutlu";
  if (code === 3) return "Kapalı";
  if (code <= 48) return "Sisli";
  if (code <= 57) return "Çiseliyor";
  if (code <= 67) return "Yağmurlu";
  if (code <= 77) return "Karlı";
  if (code <= 82) return "Sağanak";
  if (code <= 86) return "Kar sağanağı";
  return "Fırtına";
}

export function isRainy(code: number) {
  return (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95;
}
