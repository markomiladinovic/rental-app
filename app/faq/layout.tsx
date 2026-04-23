import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Česta pitanja",
  description: "Odgovori na najčešća pitanja o iznajmljivanju opreme, plaćanju, otkazivanju rezervacija i korišćenju opreme.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
