import { useRef, useState } from "react";

interface Rect { x: number; y: number; w: number; h: number }

function ImageCropper({
  src, onConfirm, onCancel,
}: { src: string; onConfirm: (blob: Blob) => void; onCancel: () => void }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rects, setRects] = useState<Rect[]>([]);
  const [currentRect, setCurrentRect] = useState<Rect | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  function relativePos(e: React.MouseEvent) {
    const bounds = containerRef.current!.getBoundingClientRect();
    return {
      x: Math.min(Math.max(e.clientX - bounds.left, 0), bounds.width),
      y: Math.min(Math.max(e.clientY - bounds.top, 0), bounds.height),
    };
  }

  function handleMouseDown(e: React.MouseEvent) {
    const pos = relativePos(e);
    setDragStart(pos);
    setCurrentRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragStart) return;
    const pos = relativePos(e);
    setCurrentRect({
      x: Math.min(dragStart.x, pos.x),
      y: Math.min(dragStart.y, pos.y),
      w: Math.abs(pos.x - dragStart.x),
      h: Math.abs(pos.y - dragStart.y),
    });
  }

  function handleMouseUp() {
    setDragStart(null);
    if (currentRect && currentRect.w >= 5 && currentRect.h >= 5) {
      setRects((prev) => [...prev, currentRect]);
    }
    setCurrentRect(null);
  }

  function removeRect(index: number) {
    setRects((prev) => prev.filter((_, i) => i !== index));
  }

  function confirmCrop() {
    if (rects.length === 0 || !imgRef.current) return;
    const img = imgRef.current;
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;

    // Stack parts top-to-bottom by where they sit on the source page,
    // not by the order they were drawn in.
    const parts = rects
      .map((r) => ({ sx: r.x * scaleX, sy: r.y * scaleY, sw: r.w * scaleX, sh: r.h * scaleY }))
      .sort((a, b) => a.sy - b.sy);

    const GAP = 16;
    const width = Math.max(...parts.map((p) => p.sw));
    const height = parts.reduce((sum, p) => sum + p.sh, 0) + GAP * (parts.length - 1);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    let offsetY = 0;
    for (const p of parts) {
      ctx.drawImage(img, p.sx, p.sy, p.sw, p.sh, 0, offsetY, p.sw, p.sh);
      offsetY += p.sh + GAP;
    }

    canvas.toBlob((blob) => {
      if (blob) onConfirm(blob);
    }, "image/png");
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/75 p-6">
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative max-h-[46vh] max-w-[55vw] cursor-crosshair select-none"
      >
        <img
          ref={imgRef}
          src={src}
          alt="Crop source"
          className="max-h-[46vh] max-w-[55vw] select-none"
          draggable={false}
        />
        {rects.map((r, i) => (
          <div
            key={i}
            className="absolute border-2 border-cobalt bg-[rgba(27,59,214,0.15)]"
            style={{ left: r.x, top: r.y, width: r.w, height: r.h }}
          >
            <button
              type="button"
              onClick={() => removeRect(i)}
              title="Remove this part"
              className="absolute -right-2.5 -top-2.5 grid h-5 w-5 cursor-pointer place-items-center rounded-full border-none bg-ember text-xs font-bold leading-none text-white"
            >
              ×
            </button>
            <span className="absolute left-1 top-1 rounded bg-cobalt px-1 text-[10px] font-semibold text-white">
              {i + 1}
            </span>
          </div>
        ))}
        {currentRect && (
          <div
            className="pointer-events-none absolute border-2 border-dashed border-cobalt bg-[rgba(27,59,214,0.1)]"
            style={{ left: currentRect.x, top: currentRect.y, width: currentRect.w, height: currentRect.h }}
          />
        )}
      </div>
      <p className="text-xs text-white/70">
        Drag to add a part — draw as many as the question needs. Parts stack top-to-bottom by page position.
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-lg border border-white/30 bg-transparent px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
        >
          Cancel
        </button>
        {rects.length > 0 && (
          <button
            type="button"
            onClick={() => setRects([])}
            className="cursor-pointer border-none bg-transparent px-1 text-sm font-medium text-white/70 hover:text-white hover:underline"
          >
            Clear all
          </button>
        )}
        <button
          type="button"
          onClick={confirmCrop}
          disabled={rects.length === 0}
          className="cursor-pointer rounded-lg border-none bg-cobalt px-5 py-2.5 text-sm font-semibold text-cobalt-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          Confirm crop{rects.length > 1 ? ` (${rects.length} parts)` : ""}
        </button>
      </div>
    </div>
  );
}

export function ImageField({
  label, file, onChange, initialUrl,
}: { label: string; file: File | null; onChange: (f: File | null) => void; initialUrl?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = file ? URL.createObjectURL(file) : initialUrl ?? null;
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  function handlePicked(picked: File | null) {
    if (!picked) return;
    setCropSrc(URL.createObjectURL(picked));
  }

  function handleConfirmCrop(blob: Blob) {
    onChange(new File([blob], "cropped.png", { type: "image/png" }));
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  }

  function handleCancelCrop() {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  }

  return (
    <div className="block">
      <span className="mb-1 block text-xs font-semibold text-admin-graphite">{label}</span>
      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer items-center justify-center overflow-hidden border border-dashed border-admin-line bg-white"
        style={{ aspectRatio: label.toLowerCase().includes("scheme") ? "4/3" : "16/10" }}
      >
        {previewUrl ? (
          <img src={previewUrl} alt={label} className="h-full w-full object-contain" />
        ) : (
          <span className="px-4 text-center text-sm text-admin-graphite">Click to choose &amp; crop an image</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handlePicked(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />
      <div className="mt-1.5 flex items-center justify-between gap-2 text-xs text-admin-graphite">
        <span className="truncate">{file ? file.name : initialUrl ? "Current image" : "No image chosen"}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer border-none bg-transparent p-0 font-medium text-cobalt hover:underline"
          >
            Re-crop
          </button>
          {file && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="cursor-pointer border-none bg-transparent p-0 font-medium text-ember hover:underline"
            >
              Undo change
            </button>
          )}
        </div>
      </div>
      {cropSrc && <ImageCropper src={cropSrc} onConfirm={handleConfirmCrop} onCancel={handleCancelCrop} />}
    </div>
  );
}
