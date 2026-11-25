import HeroDock from "@/components/home/HeroDock";
import Journey from "@/components/home/Journey";
import FounderStory from "@/components/home/FounderStory";
import FeatureSlider from "@/components/home/FeatureSlider";
import WhatsNew from "@/components/home/WhatsNew";
import IndonesiaMap from "@/components/home/IndonesiaMap";
import VoicesWall from "@/components/home/VoicesWall";
import BlogTeaser from "@/components/home/BlogTeaser";
import CTASection from "@/components/home/CTASection";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { getPublishedPosts } from "@/lib/blog";

// Blog teaser content comes from Supabase; an hour of staleness is fine and
// keeps the home page static for almost every visitor.
export const revalidate = 3600;

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(lang);
  const posts = await getPublishedPosts(3);

  return (
    <>
      <HeroDock lang={locale} dict={dict} />

      {/* Everything past the hero clears the fixed left rail. The rail is
          272px wide, exists only from `lg` up, and stands down entirely under
          prefers-reduced-motion — which is why the offset is undone in CSS
          rather than being unconditional here. */}
      <div data-rail-offset className="lg:pl-[272px]">
        <Journey dict={dict} />
        <div id="cerita">
          <FounderStory lang={locale} dict={dict} />
        </div>
        {/* Carries its own id — the slider owns the section element because it
            sizes it from JS. */}
        <FeatureSlider dict={dict} />
        <WhatsNew dict={dict} />
        <div id="komunitas">
          <IndonesiaMap dict={dict} lang={locale} />
          {/* Straight after the map on purpose: the map is the reach, this is
              what the reach is made of. */}
          <VoicesWall dict={dict} />
        </div>
        <div id="blog">
          <BlogTeaser posts={posts} lang={locale} dict={dict} />
        </div>
        <CTASection dict={dict} />
      </div>
    </>
  );
}
