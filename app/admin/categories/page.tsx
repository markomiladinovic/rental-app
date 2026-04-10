"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import ImageUpload from "@/components/admin/ImageUpload";

type Category = {
  id: string;
  label: string;
  icon: string;
  description: string;
  image: string;
  sort_order?: number;
};

const inputClass = "w-full bg-white border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors";
const labelClass = "block text-sm font-semibold text-slate-dark mb-2";

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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const updateCategory = async (category: Category) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
      if (res.ok) {
        const updated = await res.json();
        setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
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

  const addCategory = async (category: Category) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
      if (res.ok) {
        const created = await res.json();
        setCategories((prev) => [...prev, created]);
        setMessage("Kategorija dodata!");
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
        <h2 className="font-heading font-bold text-xl text-midnight">Kategorije</h2>
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
            {showAdd ? "Otkaži" : "+ Dodaj kategoriju"}
          </button>
        </div>
      </div>

      {/* Add new category */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-cloud overflow-hidden mb-6">
          <div className="p-4 border-b border-cloud">
            <h3 className="font-heading font-bold text-midnight">Nova kategorija</h3>
          </div>
          <AddCategory
            onSave={addCategory}
            saving={saving}
            nextOrder={categories.length}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-cloud overflow-hidden">
            {/* Category card */}
            <div className="flex items-center gap-4 p-4">
              <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-cloud flex-shrink-0">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="96px"
                  className="object-cover"
                  unoptimized={cat.image.startsWith("/uploads")}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-midnight">
                  {cat.icon} {cat.label}
                </h3>
                <p className="text-muted text-sm truncate">{cat.description}</p>
              </div>
              <button
                onClick={() => setEditing(editing === cat.id ? null : cat.id)}
                className="flex-shrink-0 text-sm font-semibold text-ocean hover:text-ocean-dark transition-colors px-3 py-2"
              >
                {editing === cat.id ? "Zatvori" : "Izmeni"}
              </button>
            </div>

            {/* Edit panel */}
            {editing === cat.id && (
              <EditCategory
                category={cat}
                onSave={updateCategory}
                saving={saving}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AddCategory({
  onSave,
  saving,
  nextOrder,
}: {
  onSave: (c: Category) => void;
  saving: boolean;
  nextOrder: number;
}) {
  const [form, setForm] = useState({
    id: "",
    label: "",
    icon: "",
    description: "",
    image: "",
  });

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isValid = form.label && form.icon && form.description && form.image;

  return (
    <div className="p-6 bg-snow space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Naziv</label>
          <input
            type="text"
            value={form.label}
            onChange={(e) => {
              set("label", e.target.value);
              set("id", slugify(e.target.value));
            }}
            placeholder="npr. E-Trotinet"
            className={inputClass}
          />
          {form.id && (
            <p className="text-muted text-xs mt-1">ID: {form.id}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Ikona (emoji)</label>
          <input
            type="text"
            value={form.icon}
            onChange={(e) => set("icon", e.target.value)}
            placeholder="npr. 🛴"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Opis</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Kratak opis kategorije"
          className={inputClass}
        />
      </div>

      <ImageUpload
        currentImage={form.image}
        onImageChange={(url) => set("image", url)}
        label="Slika kategorije"
      />

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={() => onSave({ ...form, id: form.id || slugify(form.label), sort_order: nextOrder })}
          disabled={saving || !isValid}
          className="bg-ocean hover:bg-ocean-dark text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-cta disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Dodavanje..." : "Dodaj kategoriju"}
        </button>
      </div>
    </div>
  );
}

function EditCategory({
  category,
  onSave,
  saving,
}: {
  category: Category;
  onSave: (c: Category) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Category>({ ...category });

  const set = (key: keyof Category, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="border-t border-cloud p-6 bg-snow space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Naziv</label>
          <input
            type="text"
            value={form.label}
            onChange={(e) => set("label", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Ikona (emoji)</label>
          <input
            type="text"
            value={form.icon}
            onChange={(e) => set("icon", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Opis</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className={inputClass}
        />
      </div>

      <ImageUpload
        currentImage={form.image}
        onImageChange={(url) => set("image", url)}
        label="Slika kategorije"
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
