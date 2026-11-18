# ☂ Rainwalk

Walk through a rainy city, listen to its live local radio, and get some work done.

Rainwalk 2.0 is a ground-up rewrite with a new "window" design: the city walk sits inside a rounded window and every control lives in the frame around it. Focus mode lets the walk fill the screen.

## Features

- **City walks**: 11 cities, each with its local time and live weather (Open-Meteo). Use ← → to switch city, S for a random one.
- **Live local radio** from [radio-browser.info](https://www.radio-browser.info), with genre filters, favorites, automatic skip when a stream fails, and lock-screen controls (Media Session API).
- **Sound mixer**: street sound (the video's own audio), radio, plus rain, thunder, wind, city hum and brown noise. The ambient layers are generated in the browser with the Web Audio API, so there are no audio files.
- **Focus timer** with 25/5, 50/10 and 90/20 presets. At break time the radio is turned down rather than stopped, and a soft chime marks the end of each phase.
- **Focus mode** (F), keyboard shortcuts (press ? to see them all), and settings for opaque panels and reduced motion.
- Installable as a PWA, with a mobile layout that has a bottom tab bar.

## Design notes

- Nothing is ever drawn on top of the YouTube player, as YouTube's API policies require. Panels resize the window instead of covering it.
- Typefaces: Instrument Serif (display), Geist (UI) and Geist Mono (labels).
- Colors: a warm near-black frame, off-white text and a single teal accent, all defined in OKLCH.
- Glass panels have an opaque fallback. Safari doesn't support `prefers-reduced-transparency`, so the app also has its own toggle.

## Development

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # production build → dist/
npm run build:preview  # single-file sandbox preview (sample data, no YouTube) → dist-preview/
```

Stack: Vite, React 19, TypeScript and Zustand. There is no UI library; the components and CSS are hand-written.
