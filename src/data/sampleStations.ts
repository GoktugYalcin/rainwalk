import type { Station } from "../lib/radio";

const names: Record<string, [string, string][]> = {
  TR: [["Açık Radyo", "eclectic"], ["Radyo Eksen", "rock"], ["Radyo Voyage", "lounge"], ["TRT Radyo 3", "classical"], ["Best FM", "pop"], ["Radyo Bilgi", "jazz"]],
  JP: [["J-WAVE", "pop"], ["InterFM897", "rock"], ["NHK FM", "classical"], ["Tokyo Jazz Lounge", "jazz"], ["Shibuya Night Radio", "city pop"]],
  FR: [["FIP", "eclectic"], ["France Musique", "classical"], ["TSF Jazz", "jazz"], ["Radio Nova", "electronic"], ["Nostalgie", "pop"]],
  NL: [["NPO Radio 2", "pop"], ["Sublime", "soul"], ["Concertzender", "classical"], ["Pinguin Radio", "indie"]],
  GB: [["BBC Radio 6 Music", "indie"], ["Jazz FM", "jazz"], ["Classic FM", "classical"], ["NTS Radio", "eclectic"], ["Worldwide FM", "world"]],
  US: [["KEXP 90.3", "indie"], ["WFMU", "freeform"], ["KCRW Eclectic24", "eclectic"], ["WBGO Jazz 88", "jazz"], ["SomaFM Groove Salad", "chillout"]],
};

export function sampleStations(cc: string): Station[] {
  const list = names[cc] ?? [["Radio City", "pop"], ["Night Jazz", "jazz"], ["Classic Hour", "classical"], ["Indie Wave", "indie"]];
  return list.map(([name, tag], i) => ({
    id: `${cc}-${i}`,
    name,
    url: "",
    tags: [tag, i % 2 ? "live" : "stereo"],
    codec: "MP3",
    bitrate: 128 + (i % 3) * 64,
  }));
}
