import Link from "next/link";
import Image from "next/image";
import AppButton from "./AppButton";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { href, SITE_NAME, FOUNDERS_CREDIT } from "@/lib/site";

export default function Footer({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const links = [
    { label: dict.nav.home, url: href(lang, "home") },
    { label: dict.nav.story, url: href(lang, "story") },
    { label: dict.nav.features, url: href(lang, "features") },
    { label: dict.nav.massTimes, url: href(lang, "massTimes") },
    { label: dict.nav.bible, url: href(lang, "bible") },
    { label: dict.nav.blog, url: href(lang, "blog") },
  ];

  return (
    <footer className="grain relative border-t border-white/8 bg-brand-deep">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-mark.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-brand-gold/25"
            />
            <span className="text-lg font-semibold tracking-tight text-brand-light">
              {SITE_NAME}
            </span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-muted">
            {dict.footer.tagline}
          </p>
        </div>

        <nav aria-label={dict.footer.explore}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
            {dict.footer.explore}
          </h2>
          <ul className="mt-5 space-y-3">
            {links.map((link) => (
              <li key={link.url}>
                <Link
                  href={link.url}
                  className="text-sm text-brand-muted transition-colors hover:text-brand-light"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
            {dict.footer.app}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-brand-muted">
            {dict.cta.sub}
          </p>
          <div className="mt-5">
            <AppButton size="sm">{dict.footer.openApp}</AppButton>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-white/8 px-5 py-7 text-xs text-brand-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {SITE_NAME}. {dict.footer.rights}
        </p>
        <p>
          {dict.footer.madeBy}{" "}
          <span className="text-brand-light">{FOUNDERS_CREDIT}</span>
        </p>
      </div>

      {/* CC BY-SA 3.0 requires attribution for the Indonesia coastline traced
          in home/indonesia-path.ts — moved here from under the map itself so
          that section stays clean, not removed, since the license doesn't
          allow removing it outright. */}
      <p className="mx-auto max-w-6xl px-5 pb-6 text-[0.65rem] text-brand-muted/40 sm:px-8">
        Peta Indonesia:{" "}
        <a
          href="https://commons.wikimedia.org/wiki/File:Indonesia_blank_map_colored.svg"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="underline decoration-dotted hover:text-brand-muted"
        >
          Wikimedia Commons
        </a>
        , CC BY-SA 3.0
      </p>
    </footer>
  );
}
