# apps/web: ollo library site

Next.js (App Router) site built from the Figma "Website Screens" page (file `NqyRMhIekr7P5eCV0kvX4m`, node 17:123), using the "DS Color / DS Dimensions" tokens (`app/tokens.css`).

```bash
pnpm install
pnpm --filter @library/web dev        # http://localhost:3100 (rebuilds data first)
```

`scripts/build-data.mjs` reads `packages/assets/icons`, `packages/assets/illustrations` and `packages/forge/taxonomy.json` and writes `public/data/*.json` (git-ignored). Add `?theme=dark` or `?theme=light` to the URL to force a theme.

Screens: Icons grid (29:2), Animated icons (35:5939), animated-icon download modal (35:6787), Illustrations (33:4883), illustration download modal (34:4844), tablet 834 (38:10171, 38:11748), phone 390 (36:7773, 36:8623, 37:9601), each in light and dark.

Exports: animated icons as Lottie JSON, .lottie, GIF and animated SVG; illustrations as SVG (still, Draw, Float), PNG and Lottie. The Lottie/.lottie/frame renderer is `packages/build/src/motion-export.mjs` (shared with the build); GIFs are encoded in the browser with `gifenc`.

## Icon preview page (published after every batch)

The review page at https://claude.ai/artifact/FZsFNNvadJTNKkKmesLT2S is this same UI, bundled into one page:

```bash
node apps/web/scripts/build-preview.mjs <out-dir>     # set LIBRARY_ROOT=<checkout> to read another checkout
```

Publish `<out-dir>/index.html` to that URL with `root=<out-dir>` and the 8 `data/*` files the script prints. It opens on the newest batch ("What's new" in the sidebar, from `Icons batch N:` commit subjects). Downloads are blocked in the artifact viewer, so there Download copies to the clipboard instead.
