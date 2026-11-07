# Library

Icons + illustrations (static and animated), one source of truth, three outputs: website, Figma plugin, developer packages. See `CLAUDE.md` for the product brief.

## Layout

| Path | What |
|---|---|
| `packages/assets` | Source of truth. `icons/<name>/{light,regular,bold,duotone,fill}.svg + meta.json`, `illustrations/<name>/{stroke,fill,duotone}.svg + meta.json`, `tokens.json`, JSON schemas, raw Figma exports. |
| `packages/build` | The pipeline. Outputs `dist/` (the CDN bundle + `manifest.json` + `preview.html`) and generates `packages/react/src/generated`. |
| `packages/react` | `@library/react` - tree-shakeable components (`<HomeIcon variant size color strokeWidth />`, `<ServerStackIllustration type primary secondary />`). |
| `apps/web` | Next.js site (step 2). |
| `apps/figma-plugin` | Figma plugin (step 4). Will read `dist/manifest.json`. |

## Commands

```bash
pnpm install
pnpm build              # turbo: assets pipeline -> React package
pnpm assets:validate    # check every meta.json + svg
pnpm assets:import      # re-import packages/assets/figma-export/*.json into source files
```

## Asset format

- **Icons** - 24x24 viewBox, exported straight from Figma. The pipeline replaces `#171729` (`icon/primary`) with `currentColor`, hoists the stroke width to the root `<svg>` and keeps path order intact (motion targets path indexes). Duotone tint is `fill-opacity=.25` of the same colour, so one colour drives every style.
- **Optical sizing** - per-size stroke multiplier in `tokens.json -> icon.opticalStroke` (16px x1.25, 20px x1.1, 24px x1, 32px x0.875). Used for the per-size SVG/PNG output and by the React component.
- **Illustrations** - 260x260. Hex colours become `{{primary}}`, `{{secondary}}`, `{{background}}`, `{{ink}}` templates so any surface can recolour them. Named `<g>` layers become `data-part` attributes (animation targets).
- **Motion** - `meta.json -> animation`, a renderer-agnostic keyframe spec (`schema/motion.schema.json`): tracks of `scale | rotate | translateX | translateY | opacity | draw` with times, values and per-segment easing. Compiled today to CSS-animated SVG; the same spec will drive Lottie/dotLottie and GIF export.

## Build output (`packages/build/dist`, CDN layout)

```
manifest.json
icons/svg/<style>/<name>.svg              icons/svg/<style>/<size>/<name>.svg
icons/png/<style>/<size>/<name>@{1,2,3}x.png
icons/sprite/<style>.svg                  icons/animated/<name>.svg
illustrations/svg/<type>/<name>.svg       illustrations/png/<type>/<name>@{1,2,3}x.png
illustrations/animated/<type>/<name>.svg  illustrations/templates.json
preview.html
```

## Re-exporting from Figma

The container can't reach the Figma REST API without a personal token, so exports go through the Figma MCP server: run `node.exportAsync({ format: 'SVG_STRING', svgIdAttribute: true })` for every variant in the Icons board (`12:2`) and Illustrations board (`8:5`), save to `packages/assets/figma-export/{icons,illustrations}.json`, then `pnpm assets:import && pnpm build`. Hand edits to `meta.json` (tags, notes) survive a re-import.

## Not done yet

- Lottie / dotLottie / GIF export (spec is ready; renderer next).
- Motion for mail, chat, folder and all illustrations is approximated from the brief (`"source": "approximated"`), pending a Figma keyframe export.
- React package emits extensionless ESM imports - fine for bundlers; add `.js` extensions or a bundler (tsup) before publishing to npm.
