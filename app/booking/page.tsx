"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import type { Product } from "@/data/products";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Calendar from "@/components/ui/Calendar";

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

  const [products, setProducts] = useState<Product[]>([]);
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts);
  }, []);

  const product = products.find((p) => p.slug === productSlug);

  // Fetch booked dates when product is known
  const fetchAvailability = useCallback(async (productId: string) => {
    const today = new Date();
    const future = new Date();
    future.setMonth(future.getMonth() + 3);
    const from = today.toISOString().split("T")[0];
    const to = future.toISOString().split("T")[0];

    const res = await fetch(`/api/reservations/availability?productId=${productId}&from=${from}&to=${to}`);
    if (res.ok) {
      const data = await res.json();
      setBookedDates(new Set(data.bookedDates));
    }
  }, []);

  useEffect(() => {
    if (product) fetchAvailability(product.id);
  }, [product, fetchAvailability]);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    date: "",
    endDate: "",
    time: "",
    hours: 1,
    days: 1,
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
  const total = price * quantityParam * (durationParam === "hour" ? form.hours : form.days);

  const [confirmed, setConfirmed] = useState(false);

  // Calculate end date for daily rentals
  const endDate = durationParam === "day" && form.date
    ? (() => {
        const d = new Date(form.date);
        d.setDate(d.getDate() + form.days - 1);
        return d.toISOString().split("T")[0];
      })()
    : form.date;

  const handleConfirm = async () => {
    if (!product) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          durationType: durationParam,
          quantity: quantityParam,
          startDate: form.date,
          startTime: form.time,
          hours: durationParam === "hour" ? form.hours : null,
          endDate: endDate,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          note: form.note,
          totalPrice: total,
        }),
      });

      if (res.ok) {
        setConfirmed(true);
      } else {
        const data = await res.json();
        setError(data.error || "Greška pri kreiranju rezervacije");
      }
    } catch {
      setError("Greška pri slanju rezervacije");
    } finally {
      setSubmitting(false);
    }
  };

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
                  {durationParam === "day" ? `${form.days} dan(a)` : `${form.hours} sat(a)`}
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
      <>
        <div className="relative pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden">
          {/* Background image with white overlay */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80"
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-white/85" />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-16">
            <p className="text-ocean text-sm font-semibold uppercase tracking-[0.15em] mb-3">
              Vodič
            </p>
            <h1 className="font-heading font-bold text-3xl md:text-5xl text-midnight mb-4">
              Kako rezervisati
            </h1>
            <p className="text-subtle text-lg max-w-2xl">
              Rezervacija opreme je brza i jednostavna. Prati ove korake i oprema te čeka.
            </p>
          </div>
        </div>
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-5 md:px-16">
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  icon: "🔍",
                  title: "Izaberi opremu",
                  desc: "Idi na stranicu Oprema, pregledaj ponudu SUP dasaka, kajaka, gradskih i MTB bicikala. Klikni na proizvod koji te zanima da vidiš detalje i cenu.",
                },
                {
                  step: "02",
                  icon: "⏱️",
                  title: "Odaberi trajanje i količinu",
                  desc: "Na stranici proizvoda izaberi da li želiš da iznajmiš po satu ili po danu, podesi količinu i klikni dugme Rezerviši.",
                },
                {
                  step: "03",
                  icon: "📅",
                  title: "Izaberi datum i vreme",
                  desc: "Na kalendaru izaberi slobodan datum (zauzeti su označeni crvenom). Izaberi vreme preuzimanja i trajanje.",
                },
                {
                  step: "04",
                  icon: "📝",
                  title: "Unesi svoje podatke",
                  desc: "Ostavi ime, email i broj telefona kako bismo te kontaktirali za potvrdu. Možeš dodati i napomenu sa posebnim zahtevima.",
                },
                {
                  step: "05",
                  icon: "✅",
                  title: "Potvrdi rezervaciju",
                  desc: "Pregledaj sve detalje i potvrdi. Plaćanje je na licu mesta pri preuzimanju opreme — bez unapred plaćanja online.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-5">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-ocean/10 flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-ocean font-bold text-sm mb-1">{item.step}</div>
                    <h3 className="font-heading font-bold text-lg text-midnight mb-2">{item.title}</h3>
                    <p className="text-subtle leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12 pt-8 border-t border-cloud">
              <p className="text-subtle mb-6">Spreman? Izaberi opremu i kreni!</p>
              <Button href="/rentals" size="lg">Pogledaj opremu</Button>
            </div>
          </div>
        </section>
      </>
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
              <label className={labelClass}>Datum {durationParam === "day" ? "početka" : ""}</label>
              <Calendar
                selectedDate={form.date}
                onSelect={(d) => set("date", d)}
                bookedDates={bookedDates}
              />
            </div>
            {durationParam === "day" && (
              <div>
                <label className={labelClass}>Broj dana</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 5, 7].map((d) => (
                    <button
                      key={d}
                      onClick={() => set("days", d)}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                        form.days === d
                          ? "bg-ocean text-white shadow-cta"
                          : "bg-snow text-subtle border border-silver hover:bg-cloud"
                      }`}
                    >
                      {d} {d === 1 ? "dan" : "dana"}
                    </button>
                  ))}
                </div>
                {form.date && (
                  <p className="text-muted text-sm mt-2">
                    Od {form.date} do {endDate}
                  </p>
                )}
              </div>
            )}
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
                <div className="relative w-20 h-16 rounded-xl overflow-hidden">
                  <Image src={product.image} alt="" fill sizes="80px" className="object-cover" unoptimized={product.image.startsWith("/uploads")} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-midnight">{product.name}</h3>
                  <p className="text-muted text-sm">{product.categoryLabel}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted">Datum:</span>
                  <p className="font-semibold text-midnight">
                    {form.date}{durationParam === "day" && form.days > 1 ? ` — ${endDate}` : ""}
                  </p>
                </div>
                <div>
                  <span className="text-muted">Vreme:</span>
                  <p className="font-semibold text-midnight">{form.time}</p>
                </div>
                <div>
                  <span className="text-muted">Trajanje:</span>
                  <p className="font-semibold text-midnight">
                    {durationParam === "day" ? `${form.days} dan(a)` : `${form.hours} sat(a)`}
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

            {error && (
              <p className="text-rose text-sm font-medium bg-rose/10 px-4 py-2.5 rounded-xl">{error}</p>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(2)}>Nazad</Button>
              <Button size="lg" onClick={handleConfirm} disabled={submitting}>
                {submitting ? "Slanje..." : "Potvrdi rezervaciju"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
