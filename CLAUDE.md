# Icon & Illustration Library — Project Brief

Owner: Abdur Rahman. Read this file first in every session.

## What we're building
One place for **icons + illustrations** (static and animated), easier to consume than Hugeicons, Lordicon, Flaticon or Liniqo, at a better price. Three ways to use it:
1. **Website** — browse, search, recolour, resize, then one-click copy or download.
2. **Figma plugin** — designers drag assets onto the canvas.
3. **Developer packages** — React components (later Vue/Svelte), raw SVG and a CDN.

**Originality rule:** competitors are references for the *system and UX only*. Never copy, trace or closely imitate their icons, illustrations or branding. Every asset is drawn from scratch.

## Design source of truth (Figma)
- File: `https://www.figma.com/design/NqyRMhIekr7P5eCV0kvX4m/Library`
- Icons board (approved): node `12:2` — "Icons v3 — Modern Sample Set"
- Illustrations board (approved): node `8:5` — "Illustrations v2 — Sample Set"
- Variables collection: **Library Tokens**
- Read it with the Figma MCP server (`get_screenshot`, `get_metadata`, `use_figma`).

## Icon system (approved)
- **Grid:** 24 × 24 default; live area 3–21 (≈2–3px padding).
- **Sizes:** 16, 20, 24, 32px. Optically adjust the stroke per size rather than scaling it linearly.
- **Look:** modern and elegant. Soft, continuous curves (no sharp joins), one small floating accent per icon (a short line or curve with a gap; never touching the outline), round caps and joins.
- **Styles:**
  | Style | Spec |
  |---|---|
  | Light | 0.75px stroke |
  | Regular (default) | 1px stroke |
  | Bold | 1.5px stroke |
  | Duotone | 1px outline + main shape filled with the **same colour at 25% opacity** |
  | Fill | solid single colour; inner details are **knocked-out gaps** (~1.3px) so parts stay visually separate |
- **Colour:** one variable `icon/primary` (default `#171729`). Duotone tint is derived from it, so changing one colour updates every style and shade.
- **Animated icons:** outlines pop in (scale + fade, ease-out-back) and inner lines draw on (path trim); bell rings (rotation wiggle); heart pulses (scale); search scans (translate); lock shackle lifts and closes, then shakes. Timeline ~3s, loopable.
- Sample icons so far: home, user, bell, search, heart, mail, lock (currently "unlocked" shape — confirm), folder, calendar, chat.

## Illustration system (approved)
- **Projection:** isometric (30°), objects built from clean boxes and planes on a base slab; cards 260 × 260, radius 16.
- **Types:**
  | Type | Spec |
  |---|---|
  | Stroke | thin 1.2px ink line, hidden lines removed (faces filled with the background colour) |
  | Fill | one solid colour; every face separated by a 1.2px line **in the background colour** |
  | Duotone | side faces = primary, top faces + small accents = secondary; same background-colour separation lines |
- **Tokens:**
  | Variable | Default |
  |---|---|
  | `illustration/primary` | `#6B54F5` |
  | `illustration/secondary` | `#C6BDFF` |
  | `illustration/background` | `#F7F7FF` (card fill **and** separation lines — always the same value) |
  | `illustration/ink` | `#171729` |
- **Animations:** gentle floats/bobs, items dropping in with a small bounce, lines typing on, padlock snapping shut. Smooth easing, ~3.2s loop.
- Sample scenes: Server Stack, Analytics, Mobile App, Secure Vault, Delivery.

## Consumption & downloads (follow Liniqo-level simplicity)
Every asset page/card offers: **Copy SVG**, **Copy JSX**, **Download SVG / PNG (1×/2×/3×) / .lottie (dotLottie) / Lottie JSON / GIF**, plus a live colour picker (main colour; secondary for duotone) and a size switcher (16/20/24/32 for icons). Bulk download (zip) for a selection or a whole category.

## Suggested stack (confirm before starting)
- Monorepo: pnpm + Turborepo.
- `packages/assets` — source SVGs + JSON metadata (name, category, tags, style, size).
- `packages/build` — SVGO clean-up, React component generation, sprite + CDN bundle, PNG export, dotLottie/GIF export for animated assets.
- `packages/react` — published npm package (tree-shakeable, `color`, `size`, `strokeWidth` props).
- `apps/web` — Next.js site: search, filters (style, category, animated), detail drawer with recolour + downloads, pricing/auth later.
- `apps/figma-plugin` — TypeScript Figma plugin reading the same asset JSON.

## Build order
1. Repo scaffold + asset format + build pipeline using the 10 sample icons and 5 sample illustrations exported from Figma.
2. Website MVP: browse, search, recolour, copy, download (SVG/PNG first, then Lottie/GIF).
3. React package.
4. Figma plugin.
5. Scale the asset set (new categories), accounts, pricing (free + pro).

## Working preferences
- Concise, iterative updates; fast execution over long planning.
- Show work for review early (screenshots or preview links) before scaling up.
