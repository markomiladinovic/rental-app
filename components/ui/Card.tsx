import Link from "next/link";
import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/rentals/${product.slug}`}
      className="group block bg-white border border-cloud rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-semibold text-midnight px-3 py-1.5 rounded-full">
          {product.categoryLabel}
        </span>
        {!product.available && (
          <div className="absolute inset-0 bg-midnight/50 flex items-center justify-center">
            <span className="bg-white text-midnight text-sm font-bold px-4 py-2 rounded-full">
              Nije dostupno
            </span>
          </div>
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
