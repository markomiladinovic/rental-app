import Section from "@/components/ui/Section";

const STEPS = [
  {
    step: "01",
    title: "Izaberi opremu",
    description: "Pregledaj našu ponudu i izaberi opremu koja ti odgovara.",
    icon: "🔍",
  },
  {
    step: "02",
    title: "Rezerviši online",
    description: "Odaberi datum, vreme i trajanje. Potvrda stiže odmah.",
    icon: "📅",
  },
  {
    step: "03",
    title: "Uživaj u avanturi",
    description: "Preuzmi opremu i kreni u avanturu. Mi brinemo o ostalom.",
    icon: "🎉",
  },
];

export default function HowItWorks() {
  return (
    <Section>
      <div className="text-center mb-12 md:mb-16">
        <p className="text-ocean text-sm font-semibold uppercase tracking-[0.15em] mb-3">
          Kako funkcioniše
        </p>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-midnight">
          Jednostavno u 3 koraka
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {STEPS.map((step, i) => (
          <div key={step.step} className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-ocean/10 flex items-center justify-center text-3xl mx-auto mb-6">
              {step.icon}
            </div>
            <div className="text-ocean font-bold text-sm mb-2">{step.step}</div>
            <h3 className="font-heading font-bold text-xl text-midnight mb-3">
              {step.title}
            </h3>
            <p className="text-subtle leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
