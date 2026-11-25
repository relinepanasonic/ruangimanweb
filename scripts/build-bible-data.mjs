/**
 * Bakes the app's Bible text (public.bible_verses) into per-book JSON the
 * website ships, so every chapter renders with no database connection.
 * Re-run if the app re-seeds the text:
 *
 *   node scripts/build-bible-data.mjs
 *
 * Source: PriskatCFM/supabase/{010,012_part_*,013_part_*,014_part_*,015_part_*}.sql
 * Output: src/data/bible/<translation>/<book_no>.json
 *         { "<chapter>": [ { "v": <verse>, "t": "<text>", "h": "<heading?>" } ] }
 *
 * The app currently only has TB (Terjemahan Baru, Indonesian) seeded; the
 * English editions have no rows yet, and the reader falls back to TB for any
 * chapter an edition is missing.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseInsert } from "./parse-pg-values.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const SUPA = path.resolve(here, "../../PriskatCFM/supabase");
const OUT = path.resolve(here, "../src/data/bible");

const FILES = [
  "010_seed_deuterocanonicals.sql",
  ...["012", "013", "014", "015"].flatMap((n) =>
    [1, 2, 3, 4].map((p) => `${n}_part_${p}.sql`),
  ),
];

/** translation -> book_no -> chapter -> [{v,t,h}] */
const tree = new Map();
let total = 0;

for (const file of FILES) {
  const full = path.join(SUPA, file);
  if (!fs.existsSync(full)) continue;
  const { rows } = parseInsert(fs.readFileSync(full, "utf8"), "bible_verses");
  for (const r of rows) {
    // The app stores the deuterocanonical books under translation 'Deutero',
    // but to a reader they're simply part of the Indonesian (TB) Catholic
    // Bible — fold them in so TB/ has all 73 books.
    const tr = r.translation === "Deutero" ? "TB" : r.translation || "TB";
    const book = Number(r.book_no);
    const ch = Number(r.chapter);
    if (!tree.has(tr)) tree.set(tr, new Map());
    const byBook = tree.get(tr);
    if (!byBook.has(book)) byBook.set(book, new Map());
    const byCh = byBook.get(book);
    if (!byCh.has(ch)) byCh.set(ch, []);
    const entry = { v: Number(r.verse), t: String(r.content) };
    if (r.title) entry.h = String(r.title);
    byCh.get(ch).push(entry);
    total++;
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
let files = 0;
for (const [tr, byBook] of tree) {
  const dir = path.join(OUT, tr);
  fs.mkdirSync(dir, { recursive: true });
  for (const [book, byCh] of byBook) {
    const obj = {};
    for (const [ch, verses] of [...byCh.entries()].sort((a, b) => a[0] - b[0])) {
      obj[ch] = verses.sort((a, b) => a.v - b.v);
    }
    fs.writeFileSync(path.join(dir, `${book}.json`), JSON.stringify(obj));
    files++;
  }
}

const size = (() => {
  let bytes = 0;
  for (const tr of fs.readdirSync(OUT))
    for (const f of fs.readdirSync(path.join(OUT, tr)))
      bytes += fs.statSync(path.join(OUT, tr, f)).size;
  return bytes;
})();

console.log(
  `✓ ${total} verses → ${files} book files across ${[...tree.keys()].join(
    ", ",
  )} (${(size / 1024 / 1024).toFixed(1)} MB) → ${path.relative(process.cwd(), OUT)}`,
);
