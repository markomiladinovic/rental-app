import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSettings } from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rental-app-kappa-flame.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BoMa Adventures — Iznajmi outdoor opremu",
    template: "%s | BoMa Adventures",
  },
  description: "Iznajmi SUP daske, kajake, gradske i MTB bicikle u Nišu. Premium oprema za tvoju sledeću avanturu — rezerviši online.",
  keywords: ["rental", "iznajmljivanje", "SUP", "kajak", "bicikl", "MTB", "outdoor", "Niš", "avantura"],
  openGraph: {
    title: "BoMa Adventures — Iznajmi outdoor opremu",
    description: "Iznajmi SUP daske, kajake, gradske i MTB bicikle u Nišu.",
    locale: "sr_RS",
    type: "website",
    url: SITE_URL,
    siteName: "BoMa Adventures",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": SITE_URL,
    name: "BoMa Adventures",
    description: "Iznajmljivanje outdoor opreme — SUP daske, kajaci, gradski i MTB bicikli.",
    url: SITE_URL,
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    address: settings.address
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.address,
          addressLocality: "Niš",
          addressCountry: "RS",
        }
      : undefined,
    sameAs: [settings.instagram, settings.facebook].filter(Boolean),
    openingHours: settings.working_hours || undefined,
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.32094,
      longitude: 21.89579,
    },
    priceRange: "$$",
  };

  return (
    <html lang="sr" className={`${inter.variable} ${jakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased bg-white text-slate-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
