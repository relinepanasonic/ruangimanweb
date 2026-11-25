import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import PostCard from "@/components/PostCard";
import CTASection from "@/components/home/CTASection";
import CategoryFilter from "./CategoryFilter";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { getPublishedPosts, collectCategories } from "@/lib/blog";
import { isSupabaseConfigured } from "@/lib/supabase";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return {
    title: dict.meta.blog.title,
    description: dict.meta.blog.description,
    alternates: {
      canonical: `/${lang}/blog`,
      languages: { id: "/id/blog", en: "/en/blog", "x-default": "/id/blog" },
    },
    openGraph: {
      title: dict.meta.blog.title,
      description: dict.meta.blog.description,
    },
  };
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { lang } = await params;
  const { kategori } = await searchParams;
  const locale = lang as Locale;
  const dict = getDictionary(lang);
  const page = dict.pages.blog;

  const allPosts = await getPublishedPosts();
  const categories = collectCategories(allPosts);
  const posts = kategori
    ? allPosts.filter((post) => post.category === kategori)
    : allPosts;

  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        heading={page.heading}
        lead={page.lead}
      />

      <section className="bg-brand-bg px-5 pb-28 sm:px-8 sm:pb-36">
        <div className="mx-auto max-w-6xl">
          {categories.length > 1 && (
            <CategoryFilter
              lang={locale}
              categories={categories}
              active={kategori}
              allLabel={dict.blog.allCategories}
            />
          )}

          {posts.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/12 px-6 py-20 text-center text-brand-muted">
              {isSupabaseConfigured ? dict.blog.empty : dict.blog.emptyConfig}
            </p>
          ) : (
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <Reveal key={post.slug} as="li" delay={0.05 * (index % 3)}>
                  <PostCard post={post} lang={locale} />
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </section>

      <CTASection dict={dict} />
    </>
  );
}
