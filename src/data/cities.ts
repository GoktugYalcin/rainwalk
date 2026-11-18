export type City = {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  videoId: string;
  start: number;
  lat: number;
  lon: number;
  timeZone: string;
  /** Hue (0-360) used to tint the procedural fallback scene. */
  hue: number;
};

export const CITIES: City[] = [
  { id: "istanbul", name: "İstanbul", country: "Türkiye", countryCode: "TR", videoId: "VUWrTQ97804", start: 0, lat: 41.01, lon: 28.98, timeZone: "Europe/Istanbul", hue: 28 },
  { id: "tokyo", name: "Tokyo", country: "Japonya", countryCode: "JP", videoId: "dGy_6qyyY7c", start: 290, lat: 35.68, lon: 139.69, timeZone: "Asia/Tokyo", hue: 320 },
  { id: "paris", name: "Paris", country: "Fransa", countryCode: "FR", videoId: "EVgeVtSyKyg", start: 8, lat: 48.86, lon: 2.35, timeZone: "Europe/Paris", hue: 38 },
  { id: "amsterdam", name: "Amsterdam", country: "Hollanda", countryCode: "NL", videoId: "CZE1CzdkEJQ", start: 0, lat: 52.37, lon: 4.9, timeZone: "Europe/Amsterdam", hue: 18 },
  { id: "london", name: "Londra", country: "Birleşik Krallık", countryCode: "GB", videoId: "N787WRdI35A", start: 118, lat: 51.51, lon: -0.13, timeZone: "Europe/London", hue: 210 },
  { id: "new-york", name: "New York", country: "ABD", countryCode: "US", videoId: "a-yUAFJbQtM", start: 286, lat: 40.71, lon: -74.01, timeZone: "America/New_York", hue: 45 },
  { id: "vienna", name: "Viyana", country: "Avusturya", countryCode: "AT", videoId: "PZ5SQbXBwhg", start: 30, lat: 48.21, lon: 16.37, timeZone: "Europe/Vienna", hue: 35 },
  { id: "oslo", name: "Oslo", country: "Norveç", countryCode: "NO", videoId: "2zMXZoFg4bc", start: 0, lat: 59.91, lon: 10.75, timeZone: "Europe/Oslo", hue: 195 },
  { id: "zermatt", name: "Zermatt", country: "İsviçre", countryCode: "CH", videoId: "LFOx-vmYrts", start: 201, lat: 46.02, lon: 7.75, timeZone: "Europe/Zurich", hue: 200 },
  { id: "moscow", name: "Moskova", country: "Rusya", countryCode: "RU", videoId: "UiOV3VQWVQo", start: 192, lat: 55.76, lon: 37.62, timeZone: "Europe/Moscow", hue: 0 },
  { id: "boston", name: "Boston", country: "ABD", countryCode: "US", videoId: "JB0A8Me8EKk", start: 273, lat: 42.36, lon: -71.06, timeZone: "America/New_York", hue: 220 },
];
