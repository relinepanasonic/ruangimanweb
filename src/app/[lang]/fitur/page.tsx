import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import FeatureIcon from "@/components/FeatureIcon";
import AppButton from "@/components/AppButton";
import WhatsNew from "@/components/home/WhatsNew";
import CTASection from "@/components/home/CTASection";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return {
    title: dict.meta.fitur.title,
    description: dict.meta.fitur.description,
    alternates: {
      canonical: `/${lang}/fitur`,
      languages: { id: "/id/fitur", en: "/en/fitur", "x-default": "/id/fitur" },
    },
    openGraph: {
      title: dict.meta.fitur.title,
      description: dict.meta.fitur.description,
    },
  };
}

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const page = dict.pages.fitur;

  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        heading={page.heading}
        lead={page.lead}
      />

      <section className="bg-brand-bg px-5 pb-28 sm:px-8 sm:pb-36">
        <div className="mx-auto max-w-4xl">
          {dict.features.items.map((item, index) => (
            <Reveal
              key={item.title}
              as="article"
              from={index % 2 === 0 ? "left" : "right"}
              className="grid items-start gap-6 border-b border-white/8 py-12 sm:grid-cols-[auto_1fr] sm:gap-10 sm:py-16"
            >
              <div className="flex items-center gap-5 sm:block">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand-gold/25 bg-brand-gold/10 text-brand-gold">
                  <FeatureIcon name={item.icon} className="h-7 w-7" />
                </span>
                <span className="font-serif text-sm italic text-brand-gold/60 sm:mt-4 sm:block sm:text-center">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div>
                <h2 className="text-balance text-[clamp(1.5rem,3.4vw,2.1rem)] font-bold leading-tight tracking-[-0.03em] text-brand-light">
                  {item.title}
                </h2>
                <p className="mt-4 max-w-2xl text-[1.05rem] leading-[1.8] text-brand-muted">
                  {item.body}
                </p>
                <div className="mt-6">
                  <AppButton variant="ghost" size="sm">
                    {page.tryIt}
                  </AppButton>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <WhatsNew dict={dict} />

      <CTASection dict={dict} />
    </>
  );
}
