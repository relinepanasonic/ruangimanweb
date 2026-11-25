import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import CTASection from "@/components/home/CTASection";
import { getDictionary } from "@/i18n/get-dictionary";
import { getProvince, getProvinces } from "@/lib/mass";

export const revalidate = 3600;

type Params = Promise<{ lang: string; province: string }>;

export async function generateStaticParams() {
  const provinces = await getProvinces();
  return provinces.map((p) => ({ province: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, province: provinceSlug } = await params;
  const province = await getProvince(provinceSlug);
  if (!province) return {};

  const title =
    lang === "en"
      ? `Catholic Mass Schedules in ${province.name}`
      : `Jadwal Misa Katolik di ${province.name}`;
  const description =
    lang === "en"
      ? `Mass times for Catholic churches across ${province.name} — daily Mass, Sunday Mass and feast days, with addresses and maps.`
      : `Jadwal Misa gereja Katolik se-${province.name} — Misa harian, Misa Minggu, dan Misa hari raya, lengkap dengan alamat dan peta.`;

  const path = `/jadwal-misa/${provinceSlug}`;
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: { id: `/id${path}`, en: `/en${path}`, "x-default": `/id${path}` },
    },
    openGraph: { title, description },
  };
}

export default async function ProvincePage({ params }: { params: Params }) {
  const { lang, province: provinceSlug } = await params;
  const dict = getDictionary(lang);
  const page = dict.jadwalMisa;

  const province = await getProvince(provinceSlug);
  if (!province) notFound();

  const heading =
    lang === "en"
      ? `Mass times in ${province.name}`
      : `Jadwal Misa di ${province.name}`;

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} heading={heading} />

      <div className="grain bg-brand-bg px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <Link
            href={`/${lang}/jadwal-misa`}
            data-cursor-hover
            className="text-[0.7rem] uppercase tracking-[0.16em] text-brand-muted/70 transition-colors hover:text-brand-gold"
          >
            ← {page.backToProvinces}
          </Link>

          {province.regencies.map((regency) => (
            <section key={regency.slug} className="mt-12">
              <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-gold">
                {regency.name}
              </h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {regency.churches.map((church) => (
                  <li key={church.slug}>
                    <Link
                      href={`/${lang}/jadwal-misa/${provinceSlug}/${regency.slug}/${church.slug}`}
                      data-cursor-hover
                      className="glass block h-full rounded-2xl px-4 py-3.5 transition-colors hover:border-brand-gold/40"
                    >
                      <span className="block text-[0.95rem] font-semibold text-brand-light">
                        {church.name}
                      </span>
                      {church.address && (
                        <span className="mt-1 block text-[0.75rem] leading-relaxed text-brand-muted">
                          {church.address}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <CTASection dict={dict} />
    </>
  );
}
