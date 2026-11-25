/**
 * A round portrait with an initials fallback.
 *
 * The photo is a CSS background, not an <img>: a missing file then renders as
 * nothing and the initials underneath stay visible, instead of a broken-image
 * glyph. Drop `public/tony.png` in and it appears with no code change.
 */
export default function FounderAvatar({
  name,
  photo,
  size = 44,
  focus = "50% 14%",
}: {
  name: string;
  photo: string;
  size?: number;
  /** background-position — busts are cropped up to the face. */
  focus?: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <span
      aria-hidden="true"
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-brand-gold to-brand-gold/50 font-bold text-brand-dark"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
      <span
        className="absolute inset-0 bg-cover"
        style={{ backgroundImage: `url(${photo})`, backgroundPosition: focus }}
      />
    </span>
  );
}
