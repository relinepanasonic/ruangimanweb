"use client";

import { useSyncExternalStore } from "react";

/** Past this many pixels the navbar earns its glass background. */
const THRESHOLD = 24;

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const getSnapshot = () => window.scrollY > THRESHOLD;

// Assume the top of the page on the server; the first client snapshot corrects
// it, which matters when someone reloads halfway down.
const getServerSnapshot = () => false;

export function useScrolled(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
