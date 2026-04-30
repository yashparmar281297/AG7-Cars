import { cn } from "@/lib/utils";

interface Chip {
  value: string;
  label: string;
}
interface Props {
  label: string;
  chips: Chip[];
  selected: string[];
  onToggle: (v: string) => void;
}

export function CarbonChips({ label, chips, selected, onToggle }: Props) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">{label}</div>
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => {
          const active = selected.includes(c.value);
          return (
            <button
              key={c.value}
              onClick={() => onToggle(c.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-mono uppercase tracking-widest border transition-smooth",
                active
                  ? "border-primary bg-primary/15 text-primary shadow-crimson"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
              style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)" }}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
