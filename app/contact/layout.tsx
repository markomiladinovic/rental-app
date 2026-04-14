import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktiraj BoMa Adventures — adresa, telefon, email i radno vreme. Javi nam se za pitanja o opremi ili rezervaciji.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
