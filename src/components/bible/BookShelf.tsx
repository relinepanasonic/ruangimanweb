"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { bookSlug, type BibleBook } from "@/lib/bible-books";

/**
 * The app's Bible bookshelf, ported (PriskatCFM/src/components/faith/
 * BookListClient.tsx): a horizontal rack of book spines per testament with a
 * wooden shelf edge, the four Gospels haloed in gold, an obi band over the
 * Indonesian covers, and a tap that swings the book open to a cream chapter
 * page. The chapter numbers are real links, so the picker doubles as the
 * crawlable table of contents.
 *
 * Covers live at /images/bible/<folder>/<name_en>.jpeg (copied from the app);
 * a missing file drops to a serif fallback panel rather than a broken image.
 */

const GOSPELS = new Set(["Matthew", "Mark", "Luke", "John"]);

type Labels = {
  contents: string;
  selectChapter: string;
  chaptersShort: string;
  close: string;
};

function BookCard({
  book,
  lang,
  folder,
  isId,
  labels,
  open,
  onToggle,
}: {
  book: BibleBook;
  lang: string;
  folder: "old" | "new" | "deu";
  isId: boolean;
  labels: Labels;
  open: boolean;
  onToggle: () => void;
}) {
  const [broke, setBroke] = useState(false);
  const src = `/images/bible/${folder}/${book.name_en}.jpeg`;
  const isGospel = GOSPELS.has(book.name_en);
  const base = `/${lang}/alkitab/${bookSlug(book)}`;

  return (
    <div className="group relative flex shrink-0 snap-center flex-col items-center">
      {isGospel && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1 z-0 rounded-md bg-brand-gold-hover opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-40 md:-inset-2 md:blur-xl"
        />
      )}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        data-cursor-hover
        className="relative z-10 flex aspect-[2/3] w-[112px] flex-col overflow-hidden rounded-l-[2px] rounded-r-md border-l-4 border-[#8b6b22] bg-brand-surface shadow-[-3px_0_8px_rgba(0,0,0,0.5),5px_5px_10px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-2.5 md:w-[132px]"
      >
        {!broke && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            loading="lazy"
            onError={() => setBroke(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {broke && (
          <span className="absolute inset-0 flex flex-col justify-between bg-gradient-to-br from-[#333742] to-brand-surface p-2 text-left">
            <span className="font-serif text-[9px] uppercase tracking-wider text-brand-gold/80">
              #{book.no}
            </span>
            <span className="my-auto text-center font-serif text-[11px] font-bold leading-tight text-brand-light md:text-sm">
              {isId ? book.name : book.name_en}
            </span>
            <span className="flex items-center justify-between border-t border-white/10 pt-1.5 text-[8px] text-brand-muted">
              {book.chapter} {labels.chaptersShort}
            </span>
          </span>
        )}

        {isId && !broke && (
          <span className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex items-center justify-center border-y border-[#8b6b22]/50 bg-black/80 px-2 py-1.5 backdrop-blur-md">
            <span className="truncate font-serif text-[10px] font-bold tracking-wider text-brand-gold drop-shadow md:text-xs">
              {book.name}
            </span>
          </span>
        )}

        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 z-10 w-1 bg-gradient-to-r from-black/60 to-transparent"
        />
        <span
          aria-hidden="true"
          className="absolute inset-y-0 right-0 z-10 w-px bg-white/20"
        />
      </button>

      {!isId && (
        <span className="z-10 mt-3 w-full truncate px-1 text-center font-serif text-xs font-bold tracking-wide text-brand-light transition-colors group-hover:text-brand-gold md:text-sm">
          {book.name_en}
        </span>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overscroll-none p-2 sm:p-6 md:p-12">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onToggle}
          />
          <button
            type="button"
            onClick={onToggle}
            aria-label={labels.close}
            data-cursor-hover
            className="absolute right-6 top-6 z-[110] grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-brand-gold hover:text-black"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>

          <div className="relative flex aspect-[1.2/1] w-full max-w-4xl shadow-2xl sm:aspect-[1.6/1] md:aspect-[2/1]">
            {/* Left: the cover, dimmed, with the book's name. */}
            <div className="relative flex-1 overflow-hidden rounded-l-md border border-[#222] shadow-[inset_-10px_0_20px_rgba(0,0,0,0.8)]">
              {!broke ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt=""
                  className="absolute inset-0 h-full w-full scale-105 object-cover blur-[2px] brightness-[0.4]"
                />
              ) : (
                <span className="absolute inset-0 bg-gradient-to-br from-brand-surface to-brand-deep" />
              )}
              <span className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/90" />
              <span className="absolute inset-0 m-4 flex flex-col items-center justify-center rounded-sm border-8 border-white/5 p-8 text-center">
                <span className="mb-3 font-serif text-3xl font-bold text-brand-gold drop-shadow-lg md:text-5xl">
                  {book.name}
                </span>
                <span className="font-serif text-lg uppercase tracking-widest text-brand-light/70 md:text-xl">
                  {book.name_en}
                </span>
                <span aria-hidden="true" className="my-6 h-px w-16 bg-brand-gold/50" />
                <span className="max-w-[80%] font-serif text-sm italic text-brand-light/80 md:text-base">
                  {isId
                    ? `Kitab ${book.name} memiliki ${book.chapter} pasal.`
                    : `The book of ${book.name_en} has ${book.chapter} chapters.`}
                </span>
              </span>
            </div>

            {/* Right: the cream contents page with the real chapter links. */}
            <div className="relative flex flex-1 flex-col overflow-hidden rounded-r-md bg-[#f4ebd0] shadow-2xl">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-black/40 to-transparent"
              />
              <div className="custom-scrollbar relative z-20 flex-1 overflow-y-auto overscroll-contain p-6 md:p-10">
                <div className="mb-8 border-b border-[#2a2520]/20 pb-4 text-center">
                  <span className="mb-1 block font-serif text-sm font-bold uppercase tracking-widest text-[#2a2520]/60">
                    {labels.contents}
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#2a2520] md:text-3xl">
                    {labels.selectChapter}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 md:gap-3 lg:grid-cols-7">
                  {Array.from({ length: book.chapter }, (_, i) => i + 1).map((n) => (
                    <Link
                      key={n}
                      href={`${base}/${n}`}
                      data-cursor-hover
                      className="flex aspect-square items-center justify-center rounded-sm border border-[#2a2520]/20 font-serif text-sm font-bold text-[#2a2520] transition-all duration-200 hover:border-[#8b6b22] hover:bg-[#8b6b22] hover:text-white active:scale-95 md:text-lg"
                    >
                      {n}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookShelf({
  title,
  books,
  lang,
  folder,
  isId,
  labels,
}: {
  title: string;
  books: BibleBook[];
  lang: string;
  folder: "old" | "new" | "deu";
  isId: boolean;
  labels: Labels;
}) {
  const [openNo, setOpenNo] = useState<number | null>(null);

  useEffect(() => {
    if (openNo === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openNo]);

  return (
    <section className="mt-14 first:mt-0">
      <h2 className="mb-4 pl-2 text-xl font-bold tracking-wide text-brand-light">
        {title}
      </h2>
      <div className="relative pb-6">
        <div className="hide-scrollbar flex snap-x gap-5 overflow-x-auto px-2 pb-6 pt-2 md:gap-6">
          {books.map((book) => (
            <BookCard
              key={book.no}
              book={book}
              lang={lang}
              folder={folder}
              isId={isId}
              labels={labels}
              open={openNo === book.no}
              onToggle={() =>
                setOpenNo((cur) => (cur === book.no ? null : book.no))
              }
            />
          ))}
        </div>
        {/* The wooden shelf edge. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-[30px] h-4 rounded-sm border-y border-black bg-gradient-to-b from-[#3a3d45] to-brand-surface shadow-[0_5px_15px_rgba(0,0,0,0.6)]"
        />
      </div>
    </section>
  );
}
