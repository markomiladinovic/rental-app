"use client";
import { useState, useEffect } from "react";

type PromoCode = {
  id: string;
  code: string;
  discountPercent: number;
  validFrom: string | null;
  validUntil: string | null;
  maxUses: number | null;
  usesCount: number;
  active: boolean;
  description: string | null;
  createdAt: string;
};

const inputClass = "w-full bg-white border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors";
const labelClass = "block text-sm font-semibold text-slate-dark mb-2";

export default function AdminPromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/promo-codes").then((r) => r.json()).then(setCodes);
  }, []);

  const addCode = async (input: Omit<PromoCode, "id" | "usesCount" | "createdAt">) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (res.ok) {
        const created = await res.json();
        setCodes((prev) => [created, ...prev]);
        setMessage("Kod dodat!");
        setTimeout(() => setMessage(""), 2000);
        setShowAdd(false);
      } else {
        const err = await res.json();
        setMessage(err.error || "Greška");
      }
    } catch {
      setMessage("Greška");
    } finally {
      setSaving(false);
    }
  };

  const updateCode = async (input: PromoCode) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/promo-codes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (res.ok) {
        const updated = await res.json();
        setCodes((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
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

  const removeCode = async (id: string) => {
    if (!confirm("Obrisati ovaj kod?")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/promo-codes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setCodes((prev) => prev.filter((c) => c.id !== id));
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
        <div>
          <h2 className="font-heading font-bold text-xl text-midnight">Promo kodovi</h2>
          <p className="text-muted text-sm">Kodovi za popuste pri rezervaciji</p>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span className="text-sm font-medium text-emerald bg-emerald/10 px-3 py-1.5 rounded-lg">{message}</span>
          )}
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="bg-ocean hover:bg-ocean-dark text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-cta cursor-pointer"
          >
            {showAdd ? "Otkaži" : "+ Dodaj kod"}
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl border border-cloud overflow-hidden mb-6">
          <div className="p-4 border-b border-cloud">
            <h3 className="font-heading font-bold text-midnight">Novi promo kod</h3>
          </div>
          <PromoForm onSave={addCode} saving={saving} />
        </div>
      )}

      <div className="space-y-3">
        {codes.map((c) => {
          const today = new Date().toISOString().split("T")[0];
          const expired = c.validUntil && today > c.validUntil;
          const exhausted = c.maxUses !== null && c.usesCount >= c.maxUses;
          const isActive = c.active && !expired && !exhausted;

          return (
            <div key={c.id} className="bg-white rounded-2xl border border-cloud overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-bold text-midnight font-mono text-lg">{c.code}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      isActive ? "bg-emerald/10 text-emerald" : "bg-rose/10 text-rose"
                    }`}>
                      {!c.active ? "Neaktivan" : expired ? "Istekao" : exhausted ? "Iskorišćen" : "Aktivan"}
                    </span>
                    <span className="bg-ocean/10 text-ocean text-xs font-bold px-2.5 py-1 rounded-full">
                      −{c.discountPercent}%
                    </span>
                  </div>
                  <p className="text-muted text-sm">
                    {c.description || "Bez opisa"} ·
                    Iskorišćeno: <strong>{c.usesCount}</strong>{c.maxUses !== null ? ` / ${c.maxUses}` : ""} ·
                    {c.validFrom || c.validUntil
                      ? ` ${c.validFrom || "—"} → ${c.validUntil || "—"}`
                      : " Bez rokova"}
                  </p>
                </div>
                <button
                  onClick={() => setEditing(editing === c.id ? null : c.id)}
                  className="text-sm font-semibold text-ocean hover:text-ocean-dark transition-colors px-3 py-2"
                >
                  {editing === c.id ? "Zatvori" : "Izmeni"}
                </button>
                <button
                  onClick={() => removeCode(c.id)}
                  className="w-8 h-8 rounded-lg border border-rose/30 flex items-center justify-center text-rose hover:bg-rose/10 transition-colors cursor-pointer"
                >
                  ×
                </button>
              </div>

              {editing === c.id && (
                <PromoForm code={c} onSave={updateCode} saving={saving} />
              )}
            </div>
          );
        })}

        {codes.length === 0 && (
          <div className="text-center py-12 text-muted">
            <p className="text-3xl mb-2">🎟️</p>
            <p>Nema promo kodova. Dodaj prvi!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PromoForm({
  code,
  onSave,
  saving,
}: {
  code?: PromoCode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (c: any) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    code: code?.code || "",
    discountPercent: code?.discountPercent || 10,
    validFrom: code?.validFrom || "",
    validUntil: code?.validUntil || "",
    maxUses: code?.maxUses ?? "",
    active: code?.active ?? true,
    description: code?.description || "",
  });

  const set = (key: string, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isValid =
    form.code.trim().length >= 2 &&
    form.discountPercent > 0 &&
    form.discountPercent <= 100;

  const handleSave = () => {
    const payload = {
      ...(code ? { id: code.id } : {}),
      code: form.code.trim().toUpperCase(),
      discountPercent: form.discountPercent,
      validFrom: form.validFrom || null,
      validUntil: form.validUntil || null,
      maxUses: form.maxUses === "" ? null : Number(form.maxUses),
      active: form.active,
      description: form.description || null,
    };
    onSave(payload);
  };

  return (
    <div className="p-6 bg-snow space-y-5 border-t border-cloud">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Kod</label>
          <input
            type="text"
            value={form.code}
            onChange={(e) => set("code", e.target.value.toUpperCase())}
            placeholder="LETO20"
            className={`${inputClass} font-mono uppercase`}
          />
        </div>
        <div>
          <label className={labelClass}>Popust (%)</label>
          <input
            type="number"
            min="1"
            max="100"
            value={form.discountPercent}
            onChange={(e) => set("discountPercent", parseInt(e.target.value) || 0)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Opis (opciono)</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Letnja akcija"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className={labelClass}>Važi od</label>
          <input
            type="date"
            value={form.validFrom}
            onChange={(e) => set("validFrom", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Važi do</label>
          <input
            type="date"
            value={form.validUntil}
            onChange={(e) => set("validUntil", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Max upotreba</label>
          <input
            type="number"
            min="1"
            value={form.maxUses}
            onChange={(e) => set("maxUses", e.target.value)}
            placeholder="Bez limita"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => set("active", e.target.checked)}
            className="w-4 h-4 accent-ocean cursor-pointer"
          />
          <span className="text-sm font-medium text-slate-dark">Aktivan</span>
        </label>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || !isValid}
          className="bg-ocean hover:bg-ocean-dark text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-cta disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Čuvanje..." : code ? "Sačuvaj" : "Dodaj kod"}
        </button>
      </div>
    </div>
  );
}
