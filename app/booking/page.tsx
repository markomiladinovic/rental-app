"use client";
import { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import type { Product } from "@/data/products";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Calendar from "@/components/ui/Calendar";
import { getCart, clearCart, type CartItem } from "@/lib/cart";

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
  const durationParam = (searchParams.get("duration") || "hour") as "hour" | "day";
  const quantityParam = parseInt(searchParams.get("quantity") || "1");
  const isCartMode = searchParams.get("cart") === "1";

  const [products, setProducts] = useState<Product[]>([]);
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts);
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
    if (isCartMode) {
      setCartItems(getCart());
    }
    setCartLoaded(true);
  }, [isCartMode]);

  const product = products.find((p) => p.slug === productSlug);

  // Determine effective duration and items for booking
  const effectiveItems: CartItem[] = useMemo(() => {
    if (isCartMode) return cartItems;
    if (product) {
      return [
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.image,
          pricePerHour: product.pricePerHour,
          pricePerDay: product.pricePerDay,
          durationType: durationParam,
          quantity: quantityParam,
        },
      ];
    }
    return [];
  }, [isCartMode, cartItems, product, durationParam, quantityParam]);

  // Use duration from first item for shared booking params
  const effectiveDuration: "hour" | "day" = effectiveItems[0]?.durationType || "hour";

  // Fetch availability for all items (intersection of booked dates)
  const fetchAvailability = useCallback(async (items: CartItem[]) => {
    if (items.length === 0) return;
    const today = new Date();
    const future = new Date();
    future.setMonth(future.getMonth() + 3);
    const from = today.toISOString().split("T")[0];
    const to = future.toISOString().split("T")[0];

    const allBooked = new Set<string>();
    await Promise.all(
      items.map(async (it) => {
        const res = await fetch(`/api/reservations/availability?productId=${it.productId}&from=${from}&to=${to}`);
        if (res.ok) {
          const data = await res.json();
          for (const d of data.bookedDates || []) allBooked.add(d);
        }
      })
    );
    setBookedDates(allBooked);
  }, []);

  useEffect(() => {
    if (effectiveItems.length > 0) fetchAvailability(effectiveItems);
  }, [effectiveItems, fetchAvailability]);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    date: "",
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

  const [confirmed, setConfirmed] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; discountPercent: number } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [checkingPromo, setCheckingPromo] = useState(false);

  const applyPromoCode = async () => {
    const code = promoInput.trim();
    if (!code) return;
    setCheckingPromo(true);
    setPromoError("");
    try {
      const res = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.valid) {
        setPromoApplied({ code: data.code, discountPercent: data.discountPercent });
        setPromoError("");
      } else {
        setPromoApplied(null);
        setPromoError(data.error || "Kod nije validan");
      }
    } catch {
      setPromoError("Greška pri proveri koda");
    } finally {
      setCheckingPromo(false);
    }
  };

  const removePromo = () => {
    setPromoApplied(null);
    setPromoInput("");
    setPromoError("");
  };

  const endDate = effectiveDuration === "day" && form.date
    ? (() => {
        const d = new Date(form.date);
        d.setDate(d.getDate() + form.days - 1);
        return d.toISOString().split("T")[0];
      })()
    : form.date;

  // Calculate total across all items
  const itemsWithPrices = effectiveItems.map((it) => {
    const unit = it.durationType === "day" ? it.pricePerDay : it.pricePerHour;
    const multiplier = it.durationType === "hour" ? form.hours : form.days;
    const subtotal = unit * it.quantity * multiplier;
    return { ...it, subtotal };
  });
  const subtotal = itemsWithPrices.reduce((sum, it) => sum + it.subtotal, 0);
  const discountAmount = promoApplied
    ? Math.round(subtotal * (promoApplied.discountPercent / 100))
    : 0;
  const total = subtotal - discountAmount;

  const handleConfirm = async () => {
    if (effectiveItems.length === 0) return;
    setSubmitting(true);
    setError("");

    try {
      const body = {
        promoCode: promoApplied?.code || undefined,
        items: effectiveItems.map((it) => {
          const unit = it.durationType === "day" ? it.pricePerDay : it.pricePerHour;
          const multiplier = it.durationType === "hour" ? form.hours : form.days;
          return {
            productId: it.productId,
            productName: it.name,
            durationType: it.durationType,
            quantity: it.quantity,
            startDate: form.date,
            startTime: form.time,
            hours: it.durationType === "hour" ? form.hours : null,
            endDate: endDate,
            customerName: form.name,
            customerEmail: form.email,
            customerPhone: form.phone,
            note: form.note,
            totalPrice: unit * it.quantity * multiplier,
          };
        }),
      };

      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (isCartMode) clearCart();
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
            Hvala, {form.name}!{" "}
            {effectiveItems.length === 1
              ? <>Tvoja rezervacija za <strong>{effectiveItems[0].name}</strong> je primljena.</>
              : <>Tvoja rezervacija za <strong>{effectiveItems.length} proizvoda</strong> je primljena.</>
            }
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
                  {effectiveDuration === "day" ? `${form.days} dan(a)` : `${form.hours} sat(a)`}
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

  // Guide page when no product and no cart
  if (cartLoaded && effectiveItems.length === 0) {
    return (
      <>
        <div className="relative pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={settings.header_image_booking || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80"}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-white/70" />
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
                { step: "01", icon: "🔍", title: "Izaberi opremu", desc: "Idi na stranicu Oprema, pregledaj ponudu SUP dasaka, kajaka, gradskih i MTB bicikala. Klikni na proizvod koji te zanima da vidiš detalje i cenu." },
                { step: "02", icon: "🛒", title: "Dodaj u korpu", desc: "Na stranici proizvoda izaberi način iznajmljivanja (sat/dan) i količinu, pa dodaj u korpu. Možeš dodati više proizvoda odjednom." },
                { step: "03", icon: "📅", title: "Izaberi datum i vreme", desc: "Na kalendaru izaberi slobodan datum (zauzeti su označeni crvenom). Izaberi vreme preuzimanja i trajanje." },
                { step: "04", icon: "📝", title: "Unesi svoje podatke", desc: "Ostavi ime, email i broj telefona kako bismo te kontaktirali za potvrdu. Možeš dodati i napomenu sa posebnim zahtevima." },
                { step: "05", icon: "✅", title: "Potvrdi rezervaciju", desc: "Pregledaj sve detalje i potvrdi. Plaćanje je na licu mesta pri preuzimanju opreme — bez unapred plaćanja online." },
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

  // Loading state
  if (!cartLoaded || effectiveItems.length === 0) {
    return (
      <Section className="pt-32">
        <div className="text-center py-20 text-muted">Učitavanje...</div>
      </Section>
    );
  }

  // Warn if cart has mixed duration types
  const mixedDurations = isCartMode && new Set(cartItems.map((it) => it.durationType)).size > 1;

  const inputClass = "w-full bg-snow border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors";
  const labelClass = "block text-sm font-semibold text-slate-dark mb-2";

  const itemsSummary = isCartMode
    ? `${effectiveItems.length} ${effectiveItems.length === 1 ? "proizvod" : "proizvoda"}`
    : `${effectiveItems[0].name} — ${effectiveItems[0].quantity} kom.`;

  return (
    <Section className="pt-32">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-heading font-bold text-3xl text-midnight mb-2">
          Rezervacija
        </h1>
        <p className="text-subtle mb-8">{itemsSummary}</p>

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

            {mixedDurations && (
              <p className="text-amber text-sm bg-amber/10 px-4 py-2.5 rounded-xl">
                ⚠️ U korpi imaš mix satnih i dnevnih stavki. Termin (datum/vreme) se deli, ali svaka stavka koristi svoje trajanje.
              </p>
            )}

            <div>
              <label className={labelClass}>Datum {effectiveDuration === "day" ? "početka" : ""}</label>
              <Calendar
                selectedDate={form.date}
                onSelect={(d) => set("date", d)}
                bookedDates={bookedDates}
              />
            </div>
            {effectiveDuration === "day" && (
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
            {effectiveDuration === "hour" && (
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

            {/* Items list */}
            <div className="bg-snow rounded-2xl p-6 border border-cloud">
              <h3 className="font-heading font-semibold text-sm text-midnight mb-4 uppercase tracking-wider">
                {effectiveItems.length === 1 ? "Proizvod" : `Proizvodi (${effectiveItems.length})`}
              </h3>
              <div className="space-y-3">
                {itemsWithPrices.map((it) => (
                  <div key={`${it.productId}-${it.durationType}`} className="flex items-center gap-3 pb-3 border-b border-silver last:border-0 last:pb-0">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={it.image} alt="" fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-midnight truncate">{it.name}</p>
                      <p className="text-muted text-xs">
                        {it.quantity} × {it.durationType === "hour" ? `${form.hours}h` : `${form.days} dan(a)`}
                      </p>
                    </div>
                    <p className="font-bold text-ocean flex-shrink-0">{it.subtotal.toLocaleString()} din</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="bg-snow rounded-2xl p-6 border border-cloud space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted">Datum:</span>
                  <p className="font-semibold text-midnight">
                    {form.date}{effectiveDuration === "day" && form.days > 1 ? ` — ${endDate}` : ""}
                  </p>
                </div>
                <div>
                  <span className="text-muted">Vreme:</span>
                  <p className="font-semibold text-midnight">{form.time}</p>
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
              {/* Promo code input */}
              <div className="pt-4 border-t border-silver">
                {promoApplied ? (
                  <div className="flex items-center justify-between gap-3 bg-emerald/10 px-4 py-2.5 rounded-xl">
                    <div className="text-sm">
                      <span className="text-emerald font-semibold">✓ {promoApplied.code}</span>
                      <span className="text-muted"> — popust {promoApplied.discountPercent}%</span>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-xs text-muted hover:text-rose transition-colors cursor-pointer"
                    >
                      Ukloni
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className={labelClass}>Promo kod (opciono)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder="npr. LETO20"
                        className={`${inputClass} font-mono uppercase`}
                      />
                      <button
                        type="button"
                        onClick={applyPromoCode}
                        disabled={checkingPromo || !promoInput.trim()}
                        className="bg-cloud hover:bg-silver text-midnight text-sm font-semibold px-4 py-2.5 rounded-xl transition-all flex-shrink-0 disabled:opacity-50 cursor-pointer"
                      >
                        {checkingPromo ? "Provera..." : "Primeni"}
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-rose text-xs mt-1.5">{promoError}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-silver space-y-1">
                {promoApplied && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Osnovna cena:</span>
                      <span className="text-subtle">{subtotal.toLocaleString()} din</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald">Popust ({promoApplied.discountPercent}%):</span>
                      <span className="text-emerald font-semibold">−{discountAmount.toLocaleString()} din</span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-lg text-midnight">Ukupno:</span>
                  <span className="font-bold text-2xl text-ocean">{total.toLocaleString()} din</span>
                </div>
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
