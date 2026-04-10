import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { products, CATEGORIES } from "@/data/products";

export default function Pricing() {
  return (
    <Section>
      <div className="text-center mb-12 md:mb-16">
        <p className="text-ocean text-sm font-semibold uppercase tracking-[0.15em] mb-3">
          Cenovnik
        </p>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-midnight">
          Transparentne cene
        </h2>
        <p className="text-subtle mt-4 max-w-xl mx-auto">
          Plaćanje na licu mesta pri preuzimanju opreme. Bez skrivenih troškova.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => {
          const categoryProducts = products.filter((p) => p.category === cat.id);
          const minHour = Math.min(...categoryProducts.map((p) => p.pricePerHour));
          const minDay = Math.min(...categoryProducts.map((p) => p.pricePerDay));

          return (
            <div
              key={cat.id}
              className="bg-white border border-cloud rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h3 className="font-heading font-bold text-lg text-midnight mb-1">
                {cat.label}
              </h3>
              <p className="text-muted text-sm mb-6">{cat.description}</p>

              <div className="space-y-3 mb-6">
                <div className="bg-snow rounded-xl px-4 py-3">
                  <span className="text-muted text-xs block">Po satu</span>
                  <span className="text-ocean font-bold text-xl">
                    od {minHour.toLocaleString()}
                  </span>
                  <span className="text-muted text-sm ml-1">din</span>
                </div>
                <div className="bg-snow rounded-xl px-4 py-3">
                  <span className="text-muted text-xs block">Po danu</span>
                  <span className="text-midnight font-bold text-xl">
                    od {minDay.toLocaleString()}
                  </span>
                  <span className="text-muted text-sm ml-1">din</span>
                </div>
              </div>

              <Button href={`/rentals?category=${cat.id}`} variant="secondary" size="sm" className="w-full">
                Pogledaj ponudu
              </Button>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
