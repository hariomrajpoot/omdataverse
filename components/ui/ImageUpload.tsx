"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";

// File-upload control that replaces a raw image-URL text input. Uploads via
// /api/upload (Supabase Storage) and reports the resulting public URL through
// onChange — so the stored value is still a URL string.
export function ImageUpload({
  value,
  onChange,
  folder,
  className,
}: {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (folder) fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-brand-border/60 bg-brand-surface">
          {value ? (
            // Public Supabase URL; plain <img> avoids next/image remote config.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-brand-fg/30">
              <Upload className="h-5 w-5" />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-brand-border/60 px-3 text-sm font-medium text-brand-fg transition-colors hover:bg-brand-surface disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" /> {value ? "Replace" : "Upload image"}
              </>
            )}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-sm text-brand-fg/60 hover:text-red-600"
            >
              <X className="h-4 w-4" /> Remove
            </button>
          )}
        </div>
      </div>

      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
