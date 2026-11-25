"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getSnapshot = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The server can't know the preference. `null` is the "not resolved yet" state
// that animated sections wait on before touching GSAP, rather than guessing and
// tearing the timeline down a frame later.
const getServerSnapshot = () => null;

/**
 * `null` during SSR and the first client render, then `true`/`false`.
 *
 * useSyncExternalStore rather than useEffect + setState: reading a browser
 * medium is exactly what it's for, and it keeps the value consistent across
 * concurrent renders.
 */
export function useReducedMotion(): boolean | null {
  return useSyncExternalStore<boolean | null>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
}
