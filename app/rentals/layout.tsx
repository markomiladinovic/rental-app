import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oprema za iznajmljivanje",
  description: "Pregledaj ponudu SUP dasaka, kajaka, gradskih i MTB bicikala. Uporedi cene i rezerviši online.",
};

export default function RentalsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
