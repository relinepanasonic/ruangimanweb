import Link from "next/link";
import AppButton from "@/components/AppButton";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { href } from "@/lib/site";

/**
 * In-locale 404 — a missing blog slug, mostly. It renders inside the [lang]
 * layout so the visitor keeps the navbar and footer.
 *
 * `not-found.tsx` can't read route params, so this falls back to Indonesian.
 * That's the right default: it's the primary audience and the default locale.
 */
export default function NotFound() {
  const dict = getDictionary(defaultLocale);

  return (
    <section className="grain relative flex min-h-[70svh] flex-col items-center justify-center gap-7 px-5 py-32 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 55% at 50% 40%, rgba(57,79,107,0.4), transparent 72%)",
        }}
      />
      <p className="font-serif text-7xl italic text-brand-gold/50">404</p>
      <p className="max-w-md text-lg text-brand-muted">{dict.blog.notFound}</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href={href(defaultLocale, "blog")}
          className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-brand-light transition-colors hover:border-brand-gold/50 hover:text-brand-gold"
        >
          {dict.blog.backToBlog}
        </Link>
        <AppButton size="sm">{dict.nav.cta}</AppButton>
      </div>
    </section>
  );
}
