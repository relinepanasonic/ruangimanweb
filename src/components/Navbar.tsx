"use client";

import { useEffect, useState } from "react";
import { useScrolled } from "@/lib/use-scrolled";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import AppButton from "./AppButton";
import LangToggle from "./LangToggle";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { href, SITE_NAME } from "@/lib/site";

export default function Navbar({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();
  // The bar starts transparent over the hero and only earns its glass
  // background once you've left it.
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);

  // A fixed-position sheet over a Lenis page still lets the body scroll
  // underneath, so lock it while the sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { label: dict.nav.story, url: href(lang, "story") },
    { label: dict.nav.features, url: href(lang, "features") },
    { label: dict.nav.massTimes, url: href(lang, "massTimes") },
    { label: dict.nav.bible, url: href(lang, "bible") },
    { label: dict.nav.blog, url: href(lang, "blog") },
  ];

  // On the home page the fixed left rail is the navigation from `lg` up, so the
  // top bar stands down there and survives only as the mobile nav.
  const onHome = pathname === href(lang, "home");

  return (
    <header
      data-home-bar={onHome ? "" : undefined}
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        onHome && "lg:hidden",
        scrolled
          ? "border-b border-white/8 bg-brand-bg/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:h-18 sm:px-8">
        <Link
          href={href(lang, "home")}
          className="flex shrink-0 items-center gap-2.5"
        >
          <Image
            src="/logo-mark.png"
            alt=""
            width={36}
            height={36}
            priority
            className="h-8 w-8 rounded-full object-cover ring-1 ring-brand-gold/25 sm:h-9 sm:w-9"
          />
          <span className="text-[0.95rem] font-semibold tracking-tight text-brand-light">
            {SITE_NAME}
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              className={clsx(
                "text-sm font-medium transition-colors duration-200",
                pathname === link.url
                  ? "text-brand-gold"
                  : "text-brand-muted hover:text-brand-light",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LangToggle current={lang} label={dict.nav.switchLang} />
          <div className="hidden sm:block">
            <AppButton size="sm">{dict.nav.cta}</AppButton>
          </div>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? dict.nav.close : dict.nav.menu}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-brand-light md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4.5 w-4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        className={clsx(
          "overflow-hidden border-t border-white/8 bg-brand-bg/95 backdrop-blur-xl transition-[max-height,opacity] duration-400 md:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="flex flex-col gap-1 px-5 py-5">
          {links.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              // Dismiss on tap rather than reacting to the pathname change —
              // an effect that setStates on every navigation is the pattern
              // react-hooks/set-state-in-effect exists to catch.
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-base font-medium text-brand-light transition-colors hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3">
            <AppButton className="w-full">{dict.nav.cta}</AppButton>
          </div>
        </div>
      </div>
    </header>
  );
}
