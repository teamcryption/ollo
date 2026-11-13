# Hairline figures (live illustrations)

Isometric line illustrations that answer the pointer, built with the Hairline engine
(`kernel.js`, from `@lucasmarkes/hairline`, MIT licence, unchanged).

- `<name>.js` — one figure each (the hairline-create skill's format: `mount`, `range`, `tour`).
- `figures.json` — which figures ship, with site category (`c`), title (`t`) and tags (`g`).
- `node export.mjs` — renders each figure's rest pose to `dist/<name>.svg` (a recolourable
  template) and bundles the engine and figure code into `dist/hairline.json`.
- The website (`apps/web/scripts/build-data.mjs` on `web/ui`) reads `dist/` and derives the
  Fill and Duotone styles; the site runs each figure Animated, Interactive or on Scroll.

Check a figure with the skill's `look.mjs` before adding it to `figures.json`.
