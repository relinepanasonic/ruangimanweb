/**
 * Hand-rolled line icons, one per feature key used in the dictionaries.
 * Inlined rather than pulling in an icon package: eight glyphs don't justify
 * a dependency, and these ship as zero extra bytes over the HTML.
 */
const paths: Record<string, React.ReactNode> = {
  // Daily reflections — an open book
  book: (
    <>
      <path d="M12 6.5C10.5 5 8.5 4.5 4 4.5v13c4.5 0 6.5.5 8 2 1.5-1.5 3.5-2 8-2v-13c-4.5 0-6.5.5-8 2Z" />
      <path d="M12 6.5v13" />
    </>
  ),
  // Prayer room — hands lifted
  hands: (
    <>
      <path d="M8 20V9a1.6 1.6 0 0 1 3.2 0v3" />
      <path d="M16 20V9a1.6 1.6 0 0 0-3.2 0v3" />
      <path d="M8 12.5 5.6 15a2 2 0 0 0-.4 2.4L6.5 20" />
      <path d="M16 12.5 18.4 15a2 2 0 0 1 .4 2.4L17.5 20" />
      <path d="M12 3.5v3" />
    </>
  ),
  // Bible — a bound book with a cross on the cover. The spine curve and the
  // page-edge line are what stop it reading as a plain box with a plus in it.
  bible: (
    <>
      <path d="M4 19.2A2.5 2.5 0 0 1 6.5 16.7H20" />
      <path d="M6.5 2.8H20v18.4H6.5A2.5 2.5 0 0 1 4 18.7V5.3a2.5 2.5 0 0 1 2.5-2.5Z" />
      <path d="M13.2 6.6v5.6M10.4 9.4h5.6" />
    </>
  ),
  // Communities — a map pin
  map: (
    <>
      <path d="M12 21s7-5.4 7-10.6A7 7 0 0 0 5 10.4C5 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10.4" r="2.6" />
    </>
  ),
  // Friends in faith — two people
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5.4a3.2 3.2 0 0 1 0 6.2" />
      <path d="M17.5 14.6A6 6 0 0 1 21 20" />
    </>
  ),
  // Events — a calendar
  calendar: (
    <>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8.5 3.5v4M15.5 3.5v4" />
      <path d="M8 14h3v3H8z" />
    </>
  ),
  // Camps & retreats — an open A-frame tent. Two earlier attempts drew a closed
  // triangle with a mark inside it and both read as a hazard sign. What breaks
  // that read is the ground line running WIDER than the tent's base, so the
  // shape is never a closed triangle.
  tent: (
    <>
      <path d="M2.5 20.5h19" />
      <path d="M12 3.5 4.6 20.5" />
      <path d="M12 3.5 19.4 20.5" />
      <path d="M15.2 20.5 12 14.2l-3.2 6.3" />
    </>
  ),
  // Personal profile — a person on a card, not a bare avatar, so it reads as
  // "your page" rather than "a user".
  profile: (
    <>
      <rect x="3.2" y="4.2" width="17.6" height="15.6" rx="2.6" />
      <circle cx="9.4" cy="10.4" r="2.3" />
      <path d="M5.9 16.4a3.7 3.7 0 0 1 7 0" />
      <path d="M15.2 9.8h3.1M15.2 13h3.1" />
    </>
  ),
  // Share a thought — a speech bubble with a spark in it.
  thought: (
    <>
      <path d="M20.4 12.6c0 3.7-3.8 6.7-8.4 6.7a10 10 0 0 1-2.6-.34L4.6 20.6l1.3-3.4a6.3 6.3 0 0 1-2.3-4.6c0-3.7 3.8-6.7 8.4-6.7s8.4 3 8.4 6.7Z" />
      <path d="M12 9.4v5.2M9.4 12h5.2" />
    </>
  ),
  // Chat — one bubble tucked behind another, which is what distinguishes it
  // from the single `thought` bubble at icon size.
  chat: (
    <>
      <path d="M15.6 13.4c0 2.4-2.6 4.4-5.8 4.4a7.5 7.5 0 0 1-1.8-.22L4.4 19l1-2.5a4.3 4.3 0 0 1-1.6-3.1c0-2.4 2.6-4.4 5.8-4.4s6 2 6 4.4Z" />
      <path d="M17 14.6c1.6-.8 2.6-2.2 2.6-3.8 0-2.6-2.8-4.7-6.2-4.7a7.6 7.6 0 0 0-3.2.68" />
    </>
  ),
  // Church — a nave with a cross above the door. The steep roof and the cross
  // are what stop it reading as a generic house.
  church: (
    <>
      <path d="M12 2.4v4M10.2 4.1h3.6" />
      <path d="M4.4 20.6V11L12 6.6l7.6 4.4v9.6Z" />
      <path d="M10 20.6v-4.1a2 2 0 0 1 4 0v4.1" />
    </>
  ),
  // News & stories — a folded newspaper
  news: (
    <>
      <path d="M4 6.5h12.5v13H6a2 2 0 0 1-2-2Z" />
      <path d="M16.5 9.5H20v8a2 2 0 0 1-3.5 1.3" />
      <path d="M7 10h6.5M7 13h6.5M7 16h4" />
    </>
  ),
};

export default function FeatureIcon({
  name,
  className = "h-6 w-6",
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name] ?? paths.book}
    </svg>
  );
}
