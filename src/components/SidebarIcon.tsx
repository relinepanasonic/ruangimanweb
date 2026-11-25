/**
 * Small line icons for the left rail. Same hand-rolled approach as
 * FeatureIcon — six glyphs don't justify an icon package.
 */
const paths: Record<string, React.ReactNode> = {
  home: <path d="M3.5 10.4 12 3.6l8.5 6.8V20a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1Z" />,
  // The journey: a winding path with a marker at each end.
  route: (
    <>
      <path d="M6.5 20c0-4 11-4 11-8s-11-4-11-8" />
      <circle cx="6.5" cy="4" r="1.8" />
      <circle cx="17.5" cy="20" r="1.8" />
    </>
  ),
  quote: (
    <>
      <path d="M9.5 6.5C6.9 7.6 5.5 9.6 5.5 12.4h3.2v5H4V12c0-3.4 1.8-5.9 5.5-7Z" />
      <path d="M19 6.5c-2.6 1.1-4 3.1-4 5.9h3.2v5H13.5V12c0-3.4 1.8-5.9 5.5-7Z" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
    </>
  ),
  map: (
    <>
      <path d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.8 12 21 12 21Z" />
      <circle cx="12" cy="10.6" r="2.4" />
    </>
  ),
  news: (
    <>
      <path d="M4 6.5h12v13H5.6A1.6 1.6 0 0 1 4 17.9Z" />
      <path d="M16 9.5h4v8a2 2 0 0 1-4 0" />
      <path d="M6.8 10h6.4M6.8 13h6.4M6.8 16h4" />
    </>
  ),
  // A closed book, spine at the left.
  book: (
    <>
      <path d="M5 4.5h11a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H5Z" />
      <path d="M5 4.5v13" />
    </>
  ),
  // A calendar page with a marked day.
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9.5h16M8 3.5v4M16 3.5v4" />
      <circle cx="12" cy="14.5" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
};

export default function SidebarIcon({
  name,
  className = "h-4 w-4",
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
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name] ?? paths.home}
    </svg>
  );
}
