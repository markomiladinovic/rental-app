"use client";
import { useState, useEffect } from "react";

type Testimonial = {
  id: string;
  name: string;
  activity: string;
  text: string;
  rating: number;
};

const inputClass = "w-full bg-white border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors";
const labelClass = "block text-sm font-semibold text-slate-dark mb-2";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/testimonials").then((r) => r.json()).then(setTestimonials);
  }, []);

  const addTestimonial = async (t: Omit<Testimonial, "id">) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...t, sort_order: testimonials.length }),
      });
      if (res.ok) {
        const created = await res.json();
        setTestimonials((prev) => [...prev, created]);
        setMessage("Utisak dodat!");
        setTimeout(() => setMessage(""), 2000);
        setShowAdd(false);
      }
    } catch {
      setMessage("Greška");
    } finally {
      setSaving(false);
    }
  };

  const updateTestimonial = async (t: Testimonial) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      });
      if (res.ok) {
        const updated = await res.json();
        setTestimonials((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        setMessage("Sačuvano!");
        setTimeout(() => setMessage(""), 2000);
        setEditing(null);
      }
    } catch {
      setMessage("Greška");
    } finally {
      setSaving(false);
    }
  };

  const removeTestimonial = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        setMessage("Obrisano!");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch {
      setMessage("Greška");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-xl text-midnight">Utisci korisnika</h2>
        <div className="flex items-center gap-3">
          {message && (
            <span className="text-sm font-medium text-emerald bg-emerald/10 px-3 py-1.5 rounded-lg">{message}</span>
          )}
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="bg-ocean hover:bg-ocean-dark text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-cta cursor-pointer"
          >
            {showAdd ? "Otkaži" : "+ Dodaj utisak"}
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl border border-cloud overflow-hidden mb-6">
          <div className="p-4 border-b border-cloud">
            <h3 className="font-heading font-bold text-midnight">Novi utisak</h3>
          </div>
          <TestimonialForm onSave={addTestimonial} saving={saving} />
        </div>
      )}

      <div className="space-y-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl border border-cloud overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-full bg-ocean/10 flex items-center justify-center flex-shrink-0">
                <span className="text-ocean font-bold text-sm">
                  {t.name.split(" ").map((w) => w[0]).join("")}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-midnight">{t.name}</h3>
                <p className="text-muted text-sm">{t.activity}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-sm ${i < t.rating ? "text-amber" : "text-silver"}`}>★</span>
                ))}
              </div>
              <button
                onClick={() => setEditing(editing === t.id ? null : t.id)}
                className="flex-shrink-0 text-sm font-semibold text-ocean hover:text-ocean-dark transition-colors px-3 py-2"
              >
                {editing === t.id ? "Zatvori" : "Izmeni"}
              </button>
              <button
                onClick={() => removeTestimonial(t.id)}
                className="flex-shrink-0 w-8 h-8 rounded-lg border border-rose/30 flex items-center justify-center text-rose hover:bg-rose/10 transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>
            {editing !== t.id && (
              <div className="px-4 pb-4">
                <p className="text-subtle text-sm">&ldquo;{t.text}&rdquo;</p>
              </div>
            )}
            {editing === t.id && (
              <TestimonialForm testimonial={t} onSave={updateTestimonial} saving={saving} />
            )}
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="text-center py-12 text-muted">
            <p className="text-3xl mb-2">💬</p>
            <p>Nema utisaka. Dodaj prvi!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TestimonialForm({
  testimonial,
  onSave,
  saving,
}: {
  testimonial?: Testimonial;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (t: any) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    name: testimonial?.name || "",
    activity: testimonial?.activity || "",
    text: testimonial?.text || "",
    rating: testimonial?.rating || 5,
  });

  const set = (key: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isValid = form.name && form.activity && form.text;

  return (
    <div className="p-6 bg-snow space-y-5 border-t border-cloud">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Ime</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="npr. Marko N."
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Aktivnost</label>
          <input
            type="text"
            value={form.activity}
            onChange={(e) => set("activity", e.target.value)}
            placeholder="npr. SUP veslanje"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Tekst utiska</label>
        <textarea
          value={form.text}
          onChange={(e) => set("text", e.target.value)}
          rows={3}
          placeholder="Šta kaže korisnik..."
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Ocena</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              onClick={() => set("rating", r)}
              className={`w-10 h-10 rounded-lg text-lg transition-all cursor-pointer ${
                r <= form.rating ? "text-amber bg-amber/10" : "text-silver bg-cloud"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onSave(testimonial ? { ...form, id: testimonial.id } : form)}
          disabled={saving || !isValid}
          className="bg-ocean hover:bg-ocean-dark text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-cta disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Čuvanje..." : testimonial ? "Sačuvaj" : "Dodaj utisak"}
        </button>
      </div>
    </div>
  );
}
