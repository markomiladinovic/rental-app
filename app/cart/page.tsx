"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { getCart, updateCartQuantity, removeFromCart, type CartItem } from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[] | null>(null);

  useEffect(() => {
    const sync = () => setItems(getCart());
    sync();
    window.addEventListener("cart-changed", sync);
    return () => window.removeEventListener("cart-changed", sync);
  }, []);

  const changeQty = (productId: string, durationType: "hour" | "day", qty: number) => {
    updateCartQuantity(productId, durationType, qty);
    setItems(getCart());
  };

  const remove = (productId: string, durationType: "hour" | "day") => {
    removeFromCart(productId, durationType);
    setItems(getCart());
  };

  const itemTotal = (item: CartItem) =>
    (item.durationType === "hour" ? item.pricePerHour : item.pricePerDay) * item.quantity;

  if (items === null) {
    return (
      <Section className="pt-32">
        <div className="text-center py-20 text-muted">Učitavanje...</div>
      </Section>
    );
  }

  // Total for cart is calculated per hour; booking page multiplies by hours/days
  const subtotal = items.reduce((sum, it) => sum + itemTotal(it), 0);

  return (
    <>
      <div className="pt-28 pb-8 md:pt-36 bg-snow">
        <div className="mx-auto max-w-7xl px-5 md:px-16">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-midnight">Korpa</h1>
        </div>
      </div>

      <Section>
        <div className="max-w-4xl mx-auto">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🛒</p>
              <h2 className="font-heading font-bold text-2xl text-midnight mb-3">Korpa je prazna</h2>
              <p className="text-subtle mb-8">Dodaj opremu koju želiš da rezerviseš.</p>
              <Button href="/rentals" size="lg">Pogledaj opremu</Button>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {items.map((item) => {
                  const price = item.durationType === "hour" ? item.pricePerHour : item.pricePerDay;
                  return (
                    <div key={`${item.productId}-${item.durationType}`} className="bg-white border-2 border-silver rounded-2xl p-4 flex items-center gap-4">
                      <Link href={`/rentals/${item.slug}`} className="relative w-20 h-16 rounded-xl overflow-hidden bg-cloud flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/rentals/${item.slug}`}>
                          <h3 className="font-heading font-bold text-midnight truncate hover:text-ocean transition-colors">{item.name}</h3>
                        </Link>
                        <p className="text-muted text-sm">
                          {price.toLocaleString()} din / {item.durationType === "hour" ? "sat" : "dan"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => changeQty(item.productId, item.durationType, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg border border-silver flex items-center justify-center text-subtle hover:bg-cloud transition-colors cursor-pointer"
                        >
                          −
                        </button>
                        <span className="font-bold text-midnight w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => changeQty(item.productId, item.durationType, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg border border-silver flex items-center justify-center text-subtle hover:bg-cloud transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <div className="w-32 text-right flex-shrink-0 hidden sm:block">
                        <p className="font-bold text-ocean">{itemTotal(item).toLocaleString()} din</p>
                        <p className="text-muted text-xs">po {item.durationType === "hour" ? "satu" : "danu"}</p>
                      </div>
                      <button
                        onClick={() => remove(item.productId, item.durationType)}
                        className="flex-shrink-0 w-8 h-8 rounded-lg border border-rose/30 flex items-center justify-center text-rose hover:bg-rose/10 transition-colors cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Mix warning */}
              {new Set(items.map((i) => i.durationType)).size > 1 && (
                <div className="bg-amber/10 border border-amber/20 rounded-2xl p-4 mb-6 text-amber text-sm">
                  ⚠️ U korpi imaš stavke sa različitim načinom iznajmljivanja (sat/dan). Termin se bira zajednički — proveri da li ti to odgovara.
                </div>
              )}

              <div className="bg-snow border-2 border-silver rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-subtle">Ukupno (osnovna cena):</span>
                  <span className="font-bold text-2xl text-midnight">{subtotal.toLocaleString()} din</span>
                </div>
                <p className="text-muted text-xs mb-6">
                  Konačna cena se računa u sledećem koraku na osnovu trajanja (broj sati ili dana).
                </p>
                <Button href="/booking?cart=1" size="lg" className="w-full">
                  Nastavi ka rezervaciji
                </Button>
              </div>
            </>
          )}
        </div>
      </Section>
    </>
  );
}
