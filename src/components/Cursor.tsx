"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * The site's pointer: a small gold dot that tracks exactly, a ring that lags
 * well behind it (so there's a visible gap while you move) and swells over
 * anything clickable, and a soft gold comet-tail drawn on a canvas behind
 * both.
 *
 * Only mounts for a real mouse — `(pointer: fine)` and `(hover: hover)` — and
 * never under reduced motion, since the whole point of it is trailing motion.
 * The native cursor is only hidden while this one is actually running, so a
 * touch, keyboard or reduced-motion visitor is never left with no pointer at
 * all. Form fields keep their own cursor regardless (see globals.css); losing
 * the I-beam makes text genuinely harder to use.
 */

/** What counts as "clickable" for the swell. */
const INTERACTIVE =
  'a, button, [role="button"], summary, label, select, [data-cursor-hover]';

/** Trail tuning. */
const TRAIL_LEN = 20; // points kept ≈ frames of history
const TRAIL_WIDTH = 5; // px, at the head; tapers to 0 at the tail

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const canvas = canvasRef.current;
    if (!dot || !ring || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    gsap.registerPlugin();
    const mm = gsap.matchMedia();

    mm.add(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        document.documentElement.classList.add("has-cursor");

        // Two speeds is the whole effect: the dot is pinned to the pointer,
        // the ring chases it. quickTo keeps this to one tween per axis rather
        // than allocating a new one on every mousemove.
        const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
        const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
        // A long catch-up — the ring trails the dot by a clear margin.
        const ringX = gsap.quickTo(ring, "x", { duration: 1.2, ease: "power3" });
        const ringY = gsap.quickTo(ring, "y", { duration: 1.2, ease: "power3" });

        // ---------------------------------------------------------- the tail
        const pts: { x: number; y: number }[] = [];
        const head = { x: 0, y: 0 };
        let hasPos = false;

        const resize = () => {
          const dpr = Math.min(2, window.devicePixelRatio || 1);
          canvas.width = Math.round(window.innerWidth * dpr);
          canvas.height = Math.round(window.innerHeight * dpr);
          canvas.style.width = `${window.innerWidth}px`;
          canvas.style.height = `${window.innerHeight}px`;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();

        let raf = 0;
        const draw = () => {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          if (hasPos) {
            pts.push({ x: head.x, y: head.y });
            while (pts.length > TRAIL_LEN) pts.shift();
          }
          if (pts.length > 1) {
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.shadowColor = "rgba(255,215,112,0.5)";
            ctx.shadowBlur = 6;
            for (let i = 1; i < pts.length; i++) {
              const t = i / pts.length; // 0 = oldest, 1 = at the cursor
              ctx.beginPath();
              ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
              ctx.lineTo(pts[i].x, pts[i].y);
              ctx.lineWidth = TRAIL_WIDTH * t;
              ctx.strokeStyle = `rgba(255,215,112,${(0.55 * t * t).toFixed(3)})`;
              ctx.stroke();
            }
          }
          raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);

        // -------------------------------------------------------- listeners
        let visible = false;
        const onMove = (event: MouseEvent) => {
          if (!visible) {
            visible = true;
            gsap.to([dot, ring], { autoAlpha: 1, duration: 0.25 });
            gsap.to(canvas, { autoAlpha: 1, duration: 0.25 });
          }
          head.x = event.clientX;
          head.y = event.clientY;
          hasPos = true;
          dotX(event.clientX);
          dotY(event.clientY);
          ringX(event.clientX);
          ringY(event.clientY);
        };

        // Delegated rather than per-element listeners: the card wall and the
        // rail both add and remove interactive nodes, and this way nothing has
        // to remember to re-bind.
        const setHover = (on: boolean) => {
          gsap.to(ring, {
            scale: on ? 1.9 : 1,
            // No border tint that shifts on hover — the ring is a plain,
            // uncoloured outline. Only its size and faint fill react.
            backgroundColor: on
              ? "rgba(214,176,114,0.12)"
              : "rgba(214,176,114,0)",
            duration: 0.32,
            ease: "power3.out",
          });
          gsap.to(dot, { scale: on ? 0 : 1, duration: 0.32, ease: "power3.out" });
        };

        const onOver = (event: MouseEvent) => {
          if ((event.target as Element)?.closest?.(INTERACTIVE)) setHover(true);
        };
        const onOut = (event: MouseEvent) => {
          if ((event.target as Element)?.closest?.(INTERACTIVE)) setHover(false);
        };

        const onDown = () =>
          gsap.to(ring, { scale: 0.8, duration: 0.18, ease: "power3.out" });
        const onUp = () =>
          gsap.to(ring, { scale: 1, duration: 0.3, ease: "power3.out" });

        // Leaving the window entirely should take the cursor with it, or it
        // sits frozen at the edge of the page.
        const onLeave = () => {
          visible = false;
          hasPos = false;
          pts.length = 0;
          gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
          gsap.to(canvas, { autoAlpha: 0, duration: 0.2 });
        };

        document.addEventListener("mousemove", onMove, { passive: true });
        document.addEventListener("mouseover", onOver, { passive: true });
        document.addEventListener("mouseout", onOut, { passive: true });
        document.addEventListener("mousedown", onDown, { passive: true });
        document.addEventListener("mouseup", onUp, { passive: true });
        document.addEventListener("mouseleave", onLeave, { passive: true });
        window.addEventListener("resize", resize);

        return () => {
          cancelAnimationFrame(raf);
          document.documentElement.classList.remove("has-cursor");
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseover", onOver);
          document.removeEventListener("mouseout", onOut);
          document.removeEventListener("mousedown", onDown);
          document.removeEventListener("mouseup", onUp);
          document.removeEventListener("mouseleave", onLeave);
          window.removeEventListener("resize", resize);
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden opacity-0 [.has-cursor_&]:block"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 opacity-0 [.has-cursor_&]:block"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold-hover opacity-0 shadow-[0_0_12px_rgba(255,215,112,0.9)] [.has-cursor_&]:block"
      />
    </>
  );
}
