"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * Section two: the five areas of the app, threaded along a path that draws
 * itself as you scroll.
 *
 * The path is one SVG stretched over the whole section with
 * `preserveAspectRatio="none"`, so its coordinate space is a fixed 100 x 500
 * grid regardless of how tall the section actually renders — stop `i` always
 * sits at y = i*100 + 50. That only lines up with the cards because every stop
 * row is given the same fixed height on desktop; if you change ROW_H, nothing
 * breaks, the geometry just re-stretches with it.
 *
 * `vector-effect: non-scaling-stroke` keeps the 1px line from being smeared
 * into a wedge by that same non-uniform stretch.
 */

// Viewbox units per stop. The DOM rows are sized to match (see ROW_H).
const UNIT = 100;
/** Desktop row height. Keep in step with UNIT so the snake meets each card. */
const ROW_H = "lg:min-h-[330px]";

/**
 * Alternating x for each node. Kept just outside the opposite card's edge
 * (cards are 60% wide) so the line reads as threading past each one rather
 * than wandering through empty space.
 */
const nodeX = (i: number) => (i % 2 === 0 ? 32 : 68);
const nodeY = (i: number) => i * UNIT + UNIT / 2;

function buildPath(count: number): string {
  const parts = [`M 50 0`, `C 50 ${UNIT * 0.2} ${nodeX(0)} ${UNIT * 0.28} ${nodeX(0)} ${nodeY(0)}`];
  for (let i = 1; i < count; i++) {
    const [x0, y0] = [nodeX(i - 1), nodeY(i - 1)];
    const [x1, y1] = [nodeX(i), nodeY(i)];
    // Vertical control handles give the snake its lazy S rather than a zigzag.
    parts.push(`C ${x0} ${y0 + UNIT * 0.24} ${x1} ${y1 - UNIT * 0.24} ${x1} ${y1}`);
  }
  const last = count - 1;
  parts.push(
    `C ${nodeX(last)} ${nodeY(last) + UNIT * 0.22} 50 ${count * UNIT - UNIT * 0.2} 50 ${count * UNIT}`,
  );
  return parts.join(" ");
}

export default function Journey({ dict }: { dict: Dictionary }) {
  const rootRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const stops = dict.journey.stops;
  const count = stops.length;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const path = pathRef.current;
        // Desktop dots only. The mobile ones live inside the rows and are
        // handled below — mixing them in here would shift the index mapping
        // onto the wrong nodes.
        const dots = gsap.utils.toArray<HTMLElement>("[data-node-desktop]");

        if (path) {
          const length = path.getTotalLength();

          // Where along the line does each node sit? Not (i + 0.5) / count —
          // arc length isn't distributed evenly across the stops, so that would
          // light dots before or after the line actually got to them. Binary
          // search the real length at which the path reaches each node's y.
          const lengthAt = (targetY: number) => {
            let lo = 0;
            let hi = length;
            for (let i = 0; i < 24; i++) {
              const mid = (lo + hi) / 2;
              if (path.getPointAtLength(mid).y < targetY) lo = mid;
              else hi = mid;
            }
            return (lo + hi) / 2 / length;
          };
          const nodeAt = dots.map((_, i) => lengthAt(nodeY(i)));

          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.set(dots, { scale: 0, opacity: 0 });

          gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              // The line should be finishing as the last card lands, not as
              // the section's bottom edge clears the viewport.
              start: "top 62%",
              end: "bottom 78%",
              scrub: 0.5,
              // Pop each dot exactly as the line arrives at it, so the line is
              // always visibly connected to every dot it has passed.
              onUpdate: (self) => {
                dots.forEach((dot, i) => {
                  const arrived = self.progress >= nodeAt[i];
                  const done = dot.dataset.lit === "1";
                  if (arrived === done) return;
                  dot.dataset.lit = arrived ? "1" : "0";
                  gsap.to(dot, {
                    scale: arrived ? 1 : 0,
                    opacity: arrived ? 1 : 0,
                    duration: 0.35,
                    ease: arrived ? "back.out(2.4)" : "power2.in",
                  });
                });
              },
            },
          });
        }

        // Mobile has a static spine rather than a drawn line, so its dots just
        // pop as they arrive.
        gsap.utils.toArray<HTMLElement>("[data-node-mobile]").forEach((node) => {
          gsap.fromTo(
            node,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.45,
              ease: "back.out(2.2)",
              scrollTrigger: { trigger: node, start: "top 82%" },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-stop-card]").forEach((card) => {
          gsap.fromTo(
            card,
            { y: 44, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 82%" },
            },
          );
        });
      }, root);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="perjalanan"
      ref={rootRef}
      className="relative overflow-hidden bg-brand-bg py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <header className="max-w-2xl">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-brand-gold/25 bg-brand-gold/8 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-brand-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
            {dict.journey.eyebrow}
          </p>
          <h2 className="mt-6 text-[clamp(2.1rem,5vw,3.6rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-brand-light">
            {dict.journey.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-brand-muted">
            {dict.journey.lead}
          </p>
        </header>

        <div className="relative mt-16 lg:mt-24">
          {/* The snake. Desktop only — on a narrow screen the cards stack and a
              single spine down the left reads better than a curve. */}
          <svg
            aria-hidden="true"
            viewBox={`0 0 100 ${count * UNIT}`}
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
          >
            <path
              ref={pathRef}
              d={buildPath(count)}
              fill="none"
              stroke="var(--color-brand-gold)"
              strokeOpacity="0.45"
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Node dots live in their own overlay, positioned as percentages of
              the very box the SVG stretches over. That way they sit exactly on
              the line no matter how tall any individual card renders — putting
              them inside the rows instead made them drift the moment one card
              ran a line longer than another. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1] hidden lg:block"
          >
            {stops.map((stop, i) => (
              <span
                key={stop.no}
                data-node-desktop
                className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-gold bg-brand-bg"
                style={{
                  left: `${nodeX(i)}%`,
                  top: `${(nodeY(i) / (count * UNIT)) * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Mobile spine */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-[7px] w-px bg-gradient-to-b from-transparent via-brand-gold/30 to-transparent lg:hidden"
          />

          <ol className="relative">
            {stops.map((stop, i) => {
              const cardRight = i % 2 === 0;
              return (
                <li
                  key={stop.no}
                  className={`relative flex items-center pb-14 pl-9 lg:pb-0 lg:pl-0 ${ROW_H}`}
                >
                  {/* Mobile node, pinned to the spine. */}
                  <span
                    data-node-mobile
                    aria-hidden="true"
                    className="absolute left-[7px] top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-brand-gold bg-brand-bg lg:hidden"
                  />

                  <div
                    className={`w-full lg:w-[60%] ${
                      cardRight ? "lg:ml-auto" : "lg:mr-auto"
                    }`}
                  >
                    {/* `relative z-10` is load-bearing: without a position the
                        card sits in the in-flow paint layer, which is BELOW
                        absolutely-positioned siblings — so the line drew over
                        the top of every card. */}
                    <article
                      data-stop-card
                      className="glass relative z-10 rounded-3xl p-6 transition-colors duration-300 hover:border-brand-gold/30 lg:p-7"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="text-[2.6rem] font-extrabold leading-none tracking-[-0.05em] text-brand-gold lg:text-[3.2rem]">
                          {stop.no}
                        </span>
                        <span className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-brand-gold/70">
                          {stop.key}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-bold leading-snug tracking-[-0.02em] text-brand-light lg:text-2xl">
                        {stop.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                        {stop.body}
                      </p>

                      <ul className="mt-5 flex flex-wrap gap-2">
                        {stop.tags.map((tag) => (
                          <li
                            key={tag}
                            className="glass-chip rounded-full px-3 py-1 text-[0.68rem] font-semibold text-brand-light/80"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
