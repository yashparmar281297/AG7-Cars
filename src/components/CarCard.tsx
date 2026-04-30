import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import type { Car } from "@/types/car";
import { formatPrice, formatKm, resolveImage } from "@/types/car";
import { Gauge, Fuel, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function CarCard({ car, index = 0 }: { car: Car; index?: number }) {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 8, y: px * 8 });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });

  const statusStyle = {
available: "bg-status-available text-white border-status-available",
    booked: "bg-status-booked text-white border-status-booked",
    sold: "bg-status-sold text-white border-status-sold",
  }[car.status];

  return (
    <Link to={`/car/${car.id}`}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          animationDelay: `${index * 80}ms`,
        }}
        className="group relative carbon-surface border border-border hover:border-primary/60 transition-smooth corner-brackets opacity-0 animate-fade-in-up shadow-carbon"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-carbon-900">
          <img
            src={resolveImage(car.images?.[0] ?? "")}
            alt={`${car.brand} ${car.model}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

          {/* Top tags */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={cn("px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest border", statusStyle)}>
              {car.status}
            </span>
            {car.condition === "new" && (
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest border border-primary text-primary bg-primary/10">
                NEW
              </span>
            )}
          </div>

          {/* Year stamp */}
          {/* <div className="absolute top-3 right-3 font-mono text-xs text-foreground/80 bg-background/60 backdrop-blur px-2 py-0.5 border border-border">
            {car.year}
          </div> */}

          {/* Admin quick action */}
          {isAdmin && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate("/admin"); }}
              className="absolute bottom-3 right-3 z-10 flex items-center gap-1 px-2 py-1 bg-primary/90 text-primary-foreground text-[10px] font-mono uppercase tracking-widest border border-primary shadow-crimson hover:bg-primary"
              title="Manage in Admin Console"
            >
              <Settings className="w-3 h-3" /> Manage
            </button>
          )}

          {/* Scan line on hover */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-smooth">
            <div className="absolute inset-x-0 top-0 h-px bg-primary shadow-crimson" style={{ animation: "scan 1.5s linear infinite" }} />
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{car.brand}</div>
            <div className="font-display font-bold text-lg tracking-wide group-hover:text-primary transition-smooth">
              {car.model}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-muted-foreground border-y border-border py-2">
            <div className="flex items-center gap-1"><Gauge className="w-3 h-3 text-primary" /> {formatKm(car.kilometers)}</div>
            <div className="flex items-center gap-1"><Fuel className="w-3 h-3 text-primary" /> {car.fuel}</div>
            <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" /> {car.year}</div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Price</div>
              <div className="font-display font-bold text-xl text-glow">{formatPrice(car.price)}</div>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-primary group-hover:translate-x-1 transition-smooth">
              VIEW →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
