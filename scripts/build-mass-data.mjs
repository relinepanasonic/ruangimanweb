/**
 * Bakes the app's Mass-schedule seed into a static JSON the website ships, so
 * /jadwal-misa works with no database connection. Re-run whenever the app
 * re-syncs jadwalmisa.id:
 *
 *   node scripts/build-mass-data.mjs
 *
 * Source of truth: PriskatCFM/supabase/069_seed_mass_churches.sql
 * (schema: 068_mass_schedules.sql). Output: src/data/mass-churches.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseInsert } from "./parse-pg-values.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const SEED = path.resolve(
  here,
  "../../PriskatCFM/supabase/069_seed_mass_churches.sql",
);
const OUT = path.resolve(here, "../src/data/mass-churches.json");

if (!fs.existsSync(SEED)) {
  console.error(`✗ seed not found: ${SEED}`);
  process.exit(1);
}

const { rows } = parseInsert(fs.readFileSync(SEED, "utf8"), "mass_churches");

const churches = rows
  .map((r) => ({
    id: r.id,
    name: String(r.name).trim(),
    slug: r.slug,
    address: r.address ?? null,
    maps_url: r.maps_url ?? null,
    province_slug: r.province_slug,
    province_name: r.province_name,
    regency_slug: r.regency_slug,
    regency_name: r.regency_name,
    schedules: Array.isArray(r.schedules) ? r.schedules : [],
    special_schedules: Array.isArray(r.special_schedules)
      ? r.special_schedules
      : [],
    synced_at: r.synced_at ?? null,
  }))
  .sort(
    (a, b) =>
      a.province_name.localeCompare(b.province_name, "id") ||
      a.regency_name.localeCompare(b.regency_name, "id") ||
      a.name.localeCompare(b.name, "id"),
  );

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(churches));

const provinces = new Set(churches.map((c) => c.province_slug));
console.log(
  `✓ ${churches.length} churches across ${provinces.size} provinces → ${path.relative(
    process.cwd(),
    OUT,
  )} (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`,
);
