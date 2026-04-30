import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  step?: number;
  unit?: string;
}

/** Tachometer-style gauge slider. Drag the needle. */
export function TachometerSlider({ label, min, max, value, onChange, format, step = 1, unit }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState(false);

  // Map to 240° arc (from -120° to +120°, where -120° = min, 0° = mid, +120° = max)
  const sweep = 240;
  const startAngle = -120;
  const ratio = (value - min) / (max - min);
  const angle = startAngle + ratio * sweep;

  const setFromEvent = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.7;
    const dx = clientX - cx;
    const dy = clientY - cy;
    let a = (Math.atan2(dy, dx) * 180) / Math.PI; // -180..180
    a = a + 90; // rotate so up = 0
    if (a > 180) a -= 360;
    // Clamp to [-120, 120]
    if (a < -120) a = -120;
    if (a > 120) a = 120;
    const newRatio = (a - startAngle) / sweep;
    let v = min + newRatio * (max - min);
    v = Math.round(v / step) * step;
    v = Math.max(min, Math.min(max, v));
    onChange(v);
  };

  useEffect(() => {
    if (!drag) return;
    const move = (e: MouseEvent) => setFromEvent(e.clientX, e.clientY);
    const up = () => setDrag(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag]);

  const ticks = 13;
  const display = format ? format(value) : `${value}${unit ?? ""}`;

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
      <svg
        ref={ref}
        viewBox="0 0 200 140"
        className={cn("w-52 h-36 cursor-grab", drag && "cursor-grabbing")}
        onMouseDown={(e) => {
          setDrag(true);
          setFromEvent(e.clientX, e.clientY);
        }}
      >
        {/* Outer carbon ring */}
        <path d="M 30 100 A 70 70 0 1 1 170 100" fill="none" stroke="hsl(var(--carbon-700))" strokeWidth="14" strokeLinecap="round" />

        {/* Crimson fill arc */}
        <path
          d={describeArc(100, 100, 70, startAngle, angle)}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="14"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.7))" }}
        />

        {/* Tick marks */}
        {Array.from({ length: ticks }).map((_, i) => {
          const t = i / (ticks - 1);
          const a = ((startAngle + t * sweep) - 90) * (Math.PI / 180);
          const x1 = 100 + Math.cos(a) * 60;
          const y1 = 100 + Math.sin(a) * 60;
          const x2 = 100 + Math.cos(a) * 52;
          const y2 = 100 + Math.sin(a) * 52;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--muted-foreground))" strokeWidth="1" />;
        })}

        {/* Needle */}
        <g transform={`rotate(${angle} 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="38" stroke="hsl(var(--primary-glow))" strokeWidth="2.5" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 4px hsl(var(--primary)))" }} />
        </g>

        {/* Hub */}
        <circle cx="100" cy="100" r="9" fill="hsl(var(--carbon-900))" stroke="hsl(var(--primary))" strokeWidth="2" />
        <circle cx="100" cy="100" r="3" fill="hsl(var(--primary-glow))" />
      </svg>
      <div className="font-mono text-sm text-primary text-glow -mt-2">{display}</div>
    </div>
  );
}

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCartesian(cx, cy, r, end);
  const e = polarToCartesian(cx, cy, r, start);
  const large = end - start <= 180 ? "0" : "1";
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
}
