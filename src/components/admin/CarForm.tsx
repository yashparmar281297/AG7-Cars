import { useState } from "react";
import { supabase } from "@/integrationssupabase/client";
import type { Car, BodyType, FuelType, CarCondition } from "@/types/car";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const BODIES: BodyType[] = ["coupe", "convertible", "sedan", "suv", "hypercar", "muvmpv", "hatchback"];
const FUELS: FuelType[] = ["petrol", "diesel", "electric", "hybrid"];
const CONDITIONS: CarCondition[] = ["new", "preowned"];

const inputCls = "w-full carbon-surface-deep border border-border focus:border-primary outline-none px-3 py-2 font-mono text-sm";

// ✅ Moved outside CarForm to prevent recreation on every render (fixes focus loss bug)
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      {children}
    </label>
  );
}

export function CarForm({ initial, onSaved }: { initial?: Car; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    brand: initial?.brand ?? "",
    model: initial?.model ?? "",
    year: initial?.year ?? new Date().getFullYear(),
    price: initial?.price?.toString() ?? "",
    body: (initial?.body ?? "coupe") as BodyType,
    fuel: (initial?.fuel ?? "petrol") as FuelType,
    kilometers: initial?.kilometers?.toString() ?? "",
    transmission: initial?.transmission ?? "Automatic",
    color: initial?.color ?? "",
    description: initial?.description ?? "",
    condition: (initial?.condition ?? "preowned") as CarCondition,
    featured: initial?.featured ?? false,
    horsepower: initial?.horsepower ?? null,
    torque: initial?.torque ?? null,
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (initial) {
        const { error } = await supabase.from("cars").update({...form,price: Number(form.price),kilometers: Number(form.kilometers),}).eq("id", initial.id);
        if (error) throw error;
        toast.success("Vehicle updated");
      } else {
        const { error } = await supabase.from("cars").insert({...form, price: Number(form.price),kilometers: Number(form.kilometers),images: [],});
        if (error) throw error;
        toast.success("Vehicle added");
      }
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
      <h2 className="font-display font-bold text-2xl">{initial ? "EDIT VEHICLE" : "ADD VEHICLE"}</h2>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Brand">
          <input className={inputCls} required value={form.brand} onChange={(e) => set("brand", e.target.value)} />
        </Field>
        <Field label="Model">
          <input className={inputCls} required value={form.model} onChange={(e) => set("model", e.target.value)} />
        </Field>
        <Field label="Year">
          <input type="number" className={inputCls} required value={form.year} onChange={(e) => set("year", +e.target.value)} />
        </Field>
        <Field label="Price (₹)">
         <input type="number" className={inputCls} required value={form.price} onChange={(e) => set("price", e.target.value)}/>
        </Field>
        <Field label="Kilometers">
        <input type="number" className={inputCls} value={form.kilometers} onChange={(e) => set("kilometers", e.target.value)} />
         </Field>
        <Field label="Color">
          <input className={inputCls} value={form.color} onChange={(e) => set("color", e.target.value)} />
        </Field>
        <Field label="Body">
          <select className={inputCls} value={form.body} onChange={(e) => set("body", e.target.value as BodyType)}>
            {BODIES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
        <Field label="Fuel">
          <select className={inputCls} value={form.fuel} onChange={(e) => set("fuel", e.target.value as FuelType)}>
            {FUELS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Condition">
          <select className={inputCls} value={form.condition} onChange={(e) => set("condition", e.target.value as CarCondition)}>
            {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Transmission">
          <input className={inputCls} value={form.transmission} onChange={(e) => set("transmission", e.target.value)} />
        </Field>
        <Field label="Horsepower">
          <input type="number" className={inputCls} value={form.horsepower ?? ""} onChange={(e) => set("horsepower", e.target.value ? +e.target.value : null)} />
        </Field>
        <Field label="Torque (Nm)">
          <input type="number" className={inputCls} value={form.torque ?? ""} onChange={(e) => set("torque", e.target.value ? +e.target.value : null)} />
          </Field>
        <label className="flex items-center gap-2 mt-6">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-primary" />
          <span className="font-mono text-xs uppercase tracking-widest">Featured</span>
        </label>
      </div>

      <Field label="Description">
        <textarea rows={3} className={inputCls} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </Field>

    <button
  type="submit"
  disabled={saving}
  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-crimson text-primary-foreground font-display font-bold tracking-widest uppercase text-sm shadow-crimson disabled:opacity-50"
  style={{ clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)" }}
>
  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
  {initial ? "SAVE CHANGES" : "ADD TO FLEET"}
</button>

      {!initial && (
        <p className="text-[10px] font-mono text-muted-foreground text-center">
          After creating, use the upload button on the row to add images. Min 5, Max 20 per vehicle.
        </p>
      )}
    </form>
  );
}