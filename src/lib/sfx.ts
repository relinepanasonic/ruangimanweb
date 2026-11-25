/**
 * File-based sound effects for the members wall.
 *
 *   coin  — a short chime, fired once each time the pointer crosses onto a
 *           different card. Deliberately quiet (10%) and played at half speed
 *           so it reads as a soft cue, not a game "ping". A small pool of
 *           <audio> clones so several quick crossings can overlap instead of
 *           cutting each other off.
 *   wind  — a loop that rides an actual grab-and-swipe (pointer held down and
 *           dragged): its volume tracks the throw speed and it fades out when
 *           the drag ends. It does NOT play for the passive mouse-move pan.
 *
 * Everything is created lazily on the client and only ever from inside a real
 * pointer gesture, so none of it can trip the browser's autoplay block. All of
 * it is a no-op on the server.
 */

const COIN_SRC = "/audio/coin.mp3";
const WIND_SRC = "/audio/Wind.mp3";
const COIN_POOL = 4;
const COIN_VOLUME = 0.1; // 10% — was 0.175, felt too loud
const COIN_RATE = 0.5; // half speed — a slower, lower, gentler chime

let coinPool: HTMLAudioElement[] | null = null;
let coinIndex = 0;

function makeAudio(src: string, volume: number, loop = false) {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.loop = loop;
  audio.preload = "auto";
  return audio;
}

export function playCoin() {
  if (typeof window === "undefined") return;
  if (!coinPool) {
    coinPool = Array.from({ length: COIN_POOL }, () => {
      const a = makeAudio(COIN_SRC, COIN_VOLUME);
      a.playbackRate = COIN_RATE;
      return a;
    });
  }
  const audio = coinPool[coinIndex];
  coinIndex = (coinIndex + 1) % COIN_POOL;
  try {
    audio.currentTime = 0;
    // The rejection path matters as much as the throw path: before the first
    // real click, play() rejects with NotAllowedError, and an uncaught
    // rejection floods the console. The next qualifying gesture lets it through.
    void audio.play().catch(() => {});
  } catch {
    // A pool slot still mid-play can throw synchronously on some engines — the
    // next slot covers it, so nothing to do here.
  }
}

/** The drag wind: one looping element, faded in and out by hand. */
const wind = (() => {
  let el: HTMLAudioElement | null = null;
  let raf: number | null = null;
  let targetVol = 0;
  const MAX_VOL = 0.5;

  const ensure = () => {
    if (typeof window === "undefined") return null;
    if (!el) el = makeAudio(WIND_SRC, 0, true);
    return el;
  };

  const step = () => {
    if (!el) return;
    const diff = targetVol - el.volume;
    if (Math.abs(diff) < 0.01) {
      el.volume = targetVol;
      if (targetVol === 0 && !el.paused) el.pause();
      raf = null;
      return;
    }
    // Ease toward the target — snappier on the way up than the way down.
    el.volume = Math.max(0, Math.min(1, el.volume + diff * (diff > 0 ? 0.35 : 0.08)));
    raf = requestAnimationFrame(step);
  };

  const pump = () => {
    if (raf === null) raf = requestAnimationFrame(step);
  };

  return {
    /** Call on drag/swipe movement. `intensity` 0–1 sets the loudness target. */
    drive(intensity: number) {
      const audio = ensure();
      if (!audio) return;
      targetVol = Math.min(MAX_VOL, Math.max(0, intensity) * MAX_VOL);
      if (audio.paused) void audio.play().catch(() => {});
      pump();
    },
    /** Call when the motion has settled (or sound is turned off). */
    stop() {
      if (!el) return;
      targetVol = 0;
      pump();
    },
  };
})();

export { wind };
