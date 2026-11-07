// Builds the review page for a batch: the icon browser from Figma frame 29:2
// (collections sidebar, style chips, solid tiles, click-to-copy + toast) plus an
// "All styles" row view and a download panel for animated icons.
//
//   node src/review.mjs [out.html]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { processIcon } from '../../build/src/svg.mjs';
import { animateSvg } from '../../build/src/motion.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ASSETS = path.resolve(ROOT, '../assets');
const out = process.argv[2] ?? path.join(ROOT, 'reports', 'review.html');
const tokens = JSON.parse(fs.readFileSync(path.join(ASSETS, 'tokens.json'), 'utf8'));
const taxonomy = JSON.parse(fs.readFileSync(path.join(ROOT, 'taxonomy.json'), 'utf8'));
const report = fs.existsSync(path.join(ROOT, 'reports', 'qa.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT, 'reports', 'qa.json'), 'utf8')) : null;
const STYLES = ['light', 'regular', 'bold', 'duotone', 'fill'];
const inner = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

const icons = [];
for (const name of fs.readdirSync(path.join(ASSETS, 'icons')).sort()) {
  const dir = path.join(ASSETS, 'icons', name);
  const metaFile = path.join(dir, 'meta.json');
  if (!fs.existsSync(metaFile)) continue;
  const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
  const s = {};
  let regular = '';
  for (const st of STYLES) {
    const f = path.join(dir, `${st}.svg`);
    if (!fs.existsSync(f)) continue;
    const { svg } = processIcon(fs.readFileSync(f, 'utf8'), tokens, st);
    if (st === 'regular') regular = svg;
    s[st] = inner(svg);
  }
  let anim = null;
  if (meta.animation && regular) anim = inner(animateSvg(regular, meta.animation)).replace(/\s+/g, ' ');
  icons.push({
    n: name, t: meta.title, c: meta.category, g: meta.tags, src: meta.source === 'forge' ? 'new' : 'figma',
    v: meta.variant?.kind ?? null, s, a: anim, p: meta.animation?.preset ?? (meta.animation ? 'figma' : null),
  });
}

const cats = taxonomy.categories.map((c) => ({ id: c.id, title: c.title, target: c.target, batch: c.batch }));
const data = {
  icons, cats,
  sw: Object.fromEntries(STYLES.map((s) => [s, tokens.icon.styles[s].strokeWidth])),
  optical: tokens.icon.opticalStroke,
  qa: report ? { errors: report.errors.length, warnings: report.warnings.length, duplicates: report.duplicates.length } : null,
  targetConcepts: cats.reduce((a, c) => a + c.target, 0),
};
const html = fs.readFileSync(path.join(ROOT, 'src', 'review.template.html'), 'utf8').replace('__DATA__', JSON.stringify(data).replace(/</g, '\\u003c'));
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`review page: ${icons.length} icons, ${(html.length / 1024).toFixed(0)} KB -> ${out}`);
