import Link from "next/link";
import clsx from "clsx";
import { prettifyCategory } from "@/lib/blog";
import type { Locale } from "@/i18n/config";
import { href } from "@/lib/site";

/**
 * Link-based rather than stateful: each filter is a real, crawlable URL, which
 * is the whole reason this blog exists. No client JS needed.
 */
export default function CategoryFilter({
  lang,
  categories,
  active,
  allLabel,
}: {
  lang: Locale;
  categories: string[];
  active?: string;
  allLabel: string;
}) {
  const chip = (label: string, url: string, isActive: boolean) => (
    <li key={url}>
      <Link
        href={url}
        aria-current={isActive ? "page" : undefined}
        className={clsx(
          "inline-block rounded-full border px-4 py-2 text-sm transition-colors duration-300",
          isActive
            ? "border-brand-gold bg-brand-gold text-brand-dark font-semibold"
            : "border-white/12 text-brand-muted hover:border-brand-gold/40 hover:text-brand-light",
        )}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <ul className="flex flex-wrap gap-2.5">
      {chip(allLabel, href(lang, "blog"), !active)}
      {categories.map((category) =>
        chip(
          prettifyCategory(category),
          `${href(lang, "blog")}?kategori=${encodeURIComponent(category)}`,
          active === category,
        ),
      )}
    </ul>
  );
}
