"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { playCoin, wind } from "@/lib/sfx";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * A field of members you drag through, and a reading panel when you pick one.
 *
 * The field
 * ---------
 * Two rows of portrait cards on a track you throw left and right. Depth is
 * done analytically, not by reading the DOM: every card's layout centre is
 * measured once with offsetLeft (which transforms don't affect), so each frame
 * only needs arithmetic — screen x = layout x + track offset — to derive
 * scale, blur and opacity. Reading 20 rects per frame instead would thrash
 * layout for the same picture.
 *
 * Two transforms are deliberately kept on separate elements: the outer one is
 * written by JS every frame for depth, the inner one runs a CSS float
 * animation. On one element they'd overwrite each other.
 *
 * Sound (lib/sfx.ts): a wind loop rides a grab-and-swipe, its volume tracking
 * the throw speed; a coin chimes once each time the pointer crosses onto a new
 * card. Both only ever fire inside a real pointer gesture, default ON, and are
 * killed by the single Suara toggle.
 *
 * Reading panel
 * -------------
 * A native <dialog> stretched to the viewport — kept for its focus trap,
 * Escape handling and inert background. Left half holds the chosen card in a
 * dotted ring over the blurred field; right half is a cream reading column,
 * inverted from the rest of the site on purpose.
 *
 * Body text lights up as you read: one scroll handler sets `--read` on the
 * container and CSS does the rest per word from `--i`. Twenty paragraphs of
 * spans with no per-word JS.
 *
 * Under reduced motion none of the above runs — no drift, no inertia, no
 * depth, no float — and the field falls back to a plain scrollable row.
 */

type Voice = Dictionary["voices"]["people"][number];

/**
 * Card width is a CSS custom property, not a fixed px constant — the cards
 * were coming out noticeably larger than the reference at normal desktop
 * widths, and staying that size all the way up to an ultrawide monitor rather
 * than scaling with the viewport. `--voice-card-w` is set once on the field
 * (below) and read everywhere a card's box needs it, including the row
 * stagger's margin — so the geometry stays in lockstep with the actual
 * rendered size at every breakpoint instead of a JS number that only matches
 * reality at one width.
 */
const READER_CARD_W = 240; // the enlarged card in the reading panel — a
// deliberately independent, fixed "hero" size, unrelated to the wall's density.
/** Idle drift, px per frame at 60fps. Slow enough to click a moving card. */
const DRIFT = 0.16;
/** Drag/scroll gain. Kept at/below 1:1 so the wall tracks the hand rather than
 *  outrunning it — a slower, more controllable swipe, per request. */
const SENSITIVITY = 0.9;
/** Ceiling for the hover-to-pan speed (px/frame). Lower = gentler glide. */
const HOVER_PAN_MAX = 9;
/** Arc: how much the edge cards tilt. */
const ARC_TILT = 5;

/**
 * Which cards carry a picture panel, and what fills it.
 *
 *   VIDEO — a short talking clip at `/people/<slug>.mp4`.
 *   PHOTO — a landscape scene of them among family/community, generated
 *           separately and named `/people/<slug>2.jpeg` so it never collides
 *           with the square avatar at `/people/<slug>.jpeg`.
 *
 * The rest stay text-only on purpose: the typographic cards are what give the
 * wall its rhythm.
 */
const VIDEO_SLUGS = new Set([
  "angela",
  "bernardus",
  "gregorius",
  "ignasius",
  "katarina",
  "lidwina",
  "maria",
]);

const PHOTO_SLUGS = new Set([
  "clara",
  "damar",
  "fransiska",
  "markus",
  "petrus",
  "yosef",
  "yustinus",
]);

/**
 * `desaturate` is the wall's default: the card's photo, clip and this avatar
 * all sit in mono until the card is the one in focus — hovered on desktop, or
 * centred in the phone's snap row — at which point they bloom into colour.
 * The reader panel passes it `false`: the person you picked is in full colour.
 */
function Avatar({
  voice,
  className,
  desaturate = false,
}: {
  voice: Voice;
  className: string;
  desaturate?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-linear-to-br from-brand-gold/70 to-brand-gold/25 font-semibold text-brand-dark ${className}`}
    >
      {voice.initials}
      <span
        className={`absolute inset-0 bg-cover bg-center transition-[filter] duration-500 ${
          desaturate
            ? "grayscale [[data-center]_&]:grayscale-0 [[data-glow]_&]:grayscale-0"
            : ""
        }`}
        style={{ backgroundImage: `url(/people/${voice.slug}.jpeg)` }}
      />
    </span>
  );
}

/**
 * One card, three very different sizes: ~133px in the desktop wall, ~281px in
 * the phone's single row, 240px as the hero in the reading panel. Rather than
 * three sets of props, the article is a **container** and everything inside it
 * — panel height, type, avatar, padding — steps up past `@[220px]`. So the
 * phone card isn't a blown-up version of the desktop one with a lake of empty
 * space in the middle; it's genuinely laid out for its size.
 */
function Card({
  voice,
  seen,
  desaturate = false,
}: {
  voice: Voice;
  seen: boolean;
  /** Mono until the card is in focus. Off in the reader panel. */
  desaturate?: boolean;
}) {
  const hasVideo = VIDEO_SLUGS.has(voice.slug);
  const hasPhoto = PHOTO_SLUGS.has(voice.slug);
  const hasMedia = hasVideo || hasPhoto;
  const mono = desaturate
    ? "grayscale [[data-center]_&]:grayscale-0 [[data-glow]_&]:grayscale-0"
    : "";
  return (
    <article
      className="glass @container relative flex h-full w-full flex-col overflow-hidden rounded-[28px] text-left"
      style={{ boxShadow: "0 30px 60px -28px rgba(0,0,0,0.9)" }}
    >
      {hasMedia && (
        <span
          aria-hidden="true"
          className="relative m-2.5 mb-0 block h-[40%] shrink-0 overflow-hidden rounded-[20px] bg-brand-surface/60 @[220px]:m-3 @[220px]:mb-0 @[220px]:h-[46%]"
        >
          {hasVideo ? (
            <video
              className={`absolute inset-0 h-full w-full object-cover object-top transition-[filter] duration-500 ${mono}`}
              autoPlay
              muted
              loop
              playsInline
              // The wall repeats each row four times; preload="none" keeps that
              // from meaning twenty eager video downloads. The poster still
              // covers every copy until the browser decides to play it.
              preload="none"
              poster={`/people/${voice.slug}.jpeg`}
            >
              <source src={`/people/${voice.slug}.mp4`} type="video/mp4" />
            </video>
          ) : (
            <span
              className={`absolute inset-0 bg-cover bg-center transition-[filter] duration-500 ${mono}`}
              style={{ backgroundImage: `url(/people/${voice.slug}2.jpeg)` }}
            />
          )}
          {/* A faint floor of gradient so the headline underneath never fights
              a busy frame of the clip. */}
          <span
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{
              background:
                "linear-gradient(to top, rgba(14,16,19,0.75), transparent)",
            }}
          />
        </span>
      )}

      <span
        className={`flex min-h-0 flex-1 flex-col justify-between @[220px]:p-5 ${
          hasMedia ? "p-3.5" : "p-4"
        }`}
      >
        <span className="block min-h-0">
          {voice.verse && !hasMedia && (
            <span className="mb-2 block text-[0.58rem] font-bold uppercase tracking-[0.18em] text-brand-gold/70 @[220px]:mb-3 @[220px]:text-[0.68rem]">
              {voice.verse}
            </span>
          )}
          {/* Clamped so the avatar row below always has room (reference pic 2).
              A media card's panel takes the top ~40–46%, so its headline runs
              a size smaller and two lines shorter than a text-only card's. */}
          <span
            className={`block font-serif text-brand-light ${
              hasMedia
                ? "line-clamp-2 text-[0.8rem] leading-[1.18] @[220px]:line-clamp-3 @[220px]:text-[1.22rem] @[220px]:leading-[1.24]"
                : "line-clamp-4 text-[1.02rem] leading-[1.25] @[220px]:line-clamp-6 @[220px]:text-[1.45rem] @[220px]:leading-[1.22]"
            }`}
          >
            {voice.headline}
          </span>
        </span>

        <span
          className={`flex shrink-0 items-center gap-2.5 @[220px]:gap-3 ${
            hasMedia ? "mt-2" : "mt-3"
          }`}
        >
          <Avatar
            voice={voice}
            desaturate={desaturate}
            className={`@[220px]:h-11 @[220px]:w-11 @[220px]:text-[0.8rem] ${
              hasMedia ? "h-7 w-7 text-[0.55rem]" : "h-8 w-8 text-[0.62rem]"
            }`}
          />
          <span className="min-w-0">
            <span className="block truncate text-[0.72rem] font-semibold text-brand-light @[220px]:text-[0.95rem]">
              {voice.name}
            </span>
            <span className="block truncate text-[0.58rem] uppercase tracking-wider text-brand-muted @[220px]:text-[0.7rem]">
              {voice.community}
            </span>
          </span>
        </span>
      </span>

      {seen && (
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 z-20 grid h-5 w-5 place-items-center rounded-full bg-brand-gold text-brand-dark"
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.5 8.5l3 3 6-6" />
          </svg>
        </span>
      )}

      {/* Gold "LED" that lights the card's border and tracks the pointer —
          driven by --mx/--my set on the [data-voice-card] wrapper. See
          .voice-glow in globals.css. */}
      <span
        aria-hidden="true"
        className="voice-glow pointer-events-none absolute inset-0 z-10 rounded-[28px]"
      />
    </article>
  );
}

export default function VoicesWall({ dict }: { dict: Dictionary }) {
  const people = dict.voices.people;
  const half = Math.ceil(people.length / 2);
  const row0 = people.slice(0, half);
  const row1 = people.slice(half);
  const rows = [
    [...row0, ...row0, ...row0, ...row0],
    [...row1, ...row1, ...row1, ...row1],
  ];

  const fieldRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const readerRef = useRef<HTMLDivElement>(null);
  const phoneRowRef = useRef<HTMLUListElement>(null);

  const [seen, setSeen] = useState<string[]>([]);
  const [active, setActive] = useState<Voice | null>(null);
  const [sound, setSound] = useState(true);
  // Mirrored into a ref so the drag handlers can read the current setting
  // without the field's whole effect tearing down and re-binding every time
  // the toggle flips. Written in an effect, never during render.
  const soundRef = useRef(true);
  useEffect(() => {
    soundRef.current = sound;
    // Kill the loop immediately when the toggle goes off, rather than waiting
    // for the next settle in the tick.
    if (!sound) wind.stop();
  }, [sound]);

  // Plain function, not useCallback: it is only ever read by JSX click
  // handlers, never by a dependency array, and the hand-written `[]` was
  // blocking React Compiler from optimising a component that renders a
  // hundred cards.
  const openVoice = (voice: Voice) => {
    setActive(voice);
    setSeen((current) =>
      current.includes(voice.slug) ? current : [...current, voice.slug],
    );
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && active && !dialog.open) dialog.showModal();
  }, [active]);

  // ----------------------------------------------------- phone: centre card
  // Whichever card overlaps the middle band of the screen gets `data-center`,
  // which the CSS uses to bring that one card into colour. A thin symmetric
  // rootMargin means exactly one card qualifies at a time, and it costs one
  // observer for the section rather than a scroll handler.
  useEffect(() => {
    const row = phoneRowRef.current;
    if (!row) return;
    const items = Array.from(row.children) as HTMLElement[];
    if (items.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.toggleAttribute("data-center", entry.isIntersecting);
        }
      },
      { root: null, rootMargin: "0px -45% 0px -45%", threshold: 0 },
    );
    for (const item of items) io.observe(item);
    return () => io.disconnect();
  }, [people.length]);

  // ------------------------------------------------------------------ field
  useLayoutEffect(() => {
    const field = fieldRef.current;
    const track = trackRef.current;
    if (!field || !track) return;

    const media = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    if (!media.matches) return;

    field.dataset.interactive = "true";

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    let centres: number[] = [];
    let cycleWidth = 0;

    // offsetLeft is layout-based, so a transformed track doesn't disturb it —
    // measure once here and never touch the DOM for geometry again.
    const measure = () => {
      centres = cards.map((el) => el.offsetLeft + el.offsetWidth / 2);
      cycleWidth = track.scrollWidth / 4;
    };
    measure();

    let offset = -cycleWidth;
    let velocity = 0;
    const drift = -DRIFT;
    let dragging = false;
    let hovering = false;
    let pointerStart = 0;
    let offsetStart = 0;
    let moved = 0;
    let frame = 0;
    // The card the pointer is currently over, so the coin fires once per
    // crossing rather than repeatedly as the pointer moves within one card.
    let hoverCard: Element | null = null;
    // The card currently lit with the gold border glow, and the live pointer
    // position within it that the glow chases (written as --mx/--my).
    let glowCard: HTMLElement | null = null;

    let mouseX = 0;

    const moveGlow = (event: PointerEvent) => {
      const el = (event.target as Element)?.closest?.(
        "[data-voice-card]",
      ) as HTMLElement | null;
      if (el !== glowCard) {
        if (glowCard) glowCard.removeAttribute("data-glow");
        glowCard = el;
        if (el) el.setAttribute("data-glow", "");
      }
      if (!glowCard) return;
      // Rect is read only for the one lit card, only on move — cheap enough.
      const r = glowCard.getBoundingClientRect();
      glowCard.style.setProperty("--mx", `${event.clientX - r.left}px`);
      glowCard.style.setProperty("--my", `${event.clientY - r.top}px`);
    };

    const clearGlow = () => {
      if (glowCard) glowCard.removeAttribute("data-glow");
      glowCard = null;
    };

    const wrapOffset = () => {
      if (offset > -cycleWidth / 2) offset -= cycleWidth;
      else if (offset < -cycleWidth * 2) offset += cycleWidth;
    };

    const render = () => {
      const width = field.clientWidth;
      const centre = width / 2;
      const halfW = width / 2;
      const falloff = width * 0.55;
      track.style.transform = `translate3d(${offset}px,0,0)`;
      for (let i = 0; i < cards.length; i++) {
        const fromCentre = centres[i] + offset - centre;
        const distance = Math.min(1, Math.abs(fromCentre) / falloff);
        const signed = Math.max(-1, Math.min(1, fromCentre / halfW));
        // Inverted arc: cards go UP (-y) at edges, and tilt inversely
        const dropY = -64 * signed * signed;
        const tilt = -ARC_TILT * signed;
        const scale = 1 - distance * 0.13;
        const card = cards[i];
        card.style.transform = `translateY(${dropY.toFixed(2)}px) rotate(${tilt.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        card.style.filter = `blur(${(distance * distance * 4.5).toFixed(2)}px)`;
        card.style.opacity = `${(1 - distance * 0.62).toFixed(3)}`;
      }
    };

    const tick = () => {
      if (!dragging) {
        // Passive pan that follows the mouse position. This is NOT a grab —
        // per request it stays silent; the wind only rides a real drag.
        const targetVelocity = hovering ? -mouseX * HOVER_PAN_MAX : drift;

        velocity += (targetVelocity - velocity) * 0.05;

        if (Math.abs(velocity) > 0.05) {
          offset += velocity;
        }
        wrapOffset();
      }
      render();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const driveWind = (speed: number) => {
      if (!soundRef.current) {
        wind.stop();
        return;
      }
      if (speed < 0.6) {
        wind.stop();
        return;
      }
      wind.drive(0.25 + Math.min(1, speed / 34) * 0.75);
    };

    let captured = false;

    const onDown = (event: PointerEvent) => {
      dragging = true;
      captured = false;
      moved = 0;
      pointerStart = event.clientX;
      offsetStart = offset;
      velocity = 0;
      field.style.cursor = "grabbing";
      // A grab kills the border glow — the pointer's now "holding" the wall.
      if (glowCard) {
        glowCard.removeAttribute("data-glow");
        glowCard = null;
      }
    };

    const onMove = (event: PointerEvent) => {
      if (!dragging) {
        const center = window.innerWidth / 2;
        mouseX = (event.clientX - center) / center;
        moveGlow(event);
        return;
      }
      const rawDelta = event.clientX - pointerStart;
      moved = Math.max(moved, Math.abs(rawDelta));
      if (!captured && moved > 6) {
        field.setPointerCapture(event.pointerId);
        captured = true;
      }
      const next = offsetStart + rawDelta * SENSITIVITY;
      velocity = next - offset;
      offset = next;
      wrapOffset();
      driveWind(Math.abs(velocity));
    };

    const onUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (captured) {
        field.releasePointerCapture(event.pointerId);
        captured = false;
      }
      field.style.cursor = "";
      // The grab is over — cut the wind now rather than waiting for the glide
      // to decay in the tick loop.
      wind.stop();
      if (moved > 6) {
        field.dataset.dragged = "true";
        window.setTimeout(() => delete field.dataset.dragged, 0);
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      const step = event.deltaX * SENSITIVITY;
      offset = offset - step;
      wrapOffset();
      // Wheel/trackpad panning is not a grab — no wind, per request.
    };

    const onEnter = (event: PointerEvent) => { 
      hovering = true;
      const center = window.innerWidth / 2;
      mouseX = (event.clientX - center) / center;
    };
    
    const onLeave = () => {
      hovering = false;
      hoverCard = null;
      mouseX = 0;
      clearGlow();
    };

    // Coin on crossing onto a card. Fires once per distinct card, and never
    // while dragging (the wind owns that gesture). Works both when the pointer
    // moves over the cards and when a drifting card slides under the pointer.
    const onOver = (event: PointerEvent) => {
      if (dragging || !soundRef.current) return;
      const card = (event.target as Element)?.closest?.("[data-voice-card]");
      if (card && card !== hoverCard) {
        hoverCard = card;
        playCoin();
      } else if (!card) {
        hoverCard = null;
      }
    };

    field.addEventListener("pointerdown", onDown);
    field.addEventListener("pointermove", onMove);
    field.addEventListener("pointerup", onUp);
    field.addEventListener("pointercancel", onUp);
    field.addEventListener("wheel", onWheel, { passive: false });
    field.addEventListener("pointerenter", onEnter);
    field.addEventListener("pointerleave", onLeave);
    field.addEventListener("pointerover", onOver);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(frame);
      delete field.dataset.interactive;
      field.removeEventListener("pointerdown", onDown);
      field.removeEventListener("pointermove", onMove);
      field.removeEventListener("pointerup", onUp);
      field.removeEventListener("pointercancel", onUp);
      field.removeEventListener("wheel", onWheel);
      field.removeEventListener("pointerenter", onEnter);
      field.removeEventListener("pointerleave", onLeave);
      field.removeEventListener("pointerover", onOver);
      window.removeEventListener("resize", measure);
      wind.stop();
      clearGlow();
      // Clear only what this effect wrote. removeAttribute("style") would also
      // take React's own inline styles with it — and React won't put them back,
      // since from its side nothing changed. In StrictMode that ran on the
      // first throwaway mount and left every card without its geometry.
      for (const card of cards) {
        card.style.transform = "";
        card.style.filter = "";
        card.style.opacity = "";
        card.style.removeProperty("--mx");
        card.style.removeProperty("--my");
      }
      track.style.transform = "";
    };
  }, [people.length]);

  // --------------------------------------------------- progressive read line
  const onReaderScroll = useCallback(() => {
    const el = readerRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    el.style.setProperty("--read", max > 0 ? `${el.scrollTop / max}` : "1");
  }, []);

  useEffect(() => {
    if (active) requestAnimationFrame(onReaderScroll);
  }, [active, onReaderScroll]);

  // Reading time from the real word count, not a guess.
  const words = active ? active.story.join(" ").split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));

  let wordIndex = 0;

  return (
    <section id="umat" className="grain relative overflow-hidden bg-brand-bg py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 45%, rgba(214,176,114,0.13), transparent 72%)",
        }}
      />

      <p className="px-5 text-center font-serif text-[1.05rem] text-brand-light lg:text-[1.15rem]">
        <span className="text-brand-gold">{dict.voices.smallTitleLead}</span>{" "}
        {dict.voices.smallTitleRest}
      </p>

      {/* The "Cerita ilustrasi" chip and the per-panel disclosure that used to
          sit here are both gone by request. */}

      {/* ------------------------------------------------------------- phone
          One card at a time, everyone exactly once, snap-scrolled. The desktop
          field below is a different animal — two rows, four repeats, driven
          per-frame by JS — and squeezing that onto a 390px screen gives you
          eighty 133px cards in two cramped lanes. So the phone gets its own
          markup rather than a shrunken version of the desktop one.

          Both structures are in the DOM but only one is ever displayed, and a
          `display:none` subtree fetches neither its background images nor its
          preload="none" video — so the second structure costs nodes, not
          bytes. */}
      <ul
        ref={phoneRowRef}
        className="mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[14vw] pb-3 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
      >
        {people.map((voice) => (
          <li
            key={voice.slug}
            // `data-center` is toggled onto whichever card is crossing the
            // screen's middle (see the observer effect); Card/Avatar read it
            // to bloom that one card into colour.
            className="aspect-[3/4] w-[72vw] max-w-[300px] shrink-0 snap-center"
          >
            <button
              type="button"
              onClick={() => openVoice(voice)}
              className="block h-full w-full text-left"
            >
              <Card voice={voice} seen={seen.includes(voice.slug)} desaturate />
            </button>
          </li>
        ))}
      </ul>

      {/* ----------------------------------------------------------- desktop
          The field. Falls back to a plain scroller when the effect layer in the
          layout effect decides not to run (reduced motion). */}
      <div
        ref={fieldRef}
        data-field
        className="mt-10 hidden touch-pan-y select-none overflow-x-auto [scrollbar-width:none] data-[interactive]:cursor-grab data-[interactive]:overflow-hidden md:block [&::-webkit-scrollbar]:hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 9%, #000 91%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 9%, #000 91%, transparent)",
        }}
      >
        {/* py gives the arc room — edge cards translate downward and would
            otherwise clip against the field's hidden overflow. */}
        <div ref={trackRef} className="relative w-max px-[6vw] py-12 will-change-transform">
          <div className="flex flex-col" style={{ gap: "var(--voice-gap)" }}>
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                // items-start matters: a flex row stretches its children by
                // default, and a stretched height overrides aspect-ratio — the
                // cards come out landscape.
                className="flex items-start"
                style={{
                  gap: "var(--voice-gap)",
                  // calc() against the same custom property the cards size
                  // from, rather than a JS number, so the stagger tracks the
                  // real rendered width at every breakpoint.
                  marginLeft: rowIndex === 1 ? "calc(var(--voice-card-w) * 0.42)" : 0,
                }}
              >
                {row.map((voice, columnIndex) => {
                  const index = rowIndex * row.length + columnIndex;
                  return (
                    <div
                      key={`${columnIndex}-${voice.slug}`}
                      data-voice-card
                      ref={(node) => {
                        cardsRef.current[index] = node;
                      }}
                      // Geometry lives in a class or the --voice-card-w custom
                      // property, never in style.width/height, so the per-frame
                      // depth writes (transform/filter/opacity, set directly on
                      // this node in the layout effect) can never be confused
                      // with it or clobber it on cleanup.
                      className="aspect-[3/4] w-[var(--voice-card-w)] shrink-0 will-change-transform"
                    >
                      {/* Inner element carries the idle float so the outer
                          one stays free for the per-frame depth transform. */}
                      <button
                        type="button"
                        data-cursor-hover
                        onClick={() => {
                          if (fieldRef.current?.dataset.dragged) return;
                          openVoice(voice);
                        }}
                        className="block h-full w-full motion-safe:animate-[voice-float_var(--float-dur)_ease-in-out_var(--float-delay)_infinite]"
                        style={
                          {
                            "--float-dur": `${7 + (index % 5) * 1.4}s`,
                            "--float-delay": `${(index % 7) * -0.9}s`,
                          } as React.CSSProperties
                        }
                      >
                        <Card voice={voice} seen={seen.includes(voice.slug)} desaturate />
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-center gap-5 px-5 lg:mt-8">
        <span className="text-[0.65rem] uppercase tracking-[0.22em] text-brand-muted/70">
          {seen.length > 0 ? (
            `${dict.voices.counter} ${seen.length}/${people.length}`
          ) : (
            <>
              {/* Thumbs swipe and tap; mice drag and click. */}
              <span className="md:hidden">{dict.voices.hintTouch}</span>
              <span className="hidden md:inline">{dict.voices.hint}</span>
            </>
          )}
        </span>
        {/* The coin and wind only ever bind in the desktop field's effect, so
            this toggle would control nothing on a phone. */}
        <button
          type="button"
          onClick={() => setSound((on) => !on)}
          aria-pressed={sound}
          className="glass-chip hidden items-center gap-2 rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-brand-muted transition-colors hover:text-brand-gold md:inline-flex"
        >
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${sound ? "bg-brand-gold" : "bg-brand-muted/50"}`}
          />
          {dict.voices.soundOn}
        </button>
      </div>

      {/* ============================== READER ============================== */}
      <dialog
        ref={dialogRef}
        onClose={() => setActive(null)}
        className="h-svh max-h-svh w-screen max-w-screen border-0 bg-transparent p-0 backdrop:bg-brand-deep/80 backdrop:backdrop-blur-md"
      >
        {active && (
          <div className="flex h-svh w-screen">
            {/* Left: the chosen card, held in a dotted ring. */}
            <div className="relative hidden w-[42%] items-center justify-center lg:flex">
              <span
                aria-hidden="true"
                className="absolute h-[420px] w-[420px] rounded-full border border-dashed border-brand-gold/25"
              />
              <div
                className="relative"
                style={{ width: READER_CARD_W, aspectRatio: "3 / 4" }}
              >
                <Card voice={active} seen />
              </div>
            </div>

            {/* Right: the reading column. Cream on a dark site, deliberately —
                it reads as a page rather than another panel. */}
            <div
              ref={readerRef}
              onScroll={onReaderScroll}
              data-reveal-text
              // Lenis hijacks the wheel globally; without this the reader can't
              // be scrolled while it's open. `overscroll-contain` also stops a
              // scroll that reaches the end from leaking to the page behind.
              data-lenis-prevent
              className="relative h-svh w-full overflow-y-auto overscroll-contain bg-brand-light px-6 py-14 text-brand-dark sm:px-12 lg:w-[58%] lg:px-16"
              style={{ ["--total" as string]: String(words), ["--read" as string]: "0" }}
            >
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label={dict.voices.close}
                data-cursor-hover
                className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-xl border border-brand-dark/15 text-brand-dark transition-colors hover:bg-brand-dark hover:text-brand-light sm:right-10 sm:top-10"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>

              <div className="mx-auto max-w-xl">
                <h2 className="pr-12 font-serif text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.06] tracking-[-0.02em]">
                  {active.headline}
                </h2>

                <div className="mt-8 flex items-center gap-4">
                  <Avatar voice={active} className="h-14 w-14 text-base" />
                  <div>
                    <p className="text-[1.05rem] font-semibold">{active.name}</p>
                    <p className="mt-0.5 text-[0.72rem] uppercase tracking-wider text-brand-dark/60">
                      {active.role} · {active.community}, {active.city}
                    </p>
                  </div>
                </div>

                <p className="mt-10 flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand-dark/50">
                  <span aria-hidden="true" className="h-px w-8 bg-brand-gold" />
                  {dict.voices.discover} {active.name.split(" ")[0]}
                  <span aria-hidden="true" className="ml-auto normal-case tracking-normal">
                    {minutes} {dict.voices.readingTime}
                  </span>
                </p>

                <div className="mt-8 space-y-6 font-serif text-[1.12rem] leading-[1.65]">
                  {active.story.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>
                      {paragraph.split(" ").map((word, index) => (
                        <span
                          key={index}
                          style={{ ["--i" as string]: String(wordIndex++) }}
                        >
                          {word}{" "}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>

                {active.verse && (
                  <p className="mt-10 border-l-2 border-brand-gold pl-5 font-serif text-[1.05rem] italic text-brand-dark/70">
                    “{active.thought}”
                    <span className="mt-2 block text-[0.62rem] font-sans font-bold uppercase not-italic tracking-[0.18em] text-brand-dark/45">
                      {active.verse}
                    </span>
                  </p>
                )}

                <h3 className="mt-12 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-brand-dark/50">
                  {dict.voices.servicesLabel}
                </h3>
                <ul className="mt-4 space-y-3">
                  {active.services.map((service) => (
                    <li
                      key={`${service.year}-${service.name}`}
                      className="flex items-baseline gap-4 border-t border-brand-dark/10 pt-3"
                    >
                      <span className="w-10 shrink-0 text-[0.78rem] font-bold tabular-nums text-brand-dark/45">
                        {service.year}
                      </span>
                      <span>
                        <span className="block text-[0.95rem] font-semibold">
                          {service.name}
                        </span>
                        <span className="block text-[0.78rem] text-brand-dark/55">
                          {service.community}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
