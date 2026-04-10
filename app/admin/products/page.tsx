"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Product } from "@/data/products";

const CATEGORY_OPTIONS = [
  { id: "sup", label: "SUP Board" },
  { id: "kayak", label: "Kajak" },
  { id: "city-bike", label: "City Bike" },
  { id: "mtb", label: "MTB Bike" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[čć]/g, "c")
    .replace(/[š]/g, "s")
    .replace(/[ž]/g, "z")
    .replace(/[đ]/g, "dj")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const inputClass = "w-full bg-white border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors";
const labelClass = "block text-sm font-semibold text-slate-dark mb-2";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
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

  const addProduct = async (product: Omit<Product, "id">) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const created = await res.json();
        setProducts((prev) => [...prev, created]);
        setMessage("Proizvod dodat!");
        setTimeout(() => setMessage(""), 2000);
        setShowAdd(false);
      }
    } catch {
      setMessage("Greška pri dodavanju");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-xl text-midnight">Proizvodi</h2>
        <div className="flex items-center gap-3">
          {message && (
            <span className="text-sm font-medium text-emerald bg-emerald/10 px-3 py-1.5 rounded-lg">
              {message}
            </span>
          )}
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="bg-ocean hover:bg-ocean-dark text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-cta cursor-pointer"
          >
            {showAdd ? "Otkaži" : "+ Dodaj proizvod"}
          </button>
        </div>
      </div>

      {/* Add new product form */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-cloud overflow-hidden mb-6">
          <div className="p-4 border-b border-cloud">
            <h3 className="font-heading font-bold text-midnight">Novi proizvod</h3>
          </div>
          <AddProduct onSave={addProduct} saving={saving} />
        </div>
      )}

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

function AddProduct({
  onSave,
  saving,
}: {
  onSave: (p: Omit<Product, "id">) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "sup",
    categoryLabel: "SUP Board",
    description: "",
    shortDescription: "",
    pricePerHour: 0,
    pricePerDay: 0,
    image: "",
    gallery: [] as string[],
    features: [] as string[],
    available: true,
  });
  const [featureInput, setFeatureInput] = useState("");

  const set = (key: string, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setCategory = (categoryId: string) => {
    const cat = CATEGORY_OPTIONS.find((c) => c.id === categoryId);
    setForm((prev) => ({
      ...prev,
      category: categoryId,
      categoryLabel: cat?.label || categoryId,
    }));
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setForm((prev) => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
    setFeatureInput("");
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const isValid = form.name && form.description && form.shortDescription && form.pricePerHour > 0 && form.pricePerDay > 0 && form.image;

  return (
    <div className="p-6 bg-snow space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Naziv</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => {
              set("name", e.target.value);
              set("slug", slugify(e.target.value));
            }}
            placeholder="npr. SUP Board Explorer"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Kategorija</label>
          <select
            value={form.category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Kratak opis</label>
        <input
          type="text"
          value={form.shortDescription}
          onChange={(e) => set("shortDescription", e.target.value)}
          placeholder="Kratak opis za karticu proizvoda"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Opis</label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          placeholder="Detaljan opis proizvoda"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Cena po satu (din)</label>
          <input
            type="number"
            value={form.pricePerHour || ""}
            onChange={(e) => set("pricePerHour", parseInt(e.target.value) || 0)}
            placeholder="800"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Cena po danu (din)</label>
          <input
            type="number"
            value={form.pricePerDay || ""}
            onChange={(e) => set("pricePerDay", parseInt(e.target.value) || 0)}
            placeholder="3000"
            className={inputClass}
          />
        </div>
      </div>

      <ImageUpload
        currentImage={form.image}
        onImageChange={(url) => set("image", url)}
        label="Glavna slika"
      />

      {/* Features */}
      <div>
        <label className={labelClass}>Šta je uključeno</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
            placeholder="npr. Veslo, Pumpa, Kaciga..."
            className={inputClass}
          />
          <button
            type="button"
            onClick={addFeature}
            className="bg-cloud hover:bg-silver text-midnight text-sm font-semibold px-4 py-2.5 rounded-xl transition-all flex-shrink-0 cursor-pointer"
          >
            Dodaj
          </button>
        </div>
        {form.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.features.map((f, i) => (
              <span key={i} className="bg-white text-slate-dark text-sm px-3 py-1.5 rounded-xl border border-cloud flex items-center gap-1.5">
                {f}
                <button onClick={() => removeFeature(i)} className="text-muted hover:text-rose cursor-pointer">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={() => onSave({ ...form, slug: form.slug || slugify(form.name), category: form.category as Product["category"] })}
          disabled={saving || !isValid}
          className="bg-ocean hover:bg-ocean-dark text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-cta disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Dodavanje..." : "Dodaj proizvod"}
        </button>
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
          <label className={labelClass}>Naziv</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Kratak opis</label>
          <input
            type="text"
            value={form.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Opis</label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className={labelClass}>Cena po satu (din)</label>
          <input
            type="number"
            value={form.pricePerHour}
            onChange={(e) => set("pricePerHour", parseInt(e.target.value) || 0)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Cena po danu (din)</label>
          <input
            type="number"
            value={form.pricePerDay}
            onChange={(e) => set("pricePerDay", parseInt(e.target.value) || 0)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Dostupnost</label>
          <select
            value={form.available ? "true" : "false"}
            onChange={(e) => set("available", e.target.value === "true")}
            className={inputClass}
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
