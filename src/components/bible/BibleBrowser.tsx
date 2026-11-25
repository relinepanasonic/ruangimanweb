"use client";

import { useState } from "react";
import BookShelf from "./BookShelf";
import {
  OLD_TESTAMENT,
  NEW_TESTAMENT,
  DEUTEROCANONICA,
} from "@/lib/bible-books";

type Labels = {
  searchPlaceholder: string;
  noResults: string;
  oldTestament: string;
  newTestament: string;
  deutero: string;
  contents: string;
  selectChapter: string;
  chaptersShort: string;
  close: string;
};

/**
 * The Bible index the way the app has it: a search box, then New Testament /
 * Old Testament / Deuterocanon each on their own horizontal shelf. Indonesian
 * (Terjemahan Baru) only — search filters every shelf live by book name in
 * either language.
 */
export default function BibleBrowser({
  lang,
  labels,
}: {
  lang: string;
  labels: Labels;
}) {
  const [q, setQ] = useState("");

  // 73 tiny string checks per keystroke — no memo needed.
  const s = q.trim().toLowerCase();
  const keep = (b: { name: string; name_en: string }) =>
    !s ||
    b.name.toLowerCase().includes(s) ||
    b.name_en.toLowerCase().includes(s);

  const nt = NEW_TESTAMENT.filter(keep);
  const ot = OLD_TESTAMENT.filter(keep);
  const dc = DEUTEROCANONICA.filter(keep);
  const isId = lang !== "en";

  const shelfLabels = {
    contents: labels.contents,
    selectChapter: labels.selectChapter,
    chaptersShort: labels.chaptersShort,
    close: labels.close,
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="relative max-w-md">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="m14 14 3.5 3.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="w-full rounded-xl border border-white/10 bg-brand-surface/70 py-3 pl-9 pr-3 text-sm text-brand-light placeholder-brand-muted outline-none transition-colors focus:border-brand-gold/50"
        />
      </div>

      <div className="mt-12 space-y-2">
        {nt.length > 0 && (
          <BookShelf
            title={labels.newTestament}
            books={nt}
            lang={lang}
            folder="new"
            isId={isId}
            labels={shelfLabels}
          />
        )}
        {ot.length > 0 && (
          <BookShelf
            title={labels.oldTestament}
            books={ot}
            lang={lang}
            folder="old"
            isId={isId}
            labels={shelfLabels}
          />
        )}
        {dc.length > 0 && (
          <BookShelf
            title={labels.deutero}
            books={dc}
            lang={lang}
            folder="deu"
            isId={isId}
            labels={shelfLabels}
          />
        )}
        {nt.length === 0 && ot.length === 0 && dc.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-brand-muted">
            {labels.noResults}
          </p>
        )}
      </div>
    </div>
  );
}
