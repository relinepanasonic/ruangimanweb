"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a number up to its target the first time it scrolls into view, then
 * stops. Presentational only — it renders the final value during SSR and for
 * anyone with reduced motion or no IntersectionObserver, so the number is
 * never hidden or stuck.
 *
 * `value` is the string as it should read at rest ("37", "8jt+", "8M+", "1").
 * Only a leading integer animates; any prefix or suffix is held fixed.
 */
export default function CountUp({
  value,
  from = 1,
  duration = 1400,
  className,
}: {
  value: string;
  /** Number the count starts from once it enters the viewport. */
  from?: number;
  /** Length of the count, in milliseconds. */
  duration?: number;
  className?: string;
}) {
  const match = /^(\D*)(\d+)(.*)$/.exec(value);
  const prefix = match?.[1] ?? "";
  const target = match ? Number(match[2]) : NaN;
  const suffix = match?.[3] ?? "";

  // Starts at the target so SSR and no-JS render the real number.
  const [n, setN] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (Number.isNaN(target)) return;
    const node = ref.current;
    if (!node) return;

    const start = Math.min(from, target);
    if (start === target) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") return;

    const span = target - start;
    // Drop to the start value on the next frame — deferred rather than set here
    // so the SSR/first-render output (the real number) survives hydration, and
    // the number then reads e.g. "1" until the section scrolls into view.
    let raf = requestAnimationFrame(() => setN(start));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
          setN(Math.round(start + span * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, from, duration]);

  return (
    <span ref={ref} className={className}>
      {Number.isNaN(target) ? value : `${prefix}${n}${suffix}`}
    </span>
  );
}
