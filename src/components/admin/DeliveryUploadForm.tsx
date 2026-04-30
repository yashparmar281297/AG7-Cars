import { useState } from "react";
import { supabase } from "@/integrationssupabase/client";
import { toast } from "sonner";
import { Loader2, X, Plus } from "lucide-react";

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

  const [files, setFiles] = useState<File[]>([]);
  const [thumb, setThumb] = useState<File | null>(null);

  // Function to handle file selection and append to list
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

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
    if (files.length === 0) return toast.error("Please select at least one media file");

    setSaving(true);

    try {
      // 1. Create delivery record
      const { data: delivery, error: deliveryError } = await supabase
        .from("deliveries")
        .insert({
          brand: brand.trim(),
          model: model.trim() || null,
          caption: caption.trim() || null,
          delivered_at: deliveredAt,
        })
        .select()
        .single();

      if (deliveryError) throw deliveryError;

      // 2. Upload thumbnail if video/reel
      let thumbnail_url: string | null = null;
      if (thumb) thumbnail_url = await uploadOne(thumb);

      // 3. Upload ALL files (Sequential to maintain order)
      const uploads = [];
      for (const file of files) {
        const media_url = await uploadOne(file);
        uploads.push({
          delivery_id: delivery.id,
          media_url,
          media_type: mediaType,
          thumbnail_url,
        });
      }

      // 4. Insert into media table
      const { error: mediaError } = await supabase.from("delivery_media_items").insert(uploads);
      if (mediaError) throw mediaError;

      toast.success("Delivery posted successfully 🚗");
      
      // Reset Form
      setBrand("");
      setModel("");
      setCaption("");
      setFiles([]);
      setThumb(null);
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
      <h2 className="font-display font-bold text-2xl uppercase tracking-tighter">
        Upload <span className="text-primary">Delivery Media</span>
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <input className={inputCls} placeholder="Brand (e.g. BMW)" value={brand} onChange={(e) => setBrand(e.target.value)} required />
        <input className={inputCls} placeholder="Model (e.g. M4)" value={model} onChange={(e) => setModel(e.target.value)} />
        
        <select className={inputCls} value={mediaType} onChange={(e) => setMediaType(e.target.value as MediaType)}>
          <option value="photo">Photo</option>
          <option value="video">Video</option>
          <option value="reel">Reel</option>
        </select>

        <input type="date" className={inputCls} value={deliveredAt} onChange={(e) => setDeliveredAt(e.target.value)} />
      </div>

      {/* MEDIA PREVIEW SYSTEM */}
      <div className="space-y-2">
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Select Media (Main)</label>
        <div className="grid grid-cols-4 gap-2">
          {files.map((file, idx) => (
            <div key={idx} className="relative aspect-square carbon-surface border border-border group overflow-hidden">
              <img 
                src={URL.createObjectURL(file)} 
                className="w-full h-full object-cover" 
                alt="preview" 
                onLoad={(e) => URL.revokeObjectURL((e.target as any).src)}
              />
              <button 
                type="button"
                onClick={() => removeFile(idx)}
                className="absolute top-1 right-1 bg-black/60 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
              {idx === 0 && (
                <div className="absolute bottom-0 inset-x-0 bg-primary text-[8px] text-center font-bold uppercase py-0.5 text-black">Main Cover</div>
              )}
            </div>
          ))}
          <label className="aspect-square carbon-surface border border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
            <Plus size={20} className="text-muted-foreground" />
            <span className="text-[8px] uppercase mt-1 font-mono">Add</span>
            <input type="file" multiple accept={accept} className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      </div>

      {/* THUMBNAIL FOR VIDEO */}
      {mediaType !== "photo" && (
        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Video Thumbnail</label>
          <input type="file" accept="image/*" className="block w-full text-xs font-mono" onChange={(e) => setThumb(e.target.files?.[0] ?? null)} />
        </div>
      )}

      <textarea className={inputCls} placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} rows={2} />

      <button
        type="submit"
        disabled={saving}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-crimson text-white font-display font-bold tracking-widest uppercase text-sm disabled:opacity-50"
        style={{ clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)" }}
      >
        {saving ? <Loader2 className="animate-spin w-4 h-4" /> : "POST DELIVERY"}
      </button>
    </form>
  );
}