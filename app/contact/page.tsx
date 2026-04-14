"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<Record<string, string>>({});
  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
  }, []);

  const handleSend = async () => {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError("Greška pri slanju poruke");
      }
    } catch {
      setError("Greška pri slanju poruke");
    } finally {
      setSending(false);
    }
  };

  const inputClass = "w-full bg-snow border border-silver rounded-xl px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors";
  const labelClass = "block text-sm font-semibold text-slate-dark mb-2";

  return (
    <>
      {/* Header */}
      <div className="relative pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden">
        {settings.header_image_contact && (
          <div className="absolute inset-0">
            <Image src={settings.header_image_contact} alt="" fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-white/85" />
          </div>
        )}
        {!settings.header_image_contact && <div className="absolute inset-0 bg-snow" />}
        <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-16">
          <p className="text-ocean text-sm font-semibold uppercase tracking-[0.15em] mb-3">
            Kontakt
          </p>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-midnight mb-4">
            Javi nam se
          </h1>
          <p className="text-subtle text-lg max-w-2xl">
            Imaš pitanje o opremi, rezervaciji ili saradnji? Slobodno nas kontaktiraj.
          </p>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact form */}
          <div>
            {sent ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-6">✅</div>
                <h2 className="font-heading font-bold text-2xl text-midnight mb-3">
                  Poruka poslata!
                </h2>
                <p className="text-subtle mb-6">Odgovorićemo ti u najkraćem roku.</p>
                <Button onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }} variant="secondary">
                  Pošalji novu poruku
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Ime i prezime</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Tvoje ime"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="tvoj@email.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Poruka</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    rows={5}
                    placeholder="Tvoja poruka..."
                    className={inputClass}
                  />
                </div>
                {error && (
                  <p className="text-rose text-sm font-medium bg-rose/10 px-4 py-2.5 rounded-xl">{error}</p>
                )}
                <Button
                  onClick={handleSend}
                  disabled={!form.name || !form.email || !form.message || sending}
                  size="lg"
                  className="w-full"
                >
                  {sending ? "Slanje..." : "Pošalji poruku"}
                </Button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-heading font-semibold text-lg text-midnight mb-4">Informacije</h3>
              <div className="space-y-4">
                {[
                  { icon: "📍", label: "Adresa", value: settings.address || "" },
                  { icon: "📞", label: "Telefon", value: [settings.phone, settings.phone2].filter(Boolean).join(" / ") || "" },
                  { icon: "✉️", label: "Email", value: [settings.email, settings.email2].filter(Boolean).join(" / ") || "" },
                  { icon: "🕐", label: "Radno vreme", value: settings.working_hours || "" },
                ].filter((item) => item.value).map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-sm text-muted">{item.label}</p>
                      <p className="text-midnight font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2912.5!2d21.8958!3d43.3209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4755b0c2c1b4e1a1%3A0x1!2sBulevar%20Nemanjica%2086%2C%20Nis!5e0!3m2!1ssr!2srs!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokacija na mapi"
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
