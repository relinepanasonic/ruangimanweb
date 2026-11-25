import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { formatDate, prettifyCategory, type BlogListItem } from "@/lib/blog";
import type { Locale } from "@/i18n/config";
import { href } from "@/lib/site";

export default function PostCard({
  post,
  lang,
  featured = false,
}: {
  post: BlogListItem;
  lang: Locale;
  featured?: boolean;
}) {
  return (
    <Link
      href={href(lang, "blog", `/${post.slug}`)}
      className={clsx(
        "group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-brand-bg",
        "transition-all duration-500 hover:-translate-y-1 hover:border-brand-gold/35",
        "hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.8)]",
        featured && "sm:col-span-2 sm:flex-row",
      )}
    >
      <div
        className={clsx(
          "relative shrink-0 overflow-hidden bg-brand-surface/30",
          featured ? "aspect-[16/10] sm:aspect-auto sm:w-1/2" : "aspect-[16/10]",
        )}
      >
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt=""
            fill
            sizes={featured ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, 33vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          // No cover on the post: fall back to a branded gradient with the
          // category set in it, rather than an empty grey box.
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background:
                "radial-gradient(70% 70% at 30% 20%, rgba(214,176,114,0.22), transparent 70%), linear-gradient(140deg, #2A2E35 0%, #16181C 100%)",
            }}
          >
            <span className="font-serif text-sm italic text-brand-surface-beige/70">
              {prettifyCategory(post.category)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.14em]">
          <span className="rounded-full border border-brand-gold/25 bg-brand-gold/8 px-2.5 py-1 font-semibold text-brand-gold">
            {prettifyCategory(post.category)}
          </span>
          <span className="text-brand-muted">
            {formatDate(post.published_at, lang)}
          </span>
        </div>

        <h3
          className={clsx(
            "mt-4 text-balance font-semibold leading-snug tracking-tight text-brand-light transition-colors duration-300 group-hover:text-brand-gold",
            featured ? "text-2xl sm:text-3xl" : "text-lg",
          )}
        >
          {post.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-brand-muted">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
