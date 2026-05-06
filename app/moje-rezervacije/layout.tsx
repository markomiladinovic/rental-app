import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moje rezervacije",
  description: "Pregledaj svoje rezervacije i upravljaj njima.",
  robots: { index: false, follow: false },
};

export default function MyReservationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
