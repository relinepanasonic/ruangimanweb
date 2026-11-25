import FeatureIcon from "../FeatureIcon";
import Reveal from "../Reveal";
import AppButton from "../AppButton";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * "What's new": the features added after the first ten. Four get a real app
 * screenshot in a phone frame (alternating sides), the rest are compact cards.
 *
 * Screenshots are captured from the app (see `public/whats-new/`), never
 * generated — same rule as the feature slider.
 */
export default function WhatsNew({ dict }: { dict: Dictionary }) {
  const w = dict.whatsNew;

  return (
    <section
      id="baru"
      className="bg-brand-bg px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-gold">
            {w.eyebrow}
          </p>
          <h2 className="mt-4 text-balance text-[clamp(2rem,5vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-brand-light">
            {w.heading}
          </h2>
          <p className="mt-5 text-[1.05rem] leading-[1.8] text-brand-muted">
            {w.sub}
          </p>
        </Reveal>

        <div className="mt-16 space-y-20 sm:mt-24 sm:space-y-28">
          {w.showcase.map((item, i) => (
            <Reveal
              key={item.title}
              as="article"
              from={i % 2 === 0 ? "left" : "right"}
              className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
            >
              <div
                className={`flex justify-center ${i % 2 === 1 ? "md:order-2" : ""}`}
              >
                <div
                  className="relative w-[min(78vw,280px)] rounded-[2.6rem] p-[9px]"
                  style={{
                    background:
                      "linear-gradient(150deg,#3a3f47 0%,#14161a 42%,#25292f 100%)",
                    boxShadow:
                      "0 40px 80px -24px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.16), 0 0 90px -30px rgba(214,176,114,0.35)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/whats-new/${item.shot}`}
                    alt={item.title}
                    width={720}
                    height={1280}
                    loading="lazy"
                    className="block aspect-[9/16] w-full rounded-[2rem] bg-brand-dark object-cover object-top"
                  />
                </div>
              </div>

              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-gold/25 bg-brand-gold/10 text-brand-gold">
                  <FeatureIcon name={item.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-balance text-[clamp(1.6rem,3.4vw,2.3rem)] font-bold leading-tight tracking-[-0.03em] text-brand-light">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-xl text-[1.05rem] leading-[1.8] text-brand-muted">
                  {item.body}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-brand-gold/25 bg-brand-gold/8 px-3 py-1 text-xs font-semibold text-brand-gold"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <AppButton variant="ghost" size="sm">
                    {w.cta}
                  </AppButton>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Step-by-step features: how a community goes live, and how an event
            sells and checks in tickets. No screenshots, just the process. */}
        <div className="mt-24 space-y-8 sm:mt-32">
          {w.flows.map((flow) => (
            <Reveal
              key={flow.title}
              as="article"
              className="rounded-3xl border border-brand-gold/20 bg-brand-surface/60 p-6 sm:p-10"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-gold/25 bg-brand-gold/10 text-brand-gold">
                  <FeatureIcon name={flow.icon} className="h-6 w-6" />
                </span>
                <h3 className="text-balance text-[clamp(1.4rem,3vw,2rem)] font-bold leading-tight tracking-[-0.03em] text-brand-light">
                  {flow.title}
                </h3>
              </div>
              <p className="mt-4 max-w-2xl text-[1.05rem] leading-[1.8] text-brand-muted">
                {flow.intro}
              </p>
              <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {flow.steps.map((step, i) => (
                  <li
                    key={step.title}
                    className="rounded-2xl border border-white/8 bg-brand-bg/60 p-5"
                  >
                    <span className="font-serif text-sm italic text-brand-gold/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h4 className="mt-2 text-base font-bold text-brand-light">
                      {step.title}
                    </h4>
                    <p className="mt-2 text-[0.92rem] leading-[1.65] text-brand-muted">
                      {step.body}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>
          ))}
        </div>

        <ul className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {w.more.map((item, i) => (
            <Reveal
              key={item.title}
              as="li"
              delay={(i % 3) * 0.06}
              className="rounded-3xl border border-white/8 bg-brand-surface p-6 transition-colors hover:border-brand-gold/30 hover:bg-brand-surface-hover"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-gold/25 bg-brand-gold/10 text-brand-gold">
                  <FeatureIcon name={item.icon} className="h-5 w-5" />
                </span>
                {(item as { soon?: boolean }).soon && (
                  <span className="rounded-full bg-brand-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-dark">
                    {w.soon}
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-lg font-bold tracking-[-0.02em] text-brand-light">
                {item.title}
              </h3>
              <p className="mt-2 text-[0.95rem] leading-[1.7] text-brand-muted">
                {item.body}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
