import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/home/CTASection";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import FounderAvatar from "@/components/FounderAvatar";
import { FOUNDER, COFOUNDER } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return {
    title: dict.meta.cerita.title,
    description: dict.meta.cerita.description,
    alternates: {
      canonical: `/${lang}/cerita`,
      languages: { id: "/id/cerita", en: "/en/cerita", "x-default": "/id/cerita" },
    },
    openGraph: {
      title: dict.meta.cerita.title,
      description: dict.meta.cerita.description,
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(lang);
  const page = dict.pages.cerita;

  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        heading={page.heading}
        lead={page.lead}
      />

      <article className="bg-brand-bg px-5 pb-28 sm:px-8 sm:pb-36">
        <div className="mx-auto max-w-3xl space-y-20">
          {page.sections.map((section, index) => (
            <section key={section.title}>
              <Reveal>
                <h2 className="flex items-baseline gap-4 text-balance text-[clamp(1.5rem,3.4vw,2.25rem)] font-bold leading-tight tracking-[-0.03em] text-brand-light">
                  <span className="font-serif text-base italic text-brand-gold/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>
              </Reveal>
              <div className="mt-6 space-y-5 pl-0 sm:pl-11">
                {section.body.map((paragraph, pIndex) => (
                  <Reveal key={pIndex} delay={0.06 * pIndex} as="p">
                    <span className="block text-[1.05rem] leading-[1.85] text-brand-muted">
                      {paragraph}
                    </span>
                  </Reveal>
                ))}
              </div>
            </section>
          ))}

          <Reveal from="scale">
            <blockquote className="border-l-2 border-brand-gold pl-6 sm:pl-8">
              <p className="font-serif text-[clamp(1.35rem,3vw,2rem)] italic leading-[1.4] text-brand-surface-beige">
                “{dict.founder.quote}”
              </p>
              <footer className="mt-5 text-sm text-brand-muted">
                — <span className="text-brand-light">{FOUNDER}</span>,{" "}
                {dict.founder.role}
              </footer>
            </blockquote>
          </Reveal>

          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { name: FOUNDER, role: dict.founder.role, photo: "/founder.png" },
                {
                  name: COFOUNDER,
                  role: dict.founder.cofounder.role,
                  photo: "/tony.jpg",
                },
              ].map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-4 rounded-2xl border border-white/8 bg-brand-surface p-5"
                >
                  <FounderAvatar name={p.name} photo={p.photo} size={56} />
                  <div>
                    <p className="font-bold text-brand-light">{p.name}</p>
                    <p className="text-sm text-brand-muted">{p.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              {dict.founder.cofounder.paragraphs.map((p, i) => (
                <p key={i} className="text-[1.05rem] leading-[1.85] text-brand-muted">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </article>

      <CTASection dict={dict} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: page.heading,
            description: dict.meta.cerita.description,
            inLanguage: locale,
            about: [
              { "@type": "Person", name: FOUNDER },
              { "@type": "Person", name: COFOUNDER },
            ],
          }),
        }}
      />
    </>
  );
}
