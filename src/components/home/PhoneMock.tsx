import FeatureScreen from "./FeatureScreen";

/**
 * The device that floats in the middle of each feature card.
 *
 * The screen inside is authored at a fixed 320 x 640 logical box and scaled to
 * fit, so the little UIs in FeatureScreen can be written at sane sizes. Keep
 * SCREEN_W/H and the rendered size in step — the scale is derived from them, so
 * changing the display size alone is safe. Sizing itself (--phone-w/-s) is
 * driven by container query units set in globals.css against the parent
 * `[data-phone-slot]`, so the phone is always shown in full — never cropped —
 * at any card height.
 *
 * At rest it sits tilted away in 3D, like it's turned slightly from you; on
 * hover (the ancestor `.group`, i.e. the whole card) it turns to face you
 * flat-on. Pure CSS — `motion-safe:` is Tailwind's native
 * prefers-reduced-motion variant, so under reduced motion the phone just
 * renders facing forward with no transform and no transition at all, rather
 * than the tilt applying instantly instead of animating.
 */
const SCREEN_W = 320;
const SCREEN_H = 640;

export default function PhoneMock({ slug }: { slug: string }) {
  return (
    <div
      data-phone
      className="relative shrink-0 [transform-style:preserve-3d] motion-safe:[transform:rotateY(-34deg)_rotateX(7deg)_scale(0.9)] motion-safe:transition-transform motion-safe:duration-700 motion-safe:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:[transform:rotateY(0deg)_rotateX(0deg)_scale(1)]"
      style={{
        // --phone-w / --phone-s are declared together in globals.css and
        // stepped down by viewport height; the scale is always width / 320.
        width: "var(--phone-w)",
        height: `calc(var(--phone-w) * ${SCREEN_H / SCREEN_W})`,
        // Chassis: a dark bezel with a lit top-left edge, sitting on a soft
        // drop shadow so it reads as floating over the card art.
        padding: "calc(var(--phone-w) * 0.033)",
        borderRadius: "calc(var(--phone-w) * 0.147)",
        background: "linear-gradient(150deg,#3a3f47 0%,#14161a 42%,#25292f 100%)",
        boxShadow:
          "0 26px 50px -16px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.16)",
      }}
    >
      <div
        className="absolute -inset-10 -z-10 rounded-full bg-brand-gold/40 opacity-0 blur-3xl transition-opacity duration-700 motion-safe:group-hover:opacity-100 hidden lg:block"
        style={{ transform: "translateZ(-10px)" }}
      />
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          borderRadius: "calc(var(--phone-w) * 0.113)",
          background: "#0E1013",
        }}
      >
        <div
          className="origin-top-left"
          style={{
            width: SCREEN_W,
            height: SCREEN_H,
            transform: "scale(var(--phone-s))",
          }}
        >
          <FeatureScreen slug={slug} />
        </div>

        {/* A real screenshot, when there is one, sits straight over the mock.
            background-image rather than <img> so a missing file renders as
            nothing — an <img> would paint a broken-image glyph, and its
            onError can't prevent it because the 404 resolves before React
            hydrates. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-top"
          // Layered: whichever of the two files exists paints, the other is skipped.
          style={{
            backgroundImage: `url(/features/screens/${slug}.png), url(/features/screens/${slug}.jpg)`,
          }}
        />

        {/* Notch */}
        <span
          className="absolute left-1/2 top-1.5 -translate-x-1/2 rounded-full"
          style={{
            width: "calc(var(--phone-w) * 0.3)",
            height: "calc(var(--phone-w) * 0.033)",
            background: "#0E1013",
          }}
        />
      </div>
    </div>
  );
}
