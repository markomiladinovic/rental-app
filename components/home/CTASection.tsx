import Image from "next/image";
import Button from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80"
          alt="Adventure awaits"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-midnight/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center text-white">
        <h2 className="font-heading font-bold text-3xl md:text-5xl mb-6 leading-tight">
          Spreman za avanturu?
        </h2>
        <p className="text-lg text-white/80 mb-10 leading-relaxed">
          Rezerviši opremu za svoju sledeću outdoor avanturu. Jednostavno, brzo i pouzdano.
        </p>
        <Button href="/rentals" size="lg">
          Rezerviši sada
        </Button>
      </div>
    </section>
  );
}
