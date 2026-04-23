"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getCart, cartCount, type CartItem } from "@/lib/cart";

export default function CartIcon({ dark }: { dark: boolean }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [count, setCount] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const update = () => {
      setItems(getCart());
      setCount(cartCount());
    };
    update();
    window.addEventListener("cart-changed", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cart-changed", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const subtotal = items.reduce((sum, it) => {
    const unit = it.durationType === "hour" ? it.pricePerHour : it.pricePerDay;
    return sum + unit * it.quantity;
  }, 0);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href="/cart"
        aria-label="Korpa"
        className={`relative inline-flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${
          dark ? "hover:bg-cloud text-midnight" : "hover:bg-white/10 text-white"
        }`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-ocean text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
      </Link>

      {/* Hover dropdown */}
      {hovered && count > 0 && (
        <div className="absolute right-0 top-full pt-2 w-72 z-50 hidden md:block">
          <div className="bg-white border-2 border-silver rounded-2xl shadow-lg p-3">
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {items.map((it) => {
                const unit = it.durationType === "hour" ? it.pricePerHour : it.pricePerDay;
                return (
                  <div
                    key={`${it.productId}-${it.durationType}`}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-snow"
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-cloud flex-shrink-0">
                      <Image
                        src={it.image}
                        alt={it.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                        unoptimized={it.image.startsWith("/uploads")}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-midnight text-sm truncate">{it.name}</p>
                      <p className="text-muted text-xs">
                        {it.quantity} × {unit.toLocaleString()} din/{it.durationType === "hour" ? "sat" : "dan"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-cloud mt-2 pt-3 px-2">
              <div className="flex items-center justify-between mb-3 text-sm">
                <span className="text-muted">Osnovna cena:</span>
                <span className="font-bold text-ocean">{subtotal.toLocaleString()} din</span>
              </div>
              <Link
                href="/cart"
                className="block bg-ocean hover:bg-ocean-dark text-white text-center text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                Pogledaj korpu
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
