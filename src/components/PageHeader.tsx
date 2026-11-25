import Reveal from "./Reveal";

/**
 * Shared opening block for the inner pages. Deliberately calmer than the home
 * hero — those pages are for reading, not for being impressed.
 */
export default function PageHeader({
  eyebrow,
  heading,
  lead,
}: {
  eyebrow: string;
  heading: string;
  lead?: string;
}) {
  return (
    <header className="grain relative overflow-hidden px-5 pb-20 pt-36 sm:px-8 sm:pb-24 sm:pt-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(58% 70% at 30% 0%, rgba(57,79,107,0.5), transparent 70%), radial-gradient(40% 50% at 88% 12%, rgba(214,176,114,0.12), transparent 70%), linear-gradient(180deg, #1b1e23 0%, #272a30 100%)",
        }}
      />
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-6 text-balance text-[clamp(2.2rem,6vw,4.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-brand-light">
            {heading}
          </h1>
        </Reveal>
        {lead && (
          <Reveal delay={0.14}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-brand-muted">
              {lead}
            </p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
