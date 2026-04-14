"use client";
import { useState, useEffect } from "react";

type Reservation = {
  id: string;
  productId: string;
  productName: string;
  durationType: "hour" | "day";
  quantity: number;
  startDate: string;
  startTime: string;
  hours: number | null;
  endDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  note: string;
  totalPrice: number;
  status: "confirmed" | "cancelled" | "completed";
  createdAt: string;
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Potvrđeno",
  cancelled: "Otkazano",
  completed: "Završeno",
};

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-emerald/10 text-emerald",
  cancelled: "bg-rose/10 text-rose",
  completed: "bg-ocean/10 text-ocean",
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<"all" | "confirmed" | "cancelled" | "completed">("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/reservations").then((r) => r.json()).then(setReservations);
  }, []);

  const updateStatus = async (id: string, status: "cancelled" | "completed") => {
    setUpdating(id);
    setMessage("");
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setReservations((prev) => prev.map((r) => (r.id === id ? updated : r)));
        setMessage(status === "cancelled" ? "Rezervacija otkazana" : "Rezervacija završena");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch {
      setMessage("Greška");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === "all" ? reservations : reservations.filter((r) => r.status === filter);
  const confirmedCount = reservations.filter((r) => r.status === "confirmed").length;
  const todayStr = new Date().toISOString().split("T")[0];
  const todayCount = reservations.filter((r) => r.startDate === todayStr && r.status === "confirmed").length;

  const exportCSV = () => {
    const header = "Datum,Vreme,Proizvod,Korisnik,Email,Telefon,Trajanje,Kolicina,Ukupno (din),Status\n";
    const rows = filtered.map((r) =>
      [
        r.startDate,
        r.startTime,
        `"${r.productName}"`,
        `"${r.customerName}"`,
        r.customerEmail,
        r.customerPhone,
        r.durationType === "day" ? `${r.startDate} - ${r.endDate}` : `${r.hours}h`,
        r.quantity,
        r.totalPrice,
        r.status,
      ].join(",")
    ).join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rezervacije-${todayStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-xl text-midnight">Rezervacije</h2>
        <div className="flex items-center gap-3">
          {message && (
            <span className="text-sm font-medium text-emerald bg-emerald/10 px-3 py-1.5 rounded-lg">{message}</span>
          )}
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="bg-white hover:bg-cloud text-midnight border border-silver text-sm font-semibold px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            Preuzmi CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-cloud">
          <p className="text-muted text-xs mb-1">Ukupno</p>
          <p className="font-heading font-bold text-2xl text-midnight">{reservations.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-cloud">
          <p className="text-muted text-xs mb-1">Aktivne</p>
          <p className="font-heading font-bold text-2xl text-emerald">{confirmedCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-cloud">
          <p className="text-muted text-xs mb-1">Danas</p>
          <p className="font-heading font-bold text-2xl text-ocean">{todayCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-cloud">
          <p className="text-muted text-xs mb-1">Otkazane</p>
          <p className="font-heading font-bold text-2xl text-rose">
            {reservations.filter((r) => r.status === "cancelled").length}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(["all", "confirmed", "cancelled", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === f
                ? "bg-ocean text-white shadow-cta"
                : "bg-white text-subtle hover:bg-cloud border border-cloud"
            }`}
          >
            {f === "all" ? "Sve" : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <p className="text-3xl mb-2">📅</p>
            <p>Nema rezervacija.</p>
          </div>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-cloud p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-heading font-bold text-midnight">{r.productName}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status]}`}>
                      {STATUS_LABELS[r.status]}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-muted">Datum:</span>
                      <p className="font-medium text-midnight">
                        {r.startDate}{r.durationType === "day" && r.endDate !== r.startDate ? ` — ${r.endDate}` : ""}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted">Vreme:</span>
                      <p className="font-medium text-midnight">{r.startTime}</p>
                    </div>
                    <div>
                      <span className="text-muted">Trajanje:</span>
                      <p className="font-medium text-midnight">
                        {r.durationType === "day" ? "Dnevno" : `${r.hours}h`} x {r.quantity}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted">Ukupno:</span>
                      <p className="font-bold text-ocean">{r.totalPrice.toLocaleString()} din</p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-muted">Korisnik:</span>{" "}
                    <span className="text-midnight font-medium">{r.customerName}</span>
                    <span className="text-muted"> · </span>
                    <span className="text-subtle">{r.customerPhone}</span>
                    <span className="text-muted"> · </span>
                    <span className="text-subtle">{r.customerEmail}</span>
                  </div>
                  {r.note && (
                    <p className="text-muted text-sm mt-1">Napomena: {r.note}</p>
                  )}
                </div>

                {/* Actions */}
                {r.status === "confirmed" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateStatus(r.id, "completed")}
                      disabled={updating === r.id}
                      className="bg-emerald/10 hover:bg-emerald/20 text-emerald text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                    >
                      Završi
                    </button>
                    <button
                      onClick={() => updateStatus(r.id, "cancelled")}
                      disabled={updating === r.id}
                      className="bg-rose/10 hover:bg-rose/20 text-rose text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                    >
                      Otkaži
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
