"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import AppButton from "../AppButton";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * The last thing on every page: the door, filmed opening and zoomed through.
 *
 * `/door.mp4` plays once when the section arrives. A little past the halfway
 * mark — the moment we're through the opening — a warm bloom flares and the
 * title magnifies in from far away (small, blurred, transparent → full size,
 * sharp, lit), with the button rising in behind it. The clip then holds on its
 * last frame as the backdrop.
 *
 * The whole thing re-arms every time the section leaves and re-enters the
 * viewport: scroll up and back down and the door plays again from frame one,
 * the title shrinks back to nothing and magnifies in a second time. It is
 * meant to feel like walking back through the same doorway, not like landing
 * on a spent animation.
 *
 * The reveal is hung off the video's own progress, so it stays in step
 * whatever the clip's length turns out to be. Everything about the trigger is
 * belt-and-braces, because the one thing that must never happen is a visitor
 * staring at a doorway with no title and no button on it:
 *
 *   - IntersectionObserver, not ScrollTrigger's onEnter, so arriving by a
 *     jump, a refresh mid-page or a back-navigation still starts the clip.
 *   - A rejected play() (iOS Low Power Mode blocks even muted autoplay)
 *     reveals immediately instead.
 *   - And a hard timeout reveals regardless if the clip stalls on a bad
 *     connection.
 *
 * `preload="none"` matters here: this section closes five different pages, and
 * the file is 3MB. It is fetched only once the section is one viewport away.
 *
 * Under reduced motion none of this runs — no bloom, no magnify — and the
 * copy simply sits over the door's first frame.
 */
/** Reveal at this point through the clip — we're past the opening by now. */
const REVEAL_AT = 0.55;
/** Last-resort reveal if the clip never gets there. */
const REVEAL_DEADLINE_MS = 7000;
export default function CTASection({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const title = titleRef.current;
    const cta = ctaRef.current;
    const flash = flashRef.current;
    if (!section || !video || !title || !cta || !flash) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // The pre-reveal pose. Set now (before first paint) and restored every
      // time the section leaves the viewport, so a second approach starts from
      // the same nothing the first one did.
      const arm = () => {
        gsap.killTweensOf([title, cta, flash]);
        gsap.set(title, { scale: 0.26, autoAlpha: 0, filter: "blur(20px)" });
        gsap.set(cta, { autoAlpha: 0, y: 34 });
        gsap.set(flash, { autoAlpha: 0 });
        revealed = false;
      };

      let revealed = false;
      let deadline = 0;
      arm();

      const reveal = () => {
        if (revealed) return;
        revealed = true;
        window.clearTimeout(deadline);
        gsap
          .timeline()
          // The bloom of light as we come through the opening.
          .to(flash, { autoAlpha: 1, duration: 0.16, ease: "power2.out" })
          .to(
            title,
            {
              scale: 1,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 1.6,
              ease: "expo.out",
            },
            "<",
          )
          .to(flash, { autoAlpha: 0, duration: 1.2, ease: "power2.out" }, "<0.16")
          .to(
            cta,
            { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out" },
            "-=0.8",
          );
      };

      // Fetch the clip a viewport early, so it is ready to play on arrival.
      const preload = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          preload.disconnect();
          video.load();
        },
        { rootMargin: "100% 0px" },
      );
      preload.observe(section);

      // Wait until the section genuinely owns the screen before rolling. At a
      // lower threshold the clip started while it was still a sliver at the
      // bottom of the viewport, so a slow scroller arrived to find the door
      // already open and the whole approach missed. Not disconnected on the
      // first hit — leaving and re-entering runs the whole thing again.
      let inView = false;
      const start = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting === inView) return;
          inView = entry.isIntersecting;

          if (!inView) {
            window.clearTimeout(deadline);
            video.pause();
            arm();
            return;
          }

          arm();
          try {
            video.currentTime = 0;
          } catch {
            // currentTime can throw before any data is buffered — the load()
            // from the preload observer plus the play() below sort it out.
          }
          // Muted autoplay is normally allowed, but iOS Low Power Mode blocks
          // it outright — in which case show the copy straight away rather
          // than leaving a doorway with nothing on it.
          video.play().catch(reveal);
          deadline = window.setTimeout(reveal, REVEAL_DEADLINE_MS);
        },
        { threshold: 0.7 },
      );
      start.observe(section);

      const onTime = () => {
        const { currentTime, duration } = video;
        if (!duration || !Number.isFinite(duration)) return;
        if (currentTime / duration >= REVEAL_AT) reveal();
      };

      video.addEventListener("timeupdate", onTime);
      video.addEventListener("ended", reveal);
      video.addEventListener("error", reveal);

      return () => {
        preload.disconnect();
        start.disconnect();
        window.clearTimeout(deadline);
        video.removeEventListener("timeupdate", onTime);
        video.removeEventListener("ended", reveal);
        video.removeEventListener("error", reveal);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      // Full-bleed on every screen. Letterboxing the door inside a fixed-rem
      // block left dark bands above and below it on a phone, which reads as a
      // panel rather than a threshold you walk through.
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-brand-deep px-5 py-24 text-center sm:px-8"
    >
      {/* The door. Holds on its last frame once it has played through. */}
      <video
        ref={videoRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        preload="none"
      >
        <source src="/door.mp4" type="video/mp4" />
      </video>

      {/* Scrim. The clip ends bright, so the cream type needs a floor to sit
          on at every frame — flat wash plus a vignette that keeps the centre
          the lightest part of the frame. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 50%, rgba(8,9,11,0.38), rgba(8,9,11,0.82) 100%)",
        }}
      />

      {/* The bloom at the threshold. */}
      <div
        ref={flashRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(45% 45% at 50% 52%, rgba(255,231,172,0.85), rgba(255,215,112,0.35) 45%, transparent 76%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <h2
          ref={titleRef}
          className="mx-auto max-w-3xl text-balance text-[clamp(2.4rem,7vw,5rem)] font-bold leading-[1.02] tracking-[-0.04em] text-brand-light"
          style={{ textShadow: "0 4px 40px rgba(0,0,0,0.75)" }}
        >
          {dict.cta.heading}
        </h2>

        <div ref={ctaRef} className="mt-10 flex justify-center">
          <AppButton size="lg">{dict.cta.button}</AppButton>
        </div>
      </div>
    </section>
  );
}
