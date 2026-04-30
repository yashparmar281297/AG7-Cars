import { Hero } from "@/components/Hero";
import { CarCard } from "@/components/CarCard";
import { useCars } from "@/hooks/useCars";
import { Link } from "react-router-dom";
import { Sparkles, Award, ShieldCheck, Wrench } from "lucide-react";

export default function Home() {
  const { cars, loading } = useCars({ limit: 5 });

  return (
    <>
      <Hero />

      {/* Latest 5 */}
      <section className="container py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-primary" />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">LATEST ARRIVALS</span>
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl">
              FRESH IN <span className="text-primary text-glow">THE GARAGE</span>
            </h2>
          </div>
          <Link
            to="/collection"
            className="group inline-flex items-center gap-3 px-6 py-3 border border-primary text-primary font-display tracking-widest uppercase text-xs hover:bg-primary hover:text-primary-foreground transition-smooth w-fit"
            style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
          >
            EXPLORE COLLECTION
            <span className="inline-block group-hover:translate-x-1 transition-smooth">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[16/12] carbon-surface border border-border animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((c, i) => <CarCard key={c.id} car={c} index={i} />)}
          </div>
        )}
      </section>

      {/* Pillars */}
      <section className="border-y border-border carbon-surface-deep">
        <div className="container py-20 grid md:grid-cols-4 gap-8">
          {[
            { Icon: Sparkles, title: "CURATED", desc: "Hand-picked from the world's finest collections" },
            { Icon: ShieldCheck, title: "VERIFIED", desc: "Multi-point inspection & provenance check" },
            { Icon: Award, title: "EXCLUSIVE", desc: "Access to vehicles you won't find anywhere else" },
            { Icon: Wrench, title: "BESPOKE", desc: "White-glove service from concierge to delivery" },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="group">
              <div className="w-12 h-12 carbon-surface border border-primary/40 flex items-center justify-center mb-4 group-hover:border-primary group-hover:shadow-crimson transition-smooth">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="font-display font-bold tracking-widest text-lg mb-2">{title}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-primary" />
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">JOIN THE COLLECTIVE</span>
          <div className="w-8 h-px bg-primary" />
        </div>
        <h2 className="font-display font-black text-4xl md:text-6xl mb-6 max-w-3xl mx-auto leading-tight">
          YOUR NEXT MASTERPIECE <span className="text-primary text-glow">AWAITS</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          Whether you're a collector, an enthusiast, or simply chasing the dream — AG7 Cars opens the doors to extraordinary machines.
        </p>
     <Link
  to="/collection"
  className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-crimson text-primary-foreground font-display font-bold tracking-widest uppercase text-sm shadow-crimson"
  style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)" }}
>
  BROWSE EVERY CAR →
</Link>
      </section>
    </>
  );
}
