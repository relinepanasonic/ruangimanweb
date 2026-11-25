import Link from "next/link";
import Reveal from "../Reveal";
import FounderAvatar from "../FounderAvatar";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { href } from "@/lib/site";

/**
 * Nico's own voice, set apart from the marketing sections: warmer ground,
 * a narrower measure, and the pull-quote in Georgia italic — the app's serif.
 */
export default function FounderStory({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="grain relative overflow-hidden bg-brand-bg px-5 py-28 sm:px-8 sm:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(48% 42% at 78% 8%, rgba(214,176,114,0.1), transparent 68%)",
        }}
      />

      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
            {dict.founder.eyebrow}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-6 text-balance text-[clamp(1.9rem,4.6vw,3.25rem)] font-bold leading-[1.06] tracking-[-0.035em] text-brand-light">
            {dict.founder.heading}
          </h2>
        </Reveal>

        <div className="mt-10 space-y-6">
          {dict.founder.paragraphs.map((paragraph, index) => (
            <Reveal key={index} delay={0.06 * index} as="p">
              <span className="block text-[1.05rem] leading-[1.85] text-brand-muted">
                {paragraph}
              </span>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} from="scale">
          <blockquote className="mt-14 border-l-2 border-brand-gold pl-6 sm:pl-8">
            <p className="font-serif text-[clamp(1.3rem,3vw,1.9rem)] italic leading-[1.4] text-brand-surface-beige">
              “{dict.founder.quote}”
            </p>
          </blockquote>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-3.5">
              <FounderAvatar name={dict.founder.name} photo="/founder.png" />
              <span>
                <span className="block text-sm font-semibold text-brand-light">
                  {dict.founder.name}
                </span>
                <span className="block text-xs text-brand-muted">
                  {dict.founder.role}
                </span>
              </span>
            </div>

            <Link
              href={href(lang, "story")}
              className="group inline-flex items-center gap-2 text-sm font-medium text-brand-gold transition-colors hover:text-brand-gold-hover"
            >
              {dict.founder.cta}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-20 rounded-3xl border border-brand-gold/20 bg-brand-surface/60 p-6 sm:p-9">
            <div className="flex items-center gap-4">
              <FounderAvatar
                name={dict.founder.cofounder.name}
                photo="/tony.jpg"
                size={56}
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
                  {dict.founder.cofounder.eyebrow}
                </p>
                <p className="mt-1 text-lg font-bold text-brand-light">
                  {dict.founder.cofounder.name}
                </p>
              </div>
            </div>
            <h3 className="mt-6 text-balance text-[clamp(1.4rem,3vw,2rem)] font-bold leading-tight tracking-[-0.03em] text-brand-light">
              {dict.founder.cofounder.heading}
            </h3>
            <div className="mt-5 space-y-4">
              {dict.founder.cofounder.paragraphs.map((p, i) => (
                <p key={i} className="text-[1.05rem] leading-[1.85] text-brand-muted">
                  {p}
                </p>
              ))}
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {dict.founder.cofounder.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-brand-gold/25 bg-brand-gold/8 px-3 py-1 text-xs font-semibold text-brand-gold"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
