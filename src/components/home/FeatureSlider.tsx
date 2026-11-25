"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FeatureIcon from "../FeatureIcon";
import PhoneMock from "./PhoneMock";
import { APP_URL } from "@/lib/site";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * The features as a horizontal filmstrip dragged sideways by vertical scroll.
 *
 * The section is made tall enough to hold the whole horizontal journey, its
 * stage is pinned with CSS `sticky`, and the track inside is translated by
 * exactly the distance it overflows. Height is set from JS on `refreshInit` —
 * before ScrollTrigger measures anything — because it depends on the track's
 * real rendered width, which depends on the copy, which depends on the locale.
 *
 * The stage is a flex column that fits inside one viewport by construction:
 * header at its natural height, the track taking whatever is left. It used to
 * size the cards independently of the header, which overflowed the stage on
 * short windows — clipping the cards and leaving the pin to release while the
 * track was still moving.
 *
 * Below `lg`, and under reduced motion, none of that happens: the track becomes
 * an ordinary snap-scrolling row, which is what a touch device wants anyway.
 *
 * Media
 * -----
 * Each card layers, back to front: a gold gradient, an optional still
 * (`/features/<slug>.jpg`), an optional film (`/features/<slug>.mp4`), a
 * legibility scrim, then the phone and the copy. Every layer above the gradient
 * is optional, so the section is complete with no media at all and simply gets
 * richer as files land.
 */

/** Distinct grounds so ten cards don't read as ten of the same card. */
const grounds = [
  "radial-gradient(115% 78% at 18% 6%, rgba(214,176,114,0.30), transparent 62%), linear-gradient(158deg,#241d15 0%,#0f1115 70%)",
  "radial-gradient(120% 82% at 82% 10%, rgba(214,176,114,0.20), transparent 64%), linear-gradient(158deg,#1a1f27 0%,#0d0f13 70%)",
  "radial-gradient(110% 75% at 50% 100%, rgba(255,215,112,0.26), transparent 60%), linear-gradient(158deg,#262017 0%,#101216 70%)",
  "radial-gradient(125% 80% at 12% 92%, rgba(214,176,114,0.22), transparent 62%), linear-gradient(158deg,#181c24 0%,#0c0e12 70%)",
  "radial-gradient(110% 72% at 88% 84%, rgba(255,215,112,0.24), transparent 60%), linear-gradient(158deg,#272016 0%,#111317 70%)",
];

export default function FeatureSlider({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  const items = dict.features.items;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!section || !stage || !track) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        // The track's end padding is a real spacer element rather than CSS
        // padding, because scrollWidth famously drops a flex container's
        // trailing padding once its children overflow — which left the travel
        // short and the last card jammed against the edge.
        const travel = () => Math.max(0, track.scrollWidth - stage.clientWidth);

        // A beat of scroll after the section pins where nothing moves sideways
        // yet — the row lands, sits still and is read as a whole, and only then
        // starts travelling. Without it the cards begin sliding the instant the
        // section arrives, which reads as the page snatching them away.
        const hold = () => Math.round(window.innerHeight * 0.34);

        // Must run before ScrollTrigger takes its measurements, or the section
        // would be sized from the previous viewport on every resize. The extra
        // `hold` is what gives the tween its full travel inside a range that
        // now starts later than the pin.
        const sizeSection = () => {
          section.style.height = `${window.innerHeight + travel() + hold()}px`;
        };
        sizeSection();
        ScrollTrigger.addEventListener("refreshInit", sizeSection);

        const ctx = gsap.context(() => {
          gsap.to(track, {
            // A function value is re-read on refresh, so a resize retargets
            // the tween instead of scrubbing to a stale distance.
            x: () => -travel(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              // The stage pins (CSS sticky) when its top hits the viewport top;
              // this starts the horizontal scrub `hold` pixels later.
              start: () => `top top-=${hold()}`,
              end: "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (barRef.current) {
                  barRef.current.style.transform = `scaleX(${Math.max(
                    0.04,
                    self.progress,
                  )})`;
                }
              },
            },
          });
        }, section);

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", sizeSection);
          section.style.height = "";
          ctx.revert();
        };
      },
    );

    // No sound on these cards. A wind bed used to ride the hover here; over ten
    // cards on one pinned screen it just read as noise on top of the ambient
    // loop, so the section is silent by design.

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      id="fitur"
      ref={sectionRef}
      className="relative bg-brand-bg"
      aria-label={dict.features.heading}
    >
      {/* The stage's vertical rhythm is in svh, not px. With fixed margins the
          header kept its full height on a short window and swallowed ~46% of
          the viewport, leaving the card too short to show the phone at all.
          In svh the header shrinks with the window and the card keeps its
          share. */}
      <div
        ref={stageRef}
        className="flex flex-col overflow-hidden py-20 lg:sticky lg:top-0 lg:h-svh lg:py-[3svh]"
      >
        <header className="shrink-0 px-5 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="glass-chip inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-brand-gold">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                {dict.features.eyebrow}
              </p>
              <h2 className="mt-4 text-[clamp(1.6rem,2.8vw,2.9rem)] font-extrabold leading-[1.04] tracking-[-0.035em] text-brand-light lg:mt-[1.6svh]">
                {dict.features.heading}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-brand-muted">
              {dict.features.sub}
            </p>
          </div>

          {/* Progress. Doubles as the affordance that says "this moves". */}
          <div className="mt-5 flex items-center gap-4 lg:mt-[2.2svh]">
            <span className="h-px flex-1 overflow-hidden bg-white/10">
              <span
                ref={barRef}
                className="block h-px origin-left scale-x-[0.04] bg-brand-gold"
              />
            </span>
            <span className="shrink-0 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-brand-muted/70">
              {dict.features.dragHint}
            </span>
          </div>
        </header>

        {/* On lg this is inert and GSAP drives the track; below it, it's an
            ordinary snap-scrolling row. `min-h-0` is what lets the track take
            the leftover height instead of forcing the stage taller. */}
        <div className="mt-7 overflow-x-auto pb-4 lg:mt-[2.2svh] lg:min-h-0 lg:flex-1 lg:overflow-visible lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Card geometry is taken straight off the reference, measured at a
              1418 x 802 viewport: 382 wide, 518 tall, 30 apart. The height is
              expressed as the fraction of the viewport that was — 518/802 —
              so the proportion holds at any window size, with `h-full` as the
              floor so a short window shrinks the card instead of overflowing
              the stage. */}
          <div
            ref={trackRef}
            className="flex h-full snap-x snap-mandatory gap-5 px-5 lg:snap-none lg:items-center lg:gap-[30px] lg:pl-10 lg:pr-0"
          >
            {items.map((item, i) => (
              <article
                key={item.slug}
                // 2:3 portrait. Height leads and width follows from the ratio,
                // rather than both being fixed — so the card stays 2:3 at every
                // window size instead of only where it was measured.
                className="group relative flex aspect-[2/3] w-[min(80vw,416px)] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-white/10 lg:h-full lg:max-h-[84svh] lg:w-auto"
                style={{ backgroundImage: grounds[i % grounds.length] }}
              >
                {/* Optional still. A background-image rather than an <img>:
                    a missing file then renders as nothing at all, where an
                    <img> paints a broken-image glyph — and its onError can't
                    save it, because the 404 lands before React hydrates. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-cover bg-center opacity-60"
                  style={{ backgroundImage: `url(/features/${item.slug}.jpg)` }}
                />

                {/* Optional film over the still. */}
                <video
                  className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity duration-500 group-hover:opacity-85"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster={`/features/${item.slug}.jpg`}
                  aria-hidden="true"
                >
                  <source src={`/features/${item.slug}.mp4`} type="video/mp4" />
                </video>

                {/* Legibility floor for the copy at the bottom. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(6,7,9,0.95) 0%, rgba(6,7,9,0.68) 34%, rgba(6,7,9,0.15) 66%, rgba(6,7,9,0.4) 100%)",
                  }}
                />

                <div className="relative flex h-full flex-col p-5 [@media(max-height:700px)]:p-4">
                  <span className="glass-chip inline-flex shrink-0 items-center gap-1.5 self-start rounded-full py-1 pl-1.5 pr-2.5 text-[0.68rem] font-bold tabular-nums text-brand-light">
                    <span className="relative grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-brand-gold/15 text-brand-gold-hover">
                      <FeatureIcon name={item.icon} className="h-3 w-3" />
                      {/* An animated badge, if one exists, plays over the
                          line icon; nothing here needs it to. */}
                      <video
                        className="absolute inset-0 h-full w-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="none"
                        aria-hidden="true"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                        src={`/features/icons/${item.slug}.mp4`}
                      />
                    </span>
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* The device slot. `data-phone-slot` in globals.css makes
                      this a size container — the phone inside sizes itself off
                      the container's own height (cqh), so it's always shown in
                      full at every card height instead of being cropped on a
                      short window. `[perspective]` is what gives the tilt in
                      PhoneMock actual depth rather than a flat skew. */}
                  <div
                    data-phone-slot
                    className="flex min-h-0 flex-1 items-center justify-center pt-5 [perspective:1200px] [@media(max-height:700px)]:pt-3"
                  >
                    <PhoneMock slug={item.slug} />
                  </div>

                  <div className="relative shrink-0 pt-4 [@media(max-height:700px)]:pt-2">
                    {/* Bottom, right-aligned, one row — no wrap. `overflow-x-
                        auto` with the scrollbar hidden is the fallback if a
                        translation's tags are ever wider than the card;
                        nothing here relies on that path for the current
                        copy. */}
                    <ul className="mb-3 flex flex-nowrap justify-end gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {item.tags.map((tag) => (
                        <li
                          key={tag}
                          className="glass-chip shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.6rem] font-semibold text-brand-light/85"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <h3 className="text-lg font-bold leading-snug tracking-[-0.02em] text-white [@media(max-height:700px)]:text-base">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-[0.82rem] leading-relaxed text-brand-light/70 [@media(max-height:700px)]:mt-1.5 [@media(max-height:700px)]:line-clamp-2 [@media(max-height:700px)]:text-[0.75rem]">
                      {item.body}
                    </p>

                    <a
                      href={APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold [@media(max-height:700px)]:mt-2.5 [@media(max-height:700px)]:h-9 [@media(max-height:700px)]:w-9 text-brand-dark transition-transform duration-300 hover:scale-110"
                      aria-label={`${dict.pages.fitur.tryIt}: ${item.title}`}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            ))}

            {/* Real element, not padding — see `travel()`. */}
            <span aria-hidden="true" className="hidden shrink-0 lg:block lg:w-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
