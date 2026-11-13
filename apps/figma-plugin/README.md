# apps/figma-plugin: ollo Icons for Figma

Search the ollo library inside Figma and insert any icon as a **component named after the icon**,
with a **Style** variant property:

- Free: Light and Regular variants.
- Pro: adds Bold, Fill and Duotone variants. Until sign-in exists, the **Pro** switch in the
  panel footer unlocks them for testing.

Each icon's component set lives on an `ollo icons` page (one set per icon, reused if you insert
the same icon again). An instance of the chosen style is placed in the middle of your view and
selected. Layers are named after the icon, so nothing needs renaming.

## Run it

1. Start the site, which serves the icon data: `pnpm --filter @library/web dev` (http://localhost:3100).
2. In the Figma desktop app: **Plugins > Development > Import plugin from manifest...** and pick
   `apps/figma-plugin/manifest.json`.
3. Run **Plugins > Development > ollo Icons**.

`dist/` is committed so the plugin loads without a build. After changing `src/`, run
`pnpm --filter @library/figma-plugin build`.

The panel uses the site's own data loader and search (`apps/web/lib`), so results match the
website. When the site is hosted, add its domain to `networkAccess.allowedDomains` in
`manifest.json` and change the data URL in `src/ui.html`.

## Figma-hosted copy (official account)

The plugin also lives in the **admin@cryptionverse.com** Figma account, team "admin's team"
(id `a5462ac4-5bbc-4c68-82b5-92a24a402d51`). Its `ui.html` is `src/shell.html`: a small shell that
loads the panel from the ollo site (`/plugin/panel.js`, `/plugin/panel.css`, written by
`scripts/build.mjs`). UI changes therefore reach Figma after `pnpm --filter @library/figma-plugin build`
without re-uploading the plugin. Only `code.ts` changes need an upload.
