import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

/**
 * Next.js 16 renamed `middleware.ts` to `proxy.ts` — same behaviour, new name.
 * See node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 *
 * Every route lives under /[lang]. Anything arriving without a locale prefix
 * gets redirected to one, picked from Accept-Language and falling back to `id`.
 */

/**
 * Minimal Accept-Language negotiation — enough for two locales, and avoids
 * pulling `negotiator` + `intl-localematcher` into an edge bundle.
 * Indonesian wins ties: it's the default and the primary audience.
 */
function pickLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return {
        base: tag.trim().toLowerCase().split("-")[0],
        q: q ? Number.parseFloat(q.split("=")[1]) || 0 : 1,
      };
    })
    .sort((a, b) => b.q - a.q);

  const hit = ranked.find((entry) =>
    (locales as readonly string[]).includes(entry.base),
  );
  return hit?.base ?? defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${pickLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, metadata routes, and anything with a file extension
  // (public/ assets) — otherwise /logo.png would redirect to /id/logo.png.
  matcher: ["/((?!_next|api|.*\\.[\\w]+$|robots\\.txt|sitemap\\.xml).*)"],
};
