"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Wires Lenis' inertial scroll into GSAP's ticker so ScrollTrigger reads the
 * same frame Lenis just painted. Without this the pinned sections lag the
 * smoothed scroll position by a frame and visibly judder.
 *
 * Mounted once in the root layout. Renders nothing.
 */
export default function SmoothScrollProvider() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Native scrolling is the honest answer for reduced motion — Lenis' easing
    // is itself the kind of motion the setting asks us not to add.
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Dev-only handle: lets you drive the scroll from the console (or a
    // screenshot script) without fighting Lenis' wheel interception.
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { lenis?: Lenis }).lenis = lenis;
    }

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Fonts land after first paint and change every pinned section's height.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
