"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cartCount } from "@/lib/cart";

export default function CartIcon({ dark }: { dark: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(cartCount());
    update();
    window.addEventListener("cart-changed", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cart-changed", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
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
  );
}
