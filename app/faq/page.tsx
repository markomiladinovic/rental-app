"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

type FaqItem = { id: string; question: string; answer: string };

export default function FaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/faq").then((r) => r.json()).then(setItems);
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
  }, []);

  return (
    <>
      <div className="relative pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden">
        {settings.header_image_faq && (
          <div className="absolute inset-0">
            <Image src={settings.header_image_faq} alt="" fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-white/70" />
          </div>
        )}
        {!settings.header_image_faq && <div className="absolute inset-0 bg-snow" />}
        <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-16">
          <p className="text-ocean text-sm font-semibold uppercase tracking-[0.15em] mb-3">
            Česta pitanja
          </p>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-midnight mb-4">
            Šta te interesuje?
          </h1>
          <p className="text-subtle text-lg max-w-2xl">
            Odgovori na najčešća pitanja o rezervaciji, plaćanju i korišćenju opreme.
          </p>
        </div>
      </div>

      <Section>
        <div className="max-w-3xl mx-auto">
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <p>Nema još pitanja u bazi.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="bg-white border-2 border-silver rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenId(openId === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer hover:bg-snow transition-colors"
                  >
                    <h3 className="font-heading font-semibold text-midnight">{item.question}</h3>
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-ocean/10 text-ocean flex items-center justify-center transition-transform ${
                      openId === item.id ? "rotate-45" : ""
                    }`}>
                      +
                    </span>
                  </button>
                  {openId === item.id && (
                    <div className="px-5 pb-5 pt-0 text-subtle leading-relaxed whitespace-pre-wrap border-t border-cloud">
                      <p className="pt-4">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12 pt-8 border-t border-cloud">
            <p className="text-subtle mb-6">Nisi našao odgovor? Javi nam se!</p>
            <Button href="/contact" size="lg">Kontaktiraj nas</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
