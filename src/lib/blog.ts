import { getSupabase } from "./supabase";

/**
 * Mirrors public.blog_posts in the app's Supabase.
 * Source of truth: PriskatCFM/supabase/071_create_blog_posts.sql
 */
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  meta_description: string;
  cover_image_url: string | null;
  category: string;
  tags: string[];
  author_name: string;
  published_at: string | null;
  updated_at: string | null;
};

export type BlogListItem = Omit<BlogPost, "content">;

const LIST_COLUMNS =
  "slug,title,excerpt,meta_description,cover_image_url,category,tags,author_name,published_at,updated_at";

/**
 * RLS already restricts anonymous reads to published rows, but the explicit
 * `.eq("status","published")` keeps the intent readable and survives any future
 * policy change.
 */
export async function getPublishedPosts(limit?: number): Promise<BlogListItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  let query = supabase
    .from("blog_posts")
    .select(LIST_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("[blog] failed to list posts:", error.message);
    return [];
  }
  return (data ?? []) as unknown as BlogListItem[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("blog_posts")
    .select(`${LIST_COLUMNS},content`)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`[blog] failed to load "${slug}":`, error.message);
    return null;
  }
  return (data as unknown as BlogPost) ?? null;
}

/** Distinct categories across published posts, for the index filter chips. */
export function collectCategories(posts: BlogListItem[]): string[] {
  return [...new Set(posts.map((p) => p.category).filter(Boolean))].sort();
}

/** ~200 words per minute, floored at 1. Good enough for a "5 min read" badge. */
export function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Turns a category slug like "orang-kudus" into "Orang Kudus". */
export function prettifyCategory(category: string): string {
  return category
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatDate(iso: string | null, lang: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(lang === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
