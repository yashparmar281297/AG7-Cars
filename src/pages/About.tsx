export default function About() {
  return (
    <div className="pt-32 pb-20">
      <div className="container max-w-4xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-px bg-primary" />
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">OUR PHILOSOPHY</span>
        </div>
        <h1 className="font-display font-black text-5xl md:text-7xl mb-8">
          BUILT FOR <span className="text-primary text-glow">THE FEW</span>
        </h1>
        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>
            AG7 Cars was founded by Aashendra Gour, for collectors. We don't sell cars — we steward
            extraordinary machines from one passionate owner to the next.
          </p>
          <p>
             Every supercar and luxury vehicle — brand new or pre-owned — is personally 
             verified, history-documented, and held to the highest standard. 
             At AG7 Cars, exclusivity isn't a promise. It's a policy.
          </p>
          <p>
            Whether you're acquiring your first dream car or adding the missing piece to a world-class collection — welcome
            to the AG7 Cars way.
          </p>
        </div>
      </div>
    </div>
  );
}
