"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Product } from "@/data/products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const updateProduct = async (product: Product) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setMessage("Sačuvano!");
        setTimeout(() => setMessage(""), 2000);
        setEditing(null);
      }
    } catch {
      setMessage("Greška pri čuvanju");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-xl text-midnight">Proizvodi</h2>
        {message && (
          <span className="text-sm font-medium text-emerald bg-emerald/10 px-3 py-1.5 rounded-lg">
            {message}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-cloud overflow-hidden">
            {/* Product row */}
            <div className="flex items-center gap-4 p-4">
              <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-cloud flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized={product.image.startsWith("/uploads")}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-midnight truncate">{product.name}</h3>
                <p className="text-muted text-sm">{product.categoryLabel}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-ocean font-bold">{product.pricePerHour.toLocaleString()} din/sat</p>
                <p className="text-muted text-sm">{product.pricePerDay.toLocaleString()} din/dan</p>
              </div>
              <span className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full ${
                product.available
                  ? "bg-emerald/10 text-emerald"
                  : "bg-rose/10 text-rose"
              }`}>
                {product.available ? "Dostupno" : "Nedostupno"}
              </span>
              <button
                onClick={() => setEditing(editing === product.id ? null : product.id)}
                className="flex-shrink-0 text-sm font-semibold text-ocean hover:text-ocean-dark transition-colors px-3 py-2"
              >
                {editing === product.id ? "Zatvori" : "Izmeni"}
              </button>
            </div>

            {/* Edit panel */}
            {editing === product.id && (
              <EditProduct
                product={product}
                onSave={updateProduct}
                saving={saving}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EditProduct({
  product,
  onSave,
  saving,
}: {
  product: Product;
  onSave: (p: Product) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Product>({ ...product });

  const set = (key: keyof Product, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="border-t border-cloud p-6 bg-snow space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-dark mb-2">Naziv</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full bg-white border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-dark mb-2">Kratak opis</label>
          <input
            type="text"
            value={form.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
            className="w-full bg-white border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-dark mb-2">Opis</label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className="w-full bg-white border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-dark mb-2">Cena po satu (din)</label>
          <input
            type="number"
            value={form.pricePerHour}
            onChange={(e) => set("pricePerHour", parseInt(e.target.value) || 0)}
            className="w-full bg-white border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-dark mb-2">Cena po danu (din)</label>
          <input
            type="number"
            value={form.pricePerDay}
            onChange={(e) => set("pricePerDay", parseInt(e.target.value) || 0)}
            className="w-full bg-white border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-dark mb-2">Dostupnost</label>
          <select
            value={form.available ? "true" : "false"}
            onChange={(e) => set("available", e.target.value === "true")}
            className="w-full bg-white border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors"
          >
            <option value="true">Dostupno</option>
            <option value="false">Nedostupno</option>
          </select>
        </div>
      </div>

      <ImageUpload
        currentImage={form.image}
        onImageChange={(url) => set("image", url)}
        label="Glavna slika"
      />

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={() => onSave(form)}
          disabled={saving}
          className="bg-ocean hover:bg-ocean-dark text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-cta disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Čuvanje..." : "Sačuvaj"}
        </button>
      </div>
    </div>
  );
}
