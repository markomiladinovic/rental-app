"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

type Reservation = {
  id: string;
  productName: string;
  durationType: "hour" | "day";
  quantity: number;
  startDate: string;
  startTime: string;
  hours: number | null;
  endDate: string;
  totalPrice: number;
  status: "confirmed" | "cancelled" | "completed";
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

export default function Page() {
  return (
    <Suspense fallback={<Section className="pt-32"><div className="text-center py-20 text-muted">Učitavanje...</div></Section>}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const params = useSearchParams();
  const token = params.get("token");

  if (token) return <ReservationsView token={token} />;
  return <RequestForm />;
}

function RequestForm() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const inputClass = "w-full bg-snow border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors";

  const submit = async () => {
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/my-reservations/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.error || "Greška");
      }
    } catch {
      setError("Greška pri slanju");
    } finally {
      setSending(false);
    }
  };

  return (
    <Section className="pt-32">
      <div className="max-w-md mx-auto">
        <h1 className="font-heading font-bold text-3xl text-midnight mb-3">Moje rezervacije</h1>
        <p className="text-subtle mb-8">
          Unesi email koji si koristio pri rezervaciji. Poslaćemo ti link za pristup.
        </p>

        {sent ? (
          <div className="bg-emerald/10 border border-emerald/20 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">📧</div>
            <h2 className="font-heading font-bold text-xl text-midnight mb-2">Email poslat!</h2>
            <p className="text-subtle text-sm">
              Proveri inbox. Klikni na link u email-u da vidiš svoje rezervacije.
            </p>
            <p className="text-muted text-xs mt-3">Link važi 1 sat.</p>
          </div>
        ) : (
          <div className="bg-snow rounded-2xl p-6 border-2 border-silver space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-dark mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tvoj@email.com"
                className={inputClass}
              />
            </div>
            {error && (
              <p className="text-rose text-sm font-medium bg-rose/10 px-4 py-2.5 rounded-xl">{error}</p>
            )}
            <Button
              onClick={submit}
              disabled={!email || sending}
              size="lg"
              className="w-full"
            >
              {sending ? "Slanje..." : "Pošalji link"}
            </Button>
          </div>
        )}
      </div>
    </Section>
  );
}

function ReservationsView({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/my-reservations?token=${encodeURIComponent(token)}`);
      const data = await res.json();
      if (res.ok) {
        setEmail(data.email);
        setReservations(data.reservations);
      } else {
        setError(data.error || "Greška");
      }
    } catch {
      setError("Greška pri učitavanju");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const cancel = async (reservationId: string) => {
    if (!confirm("Da li si siguran da želiš da otkažeš ovu rezervaciju?")) return;
    setCancelling(reservationId);
    setMessage("");
    try {
      const res = await fetch("/api/my-reservations/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, reservationId }),
      });
      if (res.ok) {
        setMessage("Rezervacija otkazana.");
        await load();
      } else {
        const data = await res.json();
        setMessage(data.error || "Greška");
      }
    } catch {
      setMessage("Greška pri otkazivanju");
    } finally {
      setCancelling(null);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return <Section className="pt-32"><div className="text-center py-20 text-muted">Učitavanje...</div></Section>;
  }

  if (error) {
    return (
      <Section className="pt-32">
        <div className="max-w-md mx-auto text-center py-12">
          <p className="text-4xl mb-3">⏱️</p>
          <h1 className="font-heading font-bold text-2xl text-midnight mb-3">{error}</h1>
          <p className="text-subtle mb-6">Zatraži novi link da pristupiš rezervacijama.</p>
          <Button href="/moje-rezervacije">Zatraži novi link</Button>
        </div>
      </Section>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <Section className="pt-32">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading font-bold text-3xl text-midnight mb-2">Moje rezervacije</h1>
        <p className="text-subtle mb-8">{email}</p>

        {message && (
          <div className="bg-emerald/10 border border-emerald/20 text-emerald text-sm font-medium px-4 py-3 rounded-xl mb-6">
            {message}
          </div>
        )}

        {reservations.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <p className="text-3xl mb-2">📅</p>
            <p>Nemaš rezervacija.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map((r) => {
              const canCancel = r.status === "confirmed" && r.startDate > today;
              return (
                <div key={r.id} className="bg-white border-2 border-silver rounded-2xl p-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
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
                            {r.durationType === "day" ? "Dnevno" : `${r.hours}h`} × {r.quantity}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted">Ukupno:</span>
                          <p className="font-bold text-ocean">{r.totalPrice.toLocaleString()} din</p>
                        </div>
                      </div>
                    </div>
                    {canCancel && (
                      <button
                        onClick={() => cancel(r.id)}
                        disabled={cancelling === r.id}
                        className="bg-rose/10 hover:bg-rose/20 text-rose text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer flex-shrink-0"
                      >
                        {cancelling === r.id ? "Otkazivanje..." : "Otkaži"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-muted text-xs text-center mt-8">
          Za izmenu termina ili pomoć, javi nam se telefonom ili na kontakt strani.
        </p>
      </div>
    </Section>
  );
}
