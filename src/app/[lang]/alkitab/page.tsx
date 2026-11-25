import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import CTASection from "@/components/home/CTASection";
import BibleBrowser from "@/components/bible/BibleBrowser";
import { getDictionary } from "@/i18n/get-dictionary";
import { APP_URL } from "@/lib/site";
import { SITE_URL } from "@/lib/site";
import { ALL_BIBLE_BOOKS, bookSlug, bookLabel } from "@/lib/bible-books";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return {
    title: dict.meta.alkitab.title,
    description: dict.meta.alkitab.description,
    alternates: {
      canonical: `/${lang}/alkitab`,
      languages: { id: "/id/alkitab", en: "/en/alkitab", "x-default": "/id/alkitab" },
    },
    openGraph: {
      title: dict.meta.alkitab.title,
      description: dict.meta.alkitab.description,
    },
  };
}

export default async function AlkitabIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const page = dict.alkitab;

  // Tells Google this is a Book with a table of contents, not a blog.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: dict.meta.alkitab.title,
    description: dict.meta.alkitab.description,
    bookFormat: "https://schema.org/EBook",
    inLanguage: "id",
    url: `${SITE_URL}/${lang}/alkitab`,
    hasPart: ALL_BIBLE_BOOKS.map((book) => ({
      "@type": "Chapter",
      name: bookLabel(book, lang),
      url: `${SITE_URL}/${lang}/alkitab/${bookSlug(book)}/1`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader eyebrow={page.eyebrow} heading={page.heading} lead={page.lead} />

      <div className="grain bg-brand-bg px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          {/* Indonesian-only edition + the pointer to the app for full English. */}
          <div className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.8rem] text-brand-muted">
            <span className="rounded-full border border-brand-gold/25 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-gold/80">
              {page.editionNote}
            </span>
            <span>{page.englishNote}</span>
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="font-semibold text-brand-gold transition-colors hover:text-brand-gold-hover"
            >
              {page.englishCta} →
            </a>
          </div>

          <BibleBrowser
            lang={lang}
            labels={{
              searchPlaceholder: page.searchPlaceholder,
              noResults: page.noResults,
              oldTestament: page.oldTestament,
              newTestament: page.newTestament,
              deutero: page.deutero,
              contents: page.contents,
              selectChapter: page.selectChapter,
              chaptersShort: page.chaptersShort,
              close: page.close,
            }}
          />
        </div>
      </div>

      <CTASection dict={dict} />
    </>
  );
}
