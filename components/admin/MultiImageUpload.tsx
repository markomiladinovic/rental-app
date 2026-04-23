"use client";
import { useState, useRef, useCallback } from "react";

type MultiImageUploadProps = {
  onUploaded: (urls: string[]) => void;
};

type UploadItem = {
  name: string;
  status: "uploading" | "done" | "error";
  error?: string;
};

export default function MultiImageUpload({ onUploaded }: MultiImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [items, setItems] = useState<UploadItem[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      setItems(files.map((f) => ({ name: f.name, status: "uploading" })));

      const results = await Promise.all(
        files.map(async (file, index) => {
          const formData = new FormData();
          formData.append("file", file);
          try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (res.ok) {
              setItems((prev) => prev.map((it, i) => (i === index ? { ...it, status: "done" } : it)));
              return data.url as string;
            }
            setItems((prev) => prev.map((it, i) => (i === index ? { ...it, status: "error", error: data.error } : it)));
            return null;
          } catch {
            setItems((prev) => prev.map((it, i) => (i === index ? { ...it, status: "error", error: "Greška" } : it)));
            return null;
          }
        })
      );

      const urls = results.filter((u): u is string => u !== null);
      if (urls.length > 0) onUploaded(urls);

      setTimeout(() => setItems([]), 2500);
    },
    [onUploaded]
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    uploadFiles(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    uploadFiles(files);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-ocean bg-ocean/5"
            : "border-silver bg-snow hover:border-ocean/50 hover:bg-cloud"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={handleChange}
          className="hidden"
        />
        <div className="text-4xl mb-2">📁</div>
        <p className="font-semibold text-midnight mb-1">
          Prevuci slike ovde ili klikni da izabereš
        </p>
        <p className="text-muted text-sm">Možeš otpremiti više slika odjednom. JPG, PNG, WebP ili AVIF. Max 5MB po slici.</p>
      </div>

      {items.length > 0 && (
        <div className="mt-4 space-y-2">
          {items.map((it, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-4 py-2 rounded-xl text-sm ${
                it.status === "done"
                  ? "bg-emerald/10 text-emerald"
                  : it.status === "error"
                    ? "bg-rose/10 text-rose"
                    : "bg-cloud text-subtle"
              }`}
            >
              <span className="truncate">{it.name}</span>
              <span className="ml-3 flex-shrink-0 font-medium">
                {it.status === "uploading" && "Otpremanje..."}
                {it.status === "done" && "✓ Otpremljeno"}
                {it.status === "error" && (it.error || "Greška")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
