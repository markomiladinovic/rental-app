import Image from "next/image";
import Link from "next/link";
import Section from "@/components/ui/Section";
import { getCategories } from "@/lib/data";

export default async function Categories() {
  const CATEGORIES = await getCategories();
  return (
    <Section>
      <div className="text-center mb-12 md:mb-16">
        <p className="text-ocean text-sm font-semibold uppercase tracking-[0.15em] mb-3">
          Kategorije
        </p>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-midnight">
          Izaberi svoju avanturu
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/rentals?category=${cat.id}`}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
          >
            <Image
              src={cat.image}
              alt={cat.label}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-midnight/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-3xl mb-2 block">{cat.icon}</span>
              <h3 className="font-heading font-bold text-xl text-white mb-1">
                {cat.label}
              </h3>
              <p className="text-white/70 text-sm">{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
