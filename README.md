# NEXERA

Marketing site for NEXERA — a digital agency working across web development,
e-commerce, AI automation, marketing and branding.

Built as a single scroll-driven page: Next.js 15 (App Router) + React 19 +
Tailwind CSS v4 + GSAP 3 (ScrollTrigger, ScrollSmoother, SplitText, DrawSVG).

---

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

| Script             | What it does                                              |
| ------------------ | --------------------------------------------------------- |
| `npm run dev`      | Dev server                                                  |
| `npm run build`    | Production build                                            |
| `npm start`        | Serve the production build                                  |
| `npm run typecheck`| `tsc --noEmit`                                              |
| `npm run format`   | Prettier (with Tailwind class sorting)                      |
| `npm run audit`    | Headless behaviour suite — see [Verification](#verification)|
| `npm run perf`     | Frame-time and Web Vitals measurement                       |

Deploys as-is to Vercel, or anywhere that runs a Next.js Node server.

---

## Deploying

`vercel.json` pins the framework:

```json
{ "framework": "nextjs", "buildCommand": "next build", "installCommand": "npm ci" }
```

That is deliberate, not boilerplate. This Vercel project was created while the
repo still held nothing but the two brand images, so it was saved with no
framework — a plain static site that publishes the repo root and runs no build.
It reported *success* on every push (there was nothing to fail) and served a
`404: NOT_FOUND`, because there is no `index.html` at the root. Settings in
`vercel.json` override the dashboard, so this forces a real Next.js build
regardless of how the project was first detected.

Set `NEXT_PUBLIC_FORM_ENDPOINT` under Settings → Environment Variables to point
the contact form at a real inbox.

## Design system

Both palettes and the typography were taken from the brand assets in
[`brand/`](brand/) and are defined once, as Tailwind v4 theme tokens, in
[`src/app/globals.css`](src/app/globals.css).

| Token                          | Value     | Where it came from                |
| ------------------------------ | --------- | --------------------------------- |
| `--color-void` / `--color-black-2` | `#06070a` / `#0a0a0b` | design-system board, "Secondary" |
| `--color-navy`                 | `#0e151d` | brand board background            |
| `--color-surface-3`            | `#1f1f22` | design-system board, "Tertiary"   |
| `--color-ink`                  | `#f5f5f7` | design-system board, "Neutral"    |
| `--color-blue`                 | `#4e7de8` | the logo's chevron / arrow        |
| `--color-violet`               | `#8b5cf6` | design-system board, "Primary"    |

The five services sit on a blue→violet ramp (`#4E7DE8 → #6478EE → #7B6BF4 →
#8B5CF6 → #A855F7`) so each discipline has its own accent without leaving the
brand.

Type is **Geist** (display), **Inter** (body) and **JetBrains Mono** (labels),
matching the design-system board, loaded through `next/font` and self-hosted.

### The logo

The wordmark and monogram are **vector geometry, not a font or an image** —
[`src/components/brand/Logo.tsx`](src/components/brand/Logo.tsx). Each letter,
the blue chevron bracket and the shard in the X are separate paths, so the
intro can wipe letters individually and draw the chevron. The monogram reuses
the wordmark's own X glyph with its upper-right arm lifted out into the arrow.

---

## Content

All copy, services, process steps, projects and stats live in
[`src/lib/content.ts`](src/lib/content.ts). Nothing else needs editing to
change what the site says.

The five projects in the work grid are real — Sushirito, Gorilla Pizza, Solis,
Sooki and LANE9 — described from their own repos and READMEs, linked to their
live sites, and illustrated with a screenshot of each. Every entry has an
optional `result` field for a measured outcome; it renders in the project's
accent colour above the summary, and is left off wherever there is no real
number to quote yet.

### Project thumbnails

`public/work/*.webp`, 960×600 (16:10), ~18–33 KB each, 123 KB for all five.
They are real screenshots, not mockups: each project was cloned, built and
served locally, then captured at a 1280×800 viewport once its intro animation
had settled. To refresh one, rebuild that project, serve it, and screenshot it
at 1280×800; then resize to 960×600 and save as WebP at quality 72.

The `<img>` carries explicit `width`/`height` and `loading="lazy"`, so the
grid reserves its space before the file arrives — the thumbnails cost nothing
in layout shift (CLS stays 0) and nothing at first paint.

> **The stats row is still placeholder numbers.** Swap those before launch.

### Contact form

With no configuration the form validates client-side and hands off to the
visitor's mail client. To send enquiries to a real inbox, set a form endpoint
(Formspree, Basin, a Next route handler — anything that accepts a `POST` of
`FormData`):

```bash
# .env.local
NEXT_PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxx
```

`CONTACT_EMAIL` and `WHATSAPP` in `src/lib/content.ts` drive the mail
fallback, the contact block, the footer and the page's JSON-LD. `WHATSAPP.href`
is a `wa.me` link, so the number there must stay bare — no `+`, spaces or
dashes — while `WHATSAPP.display` is the formatted version shown on screen.

The section eyebrows (`[ 01 ]` … `[ 05 ]`) are written into each section
component and are positional, so they have to be renumbered by hand if the
order in `src/app/page.tsx` changes. `NAV_LINKS` is ordered to match the page.

---

## How the motion works

Everything scroll-driven goes through GSAP. A few decisions worth knowing
before editing:

**ScrollSmoother owns the scroll on pointer devices, and hands it straight
back on touch.** It is created with `smoothTouch: 0`, so phones scroll
natively — no interpolation, no added latency. Smoothed touch scrolling is the
single biggest source of "laggy" feel on mobile.

**Anything `position: fixed` must live outside `<SmoothScroll>`.** The smoother
transforms its content wrapper, and a transformed ancestor makes `fixed`
resolve against that wrapper instead of the viewport. The nav, cursor, scroll
progress bar and preloader are all rendered as siblings of it in
[`src/app/page.tsx`](src/app/page.tsx).

**`position: sticky` does not work while the smoother is active** — for the
same reason, the wrapper is `overflow: hidden; position: fixed` and never
actually scrolls. The stacking service cards and the pinned process heading
use `ScrollTrigger` pins instead, which behave identically in both scroll
modes. Reach for a pin, not `sticky`.

**Entrance animations start from a CSS pre-state behind `html.nx-js`.** An
inline script in the document head sets that class before first paint. If
JavaScript never runs, or motion is reduced, the class is absent and every
`[data-anim]` element renders fully visible — content is never trapped
invisible.

**`prefers-reduced-motion` is honoured throughout.** Every animation lives
inside a `gsap.matchMedia("(prefers-reduced-motion: no-preference)")` block,
the smoother is not created at all, and the preloader is skipped.

**`metadataBase` must be the host the site is actually served from.** Link
previews resolve `og:image` against it, so a placeholder domain means the
image 404s and Instagram, WhatsApp and the rest fall back to scraping the
first image in the page — which made a project thumbnail the preview. It is
derived from Vercel's `VERCEL_PROJECT_PRODUCTION_URL` at build time, with
`NEXT_PUBLIC_SITE_URL` as the override for a custom domain. The card itself
is `public/og.jpg` (1200x630, ~66 KB), rendered from the site's own hero so
it cannot drift from the brand.

**Never start a scroll reveal from a staggered `gsap.fromTo()`.** A stagger
makes GSAP render the "from" state on the first target only; every other
target keeps its natural value until its own start time arrives, then snaps
to the "from" value and animates. On the manifesto sentence that meant the
whole paragraph sat fully lit before the sweep began, and each word popped
as its turn came. Set the resting state with `gsap.set()` first, then `to()`
it. `scripts/audit.mjs` asserts the sweep is empty at progress 0, partway at
the midpoint and complete at the end, so it cannot regress quietly.

**`ScrollTrigger.refresh()` is expensive and is called exactly once**, on the
frame after web fonts settle (`SmoothScroll.tsx`). A refresh reverts and
re-measures every pin; firing it from several places used to stack into a
one-second blocking task on a throttled phone. Don't add more.

**`ignoreMobileResize: true`** stops the mobile URL bar showing/hiding from
counting as a viewport resize. Without it, every such change forces a full
refresh mid-scroll, which is what makes pinned sections stutter on phones.

---

## Verification

Two headless suites run against a production build. Start the server first:

```bash
npm run build && npm start &
npm run audit      # 22 behaviour / accessibility checks
npm run perf       # frame times + Web Vitals, incl. CPU-throttled phones
```

`npm run audit` runs 33 checks covering the mobile drawer (touch target size, `aria-expanded`,
scroll lock, Escape, anchor offset), reduced-motion, a JavaScript-disabled
render, form validation and focus management, keyboard entry, and the manifesto's
word-by-word sweep, and the Open Graph tags (the last two exist because both
failed silently in production — see below).

Both scripts read `NEXERA_URL` (default `http://localhost:3000/`) and
`CHROMIUM_PATH` if you need to point at a specific browser.

Measured on this build — desktop 1440px, and phones with 4×/6× CPU throttling:

| | LCP | CLS | scroll p50 | scroll p95 | frames > 50 ms |
| --- | --- | --- | --- | --- | --- |
| Desktop 1440 | 224 ms | 0 | 16.7 ms | 17.5 ms | 0 / 418 |
| Phone, 4× CPU throttle | 360 ms | 0 | 16.7 ms | 19.1 ms | 0 / 418 |
| Phone, 6× CPU throttle | 408 ms | 0 | 16.9 ms | 25.4 ms | 1 / 417 |

A 16.7 ms median frame is a locked 60 fps, and it holds on a phone emulated
at 6× slower than this machine. The remaining cost is load-time work — React
hydration plus GSAP setup — not scrolling.

---

## Layout

```
src/
  app/            layout, page composition, design tokens + global CSS
  components/
    brand/        Wordmark + Monogram vector marks
    sections/     Hero, Ticker, Manifesto, Work, Process,
                  Services, Contact, Footer
    ui/           Button, Magnetic, Marquee, icons
    *.tsx         Preloader, Nav, Cursor, ScrollProgress,
                  SmoothScroll, AnchorScroll, Reveals, SignalField
  lib/            gsap registration, content, device tiers, ready signal
brand/            the source brand board + design-system board
scripts/          audit.mjs, perf.mjs
```
