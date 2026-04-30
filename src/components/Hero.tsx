import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useCars } from "@/hooks/useCars";

export function Hero() {
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const carRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { cars: featuredCars, loading } = useCars({ featured: true, limit: 1 });
  const featuredCar = featuredCars[0] ?? null;
  const heroImage = featuredCar?.images?.[0] ?? null;

  useEffect(() => {
    const t = setTimeout(() => setDoorsOpen(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 6, y: px * 12 });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMove}
      className="relative min-h-screen overflow-hidden flex items-center justify-center pt-16"
    >
      {/* Ambient backdrop */}
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      {/* Carbon grid overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100% / 0.03) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Garage doors */}
      <div className="absolute inset-0 z-30 pointer-events-none flex">
        <div className={`w-1/2 h-full carbon-surface-deep border-r border-primary/30 ${doorsOpen ? "garage-door-left" : ""}`}>
          <div className="h-full w-full flex flex-col justify-around px-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-px w-full bg-primary/20" />
            ))}
          </div>
        </div>
        <div className={`w-1/2 h-full carbon-surface-deep border-l border-primary/30 ${doorsOpen ? "garage-door-right" : ""}`}>
          <div className="h-full w-full flex flex-col justify-around px-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-px w-full bg-primary/20" />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-20">
        {/* Left — copy */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 opacity-0 animate-fade-in-up" style={{ animationDelay: "1.6s" }}>
            <div className="w-10 h-px bg-primary" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">EST · 2016 · INDIA</span>
          </div>

          <h1
            className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight opacity-0 animate-fade-in-up"
            style={{ animationDelay: "1.8s" }}
          >
            DRIVEN<br />
            BY <span className="text-primary text-glow">DESIRE</span>
          </h1>

          <p
            className="text-lg text-muted-foreground max-w-md leading-relaxed opacity-0 animate-fade-in-up"
            style={{ animationDelay: "2s" }}
          >
            India's most coveted collection of supercars, hypercars, and ultra-luxury machines. Curated. Verified. Delivered.
          </p>

          <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "2.2s" }}>
            <Link
              to="/collection"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-crimson text-primary-foreground font-display font-bold tracking-widest uppercase text-sm overflow-hidden shadow-crimson scan-line"
              style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
            >
              EXPLORE COLLECTION
              <span className="inline-block group-hover:translate-x-1 transition-smooth">→</span>
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-3 px-8 py-4 border border-border hover:border-primary font-display font-bold tracking-widest uppercase text-sm transition-smooth"
              style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
            >
              OUR STORY
            </Link>
          </div>

          {/* Stats ticker */}
          <div
            className="grid grid-cols-3 gap-6 pt-8 border-t border-border opacity-0 animate-fade-in-up"
            style={{ animationDelay: "2.4s" }}
          >
            {[
              { v: "150+", l: "DELIVERED" },
              { v: "15+", l: "BRANDS" },
              { v: "100%", l: "VERIFIED" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display font-black text-3xl text-glow">{s.v}</div>
                <div className="font-mono text-[10px] tracking-widest text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — 3D mouse-tilt featured car */}
        <div
          ref={carRef}
          className="relative opacity-0 animate-fade-in-up"
          style={{ animationDelay: "2s", perspective: "1500px" }}
        >
          <div
            className="relative transition-transform duration-300 ease-out"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Floor reflection */}
            <div
              className="absolute inset-x-0 bottom-0 h-1/3 opacity-30 blur-sm"
              style={{
                background: "linear-gradient(0deg, hsl(var(--primary) / 0.5), transparent)",
              }}
            />

            {/* Crimson glow disc */}
            <div className="absolute inset-0 -z-10 bg-gradient-radial scale-125 animate-pulse-glow" />

            {/* Car image — dynamic featured or skeleton */}
            {loading ? (
              <div className="w-full aspect-video carbon-surface border border-border animate-pulse" />
            ) : heroImage ? (
              <img
                src={heroImage}
                alt={featuredCar ? `${featuredCar.brand} ${featuredCar.model}` : "Featured supercar"}
                className="relative w-full h-auto object-contain animate-float drop-shadow-[0_30px_60px_hsl(0_0%_0%/0.7)]"
              />
            ) : (
              // Fallback placeholder if no featured car has images yet
              <div className="w-full aspect-video carbon-surface border border-primary/20 flex items-center justify-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">No featured vehicle</span>
              </div>
            )}

            {/* HUD overlays */}
            <div className="absolute top-4 left-4 carbon-surface border border-primary/40 px-3 py-2 font-mono text-[10px] tracking-widest">
              <div className="text-primary">● LIVE FEED</div>
              {/* <div className="text-muted-foreground mt-1">CHASSIS · ZFFA1234567</div> */}
            </div>

            {featuredCar && (
              <div
  className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4
  carbon-surface border border-primary/40
  px-2 py-1 sm:px-3 sm:py-2
  font-mono text-[8px] sm:text-[10px]
  tracking-widest text-right
  max-w-[75%] sm:max-w-none leading-tight"
>
  <div className="text-primary text-[7px] sm:text-[10px]">
    FEATURED
  </div>

  <div
    className="text-foreground mt-0.5 sm:mt-1
    font-display text-[10px] sm:text-sm
    break-words whitespace-normal"
  >
    {featuredCar.brand.toUpperCase()} {featuredCar.model.toUpperCase()}
  </div>
</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom ticker */}
      <div className="absolute bottom-0 inset-x-0 z-20 border-t border-border bg-background/80 backdrop-blur overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap py-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 pr-12 font-mono text-xs tracking-widest text-muted-foreground">
              {["FERRARI", "LAMBORGHINI", "MCLAREN", "PORSCHE", "BMW", "ROLLS ROYCE", "ASTON MARTIN", "BENTLEY", "MERCEDES BENZ", "LOTUS", "AUDI"].map((b) => (
                <span key={`${i}-${b}`} className="flex items-center gap-12">
                  <span className="text-primary">◆</span> {b}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <ChevronDown className="absolute bottom-16 left-1/2 -translate-x-1/2 w-5 h-5 text-primary animate-bounce z-20" />
    </section>
  );
}


// import { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import heroCar from "@/assets/hero-car.jpg";
// import { ChevronDown } from "lucide-react";

// export function Hero() {
//   const [doorsOpen, setDoorsOpen] = useState(false);
//   const [tilt, setTilt] = useState({ x: 0, y: 0 });
//   const carRef = useRef<HTMLDivElement>(null);
//   const sectionRef = useRef<HTMLElement>(null);

//   useEffect(() => {
//     const t = setTimeout(() => setDoorsOpen(true), 200);
//     return () => clearTimeout(t);
//   }, []);

//   const handleMove = (e: React.MouseEvent) => {
//     const el = sectionRef.current;
//     if (!el) return;
//     const r = el.getBoundingClientRect();
//     const px = (e.clientX - r.left) / r.width - 0.5;
//     const py = (e.clientY - r.top) / r.height - 0.5;
//     setTilt({ x: -py * 6, y: px * 12 });
//   };

//   return (
//     <section
//       ref={sectionRef}
//       onMouseMove={handleMove}
//       className="relative min-h-screen overflow-hidden flex items-center justify-center pt-16"
//     >
//       {/* Ambient backdrop */}
//       <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

//       {/* Carbon grid overlay */}
//       <div
//         className="absolute inset-0 opacity-30 pointer-events-none"
//         style={{
//           backgroundImage:
//             "linear-gradient(hsl(0 0% 100% / 0.03) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.03) 1px, transparent 1px)",
//           backgroundSize: "40px 40px",
//         }}
//       />

//       {/* Garage doors — slide off on load */}
//       {!doorsOpen ? null : null}
//       <div className="absolute inset-0 z-30 pointer-events-none flex">
//         <div className={`w-1/2 h-full carbon-surface-deep border-r border-primary/30 ${doorsOpen ? "garage-door-left" : ""}`}>
//           <div className="h-full w-full flex flex-col justify-around px-8">
//             {[...Array(8)].map((_, i) => (
//               <div key={i} className="h-px w-full bg-primary/20" />
//             ))}
//           </div>
//         </div>
//         <div className={`w-1/2 h-full carbon-surface-deep border-l border-primary/30 ${doorsOpen ? "garage-door-right" : ""}`}>
//           <div className="h-full w-full flex flex-col justify-around px-8">
//             {[...Array(8)].map((_, i) => (
//               <div key={i} className="h-px w-full bg-primary/20" />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-20">
//         {/* Left — copy */}
//         <div className="space-y-8">
//           <div className="flex items-center gap-3 opacity-0 animate-fade-in-up" style={{ animationDelay: "1.6s" }}>
//             <div className="w-10 h-px bg-primary" />
//             <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">EST · 2024 · INDIA</span>
//           </div>

//           <h1
//             className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight opacity-0 animate-fade-in-up"
//             style={{ animationDelay: "1.8s" }}
//           >
//             DRIVEN<br />
//             BY <span className="text-primary text-glow">DESIRE</span>
//           </h1>

//           <p
//             className="text-lg text-muted-foreground max-w-md leading-relaxed opacity-0 animate-fade-in-up"
//             style={{ animationDelay: "2s" }}
//           >
//             India's most coveted collection of supercars, hypercars, and ultra-luxury machines. Curated. Verified. Delivered.
//           </p>

//           <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "2.2s" }}>
//             <Link
//               to="/collection"
//               className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-crimson text-primary-foreground font-display font-bold tracking-widest uppercase text-sm overflow-hidden shadow-crimson scan-line"
//               style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
//             >
//               EXPLORE COLLECTION
//               <span className="inline-block group-hover:translate-x-1 transition-smooth">→</span>
//             </Link>
//             <Link
//               to="/about"
//               className="inline-flex items-center gap-3 px-8 py-4 border border-border hover:border-primary font-display font-bold tracking-widest uppercase text-sm transition-smooth"
//               style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
//             >
//               OUR STORY
//             </Link>
//           </div>

//           {/* Stats ticker */}
//           <div
//             className="grid grid-cols-3 gap-6 pt-8 border-t border-border opacity-0 animate-fade-in-up"
//             style={{ animationDelay: "2.4s" }}
//           >
//             {[
//               { v: "150+", l: "DELIVERED" },
//               { v: "40+", l: "MARQUES" },
//               { v: "100%", l: "VERIFIED" },
//             ].map((s) => (
//               <div key={s.l}>
//                 <div className="font-display font-black text-3xl text-glow">{s.v}</div>
//                 <div className="font-mono text-[10px] tracking-widest text-muted-foreground mt-1">{s.l}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Right — 3D mouse-tilt featured car */}
//         <div
//           ref={carRef}
//           className="relative opacity-0 animate-fade-in-up"
//           style={{ animationDelay: "2s", perspective: "1500px" }}
//         >
//           <div
//             className="relative transition-transform duration-300 ease-out"
//             style={{
//               transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
//               transformStyle: "preserve-3d",
//             }}
//           >
//             {/* Floor reflection */}
//             <div
//               className="absolute inset-x-0 bottom-0 h-1/3 opacity-30 blur-sm"
//               style={{
//                 background: "linear-gradient(0deg, hsl(var(--primary) / 0.5), transparent)",
//               }}
//             />

//             {/* Crimson glow disc */}
//             <div className="absolute inset-0 -z-10 bg-gradient-radial scale-125 animate-pulse-glow" />

//             {/* The car */}
//             <img
//               src={heroCar}
//               alt="Featured supercar"
//               width={1920}
//               height={1080}
//               className="relative w-full h-auto object-contain animate-float drop-shadow-[0_30px_60px_hsl(0_0%_0%/0.7)]"
//             />

//             {/* HUD overlays */}
//             <div className="absolute top-4 left-4 carbon-surface border border-primary/40 px-3 py-2 font-mono text-[10px] tracking-widest">
//               <div className="text-primary">● LIVE FEED</div>
//               <div className="text-muted-foreground mt-1">CHASSIS · ZFFA1234567</div>
//             </div>
//             <div className="absolute bottom-4 right-4 carbon-surface border border-primary/40 px-3 py-2 font-mono text-[10px] tracking-widest text-right">
//               <div className="text-primary">FEATURED</div>
//               <div className="text-foreground mt-1 font-display text-sm">FERRARI 488 PISTA</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom ticker */}
//       <div className="absolute bottom-0 inset-x-0 z-20 border-t border-border bg-background/80 backdrop-blur overflow-hidden">
//         <div className="flex animate-ticker whitespace-nowrap py-3">
//           {[...Array(2)].map((_, i) => (
//             <div key={i} className="flex items-center gap-12 pr-12 font-mono text-xs tracking-widest text-muted-foreground">
//               {["FERRARI", "LAMBORGHINI", "MCLAREN", "PORSCHE", "BUGATTI", "ROLLS ROYCE", "ASTON MARTIN", "BENTLEY", "MASERATI", "PAGANI", "KOENIGSEGG"].map((b) => (
//                 <span key={`${i}-${b}`} className="flex items-center gap-12">
//                   <span className="text-primary">◆</span> {b}
//                 </span>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Scroll cue */}
//       <ChevronDown className="absolute bottom-16 left-1/2 -translate-x-1/2 w-5 h-5 text-primary animate-bounce z-20" />
//     </section>
//   );
// }
