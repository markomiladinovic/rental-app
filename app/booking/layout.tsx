import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rezervacija",
  description: "Rezerviši outdoor opremu online. Izaberi datum, vreme i trajanje — plaćanje na licu mesta.",
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
