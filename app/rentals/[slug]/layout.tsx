import type { Metadata } from "next";
import { getProducts } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rental-app-kappa-flame.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Proizvod nije pronađen",
    };
  }

  const description = `${product.shortDescription}. Cena od ${product.pricePerHour.toLocaleString()} din/sat ili ${product.pricePerDay.toLocaleString()} din/dan. Rezerviši online.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} — BoMa Adventures`,
      description,
      url: `${SITE_URL}/rentals/${product.slug}`,
      images: product.image ? [product.image] : undefined,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/rentals/${product.slug}`,
    },
  };
}

export default async function ProductDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) return <>{children}</>;

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    category: product.categoryLabel,
    offers: {
      "@type": "Offer",
      price: product.pricePerHour,
      priceCurrency: "RSD",
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/rentals/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      {children}
    </>
  );
}
