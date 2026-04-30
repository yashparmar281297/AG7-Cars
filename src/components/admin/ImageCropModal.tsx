import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { X, Loader2 } from "lucide-react";

interface Props {
  file: File;
  onCancel: () => void;
  onConfirm: (croppedBlob: Blob) => void;
  /** width/height ratio. Default 16/10 to match card preview. */
  aspect?: number;
}

/** Crop the source image to the given pixel area and return a Blob. */
async function getCroppedBlob(src: string, area: Area, mime = "image/jpeg"): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = src;
  });
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(area.width);
  canvas.height = Math.round(area.height);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Crop failed"))), mime, 0.92);
  });
}

export function ImageCropModal({ file, onCancel, onConfirm, aspect = 16 / 10 }: Props) {
  const [src] = useState(() => URL.createObjectURL(file));
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPx, setAreaPx] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => setAreaPx(pixels), []);

  async function confirm() {
    if (!areaPx) return;
    setBusy(true);
    try {
      const blob = await getCroppedBlob(src, areaPx, file.type.includes("png") ? "image/png" : "image/jpeg");
      URL.revokeObjectURL(src);
      onConfirm(blob);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur flex items-center justify-center p-4">
      <div className="w-full max-w-2xl carbon-surface border border-primary/40 relative p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold tracking-widest uppercase text-sm">Crop Image — {file.name}</h3>
          <button onClick={() => { URL.revokeObjectURL(src); onCancel(); }} className="p-1 border border-border hover:border-primary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative w-full h-[60vh] bg-carbon-900">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Zoom</span>
          <input
            type="range" min={1} max={4} step={0.01}
            value={zoom}
            onChange={(e) => setZoom(+e.target.value)}
            className="flex-1 accent-primary"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => { URL.revokeObjectURL(src); onCancel(); }}
            className="px-4 py-2 border border-border font-mono text-xs uppercase tracking-widest hover:border-primary"
          >
            Skip
          </button>
<button
  onClick={confirm}
  disabled={busy || !areaPx}
  className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-crimson text-primary-foreground font-display font-bold tracking-widest uppercase text-xs shadow-crimson disabled:opacity-50"
  style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)" }}
>
  {busy && <Loader2 className="w-4 h-4 animate-spin" />}
  Crop & Upload
</button>
        </div>
      </div>
    </div>
  );
}
