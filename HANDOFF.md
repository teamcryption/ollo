# Icon & Illustration Library: Handoff

Prepared 2026-11-10 for Abdur's other Claude account. This file is the whole memory of the project so far. A Claude that reads it should be able to continue exactly where the work stopped, with the same system, the same rules and the same quality bar.

**Owner:** Abdur Rahman (GitHub `teamcryption`).
**State on handoff:** 1,949 unique icons (each in 5 styles = 9,745 SVGs) after icon batch 95, commit `d325db8`. Figma website design approved. Icon creation paused by Abdur on 2026-11-10. Illustrations, animated-icon exports and the website build have not started.

---

## 0. First steps for the new Claude

1. Read this whole file, then `CLAUDE.md` and `packages/forge/README.md` in the repo.
2. Get the code (section 6). Prefer the GitHub repo once Abdur has pushed it; otherwise restore from `library.bundle` or `library-1949-icons.zip`.
3. Run `pnpm install && pnpm --filter @library/forge test && pnpm build` and confirm `ls packages/assets/icons | wc -l` prints **1949**.
4. Connect the Figma connector and confirm you can read file `NqyRMhIekr7P5eCV0kvX4m` (section 4).
5. **Rebuild and publish the icon preview page and show it to Abdur** (section 1A). He reviews everything through this page and expects the exact same UI. The old link belongs to the old account and cannot be updated from here, so publish a new Artifact and give him the new link.
6. **Do not start icon batches until Abdur says so.** His last instruction was "don't create icons anymore" (2026-11-10). Ask him which of the remaining work (section 11) he wants first.

---

## 1. Standing rules (Abdur's preferences: always follow)

These come straight from Abdur. Treat every one as a rule, not a suggestion.

**Working style**
- Concise, iterative updates. Fast execution over long planning. Show work for review early (preview links, screenshots) before scaling up.
- Once a direction is approved, keep going without waiting. For icons he said: "don't wait for me to approve it. Create one by one. Once one done, start another one." Reply only at real milestones (every few batches or when there is a question), and when you do, say the next batch has already started so it doesn't read as waiting.
- Quality is never traded for speed or tokens. He asked for medium effort to save tokens ("keep the quality same. don't lose quality"), and later raised effort to high for bigger batches. If a lower effort starts to hurt quality, tell him instead of lowering the bar.
- Batch size he agreed to: **25–30 finished icons per batch** (draft about 40 concepts; about 70% pass review). He asked for 200–300 once; 25–30 was the agreed compromise to keep quality.
- **Originality:** competitors (Hugeicons, Lordicon, Flaticon, Liniqo) are references for the system and UX only. Never copy, trace or closely imitate their icons, illustrations or branding. Every asset is drawn from scratch. Avoid trademark look-alikes (3-ellipse atom = React logo, USB trident, Apple command key).
- Every icon gets **every state variant it needs** (example: lock is drawn both closed `lock` and open `lock-open`).

**Brand and UI**
- Brand colour: **royal blue `#3A57FF`, used sparingly.** UI is mostly black and white and minimal, following the **60-30-10 rule**. Primary buttons and selected chips are black (white in dark mode). Blue only for active accents: copied tile, focus ring, switches, sliders, links, logo. No green anywhere (jade was rejected). Greys are true neutral.
- A light tint of the brand blue marks selected items (e.g. selected collection: `brand/primary-subtle` background + `text/brand`).
- Fonts: **Bricolage Grotesque** for headings (primary), **Figtree** for body/UI (secondary), **JetBrains Mono** for code.
- Focus / selected style: **double layer**: a 1px brand border inside plus a 4px soft halo outside (`effect/focus-ring`, `effect/error-ring`). Never a single plain stroke. Hover = border change, **no drop shadow**.
- Design must feel human-designed, not generic "AI slop", with attractive interactions.
- Light and dark mode for everything. Breakpoints: desktop 1440, tablet 834, iPhone 14 (390).
- Spacing, padding and sizes follow Material 3 and Simple Design System (4pt grid). Not their colours or icons.

**How assets are shown on the site**
- Top-left switch: **Icons | Illustrations.** Only one type shows at a time. Filters change with the mode (icons: Light/Regular/Bold/Duotone/Fill; illustrations: Stroke/Fill/Duotone + animation).
- Left **Collections** panel lists **industries / categories** (SaaS, E-commerce, Finance, Healthcare...), never variants like "Animated".
- **Icon tiles** (layout from Figma node `29-2`): solid rounded tile behind each icon (no pixel grid), slight corner radius, no buttons, no hover overlay. **Click copies the SVG**, the tile gets the highlight (blue border + soft ring), and a toast appears at the bottom.
- **Animated icons:** same tile as static icons, auto-animate, no grid, no play button, highlight on hover.
- **Illustration cards:** minimal, one style at a time (Stroke selected for now), animate on hover, hover highlight uses the same blue border + ring as a copied icon, no drop shadow.
- **Illustrations display in black/white per mode** (black on light, white on dark), never purple or brand colours. Colour swatches stay as a recolour-before-download option with mono selected by default.
- **Download modal only for illustrations and animated icons** (static icons just copy). Layout modelled on Liniqo's: preview left (no grid, no player bar), right side Customize (colour swatches, theme, line weight, **Background incl. transparent**), format switch SVG/PNG/Lottie, motion/trigger (Loop/Hover/Click), Copy + Download.

---

## 1A. The icon preview page (this is the UI Abdur sees; keep it exactly as it is)

Abdur reviews the icon library through one published page, and he wants to keep seeing **this exact UI** on the new account. Reference screenshots are in the repo at `docs/handoff/preview-dark.png` (his screenshot, dark mode) and `docs/handoff/preview-light.png` (rebuilt from the repo on 2026-11-10 to prove it reproduces).

What the page has (all generated by `packages/forge/src/review.mjs` + `src/review.template.html`; do not redesign it):
- Header: black "L" logo + **Library**, **Icons | Illustrations `next`** switch, search field with `/` shortcut, light/dark toggle (moon).
- Left sidebar: **WHAT'S NEW** (Latest batch, Last 5 batches, with counts and NEW tags) and **COLLECTIONS** (All icons 1,949, then the 42 categories with counts; active item has the light blue tint).
- Main: "All icons" title + subtitle "1,949 icons, each in Light, Regular, Bold, Fill and Duotone. Click any icon to copy its SVG.", **Grid / All styles** view switch, **S / M / L** tile size.
- Filter bar: Style chips (Light, Regular (selected, black), Bold, Fill, Duotone), **Animated** toggle, Colour swatches (ink, royal blue, green, red, amber, multicolour picker), Size select (16/20/24/32).
- Grid of solid rounded tiles with the icon and its name; click copies the SVG, highlights the tile (blue border + soft ring) and shows a toast. Animated toggle turns tiles into auto-playing animations; clicking one opens the download panel (no grid, no player, Background incl. transparent).

How to rebuild and publish it (about 12 MB: a 374 KB page plus 42 collection JSON files):
```bash
mkdir -p /tmp/review
cd packages/forge && node src/review.mjs /tmp/review/index.html
# -> "review page: 1949 icons, page 374 KB + 42 collection files ..."
node ../../tools/shot.cjs /tmp/review /tmp/shot      # optional: screenshots to check it before publishing
```
Publish with the Artifact tool: `file_path=/tmp/review/index.html`, `root=/tmp/review`, and a `files` map listing **all 42** `data/<category>.json` files (`{"data/interface.json": "data/interface.json", ...}`), title "Library Icons", icon "grid". Republish the whole set (all 42 files) after every batch, to the same URL. Send Abdur the link and save it in project memory.

---

## 2. What we are building

One place for **icons + illustrations (static and animated)**, easier to use than Hugeicons, Lordicon, Flaticon or Liniqo, at a better price. Three outputs from one source of truth:
1. **Website**: browse, search, recolour, resize, one-click copy or download.
2. **Figma plugin**: drag assets onto the canvas.
3. **Developer packages**: React components (later Vue/Svelte), raw SVG, CDN.

Downloads offered per asset: Copy SVG, Copy JSX, Download SVG / PNG (1×/2×/3×) / dotLottie / Lottie JSON / GIF, live colour picker (main + secondary for duotone), size switcher (16/20/24/32). Bulk zip download for a selection or a whole category.

**Targets**
- Icons: **~15,300 unique concepts × 5 styles ≈ 76,500 SVG files** (Abdur chose to count the 70–80k goal as files). Per-category targets are in `packages/forge/taxonomy.json` (section 10).
- About a third of each category comes from variants (directions, badges, mirrors, off, containers); two thirds are separately drawn concepts.
- Illustrations: isometric scene library (no count set yet; ask Abdur).

---

## 3. Build order (original plan and where it stands)

| Step | What | State |
|---|---|---|
| 1 | Repo scaffold + asset format + build pipeline (10 sample icons, 5 sample illustrations from Figma) | Done |
| – | Website design system + screens in Figma | Done, approved 2026-11-07 ("good to go"; Abdur fixes small leftovers himself) |
| – | Icon library at scale | 1,949 / ~15,300, paused |
| 2 | Website MVP (browse, search, recolour, copy, download SVG/PNG, then Lottie/GIF) | Not started; waits for Abdur's go |
| 3 | React package published | Package exists and generates; not published |
| 4 | Figma plugin | Placeholder only |
| 5 | Illustrations at scale, accounts, pricing (free + pro) | Not started |

Abdur's stated order after the Figma approval: icons continue, **then illustrations**, and the website build when he gives the go.

---

## 4. Figma

- File: `https://www.figma.com/design/NqyRMhIekr7P5eCV0kvX4m/Library` (file key `NqyRMhIekr7P5eCV0kvX4m`).
- Original approved boards: Icons board node `12:2` ("Icons v3 — Modern Sample Set"), Illustrations board node `8:5` ("Illustrations v2 — Sample Set").
- Pages added by Claude: **Design System** (node `17-122`: colour, type, spacing, radius, elevation, ~20 components each in light and dark) and **Website Screens** (node `17-123`: 22 frames, each light and dark).
  - Icon grid view (primary layout): node `29-2`.
  - Animated icon download popup: node `32-896`.
  - Illustrations screen: node `33-4883`.
  - Animated Icon Card component: node `42:8127`.
- Variable collections: **Library Tokens** (asset colours; modes "Mode 1" original colours, "Dark" `22:0`, "Site Light" `40:0`), **DS Primitives** (royal/50–950, neutral greys), **DS Color** (Light/Dark), **DS Dimensions** (space/radius/size on a 4pt grid).
- Logo is a placeholder; Abdur will replace it.
- **Access:** figma.com is blocked by the container proxy. Use the Figma MCP connector only: `get_screenshot`, `get_metadata`, `use_figma` (load the figma-use skill first). Export with `node.exportAsync({ format: 'SVG_STRING', svgIdAttribute: true })` in `use_figma`, about 48 KB per call. Motion keyframes via `get_motion_context`.
- Figma quirk: cloning a frame and setting an explicit Library Tokens mode resets the 25% duotone `tone` fill opacity on icon instances to 100%. Re-apply 0.25 after any clone.

---

## 5. Repo structure and pipeline

Monorepo, **pnpm 10 + Turborepo**, Node ≥ 20. Branch with all work: `icons/batch-1` (`main` holds the step 1 scaffold).

| Path | What |
|---|---|
| `CLAUDE.md` | Product brief. Read first every session. |
| `packages/assets` | Source of truth. `icons/<name>/{light,regular,bold,duotone,fill}.svg + meta.json`; `illustrations/<name>/{stroke,fill,duotone}.svg + meta.json`; `tokens.json`; JSON schemas (`icon`, `illustration`, `motion`); raw Figma exports in `figma-export/`. |
| `packages/forge` | Where icons are drawn. Geometry DSL → 5 styles + variants + motion + QA. `defs/<category>[-N].mjs` (460 files), `src/variant-plan.mjs`, `taxonomy.json`, `src/review.mjs` (review page). |
| `packages/build` | Pipeline: SVGO clean-up, `#171729` → `currentColor`, stroke hoisted to root, sprites, optical per-size SVGs, CSS-animated SVG, React codegen, `dist/manifest.json`, `preview.html`. Icon PNGs off by default (`LIB_ICON_PNG=1` restores). |
| `packages/react` | `@library/react`: `<HomeIcon variant size color strokeWidth />`, `<ServerStackIllustration type primary secondary />`. Emits extensionless ESM imports; add `.js` extensions or tsup before publishing. |
| `apps/web` | Next.js site (placeholder README). |
| `apps/figma-plugin` | Figma plugin (placeholder README). Will read `dist/manifest.json`. |

Commands:
```bash
pnpm install
pnpm build                                   # turbo: assets pipeline -> React package
pnpm assets:validate                         # check every meta.json + svg
pnpm assets:import                           # re-import packages/assets/figma-export/*.json
pnpm --filter @library/forge test            # forge tests
node packages/forge/src/generate.mjs         # draw + QA + write all icons
node packages/forge/src/generate.mjs --check # QA only, writes nothing
node packages/forge/src/generate.mjs --only=arrows,files
node packages/forge/src/review.mjs <outdir>  # build the review page + data/<category>.json
```

Asset format details:
- Icons: 24×24 viewBox. One colour variable `icon/primary` (`#171729` → `currentColor`). Duotone tint = `fill-opacity=.25` of the same colour, so one colour drives every style. Path order is kept (motion targets path indexes).
- Optical stroke per size (`tokens.json → icon.opticalStroke`): 16px ×1.25, 20px ×1.1, 24px ×1, 32px ×0.875 (still a proposal awaiting Abdur's sign-off).
- Illustrations: 260×260, radius 16. Hex colours become `{{primary}}`, `{{secondary}}`, `{{background}}`, `{{ink}}`. Named `<g>` layers become `data-part` (animation targets).
- Motion: `meta.json → animation`, a renderer-agnostic keyframe spec (`schema/motion.schema.json`): tracks of `scale | rotate | translateX | translateY | opacity | draw` with times, values and per-segment easing. Compiled today to CSS-animated SVG; the same spec is meant to drive Lottie/dotLottie and GIF export (not built yet).

CDN output layout (`packages/build/dist`):
```
manifest.json
icons/svg/<style>/<name>.svg              icons/svg/<style>/<size>/<name>.svg
icons/png/<style>/<size>/<name>@{1,2,3}x.png   (only with LIB_ICON_PNG=1)
icons/sprite/<style>.svg                  icons/animated/<name>.svg
illustrations/svg/<type>/<name>.svg       illustrations/png/<type>/<name>@{1,2,3}x.png
illustrations/animated/<type>/<name>.svg  illustrations/templates.json
preview.html
```

---

## 6. Where the code is and how to move it

- **No GitHub repo exists yet.** The repo name is still an open question (section 12). Claude cannot create GitHub repos; Abdur creates an empty one and gives Claude the name.
- Copies:
  - Old project files: `library-repo/library.bundle` (git bundle with full history and every branch: `icons/batch-1` = shipped work + this handoff commit, `icons/batch-96-drafts`, `main` = step 1 scaffold), `library-repo/library-1949-icons.zip` (`git archive` of batch 95, no history), plus older `library-step1/batch1/batch2.tar.gz`. `handoff/` holds this file and the preview screenshots.
  - Abdur's PC, `C:\Users\USER\Documents\Library\`: `library-1949-icons.zip`, `library.bundle` (same as above), `HANDOFF.md`, and the two preview screenshots.
  - Inside the repo: `HANDOFF.md` (this file), `docs/handoff/preview-*.png`, and `tools/` (`sheet.mjs` contact sheet, `ship.sh` build/test/commit/review, `shot.cjs` review-page screenshots).
- Restore from the bundle (keeps history, needed for the review page's "What's new"):
  ```bash
  git clone library.bundle library && cd library
  git checkout icons/batch-1
  git remote remove origin
  git remote add origin https://github.com/teamcryption/<repo-name>.git
  git push -u origin --all
  ```
  If only the zip is available, `git init`, commit everything as one commit, then push. Note: the review page reads batch numbers from commit subjects, so without history every icon shows as one batch.

---

## 7. Icon drawing system

**Grid and look**
- 24×24 grid, live area 3–21 (centre-line warning outside 2.5–21.5; hard limit 0.75–23.25 including the Bold half-stroke).
- Sizes 16, 20, 24, 32; optical stroke per size, not linear scaling.
- Modern and elegant: soft continuous curves, no sharp joins, round caps and joins.
- **One small floating accent per icon**: a short line or curve with a visible gap, never touching the outline. Pure direction glyphs (arrows category, `accent: false`) are exempt.

**Five styles from one drawing**

| Style | Spec |
|---|---|
| Light | 0.75 stroke |
| Regular (default) | 1 stroke |
| Bold | 1.5 stroke |
| Duotone | 1 outline + main shape filled with the same colour at 25% opacity |
| Fill | solid single colour; inner details are knocked-out gaps (~1.3) so parts stay separate |

Render constants (`packages/forge/src/render.mjs → SPEC`): fillLine 1.5 (solid bar for lines outside a body in Fill), knockout 1.3, fillGap 1.1 (layer separation in Fill), coverGap 2.25 (distance from a front shape's centre line to where back lines stop), duotoneOpacity 0.25, ink `#171729`.

**Writing an icon** (`defs/<category>-N.mjs`):
```js
icon('file-text', 'File Text', ['document', 'text', 'page'], [
  body(PAGE),                    // closed main shape
  line(FOLD),                    // a stroke
  line(L(9, 12.5, 15, 12.5)),
  accent(L(9, 16, 12.5, 16)),    // the floating accent; QA checks it never touches anything
], { badges: ['add', 'check', 'close'], anim: 'pop-draw' })
```
Helpers (`src/geo.mjs`): `L` line, `R` rounded rect, `C` circle, `E` ellipse, `A` arc, `poly` soft-cornered polyline/polygon, `head` arrow head, `arcArrow`, `star`, `gear`, `D` dot, `rotateD` / `mirrorD` / `translateD`.

| Role | Light / Regular / Bold | Duotone | Fill |
|---|---|---|---|
| `body` | outline | outline + 25% tint | solid (grown to the Regular outline's outer edge) |
| `line` | stroke | stroke | knocked-out 1.3 gap inside a body, solid 1.5 bar outside |
| `accent` | stroke | stroke (40% when the icon has no body) | same as `line` |
| `tint` | – | 25% area only | – |

`cover: true` puts an element in front: everything drawn before it is cut back by a gap (stacked cards, badges, slashes).

**Variants** (one drawing becomes a family; which icon gets which lives in `src/variant-plan.mjs`, add entries every batch):
- `turns: { up: -90, down: 90, left: 180 }` with `dir: 'right'`: direction variants, renamed, re-tagged, motion vector rotated.
- `mirror: { name, title, axis }`: undo/redo, trend up/down.
- `variants: [...]`: hand-drawn siblings (toggle on/off, zoom in/out).
- `badges: ['add', 'remove', 'check', 'close', 'alert']`: status disc bottom right; base cut back around it.
- `off: true`: `<name>-off` with the slash in front.
- `containers: ['circle', 'square']`: glyph shrunk into a frame (`plus-square`, `pause-circle`).
- `extend: true`: the base is a Figma icon; only variants are drawn (`user-add`, `mail-check`).
- `siblings: ['lock-open']`: a Figma icon in this family (for the duplicate check).
- Rule of thumb: objects people collect or manage get badges; things that can be switched off get `off`; bare glyphs used as buttons get a container.

**Motion presets** (`src/motion.mjs`): `pop-draw` (default: bodies pop in with scale + fade ease-out-back, lines draw on), `spin`, `wiggle`, `pulse`, `nudge` (with direction), `bounce`. Approved behaviours: bell rings (rotation wiggle), heart pulses, search scans (translate), lock shackle lifts and closes then shakes. Timeline ~3 s, loopable.

**Naming decisions**
- Figma `lock` renamed `lock-open`; forge draws closed `lock`.
- Interface `pin` is the map pin; `pushpin` is the thumbtack.
- Emoji faces are variants of `face-smile`.
- Names are kebab-case, unique, never start with a digit (`3d-printer` broke the TS identifier).

---

## 8. QA (runs on every generate; errors block the write)

From `packages/forge/src/qa.mjs`:
- **grid**: hard error if anything leaves 0.75–23.25 including the Bold half-stroke; warning if centre-lines leave the 2.5–21.5 live area (draw inside 3–21).
- **accent**: the floating accent keeps **1.85** centre-line clearance (Bold 1.5 + 0.35 visible gap) from every other element, measured to outlines (an accent inside a body is fine if it stays 1.85 from the edge). Icons with no meaningful accent use `noAccent: true`; arrows category is exempt.
- **fill**: Fill needs ≥ 6 units² of ink and Fill ink ≥ 0.75 × Bold ink at 32px (catches broken boolean ops).
- **duplicates**: Regular raster at 32px, 16px average-hash prefilter (hamming ≤ 48), then Hausdorff shape distance **≤ 1.5px = duplicate**. Rotation-invariant. Error across families, warning within a family. Above 4,000 icons candidates come from LSH buckets.
- **meta**: kebab-case name, unique, ≥ 3 tags, category from `taxonomy.json`.
- Report: `packages/forge/reports/qa.json`.

Manual checks on top of the automated ones (every batch):
- **Visual sheet review**: render the new icons in all 5 styles and look at them. Redraw or drop weak ones. Expect ~30% of drafts to be dropped.
- **Name collision checks** before drafting and again on final names (see pitfalls).

---

## 9. The batch workflow (one batch, in order)

Helper scripts are in the repo under `tools/` (`sheet.mjs`, `ship.sh`, `shot.cjs`), made path-independent for the handoff.

1. **Pick concepts.** Draft about 35–45 concepts for a batch of 25–30 (60–75% survive review). Pull from `taxonomy.json` targets, favouring the thinnest categories (section 10). Every concept must be original and readable at 16px: mostly one body plus 1–3 lines.
2. **Check every name before drawing.** In `packages/assets/icons`:
   ```bash
   ls packages/assets/icons | tr -d - > /tmp/names.txt
   grep -qx "<name-without-hyphens>" /tmp/names.txt && echo TAKEN
   ls packages/assets/icons | grep -i "<stem>"      # near-names and reordered words
   ```
   Names collide once hyphens are removed (hot-dog/hotdog, x-ray/xray, hair-dryer/hairdryer) because React component names drop hyphens. No leading digits. `generate.mjs` does **not** reject a def whose name already exists, so also run `[ -d packages/assets/icons/<name> ]` on every final name.
3. **Write the defs.** Find the next free file number with `ls packages/forge/defs | sort -V` and create new `defs/<category>-<N>.mjs` files. **Never overwrite or append to an existing defs file.** One `icon()` per line.
4. **Generate + QA.** In `packages/forge`:
   ```bash
   node src/generate.mjs 2>&1 | grep -E "Generated|QA errors|duplicate|fill:|accent: el|grid:"
   ls ../assets/icons | wc -l     # trust this, not the "Generated N" line (it undercounts)
   ```
   Any QA error means nothing is written; fix and rerun.
5. **Visual review (mandatory).** `node tools/sheet.mjs /tmp/sheet.png "name1,name2,..." big` renders each new icon in all 5 styles (QA errors red, warnings amber). Look at it. Drop anything unclear, look-alike or with a broken Fill; fix accents and live-area overflows. For each drop: delete its def line **and** `rm -rf packages/assets/icons/<name>` (generate does not delete dropped icons, so they would ship).
6. **Variants.** Add entries to `packages/forge/src/variant-plan.mjs` for the new icons: `off` for things that switch off, `badges` for objects people manage, `containers` for bare glyphs used as buttons. Regenerate.
7. **Ship.** `tools/ship.sh "Icons batch N: <count> <topics> icons" "Adds a, b, c in all five styles."` runs the build, build tests, forge tests, `tsc --noEmit` on the React package, commits, optionally bundles (`BUNDLE=...`), and builds the review page. **Keep the subject format exactly** (`Icons batch N: ...`): the review page parses `batch N` from commit subjects for its Latest batch / Last 5 batches / NEW tags. If you pipe it through `| tail`, check `git log -1` afterwards because a failed step can be hidden. Push to GitHub after each batch once the repo exists.
8. **Publish the review page.** `node packages/forge/src/review.mjs <dir>/index.html` writes `index.html` plus `data/<category>.json` for all 42 categories. Publish it as an Artifact with `root=<dir>` and a `files` map containing **all 42** `data/<cat>.json` files (republish all every time). Optional check: `node tools/shot.cjs <dir> /tmp/shot` screenshots the Latest, Last 5 and All views. Review page design: royal blue minimal theme, categories-only collections with a blue tint on the active one, solid tiles, click to copy + toast, Animated toggle with auto-playing tiles and a download panel (no grid, no player, Background incl. transparent).
9. **Wrap up.** Update the progress line in project memory and the checklist. Start the next batch immediately. Reply to Abdur only at milestones (roughly every 150 icons), saying the next batch has already started.

Last numbers for reference: batch 95 added 23 icons; batches 91–95 added 22–27 each. Last milestone reply was at 1,949; the next was planned at ~2,100.

---

## 10. Progress by category (after batch 95)

Unique concepts done vs target (`taxonomy.json`). Total **1,949 / 15,300** (12.7%).

Sorted thinnest first (by % of target). Each icon ships in 5 styles, so files = concepts × 5.

| Category (id) | Done | Target | % |
|---|---:|---:|---:|
| social | 14 | 275 | 5% |
| design | 38 | 675 | 6% |
| business | 47 | 675 | 7% |
| development | 45 | 600 | 8% |
| actions | 35 | 450 | 8% |
| data | 30 | 375 | 8% |
| ai | 18 | 225 | 8% |
| finance | 43 | 525 | 8% |
| people | 38 | 450 | 8% |
| health | 47 | 525 | 9% |
| energy | 18 | 200 | 9% |
| maps | 28 | 300 | 9% |
| emoji | 22 | 200 | 11% |
| education | 35 | 300 | 12% |
| security | 36 | 300 | 12% |
| transport | 54 | 450 | 12% |
| logistics | 27 | 225 | 12% |
| travel | 46 | 375 | 12% |
| animals | 37 | 300 | 12% |
| devices | 84 | 675 | 12% |
| commerce | 57 | 450 | 13% |
| media | 72 | 525 | 14% |
| tools | 42 | 300 | 14% |
| notifications | 18 | 125 | 14% |
| navigation | 33 | 225 | 15% |
| text | 33 | 225 | 15% |
| buildings | 33 | 225 | 15% |
| files | 80 | 525 | 15% |
| sports | 58 | 375 | 15% |
| science | 36 | 225 | 16% |
| celebration | 33 | 200 | 16% |
| interface | 113 | 675 | 17% |
| communication | 64 | 375 | 17% |
| arrows | 90 | 525 | 17% |
| weather | 41 | 225 | 18% |
| time | 38 | 200 | 19% |
| nature | 58 | 300 | 19% |
| gaming | 44 | 225 | 20% |
| home | 90 | 450 | 20% |
| fashion | 45 | 225 | 20% |
| accessibility | 16 | 75 | 21% |
| food | 113 | 525 | 22% |

Recent batches pulled physical objects (home, food, sports, tools, travel, devices) because yield was good there. The UI-heavy categories (social, design, business, development, actions, data, ai) are furthest behind and should come next: they also gain the most from badge, off and container variants.

---

## 11. What is left

**A. Icon library (paused; resume only when Abdur says so)**
1. **Batch 96 drafts** are on branch `icons/batch-96-drafts` (commit `e966e55`), generated but **not reviewed or shipped**. 34 icons:
   - 24 new concepts: high-chair, diaper, bib, crib-mobile, clothes-rack, wall-shelf, honey-dipper, egg-basket, chocolate-bar, pudding, pepper-mill, cake-stand, golf-tee, quiver, fencing-mask, laurel, telegraph, utility-pole, travel-pillow, sleep-mask, baggage-claim, funicular, hot-spring, nas.
   - 10 `-off` variants: ceiling-fan, desk-lamp, flashlight, cctv, doorbell, speaker, smoke-detector, motion-sensor, sprinkler, ring-light.
   - Defs in `home-26`, `food-25`, `sports-22`, `communication-10`, `energy-9`, `travel-14`, `devices-14`, plus the variant-plan tail.
   - Known issues: travel-pillow is outside the live area (2.35–21.65), shrink it; laurel leaves are computed in JS, check they look right; no contact-sheet review yet, expect to drop ~25%.
   - To finish: check out the branch, run the sheet review, fix/drop, then bring the result onto `icons/batch-1` as one commit `Icons batch 96: <count> <topics> icons`. (The same drafts are also in `refs/stash` in the bundle; the branch is the one to use.)
2. **Continue batches** toward ~15,300 concepts, thinnest categories first (section 10), 25–30 icons per batch, same QA.
3. **Lottie / dotLottie / GIF export** for animated icons: not built. The motion spec in each `meta.json` is ready; write the renderer in `packages/build`.
4. Real Figma keyframes for the approximated motions (mail, chat, folder).

**B. Illustrations (next after icons, per Abdur)**
- Only the 5 approved samples exist (server-stack, analytics, mobile-app, secure-vault, delivery). Needs: an illustration forge (like the icon forge) for isometric 30° scenes on a base slab, 260×260 cards, radius 16; three types Stroke (1.2 ink line, hidden lines removed by filling faces with background), Fill (one colour, faces separated by 1.2 lines in the background colour), Duotone (side faces primary, top faces + accents secondary, same separation lines); tokens primary `#6B54F5`, secondary `#AC9FFF`/`#C6BDFF` (open), background `#F7F7FF` (card fill and separation lines, always equal), ink `#171729`; animations: gentle floats/bobs, drop-in with small bounce, lines typing on, padlock snapping shut, ~3.2 s loop.
- On the site they render black/white per mode; colours are a download option.
- Collections are industries (SaaS, E-commerce, Finance, Healthcare...). Ask Abdur for the scene list and count before scaling.

**C. Website build (waits for Abdur's go)**
- Next.js in `apps/web`, built from the approved Figma (Design System + Website Screens pages). Reuse the DS tokens and components; double-layer focus ring; no single-stroke focus states; no drop shadows on hover.
- Features: Icons/Illustrations switch, Collections sidebar (industries), style filters, search, click-to-copy icons with toast + highlight, animated icon tiles, download modal for illustrations and animated icons, light/dark, desktop/tablet/mobile.
- Then React package publishing (`.js` extensions or tsup), Figma plugin (`apps/figma-plugin`, reads `dist/manifest.json`), accounts and pricing (free + pro).

---

## 12. Open questions for Abdur

- **GitHub repo name** (still not chosen; suggestion was `library`). He creates the empty repo; Claude pushes.
- Illustration secondary colour: Figma has `#AC9FFF`, the brief says `#C6BDFF`. `tokens.json` currently uses `#AC9FFF`.
- Optical stroke multipliers (16px ×1.25, 20px ×1.1, 32px ×0.875) are a proposal awaiting sign-off.
- Motion for mail, chat, folder and all 5 sample illustrations was approximated from the brief (`"source": "approximated"`), pending a Figma keyframe export.
- How many illustrations, which scenes and which industries first.
- Whether static icons need a background option when copying (he said he forgot what he meant; left as is).
- The two UI kits (Material 3, Simple Design System) never arrived as files; public specs were used for spacing.

---

## 13. Pitfalls already learned (save yourself the time)

- `generate.mjs` does not delete asset folders of dropped defs, and does not reject a def whose name already exists. Remove dropped icons by hand; check names by hand.
- Name collisions after removing hyphens break React component names (tsc catches them late). Leading digits are invalid TS identifiers. Watch reordered names (printer-3d vs 3d-printer).
- Duplicate check (32px, rotation-invariant) keeps tripping on ring+centre glyphs (record, add-circle, refresh-square), plain triangles, pills, and Figma icons like share (nodes). Pairs that kept failing: crosswalk~raft, room-divider~map, stylus~syringe, jeans~trousers, radiation~radioactive, bear~pig, focus~fit-screen, flute~ruler, grip-horizontal~grip-vertical. Give new icons a distinct silhouette; don't add rotated copies as new concepts.
- Custom badge glyphs (heart/star in the badge disc) fail the duplicate check against user-add etc.; only distinct glyphs like a clock or key survive.
- `cover` does not cut a closed rounded rect drawn behind it in outline styles: draw the visible part as an open line instead.
- A `body` with overlapping subpaths breaks Fill: use separate `body()` elements. A line that pokes outside its body should be its own element or Fill drops the inner part.
- Thin bodies (≤ 3 wide) with several knock-outs fail the Fill/Bold ink ratio.
- Side-view vehicles share `W=(a,b,r=2,y=17.5)=>body(C(a,y,r)+C(b,y,r),{cover:true})`.
- Rotation helper: `const rot=(els,deg,dx,dy)=>els.map(e=>({...e,d:translateD(rotateD(e.d,deg),dx,dy)}))` (rotation about 12,12).
- Corner radii by convention: outer boxes R 1.5–3, small parts 0.5–1, `poly(pts, r, true)` 0.5–1.5, pills r = h/2.
- resvg `img.pixels` is a copying getter: read it once or you run out of memory. paper.js compound-path subtract must be done per child on a clone.
- Known pre-existing QA noise to ignore: wifi, wifi-off and gamepad outside the live area; face-* duplicates (emoji faces are face-smile variants); lock~lock-open; "no floating accent" on old icons.
- Piping `ship.sh` through `| tail` can hide a failed step; always check `git log -1`.
- figma.com is blocked by the container proxy; only the Figma MCP connector works.
- Figma: after cloning a frame and setting a Library Tokens mode, re-apply the 0.25 duotone tone opacity.

---

## 14. Setting up the new project (for Abdur)

1. **GitHub:** create an empty repo on github.com under `teamcryption` (pick the name). Connect GitHub to Claude on the new account (claude.ai → connect GitHub) and install the Claude GitHub App on that repo. Then tell Claude the name; it restores the bundle and pushes all branches (section 6). If you prefer, push it yourself from the PC: clone the bundle with git and `git push -u origin --all`.
2. **Project:** create a new project on the new account. Attach the repo. Upload `library.bundle` and `library-1949-icons.zip` to the project files as a backup.
3. **Figma:** connect the Figma connector on the new account with the same Figma login that owns file `NqyRMhIekr7P5eCV0kvX4m` (or share the file with the new Figma login as editor).
4. **Instructions:** paste this whole file into the new project's instructions (if it is too long for the instructions box, paste sections 0, 1, 1A and 12 and tell Claude the full file is `HANDOFF.md` in the repo).
5. **Environment:** the cloud environment needs network access to npm (pnpm install) and GitHub. Node ≥ 20 and pnpm 10.
6. **First message to Claude** (suggested): "Read HANDOFF.md, restore the repo, run the checks, publish a new icon preview, then wait for my go on what to do next."
