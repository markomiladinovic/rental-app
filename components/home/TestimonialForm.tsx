"use client";
import { useState } from "react";
import Section from "@/components/ui/Section";

export default function TestimonialForm() {
  const [form, setForm] = useState({ name: "", activity: "", text: "", rating: 5 });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status: "pending" }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError("Greška pri slanju");
      }
    } catch {
      setError("Greška pri slanju");
    } finally {
      setSending(false);
    }
  };

  const inputClass = "w-full bg-white border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors";

  if (sent) {
    return (
      <Section>
        <div className="max-w-lg mx-auto text-center py-8">
          <div className="text-4xl mb-4">🙏</div>
          <h3 className="font-heading font-bold text-xl text-midnight mb-2">Hvala na utiscima!</h3>
          <p className="text-subtle">Tvoj komentar će biti prikazan nakon odobrenja.</p>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h3 className="font-heading font-bold text-2xl text-midnight mb-2">
            Podeli svoje iskustvo
          </h3>
          <p className="text-subtle">
            Koristio si našu opremu? Ostavi utisak i pomozi drugima da se odluče.
          </p>
        </div>

        <div className="bg-snow rounded-2xl p-6 border border-cloud space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-dark mb-2">Ime</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Tvoje ime"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-dark mb-2">Aktivnost</label>
              <select
                value={form.activity}
                onChange={(e) => set("activity", e.target.value)}
                className={inputClass}
              >
                <option value="">Izaberi aktivnost</option>
                <option value="SUP veslanje">SUP veslanje</option>
                <option value="Kajak tura">Kajak tura</option>
                <option value="City Bike tura">City Bike tura</option>
                <option value="MTB vožnja">MTB vožnja</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-dark mb-2">Ocena</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  onClick={() => set("rating", r)}
                  className={`w-10 h-10 rounded-lg text-lg transition-all cursor-pointer ${
                    r <= form.rating ? "text-amber bg-amber/10" : "text-silver bg-white border border-cloud"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-dark mb-2">Tvoj utisak</label>
            <textarea
              value={form.text}
              onChange={(e) => set("text", e.target.value)}
              rows={3}
              placeholder="Opiši svoje iskustvo..."
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-rose text-sm font-medium bg-rose/10 px-4 py-2.5 rounded-xl">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!form.name || !form.activity || !form.text || sending}
            className="w-full bg-ocean hover:bg-ocean-dark text-white font-semibold py-3 rounded-xl transition-all shadow-cta disabled:opacity-50 cursor-pointer"
          >
            {sending ? "Slanje..." : "Pošalji utisak"}
          </button>
        </div>
      </div>
    </Section>
  );
}
