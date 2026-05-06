"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Proizvodi", icon: "📦" },
  { href: "/admin/categories", label: "Kategorije", icon: "🏷️" },
  { href: "/admin/gallery", label: "Galerija", icon: "🖼️" },
  { href: "/admin/reservations", label: "Rezervacije", icon: "📅", badge: true },
  { href: "/admin/testimonials", label: "Utisci", icon: "💬" },
  { href: "/admin/faq", label: "FAQ", icon: "❓" },
  { href: "/admin/promo-codes", label: "Promo kodovi", icon: "🎟️" },
  { href: "/admin/settings", label: "Informacije", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [unseenCount, setUnseenCount] = useState(0);

  useEffect(() => {
    fetch("/api/reservations/unseen")
      .then((r) => r.json())
      .then((data) => setUnseenCount(data.count || 0));
  }, []);

  // Mark as seen when visiting reservations page
  useEffect(() => {
    if (pathname === "/admin/reservations" && unseenCount > 0) {
      fetch("/api/reservations/unseen", { method: "POST" })
        .then(() => setUnseenCount(0));
    }
  }, [pathname, unseenCount]);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-snow pt-20">
      <div className="mx-auto max-w-7xl px-5 md:px-16 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-2xl text-midnight">Admin Panel</h1>
            <p className="text-muted text-sm">Upravljaj proizvodima, kategorijama i slikama</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-ocean hover:text-ocean-dark transition-colors"
            >
              ← Nazad na sajt
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-rose hover:text-rose/80 font-medium transition-colors cursor-pointer"
            >
              Odjavi se
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-8 border-b border-silver pb-4 overflow-x-auto">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                pathname === item.href
                  ? "bg-ocean text-white shadow-cta"
                  : "bg-white text-subtle hover:bg-cloud border border-cloud"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
              {item.badge && unseenCount > 0 && (
                <span className="bg-rose text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {unseenCount}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
