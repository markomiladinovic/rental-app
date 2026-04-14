import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

export const metadata: Metadata = {
  title: {
    default: "BoMa Adventures — Iznajmi outdoor opremu",
    template: "%s | BoMa Adventures",
  },
  description: "Iznajmi SUP daske, kajake, gradske i MTB bicikle. Premium oprema za tvoju sledeću avanturu.",
  keywords: ["rental", "iznajmljivanje", "SUP", "kajak", "bicikl", "MTB", "outdoor", "Beograd", "avantura"],
  openGraph: {
    title: "BoMa Adventures — Iznajmi outdoor opremu",
    description: "Iznajmi SUP daske, kajake, gradske i MTB bicikle. Premium oprema za tvoju sledeću avanturu.",
    locale: "sr_RS",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" className={`${inter.variable} ${jakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased bg-white text-slate-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
