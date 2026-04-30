import { useState } from "react";
import { supabase } from "@/integrationssupabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const inputCls =
  "w-full carbon-surface-deep border border-border focus:border-primary outline-none px-3 py-2 font-mono text-sm";

type MediaType = "photo" | "video" | "reel";

export function DeliveryUploadForm({ onSaved }: { onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("photo");
  const [caption, setCaption] = useState("");
  const [deliveredAt, setDeliveredAt] = useState(new Date().toISOString().slice(0, 10));
  const [file, setFile] = useState<File | null>(null);
  const [thumb, setThumb] = useState<File | null>(null);

  async function uploadOne(f: File): Promise<string> {
    const ext = f.name.split(".").pop() || "bin";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from("delivery-media")
      .upload(path, f, { contentType: f.type });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from("delivery-media").getPublicUrl(path);
    return publicUrl;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!brand.trim()) return toast.error("Brand is required");
    if (!file) return toast.error("Please select a media file");
    setSaving(true);
    try {
      const media_url = await uploadOne(file);
      let thumbnail_url: string | null = null;
      if (thumb) thumbnail_url = await uploadOne(thumb);

      const { error } = await supabase.from("deliveries").insert({
        brand: brand.trim(),
        model: model.trim() || null,
        media_url,
        media_type: mediaType,
        thumbnail_url,
        caption: caption.trim() || null,
        delivered_at: deliveredAt,
      });
      if (error) throw error;

      toast.success("Delivery posted");
      setBrand(""); setModel(""); setCaption(""); setFile(null); setThumb(null);
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSaving(false);
    }
  }

  const accept = mediaType === "photo" ? "image/*" : "video/*";

  return (
    <form onSubmit={submit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
      <h2 className="font-display font-bold text-2xl">UPLOAD DELIVERY MEDIA</h2>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Brand *</div>
          <input className={inputCls} required value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="BMW" />
        </label>
        <label className="block">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Model</div>
          <input className={inputCls} value={model} onChange={(e) => setModel(e.target.value)} placeholder="M4 Competition" />
        </label>

        <label className="block">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Type</div>
          <select className={inputCls} value={mediaType} onChange={(e) => setMediaType(e.target.value as MediaType)}>
            <option value="photo">Photo</option>
            <option value="video">Video</option>
            <option value="reel">Reel (vertical)</option>
          </select>
        </label>
        <label className="block">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Delivered On</div>
          <input type="date" className={inputCls} value={deliveredAt} onChange={(e) => setDeliveredAt(e.target.value)} />
        </label>
      </div>

      <label className="block">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
          Media File * ({mediaType === "photo" ? "image" : "video"})
        </div>
        <input
          type="file"
          accept={accept}
          required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-xs font-mono"
        />
      </label>

      {mediaType !== "photo" && (
        <label className="block">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            Thumbnail (optional, image)
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumb(e.target.files?.[0] ?? null)}
            className="block w-full text-xs font-mono"
          />
        </label>
      )}

      <label className="block">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Caption</div>
        <textarea rows={2} className={inputCls} value={caption} onChange={(e) => setCaption(e.target.value)} />
      </label>

      <button
        type="submit"
        disabled={saving}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-crimson font-display font-bold tracking-widest uppercase text-sm shadow-crimson disabled:opacity-50"
        style={{ clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)" }}
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        POST DELIVERY
      </button>
    </form>
  );
}
