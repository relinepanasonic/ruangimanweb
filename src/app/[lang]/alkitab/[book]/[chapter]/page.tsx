import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import CTASection from "@/components/home/CTASection";
import { getDictionary } from "@/i18n/get-dictionary";
import { APP_URL, SITE_URL } from "@/lib/site";
import { getChapter } from "@/lib/bible";
import { ALL_BIBLE_BOOKS, bookSlug, bookLabel, findBookBySlug } from "@/lib/bible-books";

/** Rebuilt daily; the text itself never changes, only the odd correction. */
export const revalidate = 86400;

type Params = Promise<{ lang: string; book: string; chapter: string }>;

/**
 * Every chapter of every book, in both UI locales — ~2,670 static pages. That
 * is the whole SEO point: someone searching "Yohanes 3 16" or "Mazmur 23"
 * lands on a real page, not a JavaScript reader.
 */
export function generateStaticParams() {
  return ALL_BIBLE_BOOKS.flatMap((book) =>
    Array.from({ length: book.chapter }, (_, i) => ({
      book: bookSlug(book),
      chapter: String(i + 1),
    })),
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, book: bookParam, chapter } = await params;
  const book = findBookBySlug(bookParam);
  if (!book) return {};

  const name = bookLabel(book, lang);
  const title =
    lang === "en"
      ? `${name} ${chapter} — Catholic Bible Online (Indonesian)`
      : `${name} ${chapter} — Alkitab Katolik Online`;
  const description =
    lang === "en"
      ? `Read ${name} chapter ${chapter} in full, Indonesian Terjemahan Baru. Free and ad-free.`
      : `Baca ${name} pasal ${chapter} lengkap, Terjemahan Baru. Alkitab Katolik online, gratis dan tanpa iklan.`;

  const path = `/alkitab/${bookParam}/${chapter}`;
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: { id: `/id${path}`, en: `/en${path}`, "x-default": `/id${path}` },
    },
    openGraph: { title, description, type: "article" },
  };
}

export default async function ChapterPage({ params }: { params: Params }) {
  const { lang, book: bookParam, chapter: chapterParam } = await params;
  const dict = getDictionary(lang);
  const page = dict.alkitab;

  const book = findBookBySlug(bookParam);
  const chapter = Number(chapterParam);
  if (!book || !Number.isInteger(chapter) || chapter < 1 || chapter > book.chapter) {
    notFound();
  }

  const verses = await getChapter(book.no, chapter);
  const name = bookLabel(book, lang);
  const slug = bookSlug(book);
  const base = `/${lang}/alkitab/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Chapter",
    name: `${name} ${chapter}`,
    isPartOf: { "@type": "Book", name: dict.meta.alkitab.title },
    inLanguage: "id",
    url: `${SITE_URL}${base}/${chapter}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        eyebrow={`${page.eyebrow} · ${name}`}
        heading={`${name} ${chapter}`}
      />

      <div className="grain bg-brand-bg px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl">
          {/* Every chapter of this book — a crawler can walk the whole thing,
              a reader can jump without going back to the shelf. */}
          <nav aria-label={page.selectChapter} className="mb-12">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-brand-muted/70">
              {page.selectChapter}
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {Array.from({ length: book.chapter }, (_, i) => i + 1).map((n) => (
                <li key={n}>
                  <Link
                    href={`${base}/${n}`}
                    data-cursor-hover
                    aria-current={n === chapter ? "page" : undefined}
                    className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[0.75rem] font-semibold tabular-nums transition-colors ${
                      n === chapter
                        ? "bg-brand-gold text-brand-dark"
                        : "glass-chip text-brand-muted hover:text-brand-gold"
                    }`}
                  >
                    {n}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {verses.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-brand-muted">
              {page.empty}
            </p>
          ) : (
            <div className="space-y-1">
              {verses.map((v) => (
                <div key={v.verse}>
                  {v.title && (
                    <h2 className="mb-3 mt-9 font-serif text-[1.15rem] font-semibold text-brand-gold">
                      {v.title}
                    </h2>
                  )}
                  <p className="font-serif text-[1.08rem] leading-[1.75] text-brand-light/90">
                    <sup className="mr-1.5 align-super text-[0.62rem] font-sans font-bold text-brand-gold/80">
                      {v.verse}
                    </sup>
                    {v.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          <p className="mt-12 border-t border-white/10 pt-6 text-[0.78rem] text-brand-muted">
            {page.englishNote}{" "}
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="font-semibold text-brand-gold transition-colors hover:text-brand-gold-hover"
            >
              {page.englishCta} →
            </a>
          </p>

          <nav className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm">
            {chapter > 1 ? (
              <Link
                href={`${base}/${chapter - 1}`}
                data-cursor-hover
                className="text-brand-muted transition-colors hover:text-brand-gold"
              >
                ← {page.prev}
              </Link>
            ) : (
              <span />
            )}
            <Link
              href={`/${lang}/alkitab`}
              data-cursor-hover
              className="text-[0.7rem] uppercase tracking-[0.16em] text-brand-muted/70 transition-colors hover:text-brand-gold"
            >
              {page.backToBooks}
            </Link>
            {chapter < book.chapter ? (
              <Link
                href={`${base}/${chapter + 1}`}
                data-cursor-hover
                className="text-brand-muted transition-colors hover:text-brand-gold"
              >
                {page.next} →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </div>

      <CTASection dict={dict} />
    </>
  );
}
