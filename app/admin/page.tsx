import Link from "next/link";
import { getProducts, getCategories, getAllReservations } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, categories, reservations] = await Promise.all([
    getProducts(), getCategories(), getAllReservations(),
  ]);
  const todayStr = new Date().toISOString().split("T")[0];
  const activeReservations = reservations.filter((r) => r.status === "confirmed");
  const todayReservations = activeReservations.filter((r) => r.startDate === todayStr);

  // Reservations chart (last 14 days)
  const chartDays = 14;
  const chartData: { label: string; count: number }[] = [];
  for (let i = chartDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split("T")[0];
    const count = reservations.filter((r) => r.startDate === ds && r.status !== "cancelled").length;
    chartData.push({
      label: d.toLocaleDateString("sr-Latn-RS", { day: "numeric", month: "short" }),
      count,
    });
  }
  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  const paidReservations = reservations.filter((r) => r.status !== "cancelled");
  const totalRevenue = paidReservations.reduce((sum, r) => sum + r.totalPrice, 0);

  // Current month revenue
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const monthRevenue = paidReservations
    .filter((r) => r.startDate >= monthStart)
    .reduce((sum, r) => sum + r.totalPrice, 0);
  const monthReservationCount = paidReservations.filter((r) => r.startDate >= monthStart).length;

  // Last 6 months revenue
  const monthlyRevenue: { label: string; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = d.toISOString().split("T")[0];
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString().split("T")[0];
    const rev = paidReservations
      .filter((r) => r.startDate >= start && r.startDate < end)
      .reduce((sum, r) => sum + r.totalPrice, 0);
    monthlyRevenue.push({
      label: d.toLocaleDateString("sr-Latn-RS", { month: "short" }),
      revenue: rev,
    });
  }
  const maxMonthRev = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);

  // Top products by revenue
  const productRevenue: Record<string, { name: string; revenue: number; count: number }> = {};
  for (const r of paidReservations) {
    if (!productRevenue[r.productId]) {
      productRevenue[r.productId] = { name: r.productName, revenue: 0, count: 0 };
    }
    productRevenue[r.productId].revenue += r.totalPrice;
    productRevenue[r.productId].count += 1;
  }
  const topProducts = Object.values(productRevenue)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Repeat customers (count emails appearing > 1)
  const customerCount: Record<string, number> = {};
  for (const r of paidReservations) {
    customerCount[r.customerEmail] = (customerCount[r.customerEmail] || 0) + 1;
  }
  const uniqueCustomers = Object.keys(customerCount).length;
  const repeatCustomers = Object.values(customerCount).filter((c) => c > 1).length;

  const available = products.filter((p) => p.available).length;
  const unavailable = products.filter((p) => !p.available).length;

  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-midnight mb-6">Pregled</h2>

      {/* Revenue cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border-2 border-ocean/30">
          <p className="text-muted text-sm mb-1">Prihod ovog meseca</p>
          <p className="font-heading font-bold text-2xl text-ocean">{monthRevenue.toLocaleString()} din</p>
          <p className="text-muted text-xs mt-1">{monthReservationCount} rezervacija</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-cloud">
          <p className="text-muted text-sm mb-1">Ukupan prihod</p>
          <p className="font-heading font-bold text-2xl text-midnight">{totalRevenue.toLocaleString()} din</p>
          <p className="text-muted text-xs mt-1">{paidReservations.length} rezervacija</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-cloud">
          <p className="text-muted text-sm mb-1">Ukupno korisnika</p>
          <p className="font-heading font-bold text-2xl text-midnight">{uniqueCustomers}</p>
          <p className="text-muted text-xs mt-1">{repeatCustomers} se vratilo</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-cloud">
          <p className="text-muted text-sm mb-1">Rezervacije danas</p>
          <p className="font-heading font-bold text-2xl text-emerald">{todayReservations.length}</p>
          <Link href="/admin/reservations" className="text-ocean text-xs font-medium mt-1 inline-block hover:text-ocean-dark transition-colors">
            Pogledaj sve →
          </Link>
        </div>
      </div>

      {/* Two charts side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Reservations chart */}
        <div className="bg-white rounded-2xl p-6 border border-cloud">
          <h3 className="font-heading font-semibold text-lg text-midnight mb-6">Rezervacije (14 dana)</h3>
          <div className="flex items-end gap-1.5 h-32">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-muted font-medium">
                  {d.count > 0 ? d.count : ""}
                </span>
                <div
                  className="w-full rounded-t-md bg-ocean/80 hover:bg-ocean transition-colors min-h-[2px]"
                  style={{ height: `${(d.count / maxCount) * 100}%` }}
                />
                <span className="text-[10px] text-muted leading-tight text-center">
                  {d.label.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly revenue */}
        <div className="bg-white rounded-2xl p-6 border border-cloud">
          <h3 className="font-heading font-semibold text-lg text-midnight mb-6">Prihod (6 meseci)</h3>
          <div className="flex items-end gap-3 h-32">
            {monthlyRevenue.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-muted font-medium">
                  {m.revenue > 0 ? `${Math.round(m.revenue / 1000)}k` : ""}
                </span>
                <div
                  className="w-full rounded-t-md bg-emerald/80 hover:bg-emerald transition-colors min-h-[2px]"
                  style={{ height: `${(m.revenue / maxMonthRev) * 100}%` }}
                />
                <span className="text-[10px] text-muted leading-tight text-center">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top products + Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-cloud">
          <h3 className="font-heading font-semibold text-lg text-midnight mb-4">Top 5 proizvoda po prihodu</h3>
          {topProducts.length === 0 ? (
            <p className="text-muted text-sm">Nema rezervacija još uvek.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => {
                const maxRev = topProducts[0].revenue || 1;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-dark text-sm font-medium truncate flex-1 min-w-0">
                        {i + 1}. {p.name}
                      </span>
                      <span className="text-ocean font-bold text-sm flex-shrink-0 ml-2">
                        {p.revenue.toLocaleString()} din
                      </span>
                    </div>
                    <div className="h-1.5 bg-cloud rounded-full overflow-hidden">
                      <div
                        className="h-full bg-ocean rounded-full"
                        style={{ width: `${(p.revenue / maxRev) * 100}%` }}
                      />
                    </div>
                    <p className="text-muted text-xs mt-1">{p.count} {p.count === 1 ? "rezervacija" : "rezervacija"}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-cloud">
          <h3 className="font-heading font-semibold text-lg text-midnight mb-4">Kategorije</h3>
          <div className="space-y-3 mb-6">
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
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-cloud">
            <div className="text-center">
              <p className="text-muted text-xs">Ukupno</p>
              <p className="font-bold text-midnight">{products.length}</p>
            </div>
            <div className="text-center">
              <p className="text-muted text-xs">Dostupno</p>
              <p className="font-bold text-emerald">{available}</p>
            </div>
            <div className="text-center">
              <p className="text-muted text-xs">Nedostupno</p>
              <p className="font-bold text-rose">{unavailable}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
