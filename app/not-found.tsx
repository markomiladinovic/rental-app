import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center">
        <p className="text-8xl font-heading font-bold text-ocean/20 mb-4">404</p>
        <h1 className="font-heading font-bold text-3xl text-midnight mb-3">
          Stranica nije pronađena
        </h1>
        <p className="text-subtle text-lg mb-8 max-w-md mx-auto">
          Izgleda da ova stranica ne postoji. Vrati se na početnu ili pogledaj našu opremu.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/" size="lg">Početna</Button>
          <Button href="/rentals" variant="secondary" size="lg">Pogledaj opremu</Button>
        </div>
      </div>
    </div>
  );
}
