import Section from "@/components/ui/Section";
import ProductCard from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { products } from "@/data/products";

export default function FeaturedProducts() {
  const featured = products.filter((p) => p.available).slice(0, 4);

  return (
    <Section className="bg-snow">
      <div className="text-center mb-12 md:mb-16">
        <p className="text-ocean text-sm font-semibold uppercase tracking-[0.15em] mb-3">
          Popularna oprema
        </p>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-midnight">
          Najtraženija oprema
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center mt-12">
        <Button href="/rentals" variant="secondary">
          Pogledaj svu opremu
        </Button>
      </div>
    </Section>
  );
}
