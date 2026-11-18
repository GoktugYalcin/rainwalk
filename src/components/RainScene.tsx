import { useEffect, useRef } from "react";

type Props = { hue: number; still?: boolean; intensity?: number; className?: string };

type Bokeh = { x: number; y: number; r: number; h: number; s: number; l: number; a: number; tw: number; dx: number };
type Drop = { x: number; y: number; r: number; v: number; trail: number };

/**
 * A procedural "city lights through a rainy window" scene.
 * Used as the loading/fallback layer behind the video and as the preview background.
 */
export function RainScene({ hue, still = false, intensity = 1, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const hueRef = useRef(hue);
  hueRef.current = hue;

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, raf = 0, running = true;
    let bokeh: Bokeh[] = [];
    let beads: { x: number; y: number; r: number }[] = [];
    let drops: Drop[] = [];
    let curHue = hueRef.current;

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const seed = () => {
      const area = (w * h) / (1280 * 720);
      bokeh = Array.from({ length: Math.round(70 * Math.max(0.5, area)) }, () => {
        const kind = Math.random();
        // warm streetlights, hue-tinted signs, a few teal/red accents
        const [hh, s, l] =
          kind < 0.45 ? [rnd(28, 42), 90, 62] :
          kind < 0.75 ? [0, 80, 60] : // replaced by city hue at draw time
          kind < 0.88 ? [rnd(180, 195), 60, 55] : [rnd(350, 365) % 360, 85, 55];
        return {
          x: rnd(-0.05, 1.05) * w,
          y: rnd(0.35, 1.0) * h,
          r: rnd(8, 46) * Math.max(0.6, Math.sqrt(area)),
          h: kind >= 0.45 && kind < 0.75 ? -1 : hh,
          s, l,
          a: rnd(0.12, 0.42),
          tw: rnd(0, Math.PI * 2),
          dx: rnd(-0.08, 0.08),
        };
      });
      beads = Array.from({ length: Math.round(420 * area * intensity) }, () => ({ x: rnd(0, w), y: rnd(0, h), r: rnd(0.6, 2.2) }));
      drops = Array.from({ length: Math.round(22 * area * intensity) }, () => newDrop(true));
    };

    const newDrop = (anywhere = false): Drop => ({
      x: rnd(0, w), y: anywhere ? rnd(-h, h) : rnd(-80, -10), r: rnd(2, 4.2), v: rnd(0.6, 2.4), trail: rnd(30, 140),
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (still) draw(0);
    };

    const draw = (t: number) => {
      curHue += (hueRef.current - curHue) * 0.03;
      // night sky → street glow
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, `hsl(${curHue} 25% 6%)`);
      g.addColorStop(0.55, `hsl(${curHue} 30% 9%)`);
      g.addColorStop(1, `hsl(${curHue + 10} 35% 14%)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // out-of-focus city lights
      ctx.globalCompositeOperation = "lighter";
      for (const b of bokeh) {
        const flick = 0.85 + Math.sin(t * 0.0006 + b.tw) * 0.15;
        if (!still) b.x += b.dx;
        if (b.x < -60) b.x = w + 60; else if (b.x > w + 60) b.x = -60;
        const hh = b.h < 0 ? curHue : b.h;
        const rg = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        rg.addColorStop(0, `hsla(${hh} ${b.s}% ${b.l}% / ${b.a * flick})`);
        rg.addColorStop(0.7, `hsla(${hh} ${b.s}% ${b.l}% / ${b.a * flick * 0.55})`);
        rg.addColorStop(1, `hsla(${hh} ${b.s}% ${b.l}% / 0)`);
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // distant falling rain
      ctx.strokeStyle = "rgba(220,230,240,0.07)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      const n = Math.round(90 * intensity);
      for (let i = 0; i < n; i++) {
        const x = ((i * 97.3 + t * 0.05 * (1 + (i % 3))) % (w + 40)) - 20;
        const y = ((i * 57.7 + t * (0.9 + (i % 5) * 0.12)) % (h + 60)) - 30;
        ctx.moveTo(x, y);
        ctx.lineTo(x - 3, y + 18);
      }
      ctx.stroke();

      // static beads on the glass
      for (const d of beads) {
        ctx.fillStyle = "rgba(255,255,255,0.10)";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.beginPath();
        ctx.arc(d.x - d.r * 0.3, d.y - d.r * 0.35, d.r * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }

      // sliding drops with trails
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        if (!still) {
          d.y += d.v * (0.6 + Math.random() * 0.8);
          d.x += (Math.random() - 0.5) * 0.4;
        }
        const tg = ctx.createLinearGradient(d.x, d.y - d.trail, d.x, d.y);
        tg.addColorStop(0, "rgba(255,255,255,0)");
        tg.addColorStop(1, "rgba(255,255,255,0.10)");
        ctx.strokeStyle = tg;
        ctx.lineWidth = d.r * 0.8;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(d.x, d.y - d.trail);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.16)";
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, d.r, d.r * 1.15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.beginPath();
        ctx.arc(d.x - d.r * 0.35, d.y - d.r * 0.4, d.r * 0.3, 0, Math.PI * 2);
        ctx.fill();
        if (d.y - d.trail > h) drops[i] = newDrop();
      }

      // soft vignette
      const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
      v.addColorStop(0, "rgba(0,0,0,0)");
      v.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, w, h);
    };

    const loop = (t: number) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    if (!still) raf = requestAnimationFrame(loop);
    const onVis = () => {
      running = document.visibilityState === "visible" && !still;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [still, intensity]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
