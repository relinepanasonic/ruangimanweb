import Link from "next/link";
import "./globals.css";
import { defaultLocale } from "@/i18n/config";

/**
 * The root layout lives at app/[lang]/layout.tsx, so nothing wraps this file —
 * it has to render its own <html>/<body>. Reached only for paths outside any
 * locale (an unknown /xx/... prefix); in-locale 404s use [lang]/not-found.tsx.
 */
export default function GlobalNotFound() {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col items-center justify-center gap-6 bg-brand-bg px-6 text-center antialiased">
        <p className="font-serif text-6xl italic text-brand-gold/60">404</p>
        <p className="max-w-sm text-brand-muted">
          Halaman ini tidak ada. / This page doesn&apos;t exist.
        </p>
        <Link
          href={`/${defaultLocale}`}
          className="rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-dark"
        >
          Kembali ke beranda
        </Link>
      </body>
    </html>
  );
}
