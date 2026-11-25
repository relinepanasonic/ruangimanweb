"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AppButton from "../AppButton";
import SidebarIcon from "../SidebarIcon";
import LangToggle from "../LangToggle";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { href, FOUNDERS_CREDIT } from "@/lib/site";

/**
 * The first screen and the left rail are one component, because the whole
 * effect is the transition BETWEEN them: the giant wordmark shrinks into the
 * rail's logo slot, and the navigation that starts as a horizontal row under
 * the wordmark folds down into a vertical stack.
 *
 * How the flight works
 * --------------------
 * Every element that moves is rendered ONCE, at its *docked* position, inside
 * the fixed rail. Its hero position is described by a matching "ghost" — an
 * invisible copy laid out inside the hero stage that exists only to be
 * measured. On mount we measure both, set the real element's transform to the
 * delta so it *appears* to be in the hero, then scrub that transform back to
 * zero. One set of real nodes, genuinely continuous motion, no DOM surgery and
 * nothing for React to fight over.
 *
 * The wordmark runs the other way — real (giant) in the stage, ghost (small) in
 * the rail — because scaling type DOWN stays crisp and scaling it up does not.
 * It hands off to the rail's static logo in the last few percent of the scrub.
 *
 * Everything is wrapped in `gsap.matchMedia`, so on mobile or under
 * prefers-reduced-motion no transform is ever written and both the hero and the
 * rail render at rest.
 */

type Flight = {
  real: HTMLElement;
  ghost: HTMLElement;
  /** true when the element starts in the hero and flies INTO the rail. */
  fromHero?: boolean;
  scale?: boolean;
  dx: number;
  dy: number;
  ds: number;
};

export default function HeroDock({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [portraitFailed, setPortraitFailed] = useState(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const section = sectionRef.current;
    if (!root || !section) return;

    // Lets the layout's footer clear the rail — see globals.css. The page's own
    // sections pad themselves, but the footer renders outside this route.
    document.body.classList.add("has-rail");

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const pick = <T extends Element = HTMLElement>(sel: string) =>
          Array.from(root.querySelectorAll(sel)) as unknown as T[];

        // Pair each real element with the ghost that describes where it sits
        // during the hero. data-flight / data-ghost values are the join key.
        const flights: Flight[] = [];
        for (const real of pick<HTMLElement>("[data-flight]")) {
          const key = real.dataset.flight;
          const ghost = root.querySelector<HTMLElement>(
            `[data-ghost="${key}"]`,
          );
          if (!ghost) continue;
          flights.push({
            real,
            ghost,
            fromHero: real.dataset.flightFrom === "hero",
            scale: real.dataset.flightScale === "true",
            dx: 0,
            dy: 0,
            ds: 1,
          });
        }

        // Measure from a clean slate: any transform left over from a previous
        // refresh would be baked into the next delta.
        const measure = () => {
          for (const f of flights) {
            gsap.set(f.real, { x: 0, y: 0, scale: 1 });
            const r = f.real.getBoundingClientRect();
            const g = f.ghost.getBoundingClientRect();
            f.ds = f.scale && r.width ? g.width / r.width : 1;
            f.dx = g.left - r.left;
            f.dy = g.top - r.top;
          }
        };
        measure();

        const ctx = gsap.context(() => {
          for (const f of flights) {
            // transformOrigin has to be the top-left corner or the scale would
            // pull the element away from the corner we just aligned.
            gsap.set(f.real, { transformOrigin: "0 0" });
            if (!f.fromHero) gsap.set(f.real, { x: f.dx, y: f.dy, scale: f.ds });
          }

          // Hide the rail's own chrome up front rather than relying on a
          // fromTo's immediateRender inside a scrubbed timeline — that leaves
          // the panels painted for the first frames.
          gsap.set(pick("[data-dock-panel]"), { opacity: 0 });
          gsap.set(pick("[data-dock-only]"), { opacity: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.55,
              invalidateOnRefresh: true,
            },
          });

          flights.forEach((f, i) => {
            tl.to(
              f.real,
              f.fromHero
                ? { x: f.dx, y: f.dy, scale: f.ds, ease: "power2.inOut" }
                : { x: 0, y: 0, scale: 1, ease: "power2.inOut" },
              i * 0.01,
            );
          });

          // The rail's panels are invisible while their contents are still out
          // in the hero, then wash in underneath them.
          tl.to(
            pick("[data-dock-panel]"),
            { opacity: 1, ease: "none", stagger: 0.03 },
            0.35,
          )
            .to(pick("[data-dock-only]"), { opacity: 1, ease: "none" }, 0.45)
            // The hero-only chrome on each flying chip (the card behind a stat)
            // has to leave as the rail's own card arrives.
            .to(pick("[data-hero-only]"), { opacity: 0, ease: "none" }, 0.2)
            .to(
              pick("[data-hero-fade]"),
              { opacity: 0, y: -34, ease: "none", stagger: 0.04 },
              0,
            )
            .to(
              "[data-portrait]",
              {
                filter: "blur(26px)",
                opacity: 0.22,
                scale: 1.07,
                ease: "none",
              },
              0,
            )
            // Hand the shrunken wordmark over to the rail's static logo. Late
            // and quick, so the swap lands while the two are the same size.
            .to("[data-wordmark]", { opacity: 0, duration: 0.06 }, 0.92)
            .fromTo(
              "[data-rail-logo]",
              { opacity: 0 },
              { opacity: 1, duration: 0.06 },
              0.94,
            );
        }, root);

        // A resize changes both layouts, so both deltas have to be retaken.
        const onRefresh = () => {
          measure();
          for (const f of flights) {
            if (!f.fromHero) gsap.set(f.real, { x: f.dx, y: f.dy, scale: f.ds });
          }
        };
        ScrollTrigger.addEventListener("refreshInit", onRefresh);

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", onRefresh);
          ctx.revert();
        };
      },
    );

    return () => {
      document.body.classList.remove("has-rail");
      mm.revert();
    };
  }, []);

  const nav = dict.sidebar.nav;
  const wordmark = dict.hero.wordmark;
  const routeLinks = [
    { route: "bible", label: dict.nav.bible, icon: "book" },
    { route: "massTimes", label: dict.nav.massTimes, icon: "calendar" },
  ] as const;

  return (
    <div ref={rootRef}>
      {/* ============================= THE RAIL =============================
          Fixed, and present from the very first frame — but everything in it
          is either transformed out into the hero or faded to zero, so nothing
          of it is legible until the scrub brings it home. */}
      <aside
        data-home-rail
        className="pointer-events-none fixed inset-y-0 left-0 z-40 hidden w-[272px] flex-col gap-3 p-4 lg:flex"
      >
        {/* Logo + tagline */}
        <div className="relative rounded-2xl">
          <div
            data-dock-panel
            className="glass absolute inset-0 rounded-2xl"
          />
          <div className="relative p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-1.5">
                {/* The actual app mark. Static — it doesn't fly, it's just
                    there from the first frame, the way a real logo would be. */}
                <span data-dock-only className="pointer-events-auto shrink-0">
                  <Image
                    src="/logo-mark.png"
                    alt=""
                    width={22}
                    height={22}
                    className="h-5.5 w-5.5 rounded-full object-cover ring-1 ring-brand-gold/25"
                  />
                </span>
                {/* Reserves the slot the giant wordmark shrinks into, and is
                    the thing that takes over once it gets there. */}
                <span
                  data-ghost="wordmark"
                  data-rail-logo
                  className="pointer-events-auto inline-block whitespace-nowrap rounded-lg bg-brand-gold px-2 py-1 text-[0.7rem] font-extrabold leading-none tracking-[-0.02em] text-brand-dark opacity-0"
                >
                  {wordmark}
                </span>
              </span>
              <span data-dock-only className="pointer-events-auto shrink-0">
                <LangToggle current={lang} label={dict.nav.switchLang} />
              </span>
            </div>
            <p
              data-dock-only
              className="mt-3 text-[0.72rem] leading-relaxed text-brand-muted"
            >
              {dict.sidebar.tagline}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="relative rounded-2xl">
          <div
            data-dock-panel
            className="glass absolute inset-0 rounded-2xl"
          />
          <div className="relative grid grid-cols-2">
            {dict.hero.stats.map((stat, i) => (
              <div
                key={stat.value}
                data-flight={`stat-${i}`}
                className="relative px-4 py-3.5"
              >
                {/* Only visible while this cell is still floating in the hero. */}
                <div
                  data-hero-only
                  className="glass absolute inset-0 rounded-2xl"
                />
                <div className="relative">
                  <p className="text-xl font-extrabold leading-none text-brand-gold">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 whitespace-pre-line text-[0.62rem] font-semibold uppercase leading-tight tracking-wider text-brand-muted">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="relative rounded-2xl">
          <div
            data-dock-panel
            className="glass absolute inset-0 rounded-2xl"
          />
          <nav className="relative flex flex-col items-start gap-1 p-3">
            {nav.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-flight={`nav-${i}`}
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-[0.78rem] font-bold uppercase tracking-wider text-brand-light transition-colors duration-300 hover:text-brand-gold"
              >
                <span data-dock-only className="text-brand-gold">
                  <SidebarIcon name={item.icon} className="h-3.5 w-3.5" />
                </span>
                {item.label}
              </a>
            ))}

            {/* Real routes, not hero sections — so they don't fly in from the
                portrait like the anchors above; they just fade in with the
                rest of the rail's chrome (data-dock-only). */}
            <span
              data-dock-only
              aria-hidden="true"
              className="my-1 h-px w-8 self-start bg-white/10"
            />
            {routeLinks.map((item) => (
              <Link
                key={item.route}
                href={href(lang, item.route)}
                data-dock-only
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-[0.78rem] font-bold uppercase tracking-wider text-brand-light transition-colors duration-300 hover:text-brand-gold"
              >
                <span className="text-brand-gold">
                  <SidebarIcon name={item.icon} className="h-3.5 w-3.5" />
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto" data-dock-only>
          <AppButton className="pointer-events-auto w-full justify-center">
            {dict.nav.cta}
          </AppButton>
        </div>
      </aside>

      {/* ============================= THE HERO ============================= */}
      <section
        id="beranda"
        ref={sectionRef}
        aria-label={dict.hero.headlineLines.join(" ")}
        className="relative h-svh lg:h-[240svh]"
      >
        <div className="grain sticky top-0 h-svh overflow-hidden">
          {/* Ground. Gold pooled low, everything else charcoal — no blue. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(70% 50% at 50% 100%, rgba(214,176,114,0.16), transparent 72%), radial-gradient(45% 40% at 82% 8%, rgba(255,255,255,0.05), transparent 70%), linear-gradient(180deg, #101216 0%, #16181c 55%, #0c0e11 100%)",
            }}
          />

          {/* --- Giant wordmark. Sits behind the portrait. --- */}
          <h1
            data-wordmark
            data-flight="wordmark"
            data-flight-from="hero"
            data-flight-scale="true"
            // Position and size live in globals.css under [data-wordmark] —
            // they need a media query, which an inline style can't carry.
            className="absolute left-[2vw] right-[2vw] z-0 whitespace-nowrap text-center font-extrabold leading-[0.78] tracking-[-0.045em] text-brand-gold"
          >
            {wordmark}
          </h1>

          {/* --- Co-founder, standing behind the founder ---
              Same data-portrait hook as the main portrait, so the scroll
              animation blurs and fades both together. A background rather than
              an <img> so a missing /tony.jpg just renders nothing. The photo
              is a full portrait on a near-black backdrop; the mask keeps only
              the head and shoulders and melts the rest into the hero ground. */}
          <div
            data-portrait
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[12svh] z-[5] flex justify-center lg:top-[9svh]"
          >
            <div
              className="aspect-[1116/2000] h-[36svh] translate-x-[25vw] bg-cover bg-top lg:h-[58svh] lg:translate-x-[17vw]"
              style={{
                backgroundImage: "url(/tony.jpg)",
                filter: "brightness(0.78) contrast(1.05)",
                maskImage:
                  "radial-gradient(ellipse 58% 40% at 50% 42%, #000 46%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 58% 40% at 50% 42%, #000 46%, transparent 100%)",
              }}
            />
          </div>

          {/* --- Portrait ---
              Anchored from the TOP, not the bottom. This is a head-and-
              shoulders crop, so the face is roughly 60% of the frame — bottom-
              anchoring it put the chin at ~72svh and the headline landed square
              on his mouth. Sized and placed instead so the head rides up into
              the wordmark (the look we're after) and the chin clears the
              headline with room to spare. */}
          <div
            data-portrait
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[9svh] z-10 flex justify-center lg:top-[6svh]"
          >
            {portraitFailed ? (
              <Silhouette />
            ) : (
              // Not next/image: the mask and the exact height matter more here
              // than a srcset, and it is a single LCP asset.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/founder.png"
                alt=""
                onError={() => setPortraitFailed(true)}
                className="h-[46svh] w-auto object-contain lg:h-[64svh]"
                style={{
                  maskImage:
                    "radial-gradient(ellipse 64% 76% at 50% 38%, #000 56%, transparent 100%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 64% 76% at 50% 38%, #000 56%, transparent 100%)",
                }}
              />
            )}
          </div>

          {/* --- Ghost row: where the rail's nav sits during the hero. ---
              Invisible and inert; it exists to be measured. On the left of the
              portrait, then the right, mirroring the reference. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[3vw] top-[49svh] z-20 hidden select-none justify-between opacity-0 lg:flex"
          >
            <div className="flex items-start gap-5">
              {nav.slice(0, 3).map((item, i) => (
                <GhostNavItem key={item.id} index={i} label={item.label} />
              ))}
            </div>
            <div className="flex items-start gap-5">
              {nav.slice(3).map((item, i) => (
                <GhostNavItem key={item.id} index={i + 3} label={item.label} />
              ))}
            </div>
          </div>

          {/* --- Ghost stat cards, left flank --- */}
          {/* Invisible in the animated case — but under reduced motion the rail
              never arrives, so globals.css reveals this and it carries the
              stats itself. Hence the real card styling on a "ghost". */}
          <div
            data-ghost-stats
            aria-hidden="true"
            className="pointer-events-none absolute left-[3vw] top-[58svh] z-20 hidden w-[168px] select-none flex-col gap-3 opacity-0 lg:flex"
          >
            {dict.hero.stats.map((stat, i) => (
              <div
                key={stat.value}
                data-ghost={`stat-${i}`}
                className="glass rounded-2xl px-4 py-3.5"
              >
                <p className="text-xl font-extrabold leading-none text-brand-gold">
                  {stat.value}
                </p>
                <p className="mt-1.5 whitespace-pre-line text-[0.62rem] font-semibold uppercase leading-tight tracking-wider text-brand-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* --- The five areas, right flank --- */}
          <ul
            data-hero-fade
            className="glass absolute right-[3vw] top-[58svh] z-20 hidden select-none flex-col gap-2 rounded-2xl p-4 lg:flex"
          >
            {dict.hero.pillars.map((pillar) => (
              <li
                key={pillar}
                className="flex items-center gap-2.5 text-sm font-semibold text-brand-light"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                {pillar}
              </li>
            ))}
          </ul>

          {/* --- Headline over the chest --- */}
          <div className="absolute inset-x-0 top-[50svh] z-20 flex flex-col items-center px-5 text-center lg:top-[56svh]">
            <h2
              data-hero-fade
              className="text-[clamp(2.4rem,6.4vw,4.6rem)] font-extrabold leading-[0.94] tracking-[-0.04em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)]"
            >
              {dict.hero.headlineLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>

            <p
              data-hero-fade
              className="mt-5 max-w-md text-balance text-sm leading-relaxed text-brand-muted lg:hidden"
            >
              {dict.hero.sub}
            </p>

            <div
              data-hero-fade
              className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:mt-9"
            >
              <AppButton size="lg">{dict.hero.cta}</AppButton>
              <Link
                href={href(lang, "story")}
                className="glass-chip rounded-full px-6 py-4 text-sm font-semibold text-brand-light transition-colors duration-300 hover:border-brand-gold/40 hover:text-brand-gold"
              >
                {dict.hero.ctaSecondary}
              </Link>
            </div>

            <p
              data-hero-fade
              className="mt-4 text-xs tracking-wide text-brand-muted max-lg:hidden [@media(max-height:760px)]:hidden"
            >
              {dict.hero.foundedBy}{" "}
              <span className="font-semibold text-brand-light">
                {FOUNDERS_CREDIT}
              </span>
            </p>
          </div>

          <div
            data-hero-fade
            className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-brand-muted/70"
          >
            {dict.hero.scrollHint}
            <span className="relative h-8 w-px overflow-hidden bg-brand-light/15">
              <span className="absolute inset-x-0 top-0 h-3 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-brand-gold" />
            </span>
          </div>
        </div>

        <style>{`
          @keyframes scrollcue {
            0%   { transform: translateY(-100%); }
            60%  { transform: translateY(300%); }
            100% { transform: translateY(300%); }
          }
        `}</style>
      </section>
    </div>
  );
}

/**
 * A ghost nav item. Mirrors the real chip's box exactly — including the space
 * the icon takes up — so the two line up corner to corner when measured.
 */
function GhostNavItem({ index, label }: { index: number; label: string }) {
  return (
    <span
      data-ghost={`nav-${index}`}
      className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-[0.78rem] font-bold uppercase tracking-wider"
    >
      <span className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

/** Stand-in until `public/founder.png` exists, so the composition still reads. */
function Silhouette() {
  return (
    <svg
      viewBox="0 0 300 420"
      className="h-[46svh] w-auto lg:h-[64svh]"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="sil" cx="50%" cy="34%" r="62%">
          <stop offset="0%" stopColor="#565c66" />
          <stop offset="62%" stopColor="#2b3038" />
          <stop offset="100%" stopColor="#16181c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="150" cy="118" r="76" fill="url(#sil)" />
      <path
        d="M150 196c-72 0-112 46-118 128-2 26-2 60-2 96h240c0-36 0-70-2-96-6-82-46-128-118-128Z"
        fill="url(#sil)"
      />
    </svg>
  );
}
