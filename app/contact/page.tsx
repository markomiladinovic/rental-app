"use client";
import { useState } from "react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const inputClass = "w-full bg-snow border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors";
  const labelClass = "block text-sm font-semibold text-slate-dark mb-2";

  return (
    <>
      {/* Header */}
      <div className="pt-28 pb-12 md:pt-36 md:pb-16 bg-snow">
        <div className="mx-auto max-w-7xl px-5 md:px-16">
          <p className="text-ocean text-sm font-semibold uppercase tracking-[0.15em] mb-3">
            Kontakt
          </p>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-midnight mb-4">
            Javi nam se
          </h1>
          <p className="text-subtle text-lg max-w-2xl">
            Imaš pitanje o opremi, rezervaciji ili saradnji? Slobodno nas kontaktiraj.
          </p>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact form */}
          <div>
            {sent ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-6">✅</div>
                <h2 className="font-heading font-bold text-2xl text-midnight mb-3">
                  Poruka poslata!
                </h2>
                <p className="text-subtle mb-6">Odgovorićemo ti u najkraćem roku.</p>
                <Button onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }} variant="secondary">
                  Pošalji novu poruku
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Ime i prezime</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Tvoje ime"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="tvoj@email.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Poruka</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    rows={5}
                    placeholder="Tvoja poruka..."
                    className={inputClass}
                  />
                </div>
                <Button
                  onClick={() => setSent(true)}
                  disabled={!form.name || !form.email || !form.message}
                  size="lg"
                  className="w-full"
                >
                  Pošalji poruku
                </Button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-heading font-semibold text-lg text-midnight mb-4">Informacije</h3>
              <div className="space-y-4">
                {[
                  { icon: "📍", label: "Adresa", value: "Beograd, Srbija" },
                  { icon: "📞", label: "Telefon", value: "+381 64 123 4567" },
                  { icon: "✉️", label: "Email", value: "info@boma-adventures.com" },
                  { icon: "🕐", label: "Radno vreme", value: "Pon-Ned: 08:00 - 20:00" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-sm text-muted">{item.label}</p>
                      <p className="text-midnight font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-cloud flex items-center justify-center">
              <div className="text-center text-muted">
                <p className="text-3xl mb-2">🗺️</p>
                <p className="text-sm">Mapa lokacije</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
