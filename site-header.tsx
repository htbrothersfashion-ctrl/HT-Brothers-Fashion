"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./cart-provider";
import { IconBag, IconMenu, IconSearch, IconUser, IconX } from "./icons";

const NAV_LINKS = [
  { label: "New In", href: "/shop?sort=newest" },
  { label: "Shop All", href: "/shop" },
  { label: "T-Shirts", href: "/shop?category=t-shirts" },
  { label: "Hoodies", href: "/shop?category=hoodies" },
  { label: "Pants", href: "/shop?category=pants" },
  { label: "Shirts", href: "/shop?category=shirts" },
  { label: "Jackets", href: "/shop?category=jackets" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, hydrated, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Transparent over the dark home hero until scrolled; solid elsewhere.
  const transparent = pathname === "/" && !scrolled && !menuOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Announcement bar */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          scrolled ? "max-h-0" : "max-h-10"
        } bg-ink text-cream`}
      >
        <p className="flex h-9 items-center justify-center px-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] md:text-xs">
          Free shipping over $75 &nbsp;·&nbsp; New Season Drop 04 is live &nbsp;·&nbsp; Code
          <span className="ml-1 text-gold">BROTHER10</span> for 10% off
        </p>
      </div>

      {/* Nav bar */}
      <div
        className={`transition-all duration-300 ${
          transparent
            ? "border-b border-white/10 bg-transparent text-cream"
            : "border-b border-line bg-cream/90 text-ink backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          {/* Mobile menu button */}
          <button
            className="rounded-full p-2 transition hover:bg-white/10 lg:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <IconMenu />
          </button>

          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-lg border font-display text-sm font-bold tracking-tight transition ${
                transparent
                  ? "border-cream/70 bg-cream/10 text-cream group-hover:bg-cream group-hover:text-ink"
                  : "border-ink bg-ink text-cream group-hover:bg-clay group-hover:border-clay"
              }`}
            >
              HT
            </span>
            <span className="leading-none">
              <span className="block font-display text-lg font-bold tracking-tight">HT BROTHERS</span>
              <span className={`block text-[10px] font-semibold uppercase tracking-[0.3em] ${transparent ? "text-cream/70" : "text-ink-soft"}`}>
                Fashion
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active = link.href === "/shop" ? pathname === "/shop" && !link.href.includes("?") : false;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`rounded-full px-3.5 py-2 text-[13px] font-semibold transition hover:bg-clay hover:text-cream ${
                    active ? "text-clay" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link
              href="/shop"
              aria-label="Search the shop"
              className="rounded-full p-2.5 transition hover:bg-clay hover:text-cream"
            >
              <IconSearch />
            </Link>
            <span className="hidden rounded-full p-2.5 opacity-40 sm:block" aria-hidden>
              <IconUser />
            </span>
            <button
              onClick={openCart}
              aria-label={`Open cart, ${count} items`}
              className="relative rounded-full p-2.5 transition hover:bg-clay hover:text-cream"
            >
              <IconBag />
              {hydrated && count > 0 && (
                <span className="animate-pop absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-[11px] font-bold text-cream">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 top-[100px] z-30 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <nav
          className={`absolute inset-x-0 top-0 flex flex-col gap-1 bg-cream p-6 shadow-xl transition-transform duration-300 ${
            menuOpen ? "translate-y-0" : "-translate-y-4"
          }`}
          aria-label="Mobile"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-display text-xl font-bold">Menu</span>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="rounded-full p-2 hover:bg-sand">
              <IconX />
            </button>
          </div>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-xl px-4 py-3 font-display text-2xl font-semibold transition hover:bg-sand hover:text-clay"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/shop?category=shorts"
            className="rounded-xl px-4 py-3 font-display text-2xl font-semibold transition hover:bg-sand hover:text-clay"
          >
            Shorts
          </Link>
        </nav>
      </div>
    </header>
  );
}
