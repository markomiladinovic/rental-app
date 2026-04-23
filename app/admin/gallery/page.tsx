"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import MultiImageUpload from "@/components/admin/MultiImageUpload";

type GalleryImage = {
  id: string;
  url: string;
  alt: string;
};

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then(setImages);
  }, []);

  const save = async (updated: GalleryImage[]) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setImages(updated);
        setMessage("Sačuvano!");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch {
      setMessage("Greška pri čuvanju");
    } finally {
      setSaving(false);
    }
  };

  const addImages = (urls: string[]) => {
    const newImages: GalleryImage[] = urls.map((url, i) => ({
      id: `${Date.now()}-${i}`,
      url,
      alt: "Nova slika",
    }));
    const updated = [...images, ...newImages];
    save(updated);
  };

  const removeImage = (id: string) => {
    const updated = images.filter((img) => img.id !== id);
    save(updated);
  };

  const updateAlt = (id: string, alt: string) => {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, alt } : img)));
  };

  const saveAlt = (id: string) => {
    save(images);
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    const updated = [...images];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    save(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-bold text-xl text-midnight">Galerija</h2>
          <p className="text-muted text-sm">Slike koje se prikazuju na početnoj stranici</p>
        </div>
        {message && (
          <span className="text-sm font-medium text-emerald bg-emerald/10 px-3 py-1.5 rounded-lg">
            {message}
          </span>
        )}
      </div>

      {/* Add new images */}
      <div className="bg-white rounded-2xl border border-cloud p-6 mb-6">
        <h3 className="font-heading font-semibold text-midnight mb-4">Dodaj slike</h3>
        <MultiImageUpload onUploaded={addImages} />
      </div>

      {/* Image list */}
      <div className="space-y-3">
        {images.map((img, index) => (
          <div key={img.id} className="bg-white rounded-2xl border border-cloud p-4 flex items-center gap-4">
            <div className="relative w-32 h-20 rounded-xl overflow-hidden bg-cloud flex-shrink-0">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="128px"
                className="object-cover"
                unoptimized={img.url.startsWith("/uploads")}
              />
            </div>

            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={img.alt}
                onChange={(e) => updateAlt(img.id, e.target.value)}
                onBlur={() => saveAlt(img.id)}
                placeholder="Opis slike..."
                className="w-full bg-snow border border-silver rounded-xl px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors"
              />
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => moveImage(index, -1)}
                disabled={index === 0}
                className="w-8 h-8 rounded-lg border border-silver flex items-center justify-center text-subtle hover:bg-cloud transition-colors disabled:opacity-30 cursor-pointer"
                title="Pomeri gore"
              >
                ↑
              </button>
              <button
                onClick={() => moveImage(index, 1)}
                disabled={index === images.length - 1}
                className="w-8 h-8 rounded-lg border border-silver flex items-center justify-center text-subtle hover:bg-cloud transition-colors disabled:opacity-30 cursor-pointer"
                title="Pomeri dole"
              >
                ↓
              </button>
              <button
                onClick={() => removeImage(img.id)}
                className="w-8 h-8 rounded-lg border border-rose/30 flex items-center justify-center text-rose hover:bg-rose/10 transition-colors cursor-pointer ml-1"
                title="Obriši"
              >
                ×
              </button>
            </div>
          </div>
        ))}

        {images.length === 0 && (
          <div className="text-center py-12 text-muted">
            <p className="text-3xl mb-2">🖼️</p>
            <p>Nema slika u galeriji. Dodaj prvu sliku iznad.</p>
          </div>
        )}
      </div>
    </div>
  );
}
