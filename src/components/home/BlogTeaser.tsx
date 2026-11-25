import Link from "next/link";
import Reveal from "../Reveal";
import PostCard from "../PostCard";
import type { BlogListItem } from "@/lib/blog";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { href } from "@/lib/site";

export default function BlogTeaser({
  posts,
  lang,
  dict,
}: {
  posts: BlogListItem[];
  lang: Locale;
  dict: Dictionary;
}) {
  // Nothing published yet (or Supabase isn't wired up locally) — say nothing
  // rather than showing an empty shelf on the home page.
  if (posts.length === 0) return null;

  return (
    <section className="relative bg-brand-dark px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
                {dict.blog.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-6 text-balance text-[clamp(1.9rem,4.6vw,3.25rem)] font-bold leading-[1.06] tracking-[-0.035em] text-brand-light">
                {dict.blog.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-5 text-base leading-relaxed text-brand-muted">
                {dict.blog.sub}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <Link
              href={href(lang, "blog")}
              className="group inline-flex items-center gap-2 text-sm font-medium text-brand-gold transition-colors hover:text-brand-gold-hover"
            >
              {dict.blog.viewAll}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.slug} as="li" delay={0.07 * index} from="up">
              <PostCard post={post} lang={lang} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
