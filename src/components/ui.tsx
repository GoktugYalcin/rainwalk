import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./icons";

export function IconButton({ icon, label, active, size = 20, kbd, className = "", ...rest }:
  { icon: IconName; label: string; active?: boolean; size?: number; kbd?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`ibtn ${active ? "is-active" : ""} ${className}`} aria-label={label}
      aria-pressed={active} title={kbd ? `${label} (${kbd})` : label} {...rest}>
      <Icon name={icon} size={size} />
    </button>
  );
}

export function Slider({ value, onChange, label, disabled }:
  { value: number; onChange: (v: number) => void; label: string; disabled?: boolean }) {
  return (
    <input className="slider" type="range" min={0} max={100} step={1} aria-label={label} disabled={disabled}
      value={Math.round(value * 100)} style={{ ["--val" as string]: `${value * 100}%` }}
      onChange={(e) => onChange(Number(e.target.value) / 100)} />
  );
}

export function Chip({ active, children, onClick }: { active?: boolean; children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" className={`chip ${active ? "is-active" : ""}`} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  );
}

export function Eq({ on }: { on: boolean }) {
  return (
    <span className={`eq ${on ? "is-on" : ""}`} aria-hidden="true">
      <i /><i /><i /><i />
    </span>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="kbd">{children}</kbd>;
}
