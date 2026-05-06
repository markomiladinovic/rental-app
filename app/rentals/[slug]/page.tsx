"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import ProductCard from "@/components/ui/Card";
import type { Product } from "@/data/products";
import { addToCart } from "@/lib/cart";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [duration, setDuration] = useState<"hour" | "day">("hour");
  const [quantity, setQuantity] = useState(1);
  const [todayBookings, setTodayBookings] = useState<number | null>(null);
  const [nextFreeDate, setNextFreeDate] = useState<string | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistDone, setWaitlistDone] = useState(false);
  const [waitlistError, setWaitlistError] = useState("");

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts);
  }, []);

  const product = products.find((p) => p.slug === slug);

  // Fetch availability for this product
  useEffect(() => {
    if (!product) return;
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const future = new Date();
    future.setMonth(future.getMonth() + 3);
    const futureStr = future.toISOString().split("T")[0];

    fetch(`/api/reservations/availability?productId=${product.id}&from=${todayStr}&to=${futureStr}`)
      .then((r) => r.json())
      .then((data) => {
        const booked = new Set<string>(data.bookedDates || []);
        // Count today's reservations
        setTodayBookings(booked.has(todayStr) ? data.reservations?.length || 1 : 0);

        // Find next free date if today is booked
        if (booked.has(todayStr)) {
          const d = new Date(today);
          for (let i = 0; i < 90; i++) {
            d.setDate(d.getDate() + 1);
            const ds = d.toISOString().split("T")[0];
            if (!booked.has(ds)) {
              setNextFreeDate(ds);
              return;
            }
          }
        }
      });
  }, [product]);

  if (products.length === 0) {
    return (
      <Section className="pt-32">
        <div className="text-center py-20 text-muted">Učitavanje...</div>
      </Section>
    );
  }

  if (!product) {
    return (
      <Section className="pt-32">
        <div className="text-center py-20">
          <p className="text-5xl mb-6">😕</p>
          <h1 className="font-heading font-bold text-2xl text-midnight mb-4">Proizvod nije pronađen</h1>
          <Button href="/rentals">Nazad na opremu</Button>
        </div>
      </Section>
    );
  }

  const price = duration === "hour" ? product.pricePerHour : product.pricePerDay;
  const total = price * quantity;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  const images = product.gallery.length > 0 ? product.gallery : [product.image];

  return (
    <>
      <div className="pt-24 md:pt-28">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-5 md:px-16 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-ocean transition-colors">Početna</Link>
            <span>/</span>
            <Link href="/rentals" className="hover:text-ocean transition-colors">Oprema</Link>
            <span>/</span>
            <span className="text-midnight font-medium">{product.name}</span>
          </nav>
        </div>

        {/* Product */}
        <div className="mx-auto max-w-7xl px-5 md:px-16 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === i ? "border-ocean" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <span className="inline-block bg-ocean/10 text-ocean text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                {product.categoryLabel}
              </span>
              {todayBookings !== null && (
                <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full ml-2 ${
                  todayBookings === 0
                    ? "bg-emerald/10 text-emerald"
                    : "bg-amber/10 text-amber"
                }`}>
                  {todayBookings === 0
                    ? "Dostupno danas"
                    : nextFreeDate
                      ? `Slobodno od ${new Date(nextFreeDate).toLocaleDateString("sr-Latn-RS", { day: "numeric", month: "long" })}`
                      : "Zauzeto"
                  }
                </span>
              )}
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-midnight mb-4 mt-2">
                {product.name}
              </h1>
              <p className="text-subtle text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Features */}
              {product.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted mb-3">
                    Uključeno
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((f) => (
                      <span key={f} className="bg-snow text-slate-dark text-sm px-4 py-2 rounded-xl border border-cloud">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div className="bg-snow rounded-2xl p-6 border border-cloud mb-6">
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => setDuration("hour")}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                      duration === "hour"
                        ? "bg-ocean text-white shadow-cta"
                        : "bg-white text-subtle border border-silver"
                    }`}
                  >
                    Po satu
                  </button>
                  <button
                    onClick={() => setDuration("day")}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                      duration === "day"
                        ? "bg-ocean text-white shadow-cta"
                        : "bg-white text-subtle border border-silver"
                    }`}
                  >
                    Po danu
                  </button>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-subtle text-sm">Cena:</span>
                  <div>
                    <span className="text-ocean font-bold text-2xl">{price.toLocaleString()}</span>
                    <span className="text-muted text-sm ml-1">din/{duration === "hour" ? "sat" : "dan"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-subtle text-sm">Količina:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-lg border border-silver flex items-center justify-center text-subtle hover:bg-cloud transition-colors"
                    >
                      −
                    </button>
                    <span className="font-bold text-midnight w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 rounded-lg border border-silver flex items-center justify-center text-subtle hover:bg-cloud transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-silver mb-6">
                  <span className="font-semibold text-midnight">Ukupno:</span>
                  <span className="font-bold text-2xl text-midnight">{total.toLocaleString()} din</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={() => {
                      addToCart({
                        productId: product.id,
                        slug: product.slug,
                        name: product.name,
                        image: product.image,
                        pricePerHour: product.pricePerHour,
                        pricePerDay: product.pricePerDay,
                        durationType: duration,
                        quantity,
                      });
                      setAdded(true);
                      setTimeout(() => setAdded(false), 2000);
                    }}
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                  >
                    {added ? "✓ Dodato u korpu" : "Dodaj u korpu"}
                  </Button>
                  <Button
                    onClick={() => {
                      addToCart({
                        productId: product.id,
                        slug: product.slug,
                        name: product.name,
                        image: product.image,
                        pricePerHour: product.pricePerHour,
                        pricePerDay: product.pricePerDay,
                        durationType: duration,
                        quantity,
                      });
                      router.push("/cart");
                    }}
                    size="lg"
                    className="flex-1"
                  >
                    Rezerviši odmah
                  </Button>
                </div>
              </div>

              {!product.available && (
                <div className="bg-rose/10 border border-rose/20 rounded-xl p-4 text-center">
                  <p className="text-rose font-semibold text-sm">Ovaj proizvod trenutno nije dostupan</p>
                  {nextFreeDate && (
                    <p className="text-subtle text-sm mt-1">
                      Slobodno od {new Date(nextFreeDate).toLocaleDateString("sr-Latn-RS", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  )}
                </div>
              )}

              {/* Notify me when available */}
              {(!product.available || nextFreeDate) && (
                <div className="bg-snow border border-cloud rounded-xl p-4 mt-3">
                  {waitlistDone ? (
                    <p className="text-sm text-emerald font-medium text-center">
                      ✓ Hvala! Javićemo ti čim se proizvod oslobodi.
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-slate-dark font-medium mb-2">
                        🔔 Obavesti me kad bude slobodan
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={waitlistEmail}
                          onChange={(e) => setWaitlistEmail(e.target.value)}
                          placeholder="tvoj@email.com"
                          className="flex-1 bg-white border border-silver rounded-xl px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors"
                        />
                        <button
                          onClick={async () => {
                            setWaitlistError("");
                            setWaitlistSubmitting(true);
                            try {
                              const res = await fetch("/api/waitlist", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ productId: product.id, email: waitlistEmail }),
                              });
                              if (res.ok) {
                                setWaitlistDone(true);
                              } else {
                                const data = await res.json();
                                setWaitlistError(data.error || "Greška");
                              }
                            } catch {
                              setWaitlistError("Greška pri prijavi");
                            } finally {
                              setWaitlistSubmitting(false);
                            }
                          }}
                          disabled={!waitlistEmail || waitlistSubmitting}
                          className="bg-ocean hover:bg-ocean-dark text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {waitlistSubmitting ? "..." : "Prijavi me"}
                        </button>
                      </div>
                      {waitlistError && (
                        <p className="text-rose text-xs mt-1.5">{waitlistError}</p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <Section className="bg-snow">
          <h2 className="font-heading font-bold text-2xl text-midnight mb-8">
            Slična oprema
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
