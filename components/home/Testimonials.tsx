import Section from "@/components/ui/Section";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <Section className="bg-snow">
      <div className="text-center mb-12 md:mb-16">
        <p className="text-ocean text-sm font-semibold uppercase tracking-[0.15em] mb-3">
          Utisci
        </p>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-midnight">
          Šta kažu naši korisnici
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl p-6 border border-cloud"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-sm ${i < t.rating ? "text-amber" : "text-silver"}`}>
                  ★
                </span>
              ))}
            </div>
            <p className="text-slate-dark text-sm leading-relaxed mb-6">
              &ldquo;{t.text}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ocean/10 flex items-center justify-center">
                <span className="text-ocean font-bold text-sm">
                  {t.name.split(" ").map((w) => w[0]).join("")}
                </span>
              </div>
              <div>
                <p className="font-semibold text-sm text-midnight">{t.name}</p>
                <p className="text-muted text-xs">{t.activity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
