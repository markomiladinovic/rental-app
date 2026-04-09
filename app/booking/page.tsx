"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function BookingPage() {
  return (
    <Suspense fallback={<Section className="pt-32"><div className="text-center py-20 text-muted">Učitavanje...</div></Section>}>
      <BookingContent />
    </Suspense>
  );
}

function BookingContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");
  const durationParam = searchParams.get("duration") || "hour";
  const quantityParam = parseInt(searchParams.get("quantity") || "1");

  const product = products.find((p) => p.slug === productSlug);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    date: "",
    time: "",
    hours: 1,
    name: "",
    email: "",
    phone: "",
    note: "",
  });

  const set = (key: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const price = product
    ? durationParam === "day"
      ? product.pricePerDay
      : product.pricePerHour
    : 0;
  const total = price * quantityParam * (durationParam === "hour" ? form.hours : 1);

  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <Section className="pt-32">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="font-heading font-bold text-3xl text-midnight mb-4">
            Rezervacija potvrđena!
          </h1>
          <p className="text-subtle text-lg mb-2">
            Hvala, {form.name}! Tvoja rezervacija za <strong>{product?.name}</strong> je primljena.
          </p>
          <p className="text-muted text-sm mb-8">
            Potvrda je poslata na {form.email}
          </p>
          <div className="bg-snow rounded-2xl p-6 border border-cloud mb-8 text-left">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted">Datum:</span>
                <p className="font-semibold text-midnight">{form.date}</p>
              </div>
              <div>
                <span className="text-muted">Vreme:</span>
                <p className="font-semibold text-midnight">{form.time}</p>
              </div>
              <div>
                <span className="text-muted">Trajanje:</span>
                <p className="font-semibold text-midnight">
                  {durationParam === "day" ? "Ceo dan" : `${form.hours} sat(a)`}
                </p>
              </div>
              <div>
                <span className="text-muted">Ukupno:</span>
                <p className="font-bold text-ocean text-lg">{total.toLocaleString()} din</p>
              </div>
            </div>
          </div>
          <Button href="/" size="lg">Nazad na početnu</Button>
        </div>
      </Section>
    );
  }

  if (!product) {
    return (
      <Section className="pt-32">
        <div className="text-center py-20">
          <p className="text-5xl mb-6">😕</p>
          <h1 className="font-heading font-bold text-2xl text-midnight mb-4">Proizvod nije izabran</h1>
          <Button href="/rentals">Izaberi opremu</Button>
        </div>
      </Section>
    );
  }

  const inputClass = "w-full bg-snow border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors";
  const labelClass = "block text-sm font-semibold text-slate-dark mb-2";

  return (
    <Section className="pt-32">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-heading font-bold text-3xl text-midnight mb-2">
          Rezervacija
        </h1>
        <p className="text-subtle mb-8">{product.name} — {quantityParam} kom.</p>

        {/* Steps indicator */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                s <= step ? "bg-ocean" : "bg-silver"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Date & Time */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="font-heading font-semibold text-xl text-midnight">Izaberi datum i vreme</h2>
            <div>
              <label className={labelClass}>Datum</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Vreme preuzimanja</label>
              <select
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
                className={inputClass}
              >
                <option value="">Izaberi vreme</option>
                {Array.from({ length: 12 }, (_, i) => `${String(8 + i).padStart(2, "0")}:00`).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            {durationParam === "hour" && (
              <div>
                <label className={labelClass}>Trajanje (sati)</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 8].map((h) => (
                    <button
                      key={h}
                      onClick={() => set("hours", h)}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                        form.hours === h
                          ? "bg-ocean text-white shadow-cta"
                          : "bg-snow text-subtle border border-silver hover:bg-cloud"
                      }`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} disabled={!form.date || !form.time}>
                Dalje
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: User info */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="font-heading font-semibold text-xl text-midnight">Tvoji podaci</h2>
            <div>
              <label className={labelClass}>Ime i prezime</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Marko Nikolić"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="marko@email.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Telefon</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="064 123 4567"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Napomena (opciono)</label>
              <textarea
                value={form.note}
                onChange={(e) => set("note", e.target.value)}
                rows={3}
                placeholder="Posebni zahtevi..."
                className={inputClass}
              />
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(1)}>Nazad</Button>
              <Button onClick={() => setStep(3)} disabled={!form.name || !form.email || !form.phone}>
                Dalje
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="font-heading font-semibold text-xl text-midnight">Potvrda rezervacije</h2>
            <div className="bg-snow rounded-2xl p-6 border border-cloud space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-silver">
                <img src={product.image} alt="" className="w-20 h-16 rounded-xl object-cover" />
                <div>
                  <h3 className="font-heading font-bold text-midnight">{product.name}</h3>
                  <p className="text-muted text-sm">{product.categoryLabel}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted">Datum:</span>
                  <p className="font-semibold text-midnight">{form.date}</p>
                </div>
                <div>
                  <span className="text-muted">Vreme:</span>
                  <p className="font-semibold text-midnight">{form.time}</p>
                </div>
                <div>
                  <span className="text-muted">Trajanje:</span>
                  <p className="font-semibold text-midnight">
                    {durationParam === "day" ? "Ceo dan" : `${form.hours} sat(a)`}
                  </p>
                </div>
                <div>
                  <span className="text-muted">Količina:</span>
                  <p className="font-semibold text-midnight">{quantityParam}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-silver">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted text-sm">Ime:</span>
                  <span className="font-medium text-midnight text-sm">{form.name}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted text-sm">Email:</span>
                  <span className="font-medium text-midnight text-sm">{form.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted text-sm">Telefon:</span>
                  <span className="font-medium text-midnight text-sm">{form.phone}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-silver flex items-center justify-between">
                <span className="font-bold text-lg text-midnight">Ukupno:</span>
                <span className="font-bold text-2xl text-ocean">{total.toLocaleString()} din</span>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(2)}>Nazad</Button>
              <Button size="lg" onClick={() => setConfirmed(true)}>
                Potvrdi rezervaciju
              </Button>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
