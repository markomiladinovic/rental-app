"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useScrolled } from "@/hooks/useScrollDirection";

const NAV_LINKS = [
  { href: "/", label: "Početna" },
  { href: "/rentals", label: "Oprema" },
  { href: "/about", label: "O nama" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Kontakt" },
];

export default function Navbar() {
  const scrolled = useScrolled(50);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  // Only use light (white) text on homepage hero
  const isHeroPage = pathname === "/";
  const useDark = scrolled || !isHeroPage;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-5 md:px-16 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-ocean flex items-center justify-center">
            <span className="text-white font-bold text-sm">BA</span>
          </div>
          <span className={`font-heading font-bold text-xl tracking-tight transition-colors duration-300 ${
            useDark ? "text-midnight" : "text-white"
          }`}>
            BoMa Adventures
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                useDark ? "text-slate-dark hover:text-ocean" : "text-white/90 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/rentals"
            className="bg-ocean hover:bg-ocean-dark text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-cta hover:shadow-lg"
          >
            Rezerviši
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 transition-all duration-300 ${useDark ? "bg-midnight" : "bg-white"} ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${useDark ? "bg-midnight" : "bg-white"} ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${useDark ? "bg-midnight" : "bg-white"} ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-white ${
          menuOpen ? "max-h-80 border-t border-silver" : "max-h-0"
        }`}
      >
        <div className="px-5 py-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-base font-medium text-slate-dark hover:text-ocean transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/rentals"
            onClick={() => setMenuOpen(false)}
            className="bg-ocean hover:bg-ocean-dark text-white text-center font-semibold px-6 py-3 rounded-xl transition-all duration-200 mt-2"
          >
            Rezerviši
          </Link>
        </div>
      </div>
    </header>
  );
}
