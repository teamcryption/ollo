// Builds the review page for a batch: the icon browser from Figma frame 29:2
// (collections sidebar, style chips, solid tiles, click-to-copy + toast) plus an
// "All styles" row view and a download panel for animated icons.
//
//   node src/review.mjs [out.html]     (writes data/<category>.json beside it)
import { execFileSync } from 'node:child_process';
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

// The page carries a light index; each collection's SVG bodies live in data/<category>.json
// next to it and load when that collection is first shown, so the page stays small at any size.
// Which batch first added each icon, read from the commit history ("Icons batch N: ...").
const batchOf = {};
const batchDate = {};
try {
  const log = execFileSync('git', ['log', '--reverse', '--diff-filter=A', '--format=@@%s|%cs', '--name-only', '--', 'packages/assets/icons'], { cwd: path.resolve(ROOT, '../..'), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  let cur = null;
  for (const ln of log.split('\n')) {
    if (ln.startsWith('@@')) { const [subj, date] = ln.slice(2).split('|'); const m = subj.match(/batch (\d+)/i); cur = m ? +m[1] : (/batch 1:/.test(subj) ? 1 : null); if (cur) batchDate[cur] = date; continue; }
    const m = ln.match(/^packages\/assets\/icons\/([^/]+)\/meta\.json$/);
    if (m && cur && !(m[1] in batchOf)) batchOf[m[1]] = cur;
  }
} catch { /* no git: the page simply has no Newest view */ }
const icons = [];
const bodies = {}; // category -> { name: { s, a } }
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
  (bodies[meta.category] ??= {})[name] = anim ? { s, a: anim } : { s };
  icons.push({
    n: name, t: meta.title, c: meta.category, g: meta.tags, src: meta.source === 'forge' ? 'new' : 'figma',
    v: meta.variant?.kind ?? null, k: Object.keys(s).length, m: !!anim, p: meta.animation?.preset ?? (meta.animation ? 'figma' : null), b: batchOf[name] ?? null,
  });
}

const cats = taxonomy.categories.map((c) => ({ id: c.id, title: c.title, target: c.target, batch: c.batch }));
// Sidebar glyphs are needed before any collection loads, so their Regular bodies go inline.
const MINI = ['dashboard', 'sparkle', 'clock', ...Object.values(JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'review.template.html'), 'utf8').match(/const CAT_ICON = (\{[^}]*\})/)[1].replace(/(\w+):/g, '"$1":').replace(/'/g, '"')))];
const byCat = Object.fromEntries(icons.map((i) => [i.n, i.c]));
const mini = Object.fromEntries(MINI.filter((n) => byCat[n]).map((n) => [n, bodies[byCat[n]][n].s.regular]));
const data = {
  icons, cats, mini,
  sw: Object.fromEntries(STYLES.map((s) => [s, tokens.icon.styles[s].strokeWidth])),
  optical: tokens.icon.opticalStroke,
  qa: report ? { errors: report.errors.length, warnings: report.warnings.length, duplicates: report.duplicates.length } : null,
  targetConcepts: cats.reduce((a, c) => a + c.target, 0),
  latest: Math.max(0, ...Object.values(batchOf)),
  batchDate,
};
const html = fs.readFileSync(path.join(ROOT, 'src', 'review.template.html'), 'utf8').replace('__DATA__', JSON.stringify(data).replace(/</g, '\\u003c'));
const dataDir = path.join(path.dirname(out), 'data');
fs.rmSync(dataDir, { recursive: true, force: true });
fs.mkdirSync(dataDir, { recursive: true });
let dataKb = 0;
for (const [cat, b] of Object.entries(bodies)) {
  const json = JSON.stringify(b);
  dataKb += json.length / 1024;
  fs.writeFileSync(path.join(dataDir, `${cat}.json`), json);
}
fs.writeFileSync(out, html);
console.log(`review page: ${icons.length} icons, page ${(html.length / 1024).toFixed(0)} KB + ${Object.keys(bodies).length} collection files ${dataKb.toFixed(0)} KB -> ${out}`);
