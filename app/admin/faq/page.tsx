"use client";
import { useState, useEffect } from "react";

type FaqItem = { id: string; question: string; answer: string; sort_order?: number };

const inputClass = "w-full bg-white border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors";
const labelClass = "block text-sm font-semibold text-slate-dark mb-2";

export default function AdminFaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/faq").then((r) => r.json()).then(setItems);
  }, []);

  const addItem = async (item: Omit<FaqItem, "id">) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, sort_order: items.length + 1 }),
      });
      if (res.ok) {
        const created = await res.json();
        setItems((prev) => [...prev, created]);
        setMessage("Pitanje dodato!");
        setTimeout(() => setMessage(""), 2000);
        setShowAdd(false);
      }
    } catch {
      setMessage("Greška");
    } finally {
      setSaving(false);
    }
  };

  const updateItem = async (item: FaqItem) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/faq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const updated = await res.json();
        setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
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

  const removeItem = async (id: string) => {
    if (!confirm("Obrisati ovo pitanje?")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/faq", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((x) => x.id !== id));
        setMessage("Obrisano!");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch {
      setMessage("Greška");
    } finally {
      setSaving(false);
    }
  };

  const moveItem = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    const a = items[index];
    const b = items[newIndex];
    const updated = [...items];
    updated[index] = { ...b, sort_order: a.sort_order };
    updated[newIndex] = { ...a, sort_order: b.sort_order };
    setItems(updated);
    // Persist both
    await Promise.all([
      fetch("/api/faq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated[index]),
      }),
      fetch("/api/faq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated[newIndex]),
      }),
    ]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-bold text-xl text-midnight">Česta pitanja</h2>
          <p className="text-muted text-sm">Pitanja i odgovori koji se prikazuju na FAQ stranici</p>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span className="text-sm font-medium text-emerald bg-emerald/10 px-3 py-1.5 rounded-lg">{message}</span>
          )}
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="bg-ocean hover:bg-ocean-dark text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-cta cursor-pointer"
          >
            {showAdd ? "Otkaži" : "+ Dodaj pitanje"}
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl border border-cloud overflow-hidden mb-6">
          <div className="p-4 border-b border-cloud">
            <h3 className="font-heading font-bold text-midnight">Novo pitanje</h3>
          </div>
          <FaqForm onSave={addItem} saving={saving} />
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="bg-white rounded-2xl border border-cloud overflow-hidden">
            <div className="flex items-start gap-3 p-4">
              <div className="flex flex-col gap-1 flex-shrink-0 pt-1">
                <button
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  className="w-7 h-7 rounded border border-silver flex items-center justify-center text-subtle hover:bg-cloud transition-colors disabled:opacity-30 cursor-pointer"
                  title="Pomeri gore"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                  className="w-7 h-7 rounded border border-silver flex items-center justify-center text-subtle hover:bg-cloud transition-colors disabled:opacity-30 cursor-pointer"
                  title="Pomeri dole"
                >
                  ↓
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-midnight mb-1">{item.question}</h3>
                <p className="text-subtle text-sm whitespace-pre-wrap">{item.answer}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setEditing(editing === item.id ? null : item.id)}
                  className="text-sm font-semibold text-ocean hover:text-ocean-dark transition-colors px-3 py-2"
                >
                  {editing === item.id ? "Zatvori" : "Izmeni"}
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="w-8 h-8 rounded-lg border border-rose/30 flex items-center justify-center text-rose hover:bg-rose/10 transition-colors cursor-pointer"
                >
                  ×
                </button>
              </div>
            </div>

            {editing === item.id && (
              <FaqForm item={item} onSave={updateItem} saving={saving} />
            )}
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12 text-muted">
            <p className="text-3xl mb-2">❓</p>
            <p>Nema pitanja. Dodaj prvo!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FaqForm({
  item,
  onSave,
  saving,
}: {
  item?: FaqItem;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (f: any) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    question: item?.question || "",
    answer: item?.answer || "",
  });

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isValid = form.question.trim() && form.answer.trim();

  return (
    <div className="p-6 bg-snow space-y-5 border-t border-cloud">
      <div>
        <label className={labelClass}>Pitanje</label>
        <input
          type="text"
          value={form.question}
          onChange={(e) => set("question", e.target.value)}
          placeholder="npr. Kako se vrši plaćanje?"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Odgovor</label>
        <textarea
          value={form.answer}
          onChange={(e) => set("answer", e.target.value)}
          rows={4}
          placeholder="Detaljan odgovor..."
          className={inputClass}
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => onSave(item ? { ...form, id: item.id, sort_order: item.sort_order } : form)}
          disabled={saving || !isValid}
          className="bg-ocean hover:bg-ocean-dark text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-cta disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Čuvanje..." : item ? "Sačuvaj" : "Dodaj pitanje"}
        </button>
      </div>
    </div>
  );
}
