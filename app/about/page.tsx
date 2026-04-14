import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "O nama",
  description: "BoMa Adventures — naša priča, misija i vrednosti. Strast prema prirodi i outdoor aktivnostima.",
};

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <>
      {/* Hero */}
      <div className="relative pt-20">
        <div className="aspect-[3/1] md:aspect-[4/1] overflow-hidden">
          <Image
            src={settings.header_image_about || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80"}
            alt="Mountains"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 pb-12 md:pb-16">
          <div className="mx-auto max-w-7xl px-5 md:px-16">
            <h1 className="font-heading font-bold text-3xl md:text-5xl text-white">
              O nama
            </h1>
          </div>
        </div>
      </div>

      {/* Story */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <p className="text-ocean text-sm font-semibold uppercase tracking-[0.15em] mb-3">
            Naša priča
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-midnight mb-8">
            Strast prema avanturi
          </h2>
          <div className="space-y-6 text-subtle text-lg leading-relaxed">
            <p>
              BoMa Adventures je nastala iz ljubavi prema prirodi i outdoor aktivnostima.
              Verujemo da svako zaslužuje pristup kvalitetnoj opremi za nezaboravne avanture
              — bilo da si na jezeru, reci, planini ili u gradu.
            </p>
            <p>
              Naša misija je jednostavna: učiniti outdoor aktivnosti dostupnim svima.
              Od SUP dasaka i kajaka do city i MTB bicikala — nudimo premium opremu
              uz jednostavan proces rezervacije.
            </p>
            <p>
              Svaki komad opreme je pažljivo odabran i redovno održavan, jer tvoja
              sigurnost i zadovoljstvo su naš prioritet.
            </p>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section className="bg-snow">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-heading font-bold text-3xl text-midnight">
            Naše vrednosti
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: "🌿", title: "Priroda", desc: "Poštujemo i čuvamo prirodu u kojoj uživamo." },
            { icon: "🛡️", title: "Sigurnost", desc: "Sva oprema prolazi redovne provere i održavanje." },
            { icon: "🤝", title: "Poverenje", desc: "Gradimo dugoročne odnose sa našim korisnicima." },
          ].map((v) => (
            <div key={v.title} className="text-center">
              <div className="text-4xl mb-4">{v.icon}</div>
              <h3 className="font-heading font-bold text-lg text-midnight mb-2">{v.title}</h3>
              <p className="text-subtle">{v.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="text-center">
          <h2 className="font-heading font-bold text-3xl text-midnight mb-4">
            Spreman za avanturu?
          </h2>
          <p className="text-subtle text-lg mb-8">Pogledaj našu ponudu i rezerviši opremu.</p>
          <Button href="/rentals" size="lg">Pogledaj opremu</Button>
        </div>
      </Section>
    </>
  );
}
