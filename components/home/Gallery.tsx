"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Section from "@/components/ui/Section";
import type { GalleryImage } from "@/data/gallery";

type GalleryProps = {
  images: GalleryImage[];
};

export default function Gallery({ images }: GalleryProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  if (images.length === 0) return null;

  return (
    <Section className="bg-snow">
      <div className="text-center mb-12 md:mb-16">
        <p className="text-ocean text-sm font-semibold uppercase tracking-[0.15em] mb-3">
          Galerija
        </p>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-midnight">
          Iz naših avantura
        </h2>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Main image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
          {images.map((img, i) => (
            <div
              key={img.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === current ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}

          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-midnight/60 to-transparent p-6">
            <p className="text-white text-sm font-medium">{images[current].alt}</p>
          </div>

          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-midnight hover:bg-white transition-colors cursor-pointer"
            aria-label="Prethodna"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-midnight hover:bg-white transition-colors cursor-pointer"
            aria-label="Sledeća"
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                i === current
                  ? "bg-ocean w-8"
                  : "bg-silver hover:bg-muted"
              }`}
              aria-label={`Slika ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
