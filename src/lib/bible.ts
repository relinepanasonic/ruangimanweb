import { getSupabase } from "./supabase";
import { TB } from "./bible-books";

/**
 * Bible text — Indonesian (Terjemahan Baru) only. The data is the app's
 * (public.bible_verses, schema PriskatCFM/supabase/009_create_bible_verses.sql),
 * bundled into the site per-book (src/data/bible/TB/<book_no>.json, built by
 * scripts/build-bible-data.mjs) so every chapter renders with no database
 * connection. If Supabase is configured it wins — a live table is fresher.
 */
export type Verse = {
  verse: number;
  content: string;
  /** Pericope heading that precedes this verse, when there is one. */
  title: string | null;
};

type BundledVerse = { v: number; t: string; h?: string };
type BundledBook = Record<string, BundledVerse[]>;

async function fromBundle(bookNo: number, chapter: number): Promise<Verse[]> {
  try {
    // One book file per import — the bundler code-splits these, so a chapter
    // page only pulls its own ~50-200KB of JSON, never the whole 5.5MB.
    const mod = (await import(`../data/bible/TB/${bookNo}.json`)) as {
      default: BundledBook;
    };
    const rows = mod.default[String(chapter)] ?? [];
    return rows.map((r) => ({ verse: r.v, content: r.t, title: r.h ?? null }));
  } catch {
    return [];
  }
}

async function fromSupabase(
  bookNo: number,
  chapter: number,
): Promise<Verse[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("bible_verses")
    .select("verse,content,title")
    .eq("book_no", bookNo)
    .eq("chapter", chapter)
    .eq("translation", TB)
    .order("verse", { ascending: true });
  if (error) {
    console.error(`[bible] Supabase ${bookNo}:${chapter} failed:`, error.message);
    return null;
  }
  if (!data || data.length === 0) return null;
  return (data as unknown as Verse[]).map((r) => ({
    verse: r.verse,
    content: r.content,
    title: r.title ?? null,
  }));
}

export async function getChapter(
  bookNo: number,
  chapter: number,
): Promise<Verse[]> {
  return (await fromSupabase(bookNo, chapter)) ?? fromBundle(bookNo, chapter);
}
