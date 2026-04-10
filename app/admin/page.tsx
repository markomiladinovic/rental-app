import Link from "next/link";
import { getProducts, getCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const available = products.filter((p) => p.available).length;
  const unavailable = products.filter((p) => !p.available).length;

  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-midnight mb-6">Pregled</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-cloud">
          <p className="text-muted text-sm mb-1">Ukupno proizvoda</p>
          <p className="font-heading font-bold text-3xl text-midnight">{products.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-cloud">
          <p className="text-muted text-sm mb-1">Dostupno</p>
          <p className="font-heading font-bold text-3xl text-emerald">{available}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-cloud">
          <p className="text-muted text-sm mb-1">Nedostupno</p>
          <p className="font-heading font-bold text-3xl text-rose">{unavailable}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-cloud">
          <p className="text-muted text-sm mb-1">Kategorije</p>
          <p className="font-heading font-bold text-3xl text-ocean">{categories.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-cloud">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-lg text-midnight">Proizvodi</h3>
            <Link href="/admin/products" className="text-ocean text-sm font-medium hover:text-ocean-dark transition-colors">
              Upravljaj →
            </Link>
          </div>
          <div className="space-y-3">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-dark">{p.name}</span>
                <span className={`font-medium ${p.available ? "text-emerald" : "text-rose"}`}>
                  {p.available ? "Dostupno" : "Nedostupno"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-cloud">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-lg text-midnight">Kategorije</h3>
            <Link href="/admin/categories" className="text-ocean text-sm font-medium hover:text-ocean-dark transition-colors">
              Upravljaj →
            </Link>
          </div>
          <div className="space-y-3">
            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat.id).length;
              return (
                <div key={cat.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-dark">{cat.icon} {cat.label}</span>
                  <span className="text-muted">{count} proizvoda</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
