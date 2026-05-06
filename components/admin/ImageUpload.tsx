"use client";
import { useState, useRef } from "react";
import Image from "next/image";

type ImageUploadProps = {
  currentImage: string;
  onImageChange: (url: string) => void;
  label?: string;
};

export default function ImageUpload({ currentImage, onImageChange, label = "Slika" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Greška pri uploadu");
        return;
      }

      onImageChange(data.url);
    } catch {
      setError("Greška pri uploadu");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-dark mb-2">{label}</label>
      <div className="flex items-start gap-4">
        <div className="relative w-32 h-24 rounded-xl overflow-hidden bg-cloud border border-silver flex-shrink-0">
          {currentImage ? (
            <Image
              src={currentImage}
              alt="Preview"
              fill
              sizes="128px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-2xl">
              📷
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="bg-white hover:bg-cloud text-midnight border border-silver text-sm font-semibold px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            {uploading ? "Otpremanje..." : "Otpremi sliku"}
          </button>
          <p className="text-muted text-xs mt-2">JPG, PNG, WebP ili AVIF. Max 5MB.</p>
          {error && <p className="text-rose text-xs mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}
