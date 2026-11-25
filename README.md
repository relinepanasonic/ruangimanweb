# Ruang Iman — Story & Marketing Site

The public storytelling site for **[Ruang Iman](https://apps.priasejatikatolik.id/)**, the
home app for Catholics in Indonesia. Separate project from the app itself; every
call-to-action on this site sends people into the app.

Built by Nico Japar.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (brand tokens ported from the app) |
| Scroll motion | GSAP + ScrollTrigger, smoothed by Lenis |
| Blog content | The app's existing Supabase (`public.blog_posts`), read-only |
| Deploy | Vercel |

---

## Setup

```bash
npm install
cp .env.example .env.local   # then fill it in
npm run dev                  # http://localhost:3000 → redirects to /id
```

### Environment variables

| Variable | What it does |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | The **app's** Supabase project URL. Blog posts are read from it. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The app's anon (public) key. |
| `NEXT_PUBLIC_APP_URL` | Where every CTA button points. Defaults to `https://apps.priasejatikatolik.id/`. |
| `NEXT_PUBLIC_SITE_URL` | This site's own public URL — canonical tags, OG tags, sitemap. |

> **Only the anon key.** This site never writes and never signs anyone in. The app's
> RLS policy *"Public can read published posts"* already lets anonymous visitors read
> rows where `status = 'published'`, which is exactly what the blog needs. Never put
> `SUPABASE_SERVICE_ROLE_KEY` in this project.

Without the two Supabase values the site still runs — the blog just shows an empty
state explaining what's missing.

---

## Structure

```
src/
├── app/
│   ├── [lang]/              # THE root layout lives here, so <html lang> is per-locale
│   │   ├── layout.tsx       # navbar, footer, Lenis, JSON-LD, metadata
│   │   ├── page.tsx         # home — the scroll experience
│   │   ├── cerita/          # long-form founder story
│   │   ├── fitur/           # full feature breakdown
│   │   ├── blog/            # index + [slug] + generated share cards
│   │   └── opengraph-image.tsx
│   ├── sitemap.ts           # both locales + every blog slug, with hreflang
│   ├── robots.ts
│   └── globals.css          # brand tokens, prose styles, utilities
├── components/
│   ├── home/                # Hero, StoryScroll, FounderStory, FeatureShowcase,
│   │                        # IndonesiaMap, BlogTeaser, CTASection
│   ├── AppButton.tsx        # the ONE outbound CTA — single source of the app URL
│   ├── SmoothScrollProvider.tsx
│   └── …
├── i18n/
│   ├── config.ts
│   ├── get-dictionary.ts
│   └── dictionaries/{id,en}.ts   # ← all site copy lives here
├── lib/                     # supabase, blog queries, site constants
└── proxy.ts                 # locale redirect (Next 16 renamed middleware → proxy)
```

### Where to edit copy

**All of it is in `src/i18n/dictionaries/`.** `id.ts` is the source of truth and defines
the shape; `en.ts` is type-checked against it, so adding a key to one and forgetting the
other is a build error, not a silent gap.

---

## The two scroll sections

The home page's first two screens are the reference-piece animations.

**`Hero.tsx`** — two separate motions. An *entrance* timeline on mount rises the headline
words into place (time-based, so a visitor who never scrolls still sees it), then a
*scrubbed* timeline lifts, shrinks and dissolves the whole block as you scroll. The pin is
CSS `sticky`, not ScrollTrigger's `pin` — sticky never clones nodes or shifts layout, so it
doesn't fight Lenis.

**`StoryScroll.tsx`** — the four story beats as a horizontal filmstrip that vertical scroll
drags sideways. Everything runs off **one** GSAP timeline: the timeline spans
`0 → frames.length - 1`, and panel *i* is centred at position *i*, so the copy drift lines
up with the track by construction.

Two things to know if you change them:

- `xPercent` is a share of the **track's own width** (`frames × 100vw`), but the travel
  needed is only `(frames − 1) × 100vw`. Hence the division in `distance`. Skipping it
  overshoots by a factor of `frames`.
- ScrollTrigger's `%` offsets in `start`/`end` are **not** a share of the section's scroll
  distance. Use timeline positions instead, which is what this does.

Both degrade properly under `prefers-reduced-motion`: the hero lands in its finished state
and the filmstrip becomes an ordinary vertical stack. Lenis doesn't start at all.

---

## Localisation

Bahasa Indonesia is the default; `/` redirects to `/id` (honouring `Accept-Language`, but
falling back to Indonesian). `/en` mirrors it.

Route slugs stay Indonesian in **both** locales (`/en/cerita`, `/en/fitur`) — they're
already indexed that way and it keeps the language toggle a pure prefix swap.

**Blog posts are Indonesian in both locales.** The app's daily generator writes Indonesian
content into `blog_posts`; on `/en` the surrounding UI is English but the posts render as
authored. Splitting them would need a `lang` column on `blog_posts` in the app.

---

## SEO

- `generateMetadata` per route, with canonical + `hreflang` alternates (`id`, `en`, `x-default`).
- `sitemap.xml` lists both locales for every static route and every published blog slug,
  refreshed hourly.
- JSON-LD: `Organization` + `WebSite` + `SoftwareApplication` on every page,
  `AboutPage` on the story, `Article` on each post.
- Share cards are generated at request time by `opengraph-image.tsx` (home and per-post),
  so they stay in sync with the copy — no static PNG to keep updated.

---

## Deploy

1. Push to GitHub, import in Vercel.
2. Set the four env vars from `.env.example` in the Vercel project.
3. Point the domain at it and set `NEXT_PUBLIC_SITE_URL` to the real origin — canonical
   tags, OG URLs and the sitemap all read from it.

---

## Known follow-ups

- `public/logo.png` / `favicon.png` are the app's 548 KB originals. `next/image` handles the
  nav usage, but the favicon is served raw — worth exporting a small one.
- The blog UI has been built against the real `blog_posts` schema but not yet rendered
  against live rows; verify once the Supabase keys are in `.env.local`.
- No analytics wired up yet.
