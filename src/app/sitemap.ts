import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { routes, staticRoutes, SITE_URL } from "@/lib/site";
import { getPublishedPosts } from "@/lib/blog";
import { ALL_BIBLE_BOOKS, bookSlug } from "@/lib/bible-books";
import { getProvinces, getChurchRoutes } from "@/lib/mass";

// Refreshed on the same cadence as the blog itself, so a post published today
// is in the sitemap within the hour.
export const revalidate = 3600;

type Frequency = "daily" | "weekly" | "monthly";

/**
 * `suffix` is the path AFTER the locale segment ("", "blog", "blog/some-slug").
 * One entry is emitted per locale, each listing every locale in
 * `alternates.languages` so Google reads /id and /en as translations of the
 * same page rather than duplicate content.
 */
function entries(
  suffix: string,
  lastModified: Date,
  priority: number,
  changeFrequency: Frequency,
): MetadataRoute.Sitemap {
  const path = (locale: string) => `${SITE_URL}/${locale}${suffix ? `/${suffix}` : ""}`;
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, path(locale)]),
  );

  return locales.map((locale) => ({
    url: path(locale),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const now = new Date();

  const pages = staticRoutes.flatMap((route) =>
    entries(
      routes[route],
      now,
      route === "home" ? 1 : 0.8,
      route === "blog" ? "daily" : "monthly",
    ),
  );

  const postPages = posts.flatMap((post) =>
    entries(
      `blog/${post.slug}`,
      new Date(post.updated_at ?? post.published_at ?? now),
      0.6,
      "weekly",
    ),
  );

  // Every chapter of every book (Indonesian, Terjemahan Baru) — ~1,330 URLs
  // per locale. These answer "Yohanes 3 16" or "Mazmur 23" and are the single
  // biggest indexable surface on the site.
  const biblePages = ALL_BIBLE_BOOKS.flatMap((book) =>
    Array.from({ length: book.chapter }, (_, i) =>
      entries(`alkitab/${bookSlug(book)}/${i + 1}`, now, 0.5, "monthly"),
    ).flat(),
  );

  // Mass schedules are the other long-tail: "jadwal misa <kota>", "jadwal misa
  // <gereja>". Both come from the app's Supabase and degrade to nothing when it
  // is unreachable, which is exactly what we want in a sitemap.
  const [provinces, churches] = await Promise.all([
    getProvinces(),
    getChurchRoutes(),
  ]);

  const provincePages = provinces.flatMap((province) =>
    entries(`jadwal-misa/${province.slug}`, now, 0.7, "weekly"),
  );

  const churchPages = churches.flatMap((church) =>
    entries(
      `jadwal-misa/${church.province_slug}/${church.regency_slug}/${church.slug}`,
      now,
      0.6,
      "weekly",
    ),
  );

  return [
    ...pages,
    ...postPages,
    ...provincePages,
    ...churchPages,
    ...biblePages,
  ];
}
