import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
  nextFreeDate?: string | null;
};

export default function ProductCard({ product, nextFreeDate }: ProductCardProps) {
  return (
    <Link
      href={`/rentals/${product.slug}`}
      className="group block bg-white border border-cloud rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-semibold text-midnight px-3 py-1.5 rounded-full">
          {product.categoryLabel}
        </span>
        {!product.available && (
          <div className="absolute inset-0 bg-midnight/50 flex items-center justify-center">
            <div className="text-center">
              <span className="bg-white text-midnight text-sm font-bold px-4 py-2 rounded-full block">
                Nije dostupno
              </span>
              {nextFreeDate && (
                <span className="bg-white/90 text-subtle text-xs font-medium px-3 py-1 rounded-full mt-2 block">
                  Slobodno od {new Date(nextFreeDate).toLocaleDateString("sr-Latn-RS", { day: "numeric", month: "long" })}
                </span>
              )}
            </div>
          </div>
        )}
        {product.available && nextFreeDate && (
          <span className="absolute bottom-4 left-4 bg-amber/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            Slobodno od {new Date(nextFreeDate).toLocaleDateString("sr-Latn-RS", { day: "numeric", month: "short" })}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading font-bold text-lg text-midnight mb-1">
          {product.name}
        </h3>
        <p className="text-subtle text-sm mb-4 line-clamp-2">
          {product.shortDescription}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-ocean font-bold text-lg">{product.pricePerHour.toLocaleString()}</span>
            <span className="text-muted text-sm ml-1">din/sat</span>
          </div>
          <span className="text-sm text-muted">
            {product.pricePerDay.toLocaleString()} din/dan
          </span>
        </div>
      </div>
    </Link>
  );
}
