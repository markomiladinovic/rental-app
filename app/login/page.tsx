"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Pogrešan email ili lozinka");
      }
    } catch {
      setError("Greška pri prijavljivanju");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-snow flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-ocean flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">BA</span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-midnight">Admin prijava</h1>
          <p className="text-muted text-sm mt-1">Unesi email i lozinku za pristup</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-cloud p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-dark mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tvoj@email.com"
              autoFocus
              className="w-full bg-snow border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-dark mb-2">Lozinka</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-snow border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors"
            />
          </div>

          {error && (
            <p className="text-rose text-sm font-medium bg-rose/10 px-4 py-2.5 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={!email || !password || loading}
            className="w-full bg-ocean hover:bg-ocean-dark text-white font-semibold py-3 rounded-xl transition-all shadow-cta disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Prijavljivanje..." : "Prijavi se"}
          </button>
        </form>
      </div>
    </div>
  );
}
