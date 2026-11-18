import type { SVGProps } from "react";

const P = {
  play: <path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none" />,
  pause: <><rect x="6" y="4.5" width="4" height="15" rx="1.2" fill="currentColor" stroke="none" /><rect x="14" y="4.5" width="4" height="15" rx="1.2" fill="currentColor" stroke="none" /></>,
  next: <><path d="M5 5l10 7-10 7z" fill="currentColor" stroke="none" /><path d="M19 5v14" /></>,
  prev: <><path d="M19 5L9 12l10 7z" fill="currentColor" stroke="none" /><path d="M5 5v14" /></>,
  left: <path d="M15 5l-7 7 7 7" />,
  right: <path d="M9 5l7 7-7 7" />,
  shuffle: <><path d="M3 7h3.5c2.5 0 4 1.5 5.5 5s3 5 5.5 5H21" /><path d="M3 17h3.5c1.4 0 2.5-.5 3.4-1.4" /><path d="M14.1 8.4C15 7.5 16 7 17.5 7H21" /><path d="M18 4l3 3-3 3M18 14l3 3-3 3" /></>,
  radio: <><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8a6 6 0 010 8.4M7.8 16.2a6 6 0 010-8.4M19 5a10 10 0 010 14M5 19A10 10 0 015 5" /></>,
  mixer: <><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></>,
  timer: <><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2.5M9.5 2.5h5" /></>,
  expand: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  collapse: <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />,
  keyboard: <><rect x="2.5" y="6" width="19" height="12" rx="2.5" /><path d="M6.5 10h1M10.5 10h1M14.5 10h1M8 14h8" /></>,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.3a4.3 4.3 0 017.5 2.5C19.5 15.4 12 20 12 20z" />,
  heartFill: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.3a4.3 4.3 0 017.5 2.5C19.5 15.4 12 20 12 20z" fill="currentColor" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  pin: <><path d="M12 21s-6.5-6.1-6.5-11.2a6.5 6.5 0 0113 0C18.5 14.9 12 21 12 21z" /><circle cx="12" cy="9.8" r="2.3" /></>,
  volume: <><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none" /><path d="M15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11" /></>,
  mute: <><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none" /><path d="M16 9.5l5 5M21 9.5l-5 5" /></>,
  rain: <><path d="M7 15.5a4.5 4.5 0 01-.5-9 6 6 0 0111.4 1.6A3.8 3.8 0 0117.5 15.5z" /><path d="M8.5 18.5l-1 2M12.5 18.5l-1 2M16.5 18.5l-1 2" /></>,
  cloud: <path d="M7 18a4.5 4.5 0 01-.5-9 6 6 0 0111.4 1.6A3.8 3.8 0 0117.5 18z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></>,
  snow: <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />,
  reset: <><path d="M4 12a8 8 0 108-8 8.5 8.5 0 00-6 2.5L4 8.5" /><path d="M4 4v4.5h4.5" /></>,
  drop: <path d="M12 3s6 6.4 6 11a6 6 0 01-12 0c0-4.6 6-11 6-11z" />,
} as const;

export type IconName = keyof typeof P;

export function Icon({ name, size = 20, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {P[name]}
    </svg>
  );
}
