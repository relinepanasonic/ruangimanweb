"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { locales, localeLabels, type Locale } from "@/i18n/config";

/**
 * Swaps only the first path segment, so you stay on the page you were reading.
 * Route slugs are identical across locales (see lib/site.ts) which is what
 * makes that a safe prefix swap rather than a lookup table.
 */
export default function LangToggle({
  current,
  label,
}: {
  current: Locale;
  label: string;
}) {
  const pathname = usePathname() || `/${current}`;
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div
      aria-label={label}
      className="flex items-center rounded-full border border-brand-light/15 bg-white/5 p-0.5 text-xs font-semibold backdrop-blur-sm"
    >
      {locales.map((locale) => {
        const active = locale === current;
        return (
          <Link
            key={locale}
            href={`/${locale}${rest ? `/${rest}` : ""}`}
            hrefLang={locale}
            aria-current={active ? "true" : undefined}
            className={clsx(
              "rounded-full px-2 py-1 transition-colors duration-200",
              active
                ? "bg-brand-gold text-brand-dark"
                : "text-brand-muted hover:text-brand-light",
            )}
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
