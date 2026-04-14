"use client";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Section from "@/components/ui/Section";
import ProductCard from "@/components/ui/Card";
import type { Product } from "@/data/products";

type Category = { id: string; label: string; icon: string; description: string; image: string };

export default function RentalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [nextFreeDates, setNextFreeDates] = useState<Record<string, string | null>>({});
  const [headerImage, setHeaderImage] = useState("");

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts);
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
    fetch("/api/settings").then((r) => r.json()).then((s) => setHeaderImage(s.header_image_rentals || ""));
  }, []);

  // Fetch availability for all products
  useEffect(() => {
    if (products.length === 0) return;

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const future = new Date();
    future.setMonth(future.getMonth() + 3);
    const futureStr = future.toISOString().split("T")[0];

    Promise.all(
      products.map(async (p) => {
        const res = await fetch(`/api/reservations/availability?productId=${p.id}&from=${todayStr}&to=${futureStr}`);
        if (!res.ok) return [p.id, undefined] as const;
        const data = await res.json();
        const booked = new Set<string>(data.bookedDates || []);
        if (!booked.has(todayStr)) return [p.id, undefined] as const;
        const d = new Date(today);
        for (let i = 0; i < 90; i++) {
          d.setDate(d.getDate() + 1);
          const ds = d.toISOString().split("T")[0];
          if (!booked.has(ds)) return [p.id, ds] as const;
        }
        return [p.id, null] as const;
      })
    ).then((results) => {
      const dates: Record<string, string | null> = {};
      for (const [id, date] of results) {
        if (date !== undefined) dates[id] = date;
      }
      setNextFreeDates(dates);
    });
  }, [products]);

  const filtered = useMemo(() => {
    let result = activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.pricePerHour - b.pricePerHour);
    if (sortBy === "price-desc") result = [...result].sort((a, b) => b.pricePerHour - a.pricePerHour);

    return result;
  }, [activeCategory, sortBy, products]);

  return (
    <>
      {/* Header */}
      <div className="relative pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden">
        {headerImage && (
          <div className="absolute inset-0">
            <Image src={headerImage} alt="" fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-white/70" />
          </div>
        )}
        {!headerImage && <div className="absolute inset-0 bg-snow" />}
        <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-16">
          <p className="text-ocean text-sm font-semibold uppercase tracking-[0.15em] mb-3">
            Naša ponuda
          </p>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-midnight mb-4">
            Iznajmi opremu
          </h1>
          <p className="text-subtle text-lg max-w-2xl">
            Izaberi kategoriju, uporedi cene i rezerviši opremu za svoju sledeću avanturu.
          </p>
        </div>
      </div>

      <Section>
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeCategory === "all"
                  ? "bg-ocean text-white shadow-cta"
                  : "bg-cloud text-subtle hover:bg-silver"
              }`}
            >
              Sve
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "bg-ocean text-white shadow-cta"
                    : "bg-cloud text-subtle hover:bg-silver"
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-cloud border border-silver rounded-xl px-4 py-2.5 text-sm text-slate-dark font-medium focus:outline-none focus:border-ocean transition-colors"
          >
            <option value="default">Podrazumevano</option>
            <option value="price-asc">Cena: niža prvo</option>
            <option value="price-desc">Cena: viša prvo</option>
          </select>
        </div>

        {/* Results count */}
        <p className="text-muted text-sm mb-6">
          {filtered.length} {filtered.length === 1 ? "proizvod" : "proizvoda"}
        </p>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl mb-4">🔍</p>
            <p className="text-subtle text-lg">Nema proizvoda u ovoj kategoriji.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} nextFreeDate={nextFreeDates[product.id]} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
