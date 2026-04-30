import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrationssupabase/client";
import type { Car, BodyType, FuelType } from "@/types/car";
import { CarCard } from "@/components/CarCard";
import { BodyTypeGrid } from "@/components/filters/BodyTypeGrid";
import { TachometerSlider } from "@/components/filters/TachometerSlider";
import { CarbonChips } from "@/components/filters/CarbonChips";
import { formatPrice } from "@/types/car";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";

type BodyMode = "all" | BodyType;

const BODY_OPTIONS: { value: BodyMode; label: string }[] = [
  { value: "all", label: "All" },
  { value: "hypercar", label: "Super" },
  { value: "coupe", label: "Coupe" },
  { value: "convertible", label: "Convert" },
  { value: "muvmpv", label: "MUV-MPV" },
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "hatchback", label: "Hatch" },
];

const FUEL_OPTIONS = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
];

const CONDITION_OPTIONS = [
  { value: "new", label: "New" },
  { value: "preowned", label: "Pre-owned" },
];

const STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "booked", label: "Booked" },
  { value: "sold", label: "Sold" },
];

export default function Collection() {
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [bodyMode, setBodyMode] = useState<BodyMode>("all");
  const [maxPrice, setMaxPrice] = useState(300000000); // 30 Cr ceiling
  const [maxKm, setMaxKm] = useState(50000);
  const [fuels, setFuels] = useState<FuelType[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [searchParams] = useSearchParams();

useEffect(() => {
  (async () => {
    const { data } = await supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false });

    setAllCars((data as Car[]) ?? []);
    setLoading(false);
  })();

  // ✅ Apply URL filters
  const body = searchParams.get("body");
  const fuel = searchParams.get("fuel");

  if (body) {
    setBodyMode(body as BodyMode);
  }

  if (fuel) {
    setFuels([fuel as FuelType]);
  }

}, [searchParams]);

  const filtered = useMemo(() => {
    return allCars.filter((c) => {
      if (bodyMode !== "all" && c.body !== bodyMode) return false;
      if (c.price > maxPrice) return false;
      if (c.kilometers > maxKm) return false;
      if (fuels.length && !fuels.includes(c.fuel)) return false;
      if (conditions.length && !conditions.includes(c.condition)) return false;
      if (statuses.length && !statuses.includes(c.status)) return false;
      return true;
    });
  }, [allCars, bodyMode, maxPrice, maxKm, fuels, conditions, statuses]);

  const toggle = <T extends string>(arr: T[], v: T, setter: (a: T[]) => void) => {
    setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  };

  const reset = () => {
    setBodyMode("all");
    setMaxPrice(300000000);
    setMaxKm(50000);
    setFuels([]);
    setConditions([]);
    setStatuses([]);
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">FULL INVENTORY</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h1 className="font-display font-black text-4xl md:text-6xl">
              THE <span className="text-primary text-glow">COLLECTION</span>
            </h1>
            <div className="flex items-center gap-3">
              <div className="font-mono text-xs text-muted-foreground">
                {filtered.length} / {allCars.length} VEHICLES
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary font-mono text-xs uppercase tracking-widest"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[360px_1fr] gap-10">
          {/* Filter Console */}
          <aside
            className={cn(
              "lg:sticky lg:top-24 lg:self-start",
              "carbon-surface border border-border p-6 space-y-8",
              !showFilters && "hidden lg:block"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="font-display font-bold tracking-widest text-sm">CONTROL DECK</div>
              <button onClick={reset} className="text-[10px] font-mono uppercase tracking-widest text-primary hover:text-primary-glow">
                RESET
              </button>
            </div>

            {/* Body type — all options visible & directly clickable */}
            <BodyTypeGrid<BodyMode>
              label="BODY TYPE"
              options={BODY_OPTIONS}
              value={bodyMode}
              onChange={setBodyMode}
            />

            <div className="border-t border-border" />

            {/* Tachometer sliders */}
            <div className="grid grid-cols-2 gap-4">
              <TachometerSlider
                label="MAX PRICE"
                min={5000000}
                max={300000000}
                step={5000000}
                value={maxPrice}
                onChange={setMaxPrice}
                format={formatPrice}
              />
              <TachometerSlider
                label="MAX KM"
                min={0}
                max={50000}
                step={500}
                value={maxKm}
                onChange={setMaxKm}
                format={(v) => `${v.toLocaleString("en-IN")} km`}
              />
            </div>

            <div className="border-t border-border" />

            {/* Carbon chips */}
            <CarbonChips
              label="FUEL"
              chips={FUEL_OPTIONS}
              selected={fuels}
              onToggle={(v) => toggle(fuels, v as FuelType, setFuels)}
            />
            <CarbonChips
              label="CONDITION"
              chips={CONDITION_OPTIONS}
              selected={conditions}
              onToggle={(v) => toggle(conditions, v, setConditions)}
            />
            <CarbonChips
              label="STATUS"
              chips={STATUS_OPTIONS}
              selected={statuses}
              onToggle={(v) => toggle(statuses, v, setStatuses)}
            />

            <button
              onClick={() => setShowFilters(false)}
              className="lg:hidden w-full py-2 border border-border text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <X className="w-3 h-3" /> Close
            </button>
          </aside>

          {/* Grid */}
          <div>
            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[16/12] carbon-surface border border-border animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="carbon-surface border border-border p-16 text-center">
                <div className="font-display text-2xl mb-2">NO MATCHES</div>
                <p className="text-muted-foreground text-sm">Adjust the deck to widen your search.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((c, i) => <CarCard key={c.id} car={c} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
