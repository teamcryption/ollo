// Builds the site's static data from the asset source of truth.
//   packages/assets/icons/<name>/{light,regular,bold,duotone,fill}.svg + meta.json
//   packages/assets/illustrations/<name>/{stroke,fill,duotone}.svg + meta.json
//   packages/forge/taxonomy.json (category ids, titles, order)
// Output (apps/web/public/data, git-ignored), compact so 60k+ icons stay small and load on demand:
//   index.json            names, titles, categories, tags, counts; per icon its chunk (k) and
//                         motion recipe (mi); the shared path-attribute table (attrs)
//   icons/o<k>.json       outline chunk: { name: { d: [paths], s: { light, regular, bold, duotone } } }
//                         each style is a list of [path index | new path string, attrs index]
//                         (light, regular and bold share the same paths, only stroke width differs)
//   icons/f<k>.json       fill chunk:    { name: [[path string, attrs index], ...] }
//   motion.json           [unique motion recipes] (59k icons share a few hundred)
//   illustrations.json    templates ({{primary}} etc.) + motion per illustration
// Chunks follow batch order and close at ~5 MB, so a new batch only rewrites the last chunk:
// a republish uploads the changed chunk files plus index.json, not everything.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
// LIBRARY_ROOT reads assets and git history from another checkout (read-only), e.g. the batch branch.
const ROOT = process.env.LIBRARY_ROOT ? path.resolve(process.env.LIBRARY_ROOT) : path.resolve(here, '../../..');
const ASSETS = path.join(ROOT, 'packages/assets');
const OUT = path.resolve(here, '../public/data');
const STYLES = ['light', 'regular', 'bold', 'duotone', 'fill'];
const INK = /#171729/gi;

const tokens = JSON.parse(fs.readFileSync(path.join(ASSETS, 'tokens.json'), 'utf8'));
const taxonomy = JSON.parse(fs.readFileSync(path.join(ROOT, 'packages/forge/taxonomy.json'), 'utf8'));

/** Strip the root size and the XML namespace noise, keep viewBox; colour -> currentColor. */
function cleanIcon(svg) {
  return svg
    .replace(/<\?xml[^>]*>/, '')
    .replace(/\s+/g, ' ')
    .replace(/> </g, '><')
    .replace(/<svg([^>]*)>/, (_, a) => `<svg${a.replace(/\s(width|height)="[^"]*"/g, '')}>`)
    .replace(INK, 'currentColor')
    .trim();
}

/** Motion filter bucket shown on the Animated icons screen. */
function motionKind(spec) {
  const props = new Set(spec.tracks.map((t) => t.property));
  if (props.has('rotate') || props.has('translateX') || props.has('translateY')) return 'wiggle';
  if (props.has('draw')) return 'draw';
  if (props.has('scale') && !props.has('opacity')) return 'pulse';
  return 'pop';
}

// Which batch first added each icon, from commit subjects "Icons batch N: ..." (same rule as the
// review page). Powers "What's new" in the sidebar. No git history: the section is hidden.
const batchOf = {};
const batchDate = {};
try {
  const log = execFileSync('git', ['log', '--reverse', '--diff-filter=A', '--format=@@%s|%cs', '--name-only', '--', 'packages/assets/icons'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  let cur = null;
  for (const ln of log.split('\n')) {
    if (ln.startsWith('@@')) { const [subj, date] = ln.slice(2).split('|'); const m = subj.match(/batch (\d+)/i); cur = m ? +m[1] : null; if (cur) batchDate[cur] = date; continue; }
    const m = ln.match(/^packages\/assets\/icons\/([^/]+)\/meta\.json$/);
    if (m && cur && !(m[1] in batchOf)) batchOf[m[1]] = cur;
  }
} catch {}
console.log(`[1/3] Read batch history: ${Object.keys(batchOf).length.toLocaleString('en-US')} icons, latest batch ${Math.max(0, ...Object.values(batchOf))}`);

/** Round every number in path data to 2 decimals (invisible on a 24 px grid) and re-serialise compactly. */
function roundPath(d) {
  const toks = d.match(/[a-zA-Z]|-?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/gi) ?? [];
  let out = '';
  let prev = '';
  for (const t of toks) {
    if (/[a-zA-Z]/.test(t)) { out += t; prev = t; continue; }
    let n = String(Math.round(parseFloat(t) * 100) / 100);
    if (n === '-0') n = '0';
    n = n.replace(/^(-?)0\./, '$1.');
    const prevNum = prev !== '' && !/[a-zA-Z]/.test(prev);
    if (prevNum && !n.startsWith('-') && !(n.startsWith('.') && prev.includes('.'))) out += ' ';
    out += n;
    prev = n;
  }
  return out;
}

const ROOT_SVG = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">';
const attrs = []; // shared table of path attribute strings (everything except d)
const attrIndex = new Map();
const attrOf = (a) => {
  if (!attrIndex.has(a)) { attrIndex.set(a, attrs.length); attrs.push(a); }
  return attrIndex.get(a);
};
/** svg -> [[d, attrs]] or null when it is not the plain <svg><path/>... shape (kept raw then). */
function parsePaths(svg) {
  const m = svg.match(/^<svg[^>]*>([\s\S]*)<\/svg>$/);
  if (!m || !svg.startsWith(ROOT_SVG)) return null;
  const els = m[1].match(/<path\b[^>]*\/>/g) ?? [];
  if (els.join('') !== m[1]) return null;
  return els.map((el) => {
    const d = el.match(/\sd="([^"]*)"/)[1];
    const rest = el.slice(5, -2).replace(/\sd="[^"]*"/, '').trim();
    return [roundPath(d), rest ? ' ' + rest : ''];
  });
}

const iconDir = path.join(ASSETS, 'icons');
const names = fs.readdirSync(iconDir).filter((n) => fs.existsSync(path.join(iconDir, n, 'meta.json')));
const order = new Map(taxonomy.categories.map((c, i) => [c.id, i]));
const icons = [];
const raw = {}; // name -> { style: svg }
const motionByName = {};

const progress = (step, i, n) => { if (i % 5000 === 0 || i === n) console.log(`${step} ${i.toLocaleString('en-US')} / ${n.toLocaleString('en-US')} icons (${Math.round((i / n) * 100)}%)`); };
let readCount = 0;
for (const name of names) {
  progress('[2/3] Reading SVG files:', ++readCount, names.length);
  const meta = JSON.parse(fs.readFileSync(path.join(iconDir, name, 'meta.json'), 'utf8'));
  const svgs = {};
  let ok = true;
  for (const s of STYLES) {
    const f = path.join(iconDir, name, `${s}.svg`);
    if (!fs.existsSync(f)) { ok = false; break; }
    svgs[s] = cleanIcon(fs.readFileSync(f, 'utf8'));
  }
  if (!ok) continue;
  raw[name] = svgs;
  if (meta.animation) motionByName[name] = meta.animation;
  icons.push({
    n: name,
    t: meta.title ?? name,
    c: meta.category,
    g: (meta.tags ?? []).join(' '),
    m: meta.animation ? motionKind(meta.animation) : undefined,
    b: batchOf[name],
  });
}

// Chunks in batch order (icons without a batch first), closed at ~5 MB per file.
const LIMIT = 5 * 1048576;
const byBatch = [...icons].sort((a, b) => (a.b ?? 0) - (b.b ?? 0) || a.n.localeCompare(b.n));
const outline = [{}];
const fill = [{}];
const size = [{ o: 0, f: 0 }];
const motionTable = [];
const motionIndex = new Map();
const chunkOf = {};
const miOf = {};
for (let i = 0; i < byBatch.length; i++) {
  progress('[3/3] Packing chunks:', i + 1, byBatch.length);
  const ic = byBatch[i];
  const svgs = raw[ic.n];
  const reg = parsePaths(svgs.regular);
  const o = {};
  if (reg) {
    o.d = reg.map(([d]) => d);
    o.s = {};
    for (const st of ['light', 'regular', 'bold', 'duotone']) {
      const ps = st === 'regular' ? reg : parsePaths(svgs[st]);
      if (!ps) { (o.x ??= {})[st] = svgs[st]; continue; }
      o.s[st] = ps.map(([d, a]) => {
        const ref = o.d.indexOf(d);
        return [ref >= 0 ? ref : d, attrOf(a)];
      });
    }
  } else {
    o.x = { light: svgs.light, regular: svgs.regular, bold: svgs.bold, duotone: svgs.duotone };
  }
  const fp = parsePaths(svgs.fill);
  const f = fp ? fp.map(([d, a]) => [d, attrOf(a)]) : svgs.fill;
  const oLen = JSON.stringify(o).length + ic.n.length + 6;
  const fLen = JSON.stringify(f).length + ic.n.length + 6;
  let k = outline.length - 1;
  // Close the chunk at a batch boundary once it is full (a batch bigger than a chunk splits).
  const full = size[k].o + oLen > LIMIT || size[k].f + fLen > LIMIT;
  const boundary = i > 0 && (byBatch[i - 1].b ?? 0) !== (ic.b ?? 0);
  if (full && (boundary || size[k].o + oLen > LIMIT * 1.25 || size[k].f + fLen > LIMIT * 1.25)) {
    outline.push({}); fill.push({}); size.push({ o: 0, f: 0 }); k++;
  }
  outline[k][ic.n] = o;
  fill[k][ic.n] = f;
  size[k].o += oLen;
  size[k].f += fLen;
  chunkOf[ic.n] = k;
  const spec = motionByName[ic.n];
  if (spec) {
    const key = JSON.stringify(spec);
    if (!motionIndex.has(key)) { motionIndex.set(key, motionTable.length); motionTable.push(spec); }
    miOf[ic.n] = motionIndex.get(key);
  }
}
for (const ic of icons) {
  ic.k = chunkOf[ic.n];
  if (ic.n in miOf) ic.mi = miOf[ic.n];
}

// Default ("Most popular") order until real usage data exists: the approved Figma sample
// set first, then base concepts before their variants (fewer name parts first), then
// taxonomy order and name.
const SAMPLE = ['home', 'user', 'bell', 'search', 'heart', 'mail', 'lock', 'folder', 'calendar', 'chat'];
const rank = (i) => {
  const s = SAMPLE.indexOf(i.n);
  return s >= 0 ? s : 100 + i.n.split('-').length * 100;
};
icons.sort(
  (a, b) => rank(a) - rank(b) || (order.get(a.c) ?? 99) - (order.get(b.c) ?? 99) || a.n.localeCompare(b.n),
);
const counts = {};
for (const i of icons) counts[i.c] = (counts[i.c] ?? 0) + 1;
const categories = taxonomy.categories
  .map((c) => ({ id: c.id, title: c.title, count: counts[c.id] ?? 0 }))
  .filter((c) => c.count > 0);

// Illustrations
const illDir = path.join(ASSETS, 'illustrations');
const illustrations = [];
for (const name of fs.existsSync(illDir) ? fs.readdirSync(illDir) : []) {
  const metaFile = path.join(illDir, name, 'meta.json');
  if (!fs.existsSync(metaFile)) continue;
  const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
  const types = {};
  for (const t of meta.types ?? ['stroke', 'fill', 'duotone']) {
    const f = path.join(illDir, name, `${t}.svg`);
    if (!fs.existsSync(f)) continue;
    let svg = fs.readFileSync(f, 'utf8');
    for (const k of ['primary', 'secondary', 'background', 'ink']) {
      svg = svg.replace(new RegExp(tokens.illustration[k], 'gi'), `{{${k}}}`);
    }
    // Named Figma layers -> data-part (animation targets); drop the frame-name group id.
    svg = svg
      .replace(/<g id="[^"]*\/[^"]*">/, '<g>')
      .replace(/<g id="([^"]+)"/g, '<g data-part="$1"')
      .replace(/\sid="[^"]*"/g, '')
      .replace(/\s+/g, ' ')
      .replace(/> </g, '><')
      .trim();
    types[t] = svg;
  }
  illustrations.push({
    n: name,
    t: meta.title ?? name,
    c: meta.category ?? 'general',
    g: (meta.tags ?? []).join(' '),
    types,
    motion: meta.animation ?? null,
  });
}

// Hairline figures (packages/hairline-figures, exported by its export.mjs): the rest pose is a
// stroke template like any illustration; `live` marks the ones the Interactive and Scroll views run.
const HL_DIR = path.join(ROOT, 'packages/hairline-figures');
const hlBundle = path.join(HL_DIR, 'dist/hairline.json');
const hairline = fs.existsSync(hlBundle) ? JSON.parse(fs.readFileSync(hlBundle, 'utf8')) : null;
/** Fill and Duotone from the Stroke still (the card rect, first, keeps the ground):
 *  Fill = faces in {{primary}}, lines and dots knocked out in {{background}};
 *  Duotone = faces tinted {{secondary}}, ink lines kept. */
function hlStyles(stroke) {
  const i = stroke.indexOf('/>') + 2, head = stroke.slice(0, i), body = stroke.slice(i);
  const fill = body
    .replace(/fill="\{\{ink\}\}"( fill-opacity="[^"]*")?/g, 'fill="@BG@"')
    .replace(/fill="\{\{background\}\}"/g, 'fill="{{primary}}"')
    .replace(/fill="@BG@"/g, 'fill="{{background}}"')
    .replace(/stroke="\{\{ink\}\}"( stroke-opacity="[^"]*")?/g, 'stroke="{{background}}"');
  const duotone = body.replace(/fill="\{\{background\}\}"/g, 'fill="{{secondary}}"');
  return { stroke, fill: head + fill, duotone: head + duotone };
}
if (hairline) {
  // The live figures replace the first five samples, which were drawn before the Hairline style.
  illustrations.length = 0;
  for (const f of JSON.parse(fs.readFileSync(path.join(HL_DIR, 'figures.json'), 'utf8'))) {
    const name = f.file.replace(/\.js$/, '');
    const svgFile = path.join(HL_DIR, 'dist', `${name}.svg`);
    if (!fs.existsSync(svgFile) || !hairline.figures[name]) continue;
    illustrations.push({ n: name, t: f.t, c: f.c, g: f.g ?? '', types: hlStyles(fs.readFileSync(svgFile, 'utf8')), motion: null, live: 1 });
  }
}

// Approved sample order from the Figma Illustrations board first.
const ILL_ORDER = ['server-stack', 'analytics', 'mobile-app', 'secure-vault', 'delivery'];
const illRank = (n) => (ILL_ORDER.includes(n) ? ILL_ORDER.indexOf(n) : 99);
illustrations.sort((a, b) => illRank(a.n) - illRank(b.n) || a.n.localeCompare(b.n));

// Only write files whose content changed, so unchanged chunks keep their timestamps.
fs.rmSync(path.join(OUT, 'icons'), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'icons'), { recursive: true });
for (const f of fs.readdirSync(OUT)) if (/\.json$/.test(f) && !['index.json', 'motion.json', 'illustrations.json', 'hairline.json'].includes(f)) fs.rmSync(path.join(OUT, f));
const write = (f, d) => fs.writeFileSync(path.join(OUT, f), JSON.stringify(d));
write('index.json', {
  total: icons.length,
  styles: STYLES,
  tokens: { icon: tokens.icon, illustration: tokens.illustration },
  categories,
  icons,
  latest: Math.max(0, ...Object.values(batchOf)),
  batchDate,
  attrs,
  chunks: outline.length,
});
outline.forEach((c, k) => write(`icons/o${k}.json`, c));
fill.forEach((c, k) => write(`icons/f${k}.json`, c));
write('motion.json', motionTable);
write('illustrations.json', illustrations);
// The live views' engine and figure code; rewritten only when it changed, so a republish skips it.
if (hairline) {
  const text = JSON.stringify(hairline), f = path.join(OUT, 'hairline.json');
  if (!fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== text) fs.writeFileSync(f, text);
}

const mb = (f) => (fs.statSync(path.join(OUT, f)).size / 1048576).toFixed(1);
const total = fs.readdirSync(OUT, { recursive: true }).filter((f) => f.endsWith('.json')).reduce((t, f) => t + fs.statSync(path.join(OUT, f)).size, 0);
console.log(
  `web data: ${icons.length} icons in ${categories.length} categories, ${Object.keys(miOf).length} animated (${motionTable.length} motion recipes), ` +
    `${illustrations.length} illustrations; ${outline.length} chunks, index ${mb('index.json')} MB, total ${(total / 1048576).toFixed(0)} MB`,
);
