import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Outdoor adventure"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/30 via-midnight/20 to-midnight/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-5 max-w-4xl mx-auto">
        <p className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-white/80 mb-6">
          Iznajmi outdoor opremu
        </p>
        <h1 className="font-heading font-extrabold text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6">
          Tvoja avantura <br className="hidden md:block" />
          počinje ovde
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Iznajmi SUP, kajak ili bicikl i istraži prirodu. Premium oprema, jednostavna rezervacija.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/rentals" size="lg">
            Pogledaj opremu
          </Button>
          <Button href="/about" variant="secondary" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
            Saznaj više
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-white/30 animate-pulse" />
      </div>
    </section>
  );
}
