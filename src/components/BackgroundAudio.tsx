"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Site-wide ambient loop with an always-visible toggle.
 *
 * Default ON: the toggle shows "on" from the first paint, and the music begins
 * the moment the visitor starts engaging — the first scroll past the hero (the
 * point where the founder photo blurs), or the first click/keypress/touch,
 * whichever lands first. It is still NOT a page-load autoplay: a play() call
 * with no user activation behind it is expected to be rejected by the browser
 * and is swallowed, then retried on the next gesture. Showing "on" up front is
 * the stated intent; the sound follows as soon as the browser permits it, and
 * the always-visible toggle is there to stop it, which is what keeps this
 * acceptable rather than hostile.
 *
 * Once the visitor makes an explicit choice — tapping the toggle off stores
 * "0" — auto-start backs off entirely and that choice wins for the session.
 *
 * `preload="none"` means the 4MB file costs nothing until the first play(). The
 * preference is read via useSyncExternalStore — the same pattern the project
 * uses in use-scrolled.ts / use-reduced-motion.ts — and stored in
 * sessionStorage, not localStorage, so each fresh visit starts from the default
 * again rather than resuming a stale choice.
 */

const KEY = "ruangiman:bgm";
const listeners = new Set<() => void>();

/** Playing volume once faded in. */
const TARGET_VOLUME = 0.3;

/**
 * Ramp `audio.volume` to `target` over ~500ms on the animation frame. Shared by
 * the toggle effect and the auto-start path so both fade identically. Cancels
 * any ramp already in flight via `fadeRef`.
 */
function fadeTo(
  audio: HTMLAudioElement,
  target: number,
  fadeRef: { current: number | null },
) {
  if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
  const start = audio.volume;
  const startedAt = performance.now();
  const step = (now: number) => {
    // The RAF timestamp is when the frame *started*, which can be a hair before
    // the performance.now() above — clamp so a negative t can't push the
    // interpolated volume outside [0, 1] (IndexSizeError).
    const t = Math.max(0, Math.min(1, (now - startedAt) / 500));
    audio.volume = Math.max(0, Math.min(1, start + (target - start) * t));
    if (t < 1) {
      fadeRef.current = requestAnimationFrame(step);
    } else {
      fadeRef.current = null;
      if (target === 0) audio.pause();
    }
  };
  fadeRef.current = requestAnimationFrame(step);
}

/** True once the visitor has explicitly toggled — auto-start then stands down. */
function hasExplicitChoice() {
  try {
    return sessionStorage.getItem(KEY) !== null;
  } catch {
    return false;
  }
}

function setStored(value: boolean) {
  try {
    sessionStorage.setItem(KEY, value ? "1" : "0");
  } catch {
    // Private browsing or storage disabled — the toggle still works for this
    // page view, it just won't be remembered on the next one.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// The default is ON: music is what we want playing unless the visitor has
// explicitly turned it off this session (stored "0"). The browser still won't
// make a sound until the first real interaction — the auto-start effect below
// handles that — so "on" here is the intent, fulfilled the moment a scroll or
// click grants activation.
function getSnapshot() {
  try {
    return sessionStorage.getItem(KEY) !== "0";
  } catch {
    return true;
  }
}

// The server can't read sessionStorage — render in the default (on) state and
// let useSyncExternalStore reconcile once the client mounts.
const getServerSnapshot = () => true;

export default function BackgroundAudio() {
  const on = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef<number | null>(null);

  // The actual side effect — talking to the <audio> element — belongs in an
  // effect; only the React state read above needed to avoid one.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (on && audio.paused) {
      // A play() promise can reject if the gesture that triggered it was
      // somehow lost (rapid double-toggle, or the default-on state before any
      // interaction has granted activation) — swallow rather than crash. The
      // auto-start effect will retry on the next gesture.
      audio.play().catch(() => {});
    }

    fadeTo(audio, on ? TARGET_VOLUME : 0, fadeRef);

    return () => {
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    };
  }, [on]);

  // Auto-start on first engagement — see the component doc. Runs once; stands
  // down the moment the visitor has made an explicit choice.
  useEffect(() => {
    if (hasExplicitChoice()) return;
    const audio = audioRef.current;
    if (typeof window === "undefined" || !audio) return;

    let done = false;
    let pending = false;

    const succeed = () => {
      done = true;
      removeAll();
      // The sound is actually playing now — fade it up here rather than leaning
      // on the [on] effect, which won't re-run when the toggle is already "on"
      // (the default). Then persist so a later toggle-off has something to flip.
      fadeTo(audio, TARGET_VOLUME, fadeRef);
      setStored(true);
    };

    const attempt = () => {
      if (done || pending || hasExplicitChoice()) return;
      pending = true;
      // Start near-silent; succeed() fades it up once play() resolves.
      audio.volume = 0.0001;
      audio
        .play()
        .then(() => {
          pending = false;
          succeed();
        })
        .catch(() => {
          // Blocked (no activation yet) — wait for the next interaction.
          pending = false;
        });
    };

    // The hero photo is fully blurred out by ~40% of the first viewport.
    const HERO_BLUR = () => window.scrollY > window.innerHeight * 0.4;
    const onScroll = () => {
      if (HERO_BLUR()) attempt();
    };
    // A click/keypress/touch is a definite activation; take it whenever it
    // comes, so the music is essentially guaranteed to start on real use even
    // if a wheel-only scroll didn't grant activation.
    const onGesture = () => attempt();

    function removeAll() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      window.removeEventListener("touchstart", onGesture);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onScroll, { passive: true });
    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("keydown", onGesture);
    window.addEventListener("touchstart", onGesture, { passive: true });

    return removeAll;
  }, []);

  return (
    <>
      <audio ref={audioRef} src="/audio/backsound.mp3" loop preload="none" />
      <button
        type="button"
        onClick={() => setStored(!on)}
        aria-pressed={on}
        aria-label={on ? "Matikan musik latar" : "Nyalakan musik latar"}
        data-cursor-hover
        className="glass fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full text-brand-light transition-colors hover:text-brand-gold lg:bottom-7 lg:right-7"
      >
        {/* Three bars that "play" (bounce) only while music is on — reduced
            motion swaps them for a plain static glyph via the sibling below. */}
        <span
          aria-hidden="true"
          className="flex h-3.5 items-end gap-[3px] motion-reduce:hidden"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-current"
              style={{
                height: on ? undefined : "4px",
                animation: on
                  ? `bgm-bar 0.9s ease-in-out ${i * 0.15}s infinite`
                  : "none",
              }}
            />
          ))}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="hidden h-4 w-4 motion-reduce:block"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 6v4h3l4 3V3L5 6H2Z" />
          {on && <path d="M11 5.5a3.5 3.5 0 0 1 0 5" />}
        </svg>
      </button>

      <style>{`
        @keyframes bgm-bar {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
      `}</style>
    </>
  );
}
