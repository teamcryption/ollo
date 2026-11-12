// Full pipeline. Output (packages/build/dist) doubles as the CDN bundle:
//
//   manifest.json                                   every asset + metadata + file paths
//   icons/svg/<style>/<name>.svg                    24px, currentColor
//   icons/svg/<style>/<size>/<name>.svg             16/20/24/32 with optical stroke
//   icons/png/<style>/<size>/<name>@{1,2,3}x.png   (only with LIB_ICON_PNG=1 / --icon-png)
//   icons/sprite/<style>.svg                        <symbol id="lib-<name>">
//   icons/animated/<name>.svg                       CSS-animated SVG (regular style)
//   illustrations/svg/<type>/<name>.svg             default colours
//   illustrations/png/<type>/<name>@{1,2,3}x.png
//   illustrations/animated/<type>/<name>.svg
//   illustrations/templates.json                    {{primary}}-style templates for recolouring
//   preview.html                                    review page
import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { loadAll } from './load.mjs';
import { DIST } from './paths.mjs';
import { processIcon, processIllustration, fillTemplate, iconAtSize, splitSvg } from './svg.mjs';
import { animateSvg } from './motion.mjs';
import { generateReact } from './react.mjs';
import { writePreview } from './preview.mjs';

const t0 = Date.now();
const SCALES = [1, 2, 3];
// Icon PNGs are 12 files per style (4 sizes x 3 scales); at library scale that is ~900k files,
// so they are opt-in here and rendered on demand by the site/CDN. LIB_ICON_PNG=1 restores them.
const ICON_PNG = process.env.LIB_ICON_PNG === '1' || process.argv.includes('--icon-png');
const write = (rel, data) => {
  const f = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, data);
  return rel;
};
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();

const { tokens, icons, illustrations, errors } = loadAll();
if (errors.length) {
  console.error('Asset validation failed:\n  ' + errors.join('\n  '));
  process.exit(1);
}
fs.rmSync(DIST, { recursive: true, force: true });

const warnings = [];
const manifest = { version: 1, generatedAt: new Date().toISOString(), tokens, icons: [], illustrations: [] };
let pngCount = 0;

// ---------- icons ----------
const sprites = {};
for (const icon of icons) {
  icon.out = {};
  const files = { svg: {}, sizes: {}, png: {} };
  for (const [style, raw] of Object.entries(icon.svgs)) {
    const { svg, warnings: w } = processIcon(raw, tokens, style);
    w.forEach((x) => warnings.push(`icons/${icon.name}/${style}: ${x}`));
    icon.out[style] = svg;
    files.svg[style] = write(`icons/svg/${style}/${icon.name}.svg`, svg);
    files.sizes[style] = {};
    files.png[style] = {};
    for (const size of tokens.icon.sizes) {
      const sized = iconAtSize(svg, size, tokens);
      files.sizes[style][size] = write(`icons/svg/${style}/${size}/${icon.name}.svg`, sized);
      if (!ICON_PNG) continue;
      const coloured = sized.replaceAll('currentColor', tokens.icon.primary);
      files.png[style][size] = SCALES.map((s) => {
        pngCount++;
        return write(`icons/png/${style}/${size}/${icon.name}@${s}x.png`, png(coloured, size * s));
      });
    }
    const { attrs, body } = splitSvg(svg);
    const sw = attrs.match(/stroke-width="([^"]+)"/)?.[1];
    (sprites[style] ??= []).push(
      `<symbol id="lib-${icon.name}" viewBox="0 0 24 24" fill="none"${sw ? ` stroke-width="${sw}"` : ''}>${body}</symbol>`
    );
  }
  if (icon.animation) {
    files.animated = write(`icons/animated/${icon.name}.svg`, animateSvg(icon.out.regular, icon.animation));
  }
  const { svgs, out, ...meta } = icon;
  manifest.icons.push({ ...meta, files, markup: icon.out, animatedMarkup: files.animated ? fs.readFileSync(path.join(DIST, files.animated), 'utf8') : null });
}
for (const [style, symbols] of Object.entries(sprites)) {
  write(`icons/sprite/${style}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols.join('')}</svg>`);
}

// ---------- illustrations ----------
const templates = {};
const defaults = tokens.illustration;
for (const ill of illustrations) {
  ill.templates = {};
  const files = { svg: {}, png: {}, animated: {} };
  for (const [type, raw] of Object.entries(ill.svgs)) {
    const { template, warnings: w } = processIllustration(raw, tokens);
    w.forEach((x) => warnings.push(`illustrations/${ill.name}/${type}: ${x}`));
    ill.templates[type] = template;
    const svg = fillTemplate(template, defaults);
    files.svg[type] = write(`illustrations/svg/${type}/${ill.name}.svg`, svg);
    const [w0] = defaults.size;
    files.png[type] = SCALES.map((s) => {
      pngCount++;
      return write(`illustrations/png/${type}/${ill.name}@${s}x.png`, png(svg, w0 * s));
    });
    if (ill.animation) {
      files.animated[type] = write(`illustrations/animated/${type}/${ill.name}.svg`, animateSvg(svg, ill.animation));
    }
  }
  templates[ill.name] = ill.templates;
  const animatedTemplates = ill.animation
    ? Object.fromEntries(Object.entries(ill.templates).map(([k, v]) => [k, animateSvg(v, ill.animation)]))
    : null;
  const { svgs, templates: _t, ...meta } = ill;
  manifest.illustrations.push({ ...meta, files, templates: ill.templates, animatedTemplates });
}
write('illustrations/templates.json', JSON.stringify(templates));

// ---------- manifest (lean copy without markup for the CDN, full copy for the preview) ----------
const lean = {
  ...manifest,
  icons: manifest.icons.map(({ markup, animatedMarkup, ...m }) => m),
  illustrations: manifest.illustrations.map(({ templates: _a, animatedTemplates: _b, ...m }) => m),
};
write('manifest.json', JSON.stringify(lean, null, 2));

// ---------- React + preview ----------
const reactCount = generateReact({ icons, illustrations, tokens });
// The single-file preview embeds every style at every size; above a few thousand icons that exceeds V8's maximum
// string length, so it shows a sample (it is a pipeline check; the site has the full browser).
const PREVIEW_MAX = 1500;
writePreview({ ...manifest, icons: manifest.icons.slice(0, PREVIEW_MAX) }, path.join(DIST, 'preview.html'));

console.log(
  `Built ${icons.length} icons (${icons.reduce((n, i) => n + Object.keys(i.svgs).length, 0)} styles), ` +
    `${illustrations.length} illustrations, ${pngCount} PNGs, ${Object.keys(sprites).length} sprites, ` +
    `${reactCount} React components in ${Date.now() - t0}ms`
);
if (warnings.length) console.warn('Warnings:\n  ' + warnings.join('\n  '));
