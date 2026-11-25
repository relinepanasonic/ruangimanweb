# Feature slider media

Drop files here and the home-page slider picks them up. **Nothing here is
required** — every card renders a gold gradient and a line icon on its own, so
the section is complete without a single file. Each file you add just replaces
one fallback.

## Don't edit the images in this folder by hand

They're generated. Full-resolution originals live in **`design/`** at the repo
root, outside `public/` so they aren't served or deployed:

```
design/card-backgrounds/<slug>.jpg   the 896x1200 art as generated
design/screens/<slug>N.png           full-size app screenshots
```

Add or replace a file there, then:

```bash
node scripts/process-card-media.mjs
```

That writes the web-sized versions into this folder — backgrounds at 720×960
JPEG, screens at 320×640 PNG. The originals are ~650 KB each; the versions the
browser actually loads come out at 21–61 KB, which matters because ten of them
are on one page.

## What goes where

For each feature `<slug>`:

| File | Size | Purpose |
|---|---|---|
| `public/features/<slug>.mp4` | 720 × 960 (3:4) | card background film |
| `public/features/<slug>.jpg` | 720 × 960 (3:4) | still background, and the film's poster frame |
| `public/features/icons/<slug>.mp4` | 128 × 128 | animated badge, plays over the line icon |
| `public/features/screens/<slug>.png` | 320 × 640 (1:2) | **real app screenshot**, shown inside the phone |

The phone in the middle of each card currently renders a hand-built mock of
that feature's screen (see `src/components/home/FeatureScreen.tsx`). Drop a real
screenshot at `screens/<slug>.png` and it covers the mock — that's the single
highest-value file you can add, because it shows people the actual app.

Capture at a 1:2-ish portrait ratio with the status bar included, or crop to
just the app content; either reads fine at the size it renders.

The ten slugs, in slider order:

```
01 profil            06 temukan
02 bagikan           07 chat
03 alkitab           08 pusat-komunitas
04 renungan          09 kabar
05 doa               10 jadwal-misa
```

Slugs are shared across both locales — the films are the same on `/id` and
`/en`. They're defined in `src/i18n/dictionaries/id.ts` under `features.items`.

## Specs

**Background films.** H.264 MP4, no audio track, 6–10 seconds, seamlessly
looping (first and last frame should match), **under 2 MB each**. Ten of these
autoplay on one page, so weight matters more than resolution — 720 × 960 at a
moderate bitrate looks fine at the size these cards actually render.

**Icon films.** Same codec, 2–4 seconds, seamless, under 200 KB. MP4 can't carry
transparency, so give them a near-black background (`#0E1013`) — the badge is
dark glass and it blends.

To compress and strip audio:

```bash
ffmpeg -i input.mp4 -vf "scale=720:960:force_original_aspect_ratio=increase,crop=720:960" \
  -an -c:v libx264 -crf 30 -preset slow -movflags +faststart profil.mp4

# poster from the first frame
ffmpeg -i profil.mp4 -vframes 1 -q:v 4 profil.jpg
```

---

# The phone screens: captured, not generated

**Don't generate these.** Nine of the ten are real screenshots of the app.

A generated app UI would be plausible-looking and wrong — invented fonts, fake
Indonesian, layouts that don't exist — and the entire point of the phone is to
show people the real thing before they tap through.

| Slug | Source | State |
|---|---|---|
| `alkitab` `renungan` `doa` `pusat-komunitas` `kabar` `jadwal-misa` | captured signed-out from the live site | ✅ |
| `profil` `temukan` | captured signed-in | ✅ |
| `bagikan` | captured signed-out | ⚠️ shows an empty state — no posts exist when signed out |
| `chat` | — | ❌ falls back to the hand-built mock |

**Still worth adding:** `chat` (from `/community/messages`) and a signed-in
re-shoot of `bagikan` with real posts in it. Screenshot at phone width, drop
the file in `design/screens/`, and re-run the processing script below.

Desktop-width captures don't work here — squeezed into a 1:2 phone frame they
read as a shrunken website rather than an app. Shoot at ~390px wide.

---

# Generation prompts

## Nano Banana 2 — card background stills

These are the `<slug>.jpg` files. Generate at **3:4 portrait**, export around
720 × 960, keep each under ~250 KB.

What the brief has to account for: this image is **not** the subject of the
card. A phone sits on top of it, a dark scrim covers the bottom 40% for the
copy, and the whole thing renders about 380px wide. So it needs to be dark,
low-contrast, and quiet in the centre where the phone lands — a busy or bright
image fights the device and makes the title unreadable. Ask for the light to
pool at the *edges*, not the middle.

**Style block — paste this before every subject below, unchanged.** Keeping it
identical across all ten is what makes them read as one set rather than ten
unrelated pictures.

> Cinematic still photograph, 3:4 portrait, shot on a fast prime at f/1.8.
> Very dark, near-black scene (#0E1013) with warm gold light (#D6B072) as the
> only colour present — no blue, no teal, no green, no white balance drift.
> Deep shadow across the centre of the frame with the light pooling toward the
> edges and corners, leaving the middle calm and uncluttered. Shallow depth of
> field, fine natural film grain, soft highlight rolloff. Indonesian setting
> and Indonesian people. Reverent, intimate and quiet — never bright, never
> corporate stock photography. No text, no lettering, no signage, no logos, no
> watermarks, no UI, no phones, no screens.

The "no phones, no screens" line matters — the card already has one, and a
second device in the artwork looks like a mistake.

| Slug | Subject to append to the style block |
|---|---|
| `profil` | A young Indonesian man alone in a dark room wearing over-ear headphones, eyes closed, head tilted back, listening. A single warm gold lamp rims his cheek and shoulder from the left edge of frame; everything else falls to black. Shot from slightly below. |
| `bagikan` | An unsent handwritten letter and a fountain pen on a dark wooden table, lit by one warm gold lamp low in the corner of the frame. Nobody present. The paper catches just enough light to read as paper, not as text. |
| `alkitab` | Macro of the gilt page edges of a closed leather Bible resting on dark wood, raking gold side-light catching the gold leaf. Extremely shallow focus, the spine falling into black. |
| `renungan` | Dawn light through a shuttered window laying warm gold bars across an empty dark table and a cooling cup of coffee. Dust motes suspended in the light. The room before anyone else is awake. |
| `doa` | A wooden rosary hanging from weathered fingers against a black background, the crucifix catching a single hard gold light from the left. Hands only, no face, no context. |
| `temukan` | Two Indonesian men greeting each other with a warm two-handed handshake in the dim entrance hall of a church, gold light spilling from a doorway behind them so they read as lit-edged silhouettes. Shot wide, both figures small in the frame. |
| `chat` | Two empty chairs turned slightly toward each other in a dark parish hall, one warm gold lamp behind them. Nobody in frame — the composition implies the conversation rather than showing it. |
| `pusat-komunitas` | A wide, underexposed shot of young Indonesians arranging chairs and setting up a small stage in a parish hall, lit only by warm practical lights overhead so they read as gold-lit silhouettes mid-motion. |
| `kabar` | A parish noticeboard thick with overlapping pinned papers and photographs, lit by one warm gold lamp from the side. Papers blurred enough that nothing is legible. Shot at an angle. |
| `jadwal-misa` | The interior of an empty Indonesian Catholic church at golden hour, long shafts of warm gold light falling through high windows across rows of empty pews toward the altar. Symmetrical, still, the building waiting. |

If a result comes back too bright or too busy in the middle — which is the
usual failure — add: *"darker overall, deeper shadows through the centre of the
frame, reduce contrast, move the light source further toward the frame edge."*

## House style — for the background FILMS (video)

> Cinematic vertical video, 3:4 portrait aspect. Near-black background around
> #0E1013. Warm gold light (#D6B072) is the only colour in the frame — no blue,
> no teal, no green. Shallow depth of field, one slow deliberate camera move,
> soft natural film grain. Indonesian setting and Indonesian people. Reverent
> and quiet, never corporate stock footage. No text, no captions, no logos, no
> watermarks.

Keeping this block identical across all ten is what makes them read as one set
rather than ten unrelated clips.

## The ten backgrounds

**01 · `profil` — Your Profile**
> A young Indonesian man sits alone in a dark room wearing over-ear headphones,
> eyes closed, head tilted slightly back, listening. A single warm gold lamp
> rims his cheek and shoulder from the left; the rest falls to black. Very slow
> push-in. He is still — this is someone at rest, not performing.

**02 · `bagikan` — Share What's On Your Mind**
> Extreme close-up of a young woman's hands typing slowly on a phone in a dark
> room. The screen throws warm gold light up onto her fingers and the edge of a
> blanket. Slow drift from the left. Only hands and phone in frame, face out of
> shot.

**03 · `alkitab` — A Bible Worth Reading**
> Macro shot of an open Bible on a dark wooden table, thin gilt-edged pages
> turning slowly on their own in a draught. Hard gold side-light rakes across
> the paper, catching the gold leaf on the page edges. Background falls to pure
> black. Camera holds nearly still; only the pages move.

**04 · `renungan` — Daily Devotional**
> Dawn light through a shuttered window falling in warm gold bars across an open
> book and a cooling cup of coffee on a dark table. Dust motes drift through the
> light. Very slow pan right. Nobody in frame — this is the room before anyone
> else is awake.

**05 · `doa` — Catholic Prayer**
> Macro shot of a wooden rosary slipping bead by bead through weathered fingers
> against a black background. Warm gold light from one side catches the crucifix
> as it swings. Slow motion. Hands only, no face.

**06 · `temukan` — Find Each Other**
> Two Indonesian men greet each other with a warm two-handed handshake in the
> dim entrance hall of a church. Gold light spills from a doorway behind them,
> putting them in near-silhouette with lit edges. Shallow focus, slight slow
> motion, gentle handheld drift.

**07 · `chat` — Private & Group Chat**
> Two phones lying face-up on a dark table at night, side by side, their screens
> glowing warm gold. A hand enters frame and picks one up. Everything beyond the
> table falls to black. Slow overhead drift.

**08 · `pusat-komunitas` — Community Centre**
> A group of young Indonesians arranging chairs and setting up a small stage in
> a parish hall, lit by warm practical lights overhead. Shot wide and slightly
> underexposed so they read as gold-lit silhouettes in motion. Slow lateral
> dolly. Busy, purposeful, unposed.

**09 · `kabar` — News Across the Community**
> A parish noticeboard covered in overlapping printed notices and photographs,
> lit by a single warm gold lamp. A hand reaches in and pins up one more sheet.
> Slow push-in on the board. Papers should be blurred enough that no text is
> legible.

**10 · `jadwal-misa` — Mass Times Nationwide**
> The interior of an empty Indonesian Catholic church at golden hour. Long
> shafts of warm gold light fall through high windows across rows of empty
> pews toward the altar. Slow, steady push-in down the centre aisle. Utterly
> still — the building waiting.

## The ten icon films

Prepend to each:

> 128 × 128 square looping animation. Flat near-black background #0E1013. A
> single thin gold line-drawn icon, stroke weight even throughout, colour
> #FFD770. Minimal, calm, seamless loop, no text, no background detail, no
> shadows.

| Slug | Motion |
|---|---|
| `profil` | An ID-card outline draws itself; a small circular portrait inside fades in |
| `bagikan` | A speech bubble draws itself, then a four-point spark blinks once inside it |
| `alkitab` | A closed book opens; its pages riffle once and settle |
| `renungan` | An open book with a sun cresting slowly over its top edge |
| `doa` | Two hands rise into a prayer position; a soft glow pulses once above them |
| `temukan` | Two person-outlines drift together from either edge until they touch |
| `chat` | One chat bubble appears, then a second slides in behind it; three dots blink |
| `pusat-komunitas` | A calendar grid draws itself; one square fills gold |
| `kabar` | A folded newspaper unfolds; its text lines draw in as thin rules |
| `jadwal-misa` | A church silhouette draws itself bottom-up; the cross on top lights last |

---

## Still needed, unrelated to this folder

`public/founder.png` — Nico's portrait for the hero. Cut-out PNG with a
transparent background is ideal; a dark studio portrait also works, since the
hero masks the edges with a soft ellipse. Roughly 1600 × 2000 or larger,
bottom-anchored on the subject. Until it exists the hero shows a grey
silhouette.
