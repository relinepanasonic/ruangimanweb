"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  /** Seconds of stagger before this element starts. */
  delay?: number;
  /** Direction the element travels in from. */
  from?: "up" | "left" | "right" | "scale";
  className?: string;
  as?: "div" | "li" | "section" | "article" | "p" | "h2" | "h3";
};

/**
 * A plain IntersectionObserver reveal. Deliberately not GSAP: these fire once,
 * never scrub, and there can be dozens on a page — an observer plus a CSS
 * transition is far cheaper than a ScrollTrigger each.
 *
 * Reduced motion is handled in CSS (transitions collapse to ~0ms in
 * globals.css), so the element still ends up visible.
 */
export default function Reveal({
  children,
  delay = 0,
  from = "up",
  className,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-reveal
      style={{ transitionDelay: `${delay}s` }}
      className={clsx(
        "transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        shown
          ? "translate-x-0 translate-y-0 scale-100 opacity-100"
          : [
              "opacity-0",
              from === "up" && "translate-y-10",
              from === "left" && "-translate-x-10",
              from === "right" && "translate-x-10",
              from === "scale" && "scale-[0.94]",
            ],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
