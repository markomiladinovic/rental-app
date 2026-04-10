"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import ProductCard from "@/components/ui/Card";
import type { Product } from "@/data/products";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [duration, setDuration] = useState<"hour" | "day">("hour");
  const [quantity, setQuantity] = useState(1);
  const [todayBookings, setTodayBookings] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts);
  }, []);

  const product = products.find((p) => p.slug === slug);

  // Fetch today's bookings for this product
  useEffect(() => {
    if (!product) return;
    const today = new Date().toISOString().split("T")[0];
    fetch(`/api/reservations/availability?productId=${product.id}&from=${today}&to=${today}`)
      .then((r) => r.json())
      .then((data) => setTodayBookings(data.reservations?.length || 0));
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
                  unoptimized={images[selectedImage].startsWith("/uploads")}
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
                      <Image src={img} alt="" fill sizes="80px" className="object-cover" unoptimized={img.startsWith("/uploads")} />
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
                  {todayBookings === 0 ? "Dostupno danas" : `${todayBookings} rezervacija danas`}
                </span>
              )}
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-midnight mb-4 mt-2">
                {product.name}
              </h1>
              <p className="text-subtle text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Features */}
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

                <Button
                  href={`/booking?product=${product.slug}&duration=${duration}&quantity=${quantity}`}
                  size="lg"
                  className="w-full"
                >
                  Rezerviši
                </Button>
              </div>

              {!product.available && (
                <div className="bg-rose/10 border border-rose/20 rounded-xl p-4 text-center">
                  <p className="text-rose font-semibold text-sm">Ovaj proizvod trenutno nije dostupan</p>
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
