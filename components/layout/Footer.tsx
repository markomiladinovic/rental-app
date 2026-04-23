import Link from "next/link";
import { getSettings } from "@/lib/data";

const FOOTER_LINKS = {
  "Oprema": [
    { href: "/rentals?category=sup", label: "SUP Board" },
    { href: "/rentals?category=kayak", label: "Kajak" },
    { href: "/rentals?category=city-bike", label: "City Bike" },
    { href: "/rentals?category=mtb", label: "MTB Bike" },
  ],
  "Kompanija": [
    { href: "/about", label: "O nama" },
    { href: "/contact", label: "Kontakt" },
    { href: "/login", label: "Admin" },
  ],
  "Info": [
    { href: "/booking", label: "Kako rezervisati" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Pomoć" },
  ],
};

export default async function Footer() {
  const settings = await getSettings();
  return (
    <footer className="bg-midnight text-white">
      <div className="mx-auto max-w-7xl px-5 md:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-ocean flex items-center justify-center">
                <span className="text-white font-bold text-sm">BA</span>
              </div>
              <span className="font-heading font-bold text-xl tracking-tight">
                BoMa Adventures
              </span>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Premium oprema za outdoor avanturu. SUP, kajak, bicikli — sve na jednom mestu.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted mb-4">
                {title}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-silver hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-sm">
            &copy; {new Date().getFullYear()} BoMa Adventures. Sva prava zadržana.
          </p>
          <div className="flex gap-6">
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white text-sm transition-colors">Instagram</a>
            )}
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white text-sm transition-colors">Facebook</a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
