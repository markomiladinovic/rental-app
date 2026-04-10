"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Proizvodi", icon: "📦" },
  { href: "/admin/categories", label: "Kategorije", icon: "🏷️" },
  { href: "/admin/gallery", label: "Galerija", icon: "🖼️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

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
        <div className="flex gap-2 mb-8 border-b border-silver pb-4">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                pathname === item.href
                  ? "bg-ocean text-white shadow-cta"
                  : "bg-white text-subtle hover:bg-cloud border border-cloud"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
