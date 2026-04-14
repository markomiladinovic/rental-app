"use client";
import { useState, useEffect } from "react";

const inputClass = "w-full bg-white border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors";
const labelClass = "block text-sm font-semibold text-slate-dark mb-2";

const FIELDS = [
  { key: "address", label: "Adresa", placeholder: "Bulevar Nemanjića 86, 18000 Niš" },
  { key: "phone", label: "Telefon (glavni)", placeholder: "+381 63 728 2490" },
  { key: "phone2", label: "Telefon (drugi)", placeholder: "Opciono — drugi broj" },
  { key: "email", label: "Email (glavni)", placeholder: "info@boma-adventures.com" },
  { key: "email2", label: "Email (drugi)", placeholder: "Opciono — drugi email" },
  { key: "working_hours", label: "Radno vreme", placeholder: "Svakog dana: 09:00 - 21:00" },
  { key: "instagram", label: "Instagram link", placeholder: "https://instagram.com/boma.adventures" },
  { key: "facebook", label: "Facebook link", placeholder: "https://facebook.com/boma.adventures" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
  }, []);

  const set = (key: string, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMessage("Sačuvano!");
        setTimeout(() => setMessage(""), 2000);
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
        <div>
          <h2 className="font-heading font-bold text-xl text-midnight">Informacije</h2>
          <p className="text-muted text-sm">Kontakt podaci, radno vreme i društvene mreže</p>
        </div>
        {message && (
          <span className="text-sm font-medium text-emerald bg-emerald/10 px-3 py-1.5 rounded-lg">{message}</span>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-cloud p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FIELDS.map((field) => (
            <div key={field.key} className={field.key === "address" ? "md:col-span-2" : ""}>
              <label className={labelClass}>{field.label}</label>
              <input
                type="text"
                value={settings[field.key] || ""}
                onChange={(e) => set(field.key, e.target.value)}
                placeholder={field.placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-cloud">
          <button
            onClick={save}
            disabled={saving}
            className="bg-ocean hover:bg-ocean-dark text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-cta disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Čuvanje..." : "Sačuvaj izmene"}
          </button>
        </div>
      </div>
    </div>
  );
}
