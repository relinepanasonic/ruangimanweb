import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/home/CTASection";
import JadwalSearchHero from "@/components/jadwal/JadwalSearchHero";
import { getDictionary } from "@/i18n/get-dictionary";
import { SITE_URL } from "@/lib/site";
import { getProvinces } from "@/lib/mass";

/** Parish times change rarely; the app re-syncs and this follows within the hour. */
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return {
    title: dict.meta.jadwalMisa.title,
    description: dict.meta.jadwalMisa.description,
    alternates: {
      canonical: `/${lang}/jadwal-misa`,
      languages: {
        id: "/id/jadwal-misa",
        en: "/en/jadwal-misa",
        "x-default": "/id/jadwal-misa",
      },
    },
    openGraph: {
      title: dict.meta.jadwalMisa.title,
      description: dict.meta.jadwalMisa.description,
    },
  };
}

export default async function JadwalMisaIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const page = dict.jadwalMisa;
  const provinces = await getProvinces();
  
  // Need to import getChurches from mass.ts
  const { getChurches } = await import("@/lib/mass");
  const churches = await getChurches();
  const provincesCount = provinces.length;
  const citiesCount = new Set(churches.map((c) => c.regency_slug)).size;
  const churchesCount = churches.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: dict.meta.jadwalMisa.title,
    description: dict.meta.jadwalMisa.description,
    inLanguage: lang === "en" ? "en" : "id",
    url: `${SITE_URL}/${lang}/jadwal-misa`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Search Hero Section (App UI/UX) */}
      <section className="grain relative flex min-h-[85vh] flex-col items-center justify-center bg-brand-bg pt-20">
        <JadwalSearchHero 
          churches={churches}
          provincesCount={provincesCount}
          citiesCount={citiesCount}
          churchesCount={churchesCount}
          lang={lang}
        />
        {/* Fading bottom edge to transition into the list below */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-bg to-transparent" />
      </section>

      {/* Directory / SEO links */}
      <div className="bg-brand-bg px-5 py-12 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-gold text-center sm:text-left">
            {page.findNearby}
          </h2>

          {provinces.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-brand-muted">
              {page.empty}
            </p>
          ) : (
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {provinces.map((province, index) => (
                <Reveal key={province.slug} as="li" delay={Math.min(index, 8) * 0.02}>
                  <Link
                    href={`/${lang}/jadwal-misa/${province.slug}`}
                    data-cursor-hover
                    className="glass flex h-full items-baseline justify-between gap-3 rounded-2xl px-4 py-3.5 transition-colors hover:border-brand-gold/40"
                  >
                    <span className="text-[0.95rem] font-semibold text-brand-light">
                      {province.name}
                    </span>
                    <span className="shrink-0 text-[0.7rem] tabular-nums text-brand-muted">
                      {province.churches} {page.churches}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </div>

      <CTASection dict={dict} />
    </>
  );
}
