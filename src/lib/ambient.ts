/**
 * Procedural ambient sound engine — no audio files, everything is synthesised
 * with the Web Audio API so the app stays tiny and works offline.
 */
export type AmbientId = "rain" | "thunder" | "wind" | "cafe" | "brown";

export const AMBIENTS: { id: AmbientId; label: string }[] = [
  { id: "rain", label: "Yağmur" },
  { id: "thunder", label: "Gök gürültüsü" },
  { id: "wind", label: "Rüzgâr" },
  { id: "cafe", label: "Şehir uğultusu" },
  { id: "brown", label: "Kahverengi gürültü" },
];

type Channel = { gain: GainNode; stop: () => void };

function noiseBuffer(ctx: AudioContext, kind: "white" | "pink" | "brown", seconds = 4) {
  const len = ctx.sampleRate * seconds;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === "white") d[i] = w * 0.5;
      else if (kind === "pink") {
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856;
        b4 = 0.55 * b4 + w * 0.5329522;
        b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
        b6 = w * 0.115926;
      } else {
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.5;
      }
    }
  }
  return buf;
}

class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private channels = new Map<AmbientId, Channel>();
  private buffers: Partial<Record<"white" | "pink" | "brown", AudioBuffer>> = {};

  private ensure() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private buf(kind: "white" | "pink" | "brown") {
    const ctx = this.ensure();
    return (this.buffers[kind] ??= noiseBuffer(ctx, kind));
  }

  private loop(kind: "white" | "pink" | "brown") {
    const ctx = this.ensure();
    const src = ctx.createBufferSource();
    src.buffer = this.buf(kind);
    src.loop = true;
    return src;
  }

  private build(id: AmbientId): Channel {
    const ctx = this.ensure();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(this.master!);
    const stops: (() => void)[] = [];

    if (id === "rain") {
      const src = this.loop("pink");
      const hp = new BiquadFilterNode(ctx, { type: "highpass", frequency: 500 });
      const lp = new BiquadFilterNode(ctx, { type: "lowpass", frequency: 7000 });
      src.connect(hp).connect(lp).connect(gain);
      // a second, darker layer for body
      const body = this.loop("brown");
      const bodyGain = new GainNode(ctx, { gain: 0.35 });
      body.connect(bodyGain).connect(gain);
      src.start(); body.start();
      stops.push(() => { src.stop(); body.stop(); });
    }

    if (id === "wind") {
      const src = this.loop("brown");
      const bp = new BiquadFilterNode(ctx, { type: "bandpass", frequency: 400, Q: 0.8 });
      const lfo = new OscillatorNode(ctx, { frequency: 0.07 });
      const lfoGain = new GainNode(ctx, { gain: 250 });
      lfo.connect(lfoGain).connect(bp.frequency);
      src.connect(bp).connect(gain);
      src.start(); lfo.start();
      stops.push(() => { src.stop(); lfo.stop(); });
    }

    if (id === "cafe") {
      const src = this.loop("pink");
      const bp = new BiquadFilterNode(ctx, { type: "bandpass", frequency: 900, Q: 0.5 });
      const lp = new BiquadFilterNode(ctx, { type: "lowpass", frequency: 1800 });
      const trem = new OscillatorNode(ctx, { frequency: 0.3 });
      const tremGain = new GainNode(ctx, { gain: 0.15 });
      const vca = new GainNode(ctx, { gain: 0.85 });
      trem.connect(tremGain).connect(vca.gain);
      src.connect(bp).connect(lp).connect(vca).connect(gain);
      src.start(); trem.start();
      stops.push(() => { src.stop(); trem.stop(); });
    }

    if (id === "brown") {
      const src = this.loop("brown");
      const lp = new BiquadFilterNode(ctx, { type: "lowpass", frequency: 500 });
      src.connect(lp).connect(gain);
      src.start();
      stops.push(() => src.stop());
    }

    if (id === "thunder") {
      let timer = 0;
      const strike = () => {
        const t = ctx.currentTime;
        const src = ctx.createBufferSource();
        src.buffer = this.buf("brown");
        const lp = new BiquadFilterNode(ctx, { type: "lowpass", frequency: 120 + Math.random() * 180 });
        const env = new GainNode(ctx, { gain: 0 });
        const dur = 3 + Math.random() * 4;
        env.gain.setValueAtTime(0, t);
        env.gain.linearRampToValueAtTime(1.6, t + 0.08 + Math.random() * 0.4);
        env.gain.exponentialRampToValueAtTime(0.001, t + dur);
        src.connect(lp).connect(env).connect(gain);
        src.start(t, Math.random() * 2);
        src.stop(t + dur + 0.1);
        timer = window.setTimeout(strike, 9000 + Math.random() * 22000);
      };
      timer = window.setTimeout(strike, 1500);
      stops.push(() => clearTimeout(timer));
    }

    return { gain, stop: () => stops.forEach((s) => s()) };
  }

  /** Set a channel's level (0–1). Channels are created lazily and torn down at 0. */
  set(id: AmbientId, level: number) {
    if (level <= 0 && !this.channels.has(id)) return;
    const ctx = this.ensure();
    let ch = this.channels.get(id);
    if (!ch) {
      ch = this.build(id);
      this.channels.set(id, ch);
    }
    const target = Math.max(0, Math.min(1, level)) ** 1.6; // perceptual curve
    ch.gain.gain.setTargetAtTime(target, ctx.currentTime, 0.25);
    if (level <= 0) {
      const dying = ch;
      this.channels.delete(id);
      window.setTimeout(() => { dying.stop(); dying.gain.disconnect(); }, 1500);
    }
  }

  /** Soft bell used by the focus timer. */
  chime() {
    const ctx = this.ensure();
    const t = ctx.currentTime;
    [523.25, 783.99, 1046.5].forEach((f, i) => {
      const o = new OscillatorNode(ctx, { type: "sine", frequency: f });
      const g = new GainNode(ctx, { gain: 0 });
      g.gain.setValueAtTime(0, t + i * 0.18);
      g.gain.linearRampToValueAtTime(0.18, t + i * 0.18 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.18 + 2.4);
      o.connect(g).connect(this.master!);
      o.start(t + i * 0.18);
      o.stop(t + i * 0.18 + 2.5);
    });
  }

  resume() { this.ensure(); }
}

export const ambient = new AmbientEngine();
