import { cn } from "@/lib/utils";
import {
  Car as CarIcon,
  Wind,
  Zap,
  Mountain,
  Crown,
  Gauge,
  Box,
} from "lucide-react";

import coupeIcon from "@/assets/coupe.png";
import suvIcon from "@/assets/SUV.png";
import sedanIcon from "@/assets/sedan.png";
import supercarIcon from "@/assets/super.png";
import convertibleIcon from "@/assets/convert.png";
import hatchbackIcon from "@/assets/Hatch.png";
import muvmpvcarIcon from "@/assets/muv.png";
import Gaugeicon from "@/assets/Guage.png";

export interface BodyOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  label: string;
  options: BodyOption<T>[];
  value: T;
  onChange: (v: T) => void;
}

/**
 * ICON CONFIG (mix of Lucide + images)
 */
const ICONS: Record<
  string,
  | { type: "component"; icon: React.ComponentType<{ className?: string }> }
  | { type: "image"; icon: string }
> = {
  all: { type: "image", icon: Gaugeicon },

  coupe: { type: "image", icon: coupeIcon },
  suv: { type: "image", icon: suvIcon },
  sedan: { type: "image", icon: sedanIcon },
  hypercar: { type: "image", icon: supercarIcon },
  muvmpv: { type: "image", icon: muvmpvcarIcon },

  hatchback: { type: "image", icon: hatchbackIcon },
  convertible: { type: "image", icon: convertibleIcon },

  premium: { type: "component", icon: Crown },
  performance: { type: "component", icon: Zap },
};

export function BodyTypeGrid<T extends string>({
  label,
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <div className="space-y-3">
      {/* Label header */}
      <div className="flex items-center gap-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {label}
        </div>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const item = ICONS[opt.value];
          const active = opt.value === value;

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 carbon-surface-deep border transition-all duration-200",
                active
                  ? "border-primary text-primary shadow-crimson"
                  : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
              )}
              style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
              aria-pressed={active}
            >
              {/* corner dot */}
              <span
                className={cn(
                  "absolute top-1 right-1 w-1.5 h-1.5 rounded-full transition-colors",
                  active
                    ? "bg-primary shadow-crimson"
                    : "bg-border group-hover:bg-primary/50"
                )}
              />

              {/* ICON RENDER LOGIC */}
              {item?.type === "image" ? (
                <img
                  src={item.icon}
                  alt={opt.label}
                 className={cn(
  "w-10 h-10 object-contain drop-shadow-sm transition-transform",
  active && "scale-110 drop-shadow-md"
)}
                />
              ) : item?.type === "component" ? (
                <item.icon
                  className={cn(
                    "w-10 h-10 transition-transform",
                    active && "scale-110"
                  )}
                />
              ) : (
                <CarIcon className="w-5 h-5" />
              )}

              {/* label */}
              <span className="font-mono text-[9px] uppercase tracking-widest text-center">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// import { cn } from "@/lib/utils";
// import { Car as CarIcon, Wind, Zap, Mountain, Crown, Gauge, Box } from "lucide-react";

// export interface BodyOption<T extends string> {
//   value: T;
//   label: string;
// }

// interface Props<T extends string> {
//   label: string;
//   options: BodyOption<T>[];
//   value: T;
//   onChange: (v: T) => void;
// }

// const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
//   all: Gauge,
//   coupe: CarIcon,
//   convertible: Wind,
//   hypercar: Zap,
//   muvmpv: Wind,
//   sedan: CarIcon,
//   suv: Mountain,
//   hatchback: Box,
//   premium: Crown,
// };

// /**
//  * Carbon-fiber body-type selector. All options visible at once,
//  * directly clickable. Replaces the rotary which only cycled forward.
//  */
// export function BodyTypeGrid<T extends string>({ label, options, value, onChange }: Props<T>) {
//   return (
//     <div className="space-y-3">
//       <div className="flex items-center gap-2">
//         <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
//         <div className="flex-1 h-px bg-border" />
//       </div>
//       <div className="grid grid-cols-3 gap-2">
//         {options.map((opt) => {
//           const Icon = ICONS[opt.value] ?? CarIcon;
//           const active = opt.value === value;
//           return (
//             <button
//               key={opt.value}
//               type="button"
//               onClick={() => onChange(opt.value)}
//               className={cn(
//                 "group relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 carbon-surface-deep border transition-all duration-200",
//                 active
//                   ? "border-primary text-primary shadow-crimson"
//                   : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
//               )}
//               style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
//               aria-pressed={active}
//             >
//               {/* corner accent */}
//               <span
//                 className={cn(
//                   "absolute top-1 right-1 w-1.5 h-1.5 rounded-full transition-colors",
//                   active ? "bg-primary shadow-crimson" : "bg-border group-hover:bg-primary/50"
//                 )}
//               />
//               <Icon className={cn("w-5 h-5 transition-transform", active && "scale-110")} />
//               <span className="font-mono text-[9px] uppercase tracking-widest">
//                 {opt.label}
//               </span>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
