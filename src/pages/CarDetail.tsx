import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrationssupabase/client";
import type { Car } from "@/types/car";
import { formatPrice, formatKm, resolveImage } from "@/types/car";
import { ArrowLeft, ArrowRight, Gauge, Fuel, Calendar, Cog, Palette, Zap, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
// import { ArrowLeft, ArrowRight, Gauge, Fuel, Calendar, Cog, Palette, Zap, TrendingUp, Timer, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CarDetail() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from("cars").select("*").eq("id", id).maybeSingle();
      setCar(data as Car | null);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="container pt-32"><div className="h-96 carbon-surface animate-pulse" /></div>;
  if (!car) return (
    <div className="container pt-32 text-center">
      <h1 className="font-display text-4xl mb-4">VEHICLE NOT FOUND</h1>
      <Link to="/collection" className="text-primary underline">Back to collection</Link>
    </div>
  );

const statusStyle = {
    available: "bg-status-available text-white border-status-available",
    booked: "bg-status-booked text-white border-status-booked",
    sold: "bg-status-sold text-white border-status-sold",
  }[car.status];

  const specs = [
    { Icon: Calendar, label: "Year", value: car.year },
    { Icon: Gauge, label: "Kilometers", value: formatKm(car.kilometers) },
    { Icon: Fuel, label: "Fuel", value: car.fuel },
    { Icon: Cog, label: "Transmission", value: car.transmission },
    { Icon: Palette, label: "Color", value: car.color ?? "—" },
    { Icon: Zap, label: "Power", value: car.horsepower ? `${car.horsepower} HP` : "—" },
    { Icon: TrendingUp, label: "Torque", value: car.torque ? `${car.torque} Nm` : "—" },
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="container px-4 md:px-6">
        <Link to="/collection" className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 md:gap-10">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[16/10] md:aspect-[16/10] lg:aspect-[16/10] w-full carbon-surface border border-border overflow-hidden group">
              {car.images.length > 0 ? (
                <img
                  src={resolveImage(car.images[activeImg] ?? car.images[0])}
                  alt={`${car.brand} ${car.model} — image ${activeImg + 1}`}
                  className="w-full h-full object-cover transition-opacity"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-xs">
                  NO IMAGES UPLOADED
                </div>
              )}

              <div className={cn("absolute top-4 left-4 px-3 py-1 text-xs font-mono uppercase tracking-widest border bg-background/70 backdrop-blur", statusStyle)}>
                ● {car.status}
              </div>

              {/* Image counter */}
              {car.images.length > 1 && (
                <div className="absolute top-4 right-4 px-3 py-1 text-[10px] font-mono uppercase tracking-widest border border-border bg-background/70 backdrop-blur">
                  {String(activeImg + 1).padStart(2, "0")} / {String(car.images.length).padStart(2, "0")}
                </div>
              )}

              {/* Prev / Next */}
              {car.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImg((i) => (i - 1 + car.images.length) % car.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 border border-border bg-background/70 backdrop-blur hover:border-primary hover:text-primary transition-smooth opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImg((i) => (i + 1) % car.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 border border-border bg-background/70 backdrop-blur hover:border-primary hover:text-primary transition-smooth opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {car.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-thin">
                {car.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      "shrink-0 w-24 h-16 border overflow-hidden transition-smooth",
                      i === activeImg ? "border-primary shadow-crimson" : "border-border hover:border-primary/60"
                    )}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={resolveImage(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5 md:space-y-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{car.brand}</div>
              <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl mt-1 leading-tight"></h1><h1 className="font-display font-black text-4xl md:text-5xl mt-1">{car.model}</h1>
              <div className="flex items-center gap-3 mt-3">
                {car.condition === "new" && (
                  <span className="crimson-tag">NEW</span>
                )}
                {/* <span className="font-mono text-xs text-muted-foreground">CHASSIS · {car.id.slice(0, 8).toUpperCase()}</span> */}
              </div>
            </div>

            <div className="carbon-surface border border-primary/40 p-6 corner-brackets">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">PRICE</div>
              <div className="font-display font-black text-4xl text-glow text-primary mt-1">{formatPrice(car.price)}</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3">
              {specs.map(({ Icon, label, value }) => (
                <div key={label} className="carbon-surface border border-border p-3 flex items-center gap-3">
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
                    <div className="font-display text-sm capitalize">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {car.description && (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">DESCRIPTION</div>
                <p className="text-muted-foreground leading-relaxed">{car.description}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <a
                href="tel:+917247777724"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-crimson text-primary-foreground font-display font-bold tracking-widest uppercase text-sm shadow-crimson"
                style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)" }}
              >
                CALL CONCIERGE
              </a>
              <a
                href={`mailto:AG7Cars@gmail.com?subject=Inquiry: ${car.brand} ${car.model}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary font-display font-bold tracking-widest uppercase text-sm"
                style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)" }}
              >
                ENQUIRE
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
