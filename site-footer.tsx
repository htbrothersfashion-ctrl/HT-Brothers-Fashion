import Link from "next/link";
import { IconFacebook, IconInstagram, IconTwitterX, IconTruck, IconRefresh, IconShield } from "./icons";

const SHOP_LINKS = [
  { label: "All Products", href: "/shop" },
  { label: "T-Shirts", href: "/shop?category=t-shirts" },
  { label: "Hoodies", href: "/shop?category=hoodies" },
  { label: "Pants", href: "/shop?category=pants" },
  { label: "Shirts", href: "/shop?category=shirts" },
  { label: "Jackets", href: "/shop?category=jackets" },
  { label: "Shorts", href: "/shop?category=shorts" },
  { label: "New Arrivals", href: "/shop?sort=newest" },
];

const HELP_LINKS = [
  { label: "Shipping & Delivery", href: "/shop#shipping" },
  { label: "Returns & Exchanges", href: "/shop#returns" },
  { label: "Size Guide", href: "/shop#size-guide" },
  { label: "Track Your Order", href: "/shop" },
  { label: "Contact Us", href: "mailto:hello@htbrothers.shop" },
];

const PERKS = [
  { icon: IconTruck, title: "Free shipping over $75", text: "Fast, tracked delivery on every order." },
  { icon: IconRefresh, title: "30-day easy returns", text: "Changed your mind? No questions asked." },
  { icon: IconShield, title: "2-year stitch warranty", text: "Every seam guaranteed, on us." },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-cream">
      {/* Perks strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-3">
          {PERKS.map((perk) => (
            <div key={perk.title} className="flex items-start gap-4">
              <span className="mt-0.5 rounded-full bg-clay p-2.5 text-cream">
                <perk.icon width={18} height={18} />
              </span>
              <div>
                <p className="font-semibold">{perk.title}</p>
                <p className="mt-1 text-sm text-cream/60">{perk.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cream/40 bg-cream/10 font-display text-sm font-bold">
              HT
            </span>
            <span className="leading-none">
              <span className="block font-display text-lg font-bold tracking-tight">HT BROTHERS</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/60">Fashion</span>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/60">
            Premium menswear essentials — heavyweight tees, fleece hoodies, selvedge denim and tailored shirts.
            Designed in-house, made to be lived in since 2016.
          </p>
          <div className="mt-6 flex gap-3">
            {[IconInstagram, IconFacebook, IconTwitterX].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="rounded-full border border-cream/20 p-2.5 text-cream/70 transition hover:border-clay hover:bg-clay hover:text-cream"
              >
                <Icon width={16} height={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-cream/50">Shop</h3>
          <ul className="mt-5 space-y-3">
            {SHOP_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-cream/75 transition hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-cream/50">Help</h3>
          <ul className="mt-5 space-y-3">
            {HELP_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-cream/75 transition hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-cream/50">Visit the flagship</h3>
          <address className="mt-5 text-sm not-italic leading-relaxed text-cream/75">
            HT Brothers Fashion
            <br />
            42 Brotherhood Avenue, Level 3<br />
            Dhaka 1205, Bangladesh
            <br />
            <a href="mailto:hello@htbrothers.shop" className="mt-2 block transition hover:text-gold">
              hello@htbrothers.shop
            </a>
            <a href="tel:+8801700000000" className="transition hover:text-gold">
              +880 1700 000 000
            </a>
          </address>
          <p className="mt-4 text-xs text-cream/50">Open daily · 10:00 – 21:00</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} HT Brothers Fashion. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="rounded border border-cream/20 px-2 py-1 font-semibold tracking-wide">VISA</span>
            <span className="rounded border border-cream/20 px-2 py-1 font-semibold tracking-wide">MASTERCARD</span>
            <span className="rounded border border-cream/20 px-2 py-1 font-semibold tracking-wide">AMEX</span>
            <span className="rounded border border-cream/20 px-2 py-1 font-semibold tracking-wide">COD</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
