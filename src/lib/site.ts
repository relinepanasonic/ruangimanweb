import type { Locale } from "@/i18n/config";

/** Every CTA on this site sends people here. Single source of truth. */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://apps.ruangiman.com/";

/** This marketing site's own origin — canonicals, OG tags, sitemap. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "Ruang Iman";
export const FOUNDER = "Nico Japar";
export const COFOUNDER = "Tony Chen";
/** Both names as one credit line: footer, share card, metadata. */
export const FOUNDERS_CREDIT = `${FOUNDER} & ${COFOUNDER}`;

/**
 * Route slugs stay Indonesian in both locales. They're already indexed that
 * way, they read fine to an English speaker, and keeping one set of paths means
 * the language toggle is a pure prefix swap.
 */
export const routes = {
  home: "",
  story: "cerita",
  features: "fitur",
  massTimes: "jadwal-misa",
  bible: "alkitab",
  blog: "blog",
} as const;

export function href(lang: Locale, route: keyof typeof routes, rest = ""): string {
  const segment = routes[route];
  return `/${lang}${segment ? `/${segment}` : ""}${rest}`;
}

/** Static (non-blog) routes, used by the sitemap. */
export const staticRoutes: (keyof typeof routes)[] = [
  "home",
  "story",
  "features",
  "massTimes",
  "bible",
  "blog",
];
