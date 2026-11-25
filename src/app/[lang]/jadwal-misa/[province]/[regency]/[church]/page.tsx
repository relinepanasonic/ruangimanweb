import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import CTASection from "@/components/home/CTASection";
import { getDictionary } from "@/i18n/get-dictionary";
import { SITE_URL } from "@/lib/site";
import {
  getChurch,
  getChurchRoutes,
  type MassSlot,
  type SpecialSlot,
} from "@/lib/mass";

export const revalidate = 3600;

type Params = Promise<{
  lang: string;
  province: string;
  regency: string;
  church: string;
}>;

export async function generateStaticParams() {
  const routes = await getChurchRoutes();
  return routes.map((r) => ({
    province: r.province_slug,
    regency: r.regency_slug,
    church: r.slug,
  }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, province, regency, church: churchSlug } = await params;
  const church = await getChurch(province, regency, churchSlug);
  if (!church) return {};

  const title =
    lang === "en"
      ? `Mass Times — ${church.name}, ${church.regency_name}`
      : `Jadwal Misa ${church.name}, ${church.regency_name}`;
  const description =
    lang === "en"
      ? `Mass schedule for ${church.name} in ${church.regency_name}, ${church.province_name}. Daily, Sunday and feast-day Mass times, with address and map.`
      : `Jadwal Misa ${church.name} di ${church.regency_name}, ${church.province_name}. Misa harian, Misa Minggu, dan hari raya, lengkap dengan alamat dan peta.`;

  const path = `/jadwal-misa/${province}/${regency}/${churchSlug}`;
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

function SlotList({ slots }: { slots: (MassSlot | SpecialSlot)[] }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {slots.map((slot, index) => (
        <li
          key={`${slot.title}-${index}`}
          className="glass flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 rounded-2xl px-4 py-3.5"
        >
          <span className="text-[0.9rem] font-semibold text-brand-light">
            {slot.title}
            {"date" in slot && slot.date && (
              <span className="ml-2 text-[0.75rem] font-normal text-brand-muted">
                {slot.date}
              </span>
            )}
          </span>
          <span className="flex flex-wrap gap-1.5">
            {slot.times.map((time) => (
              <span
                key={time}
                className="glass-chip rounded-full px-2.5 py-1 text-[0.72rem] font-semibold tabular-nums text-brand-gold"
              >
                {time}
              </span>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function ChurchPage({ params }: { params: Params }) {
  const { lang, province, regency, church: churchSlug } = await params;
  const dict = getDictionary(lang);
  const page = dict.jadwalMisa;

  const church = await getChurch(province, regency, churchSlug);
  if (!church) notFound();

  const schedules = Array.isArray(church.schedules) ? church.schedules : [];
  const specials = Array.isArray(church.special_schedules)
    ? church.special_schedules
    : [];

  // Rich results for "jadwal misa <gereja>" — Google understands a place with
  // opening hours far better than a table of times.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: church.name,
    url: `${SITE_URL}/${lang}/jadwal-misa/${province}/${regency}/${churchSlug}`,
    ...(church.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: church.address,
            addressLocality: church.regency_name,
            addressRegion: church.province_name,
            addressCountry: "ID",
          },
        }
      : {}),
    ...(church.maps_url ? { hasMap: church.maps_url } : {}),
    event: schedules.flatMap((slot) =>
      slot.times.map((time) => ({
        "@type": "Event",
        name: `${slot.title} — ${time}`,
        eventSchedule: { "@type": "Schedule", startTime: time },
        location: { "@type": "Place", name: church.name },
      })),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        eyebrow={`${page.eyebrow} · ${church.regency_name}`}
        heading={church.name}
      />

      <div className="grain bg-brand-bg px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <Link
            href={`/${lang}/jadwal-misa/${province}`}
            data-cursor-hover
            className="text-[0.7rem] uppercase tracking-[0.16em] text-brand-muted/70 transition-colors hover:text-brand-gold"
          >
            ← {page.backToProvince} {church.province_name}
          </Link>

          {church.address && (
            <section className="mt-10">
              <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-gold">
                {page.address}
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-brand-light/85">
                {church.address}
              </p>
              {church.maps_url && (
                <a
                  href={church.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hover
                  className="mt-3 inline-block text-[0.8rem] font-semibold text-brand-gold transition-colors hover:text-brand-gold-hover"
                >
                  {page.openMaps} →
                </a>
              )}
            </section>
          )}

          {schedules.length > 0 && (
            <section className="mt-12">
              <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-gold">
                {page.regularSchedule}
              </h2>
              <SlotList slots={schedules} />
            </section>
          )}

          {specials.length > 0 && (
            <section className="mt-12">
              <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-gold">
                {page.specialSchedule}
              </h2>
              <SlotList slots={specials} />
            </section>
          )}

          {schedules.length === 0 && specials.length === 0 && (
            <p className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-brand-muted">
              {page.empty}
            </p>
          )}

          {church.synced_at && (
            <p className="mt-12 border-t border-white/10 pt-5 text-[0.7rem] text-brand-muted/60">
              {page.syncedAt}{" "}
              {new Date(church.synced_at).toLocaleDateString(
                lang === "en" ? "en-GB" : "id-ID",
                { day: "numeric", month: "long", year: "numeric" },
              )}
            </p>
          )}
        </div>
      </div>

      <CTASection dict={dict} />
    </>
  );
}
