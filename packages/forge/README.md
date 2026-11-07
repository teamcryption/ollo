# @library/forge

Where icons are drawn. Each icon is written once as geometry on the 24 grid; forge turns it
into the five approved styles, derives its variants, attaches motion, runs QA and writes
`packages/assets/icons/<name>/` for the build pipeline.

```bash
pnpm --filter @library/forge generate        # all categories
node src/generate.mjs --only=arrows,files    # some categories
node src/generate.mjs --check                # QA only, writes nothing
node src/review.mjs                          # reports/review.html - the batch review page
pnpm --filter @library/forge test
```

## Writing an icon

```js
icon('file-text', 'File Text', ['document', 'text', 'page'], [
  body(PAGE),                    // closed main shape
  line(FOLD),                    // a stroke
  line(L(9, 12.5, 15, 12.5)),
  accent(L(9, 16, 12.5, 16)),    // the floating accent - QA checks it never touches anything
], { badges: ['add', 'check', 'close'], anim: 'pop-draw' })
```

Helpers (`src/geo.mjs`): `L` line, `R` rounded rect, `C` circle, `E` ellipse, `A` arc,
`poly` soft-cornered polyline/polygon, `head` arrow head, `arcArrow`, `star`, `gear`, `D` dot,
plus `rotateD` / `mirrorD` / `translateD`.

| Role | Light / Regular / Bold | Duotone | Fill |
|---|---|---|---|
| `body` | outline | outline + 25% tint | solid (grown to the Regular outline's outer edge) |
| `line` | stroke | stroke | knocked-out 1.3 gap when inside a body, solid 1.5 bar outside |
| `accent` | stroke | stroke (40% when the icon has no body) | same as `line` |
| `tint` | - | 25% area only | - |

`cover: true` puts an element in front: everything drawn before it is cut back by a gap
(stacked cards, badges, slashes).

## Variants (how one drawing becomes a family)

- `turns: { up: -90, down: 90, left: 180 }` with `dir: 'right'` - direction variants, renamed and re-tagged, motion vector rotated.
- `mirror: { name, title, axis }` - undo/redo, trend up/down.
- `variants: [...]` - hand-drawn siblings (toggle on/off, zoom in/out).
- `badges: ['add', 'remove', 'check', 'close', 'alert']` - status disc at the bottom right; the base is cut back around it.
- `off: true` - `<name>-off` with the slash in front (things that can be switched off).
- `containers: ['circle', 'square']` - the glyph shrunk into a frame (`plus-square`, `pause-circle`).
- `extend: true` - the base is a Figma icon; only its variants are drawn (`user-add`, `mail-check`).
- `siblings: ['lock-open']` - a Figma icon that belongs to this family (duplicate check).

Lines a badge or slash would cut down to a stub are dropped. Which icon gets which variant
lives in `src/variant-plan.mjs`, so the whole library can be audited in one file.

## Motion presets (`src/motion.mjs`)

`pop-draw` (default: bodies pop in, lines draw on), `spin`, `wiggle`, `pulse`, `nudge` (with a
direction), `bounce`. All compile through the existing motion spec, so CSS-animated SVG works
today and the Lottie/GIF exporters will read the same data.

## QA (`src/qa.mjs`) - runs on every generate, errors block the write

- **grid**: nothing leaves the canvas at Bold weight; warning outside the 3-21 live area.
- **accent**: the floating accent keeps a visible gap from everything at Bold weight.
- **fill**: Fill is a real shape and never carries much less ink than Bold (catches broken boolean ops).
- **duplicates**: average-hash candidates, then Hausdorff shape distance at 32px. A copy nudged by
  half a unit scores <= 1.4px, a different glyph in the same frame >= 2px. Above 4,000 icons
  candidates come from LSH buckets instead of all pairs. Same-family pairs are warnings, others errors.
- **meta**: kebab-case names, unique, 3+ tags, category from `taxonomy.json`.

Report: `reports/qa.json`.

## Scale plan

`taxonomy.json` lists 42 categories with a target count each: 15,300 unique concepts x 5
styles = 76,500 SVGs. Batch 1 covers 8 categories (262 new icons plus the 10 Figma samples).
Roughly a third of each category comes from variants (directions, badges, mirrors) and two
thirds are separately drawn concepts. Icon PNGs are no longer pre-rendered by the build
(`LIB_ICON_PNG=1` restores them) because at this scale they would be ~900k files.
