"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import CountUp from "./CountUp";
import Reveal from "../Reveal";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { href } from "@/lib/site";
import INDONESIA_PATH_D, { INDONESIA_VIEWBOX } from "./indonesia-path";

// "0 0 1876 861" → the drawing's own coordinate size, used to place the
// hover label as a percentage so it tracks the SVG at any rendered width.
const [, , VB_W, VB_H] = INDONESIA_VIEWBOX.split(" ").map(Number);

/**
 * The real coastline of Indonesia (see indonesia-path.ts for provenance and
 * licensing), lit up with the same pulsing hub markers and dashed connecting
 * threads as before. An earlier version drew the archipelago as an abstract
 * cloud of scattered dots — evocative, but not actually a map, which is the
 * one thing this section is supposed to be.
 *
 * All 37 hub coordinates are the equirectangular projection of each diocesan
 * seat's real longitude/latitude onto the source SVG's viewBox (0 0 1876 861).
 * The transform was calibrated against the traced landmass bounding box — the
 * NW corner (~25, 95) is Sabang/west Aceh (≈95.3°E, 5.9°N), the far south
 * (~1137, 771) is Pulau Rote (≈123.3°E, 11°S) — giving a uniform ~39.7 px per
 * degree:
 *
 *   x = (lon − 94.57) × 39.7
 *   y = (8.37 − lat)  × 39.7
 *
 * A handful of coastal/port seats that projected a few pixels into the water
 * were snapped to the nearest land pixel of the rendered outline (even-odd
 * fill). Re-run that projection by hand if the source path ever changes.
 */

/**
 * `province` is the slug of the province in public.mass_churches that the
 * diocesan seat sits in — the "Cari Jadwal Gereja" button on each label filters
 * the Mass-schedule page to that province. Dioceses don't map 1:1 to provinces
 * (Jakarta's covers three, NTT's eight dioceses share one), so this is the
 * honest best fit: the region a visitor who clicked that dot would expect to
 * see churches from.
 */
const hubs: {
  x: number;
  y: number;
  name: string;
  bishop: string;
  province: string;
}[] = [
  // Sumatra (6)
  { x: 163, y: 190, name: 'Keuskupan Agung Medan', bishop: 'Mgr. Kornelius Sipayung, OFMCap', province: 'sumatera-utara' },
  { x: 166, y: 267, name: 'Keuskupan Sibolga', bishop: 'Mgr. Fransiskus Tuaman Sasfo Sinaga', province: 'sumatera-utara' },
  { x: 237, y: 370, name: 'Keuskupan Padang', bishop: 'Mgr. Vitus Rubianto Solichin, SX', province: 'sumatera-barat' },
  { x: 405, y: 451, name: 'Keuskupan Agung Palembang', bishop: 'Mgr. Yohanes Harun Yuwono', province: 'sumatera-selatan' },
  { x: 424, y: 548, name: 'Keuskupan Tanjungkarang', bishop: 'Mgr. Vinsensius Setiawan Triatmojo', province: 'lampung' },
  { x: 458, y: 417, name: 'Keuskupan Pangkalpinang', bishop: 'Mgr. Adrianus Sunarko, OFM', province: 'bangka-belitung' },
  // Java (7)
  { x: 487, y: 578, name: 'Keuskupan Agung Jakarta', bishop: 'Ignatius Kardinal Suharyo', province: 'dki-jakarta' },
  { x: 485, y: 594, name: 'Keuskupan Bogor', bishop: 'Mgr. Paskalis Bruno Syukur, OFM', province: 'jawa-barat' },
  { x: 518, y: 607, name: 'Keuskupan Bandung', bishop: 'Mgr. Antonius Subianto Bunjamin, OSC', province: 'jawa-barat' },
  { x: 582, y: 627, name: 'Keuskupan Purwokerto', bishop: 'Mgr. Christophorus Tri Harsono', province: 'jawa-tengah' },
  { x: 629, y: 609, name: 'Keuskupan Agung Semarang', bishop: 'Mgr. Robertus Rubiyatmoko', province: 'jawa-tengah' },
  { x: 722, y: 621, name: 'Keuskupan Surabaya', bishop: 'Mgr. Agustinus Tri Budi Utomo', province: 'jawa-timur' },
  { x: 719, y: 650, name: 'Keuskupan Malang', bishop: 'Mgr. Henricus Pidyarto Gunawan, O.Carm', province: 'jawa-timur' },
  // Kalimantan (8)
  { x: 588, y: 333, name: 'Keuskupan Agung Pontianak', bishop: 'Mgr. Agustinus Agus', province: 'kalimantan-barat' },
  { x: 636, y: 327, name: 'Keuskupan Sanggau', bishop: 'Mgr. Valentinus Saeng, CP', province: 'kalimantan-barat' },
  { x: 672, y: 329, name: 'Keuskupan Sintang', bishop: 'Mgr. Samuel Oton Sidin, OFMCap', province: 'kalimantan-barat' },
  { x: 620, y: 403, name: 'Keuskupan Ketapang', bishop: 'Mgr. Pius Riana Prapdi', province: 'kalimantan-barat' },
  { x: 768, y: 420, name: 'Keuskupan Palangkaraya', bishop: 'Mgr. Aloysius Maryadi Sutrisnaatmaka, MSF', province: 'kalimantan-tengah' },
  { x: 795, y: 464, name: 'Keuskupan Banjarmasin', bishop: 'Mgr. Victorius Dwiardy, OFMCap', province: 'kalimantan-selatan' },
  { x: 896, y: 352, name: 'Keuskupan Agung Samarinda', bishop: 'Mgr. Yustinus Harjosusanto, MSF', province: 'kalimantan-timur' },
  { x: 905, y: 220, name: 'Keuskupan Tanjung Selor', bishop: 'Mgr. Paulinus Yan Olla, MSF', province: 'kalimantan-utara' },
  // Bali & Nusa Tenggara (8)
  { x: 826, y: 676, name: 'Keuskupan Denpasar', bishop: 'Mgr. Silvester Tung Kiem San', province: 'bali' },
  { x: 1028, y: 674, name: 'Keuskupan Ruteng', bishop: 'Mgr. Siprianus Horma', province: 'nusa-tenggara-timur-ntt' },
  { x: 1075, y: 683, name: 'Keuskupan Agung Ende', bishop: 'Mgr. Paulus Budi Kleden, SVD', province: 'nusa-tenggara-timur-ntt' },
  { x: 1097, y: 675, name: 'Keuskupan Maumere', bishop: 'Mgr. Edwaldus Martinus Sedu', province: 'nusa-tenggara-timur-ntt' },
  { x: 1131, y: 665, name: 'Keuskupan Larantuka', bishop: 'Mgr. Fransiskus Kopong Kung', province: 'nusa-tenggara-timur-ntt' },
  { x: 1157, y: 736, name: 'Keuskupan Agung Kupang', bishop: 'Mgr. Hironimus Paskalis', province: 'nusa-tenggara-timur-ntt' },
  { x: 1207, y: 696, name: 'Keuskupan Atambua', bishop: 'Mgr. Dominikus Saku', province: 'nusa-tenggara-timur-ntt' },
  { x: 979, y: 712, name: 'Keuskupan Weetebula', bishop: 'Mgr. Edmund Woga, CSsR', province: 'nusa-tenggara-timur-ntt' },
  // Sulawesi (2)
  { x: 993, y: 537, name: 'Keuskupan Agung Makassar', bishop: 'Mgr. Fransiskus Nipa', province: 'sulawesi-selatan' },
  { x: 1204, y: 274, name: 'Keuskupan Manado', bishop: 'Mgr. Benedictus Estephanus Rolly Untu, MSC', province: 'sulawesi-utara' },
  // Maluku (1)
  { x: 1337, y: 476, name: 'Keuskupan Amboina', bishop: 'Mgr. Seno Ngutra', province: 'maluku' },
  // Papua (5)
  { x: 1459, y: 367, name: 'Keuskupan Manokwari-Sorong', bishop: 'Mgr. Hilarion Datus Lega', province: 'papua-barat-daya' },
  { x: 1832, y: 433, name: 'Keuskupan Jayapura', bishop: 'Mgr. Yanuarius Teofilus Matopai You', province: 'papua' },
  { x: 1680, y: 513, name: 'Keuskupan Timika', bishop: 'Administrator Diosesan', province: 'papua-tengah' },
  { x: 1729, y: 543, name: 'Keuskupan Agats', bishop: 'Mgr. Aloysius Murwito, OFM', province: 'papua-selatan' },
  { x: 1821, y: 659, name: 'Keuskupan Agung Merauke', bishop: 'Mgr. Petrus Canisius Mandagi, MSC', province: 'papua-selatan' }
];

type Hub = (typeof hubs)[number];

/**
 * The floating diocese card, placed over the map at the hub's point. Now
 * interactive: it carries a "Cari Jadwal Gereja" button that jumps to the
 * Mass-schedule page already filtered to this diocese's province. It stays
 * open while the pointer is on it — the caller's hover timer bridges the gap
 * between the dot and the card.
 */
function HubLabel({
  hub,
  lang,
  ctaLabel,
  onEnter,
  onLeave,
}: {
  hub: Hub;
  lang: Locale;
  ctaLabel: string;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const xPct = (hub.x / VB_W) * 100;
  const yPct = (hub.y / VB_H) * 100;
  // Keep the card on-canvas near the edges rather than letting it clip.
  const tx = xPct < 18 ? "0%" : xPct > 82 ? "-100%" : "-50%";
  return (
    <div
      className="pointer-events-none absolute z-20"
      style={{ left: `${xPct}%`, top: `${yPct}%` }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div
        className="glass pointer-events-auto w-max max-w-[240px] rounded-xl p-3 text-left shadow-[0_20px_40px_-16px_rgba(0,0,0,0.8)]"
        style={{ transform: `translate(${tx}, calc(-100% - 12px))` }}
      >
        <p className="text-[0.72rem] font-bold leading-tight text-brand-gold">
          {hub.name}
        </p>
        <p className="mt-0.5 text-[0.66rem] leading-tight text-brand-muted">
          {hub.bishop}
        </p>
        <Link
          href={`${href(lang, "massTimes")}/${hub.province}`}
          data-cursor-hover
          className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-brand-gold px-2.5 py-1 text-[0.64rem] font-bold uppercase tracking-[0.08em] text-brand-dark transition-transform hover:scale-[1.03]"
        >
          {ctaLabel}
          <svg
            viewBox="0 0 16 16"
            className="h-2.5 w-2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 8h11M9 4l4 4-4 4" />
          </svg>
        </Link>
        {/* Invisible bridge down to the dot so the pointer never crosses empty
            space on its way to the card. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-full h-4"
        />
      </div>
    </div>
  );
}

export default function IndonesiaMap({
  dict,
  lang,
}: {
  dict: Dictionary;
  lang: Locale;
}) {
  const [active, setActive] = useState<number | null>(null);
  // Small close delay so moving the pointer from a dot up onto its card — or
  // between the two — doesn't dismiss the label mid-reach.
  const closeTimer = useRef<number | null>(null);
  const open = (i: number) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setActive(i);
  };
  const scheduleClose = (i: number) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setActive((cur) => (cur === i ? null : cur));
    }, 160);
  };
  const keepOpen = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };
  return (
    <section className="grain relative overflow-hidden bg-brand-bg px-5 py-20 sm:px-8 sm:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 40%, rgba(214,176,114,0.14), transparent 72%)",
        }}
      />

      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
            {dict.map.eyebrow}
          </p>
        </Reveal>

        {/* The three figures are the section's title now — kept as an <h2> for
            the document outline, shown as the running counters below. */}
        <h2 className="sr-only">{dict.map.heading}</h2>

        <ul className="mt-7 grid grid-cols-3 gap-4 sm:mt-9 sm:gap-10">
          {dict.map.stats.map((stat, index) => (
            <Reveal key={stat.label} as="li" delay={0.08 * index}>
              <p className="text-[clamp(2.4rem,7vw,4.25rem)] font-bold leading-none tracking-[-0.03em] text-brand-light">
                <CountUp value={stat.value} />
              </p>
              <p className="mt-2.5 text-[0.7rem] uppercase tracking-[0.14em] text-brand-muted sm:text-xs">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* The archipelago is 2.2:1 — inside the page's side padding on a phone
          it shrinks to a smudge floating in whitespace. Edge-to-edge below sm,
          and a tighter gap above it, so it reads as the centrepiece it is. */}
      <Reveal
        delay={0.1}
        from="scale"
        className="relative -mx-5 mt-9 max-w-5xl sm:mx-auto sm:mt-16"
      >
        {active !== null && (
          <HubLabel
            hub={hubs[active]}
            lang={lang}
            ctaLabel={dict.map.findMass}
            onEnter={keepOpen}
            onLeave={() => scheduleClose(active)}
          />
        )}
        <svg
          viewBox={INDONESIA_VIEWBOX}
          role="img"
          aria-label={dict.map.heading}
          className="w-full"
        >
          <defs>
            <radialGradient id="hubGlow">
              <stop offset="0%" stopColor="#FFD770" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FFD770" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="landFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EAE5D9" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#D6B072" stopOpacity="0.14" />
            </linearGradient>
          </defs>

          {/* The coastline. */}
          <path d={INDONESIA_PATH_D} fill="url(#landFill)" fillRule="evenodd" />

          {/* Threads between hubs — the whole point of the section. */}
          <g stroke="#D6B072" strokeWidth="1.6" fill="none" opacity="0.4">
            {hubs.slice(0, -1).map((hub, index) => {
              const next = hubs[index + 1];
              const midX = (hub.x + next.x) / 2;
              const midY = Math.min(hub.y, next.y) - 90;
              return (
                <path
                  key={index}
                  d={`M ${hub.x} ${hub.y} Q ${midX} ${midY} ${next.x} ${next.y}`}
                  strokeDasharray="5 10"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="30"
                    to="0"
                    dur="1.6s"
                    repeatCount="indefinite"
                  />
                </path>
              );
            })}
          </g>

          {/* Hubs */}
          <g>
            {hubs.map((hub, index) => (
              <g
                key={hub.name}
                className="cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label={`${hub.name} — ${hub.bishop}`}
                onMouseEnter={() => open(index)}
                onMouseLeave={() => scheduleClose(index)}
                onFocus={() => open(index)}
                onBlur={() => scheduleClose(index)}
              >
                <title>{`${hub.name}\n${hub.bishop}`}</title>
                <circle cx={hub.x} cy={hub.y} r="46" fill="url(#hubGlow)" opacity={active === index ? 0.85 : 0.55} />
                {/* An invisible target a bit wider than the dot. Kept modest so
                    that in tight clusters (Jakarta/Bogor, the Flores chain) the
                    nearer dot still wins the pointer. */}
                <circle cx={hub.x} cy={hub.y} r="15" fill="transparent" />
                <circle cx={hub.x} cy={hub.y} r={active === index ? 9 : 7} fill="#FFD770">
                  <animate
                    attributeName="r"
                    values="5.5;9;5.5"
                    dur="2.8s"
                    begin={`${index * 0.45}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ))}
          </g>
        </svg>
      </Reveal>

      {/* The CC BY-SA 3.0 credit for this coastline moved to the footer — see
          Footer.tsx — rather than being removed. The license requires
          attribution; it doesn't require it to sit under the map specifically. */}
    </section>
  );
}
