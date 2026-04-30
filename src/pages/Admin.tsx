import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrationssupabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Car, CarStatus } from "@/types/car";
import { formatPrice, resolveImage } from "@/types/car";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Upload, X, Edit3, Film } from "lucide-react";
import { CarForm } from "@/components/admin/CarForm";
import { ImageCropModal } from "@/components/admin/ImageCropModal";
import { DeliveryUploadForm } from "@/components/admin/DeliveryUploadForm";
import { cn } from "@/lib/utils";

const STATUS_CYCLE: CarStatus[] = ["available", "booked", "sold"];

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Car | null>(null);
  const [creating, setCreating] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [cropQueue, setCropQueue] = useState<{ car: Car; files: File[] } | null>(null);
  const [uploadingDelivery, setUploadingDelivery] = useState(false);

  useEffect(() => {
    if (isAdmin) refresh();
  }, [isAdmin]);

  async function refresh() {
    setLoading(true);
    const { data } = await supabase.from("cars").select("*").order("created_at", { ascending: false });
    setCars((data as Car[]) ?? []);
    setLoading(false);
  }

  if (authLoading) return <div className="pt-32 text-center font-mono">AUTHENTICATING...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return (
    <div className="pt-32 container max-w-lg text-center">
      <h1 className="font-display text-3xl mb-3">ACCESS DENIED</h1>
      <p className="text-muted-foreground">Your account does not have admin privileges. Contact a system owner to grant the <span className="text-primary font-mono">admin</span> role in <span className="text-primary font-mono">user_roles</span>.</p>
    </div>
  );

  async function cycleStatus(car: Car) {
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(car.status) + 1) % STATUS_CYCLE.length];
    const { error } = await supabase.from("cars").update({ status: next }).eq("id", car.id);
    if (error) return toast.error(error.message);
    toast.success(`Status → ${next.toUpperCase()}`);
    setCars((cs) => cs.map((c) => (c.id === car.id ? { ...c, status: next } : c)));
  }

  async function removeCar(car: Car) {
    if (!confirm(`Delete ${car.brand} ${car.model}? This cannot be undone.`)) return;
    const { error } = await supabase.from("cars").delete().eq("id", car.id);
    if (error) return toast.error(error.message);
    toast.success("Vehicle removed");
    setCars((cs) => cs.filter((c) => c.id !== car.id));
  }

  function startCropQueue(car: Car, files: FileList) {
    const fileArr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const remainingSlots = 20 - car.images.length;
    if (remainingSlots <= 0) {
      toast.error("Maximum 20 images per vehicle");
      return;
    }
    const toQueue = fileArr.slice(0, remainingSlots);
    if (fileArr.length > remainingSlots) {
      toast.warning(`Only ${remainingSlots} image(s) queued — 20 max per vehicle`);
    }
    if (toQueue.length) setCropQueue({ car, files: toQueue });
  }

  async function uploadBlob(car: Car, blob: Blob, originalName: string) {
    setUploadingFor(car.id);
    try {
      const ext = blob.type === "image/png" ? "png" : "jpg";
      const path = `${car.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("car-images").upload(path, blob, { contentType: blob.type });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("car-images").getPublicUrl(path);
      const newImages = [...car.images, publicUrl];
      const { error } = await supabase.from("cars").update({ images: newImages }).eq("id", car.id);
      if (error) throw error;
      setCars((cs) => cs.map((c) => (c.id === car.id ? { ...c, images: newImages } : c)));
      toast.success(`Image added (${originalName})`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingFor(null);
    }
  }

  /** Advance the crop queue: drops the first file, closes modal if empty. */
  function advanceQueue() {
    setCropQueue((q) => {
      if (!q) return null;
      const next = q.files.slice(1);
      if (!next.length) return null;
      // Re-read latest car from state so image counts stay accurate
      const latestCar = cars.find((c) => c.id === q.car.id) ?? q.car;
      return { car: latestCar, files: next };
    });
  }

  async function removeImage(car: Car, idx: number) {
    const newImages = car.images.filter((_, i) => i !== idx);
    const { error } = await supabase.from("cars").update({ images: newImages }).eq("id", car.id);
    if (error) return toast.error(error.message);
    setCars((cs) => cs.map((c) => (c.id === car.id ? { ...c, images: newImages } : c)));
    toast.success("Image removed");
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-px bg-primary" />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">ADMIN CONSOLE</span>
            </div>
            <h1 className="font-display font-black text-4xl">FLEET <span className="text-primary text-glow">MANAGEMENT</span></h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setUploadingDelivery(true)}
              className="inline-flex items-center gap-2 px-5 py-3 border border-primary text-primary font-display font-bold tracking-widest uppercase text-xs hover:bg-primary/10 transition-smooth"
              style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)" }}
            >
              <Film className="w-4 h-4" /> UPLOAD MEDIA
            </button>
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-crimson font-display font-bold tracking-widest uppercase text-xs shadow-crimson"
              style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)" }}
            >
              <Plus className="w-4 h-4" /> ADD VEHICLE
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20"><Loader2 className="w-6 h-6 animate-spin inline" /></div>
        ) : (
          <div className="space-y-3">
            {cars.map((car) => {
              const imgCount = car.images.length;
              const belowMin = imgCount < 5;
              const atMax = imgCount >= 20;
              return (
              <div key={car.id} className="carbon-surface border border-border p-3 space-y-3">
                <div className="grid md:grid-cols-[120px_1fr_auto] gap-4 items-center">
                  <div className="aspect-[16/10] bg-carbon-900 overflow-hidden">
                    {car.images?.[0] && (
                      <img src={resolveImage(car.images[0])} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-lg">{car.brand} {car.model}</span>
                      <span className="font-mono text-xs text-muted-foreground">· {car.year}</span>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {formatPrice(car.price)} · {car.body} · {car.fuel} · {car.kilometers.toLocaleString()} km
                    </div>
                    <div className={cn(
                      "font-mono text-[10px] uppercase tracking-widest",
                      belowMin ? "text-status-booked" : atMax ? "text-primary" : "text-status-available"
                    )}>
                      {imgCount} / 20 images {belowMin && `· need ${5 - imgCount} more (min 5)`}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => cycleStatus(car)}
                      className={cn(
                        "px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border transition-smooth",
                        car.status === "available" && "border-status-available text-status-available bg-status-available/10",
                        car.status === "booked" && "border-status-booked text-status-booked bg-status-booked/10",
                        car.status === "sold" && "border-status-sold text-status-sold bg-status-sold/10"
                      )}
                      title="Click to cycle status"
                    >
                      ● {car.status}
                    </button>
                    <label className={cn(
                      "p-2 border transition-smooth",
                      atMax
                        ? "border-border opacity-40 cursor-not-allowed"
                        : "border-border hover:border-primary cursor-pointer"
                    )} title={atMax ? "Max 20 images" : "Add images (multi-select supported)"}>
                      {uploadingFor === car.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={atMax}
                        className="hidden"
                        onChange={(e) => {
                          const fs = e.target.files;
                          if (fs && fs.length) startCropQueue(car, fs);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <button
                      onClick={() => setEditing(car)}
                      className="p-2 border border-border hover:border-primary transition-smooth"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeCar(car)}
                      className="p-2 border border-border hover:border-destructive hover:text-destructive transition-smooth"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {imgCount > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {car.images.map((img, i) => (
                      <div key={i} className="relative shrink-0 w-20 h-14 border border-border overflow-hidden group">
                        <img src={resolveImage(img)} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(car, i)}
                          className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-destructive transition-smooth"
                          title="Remove image"
                          aria-label={`Remove image ${i + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )}
      </div>

      {uploadingDelivery && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur flex items-start justify-center overflow-y-auto p-4 md:p-8">
          <div className="w-full max-w-2xl carbon-surface border border-primary/40 corner-brackets relative">
            <button
              onClick={() => setUploadingDelivery(false)}
              className="absolute top-3 right-3 p-1 border border-border hover:border-primary"
            >
              <X className="w-4 h-4" />
            </button>
            <DeliveryUploadForm onSaved={() => setUploadingDelivery(false)} />
          </div>
        </div>
      )}

      {(creating || editing) && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur flex items-start justify-center overflow-y-auto p-4 md:p-8">
          <div className="w-full max-w-2xl carbon-surface border border-primary/40 corner-brackets relative">
            <button
              onClick={() => { setCreating(false); setEditing(null); }}
              className="absolute top-3 right-3 p-1 border border-border hover:border-primary"
            >
              <X className="w-4 h-4" />
            </button>
            <CarForm
              initial={editing ?? undefined}
              onSaved={() => { setCreating(false); setEditing(null); refresh(); }}
            />
          </div>
        </div>
      )}

      {cropQueue && cropQueue.files[0] && (
        <ImageCropModal
          key={cropQueue.files[0].name + cropQueue.files.length}
          file={cropQueue.files[0]}
          onCancel={advanceQueue}
          onConfirm={async (blob) => {
            const f = cropQueue.files[0];
            const car = cropQueue.car;
            advanceQueue();
            await uploadBlob(car, blob, f.name);
          }}
        />
      )}
    </div>
  );
}
