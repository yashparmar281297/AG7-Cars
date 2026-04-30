import { useState } from "react";
import { cn } from "@/lib/utils";

export interface RotaryOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  label: string;
  options: RotaryOption<T>[];
  value: T;
  onChange: (v: T) => void;
}

/**
 * Ferrari-inspired rotary mode selector.
 * Click to cycle, or click directly on a tick.
 */
export function RotaryGearSelector<T extends string>({ label, options, value, onChange }: Props<T>) {
  const [hover, setHover] = useState(false);
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  const step = 360 / options.length;
  const currentRotation = -idx * step;

  const cycle = () => {
    const next = (idx + 1) % options.length;
    onChange(options[next].value);
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
      <div
        className="relative w-44 h-44"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Outer carbon ring */}
        <div className="absolute inset-0 rounded-full carbon-surface-deep border-2 border-border" />

        {/* Crimson active arc */}
        <div className="absolute inset-1 rounded-full border border-primary/30" />

        {/* Tick marks */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          {options.map((opt, i) => {
            const angle = (i / options.length) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const x1 = 50 + Math.cos(rad) * 38;
            const y1 = 50 + Math.sin(rad) * 38;
            const x2 = 50 + Math.cos(rad) * 44;
            const y2 = 50 + Math.sin(rad) * 44;
            const tx = 50 + Math.cos(rad) * 32;
            const ty = 50 + Math.sin(rad) * 32;
            const active = i === idx;
            return (
              <g key={opt.value} onClick={() => onChange(opt.value)} className="cursor-pointer">
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                  strokeWidth={active ? 1.5 : 0.6}
                />
                <text
                  x={tx} y={ty}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={cn(
                    "font-mono uppercase",
                    active ? "fill-primary" : "fill-muted-foreground"
                  )}
                  style={{ fontSize: "4px", letterSpacing: "0.1em" }}
                >
                  {opt.label.slice(0, 8)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Inner rotor (clickable) */}
        <button
          type="button"
          onClick={cycle}
          className={cn(
            "absolute inset-6 rounded-full carbon-surface border-2 border-primary/60 flex items-center justify-center transition-transform duration-500",
            hover && "border-primary shadow-crimson"
          )}
          style={{ transform: `rotate(${currentRotation}deg)` }}
          aria-label={`Cycle ${label}`}
        >
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-primary shadow-crimson" />

          {/* Knob grip lines */}
          <div className="absolute inset-3 rounded-full border border-border" />
          <div className="absolute inset-5 rounded-full border border-border/60" />
        </button>

        {/* Center label */}
        <div
          className="absolute inset-12 rounded-full carbon-surface-deep border border-border flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="font-display font-black text-xs text-primary text-glow uppercase tracking-wider text-center px-1">
            {options[idx]?.label}
          </div>
        </div>
      </div>
    </div>
  );
}
