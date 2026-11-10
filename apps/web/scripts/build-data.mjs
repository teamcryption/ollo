// Builds the site's static data from the asset source of truth.
//   packages/assets/icons/<name>/{light,regular,bold,duotone,fill}.svg + meta.json
//   packages/assets/illustrations/<name>/{stroke,fill,duotone}.svg + meta.json
//   packages/forge/taxonomy.json (category ids, titles, order)
// Output (apps/web/public/data, git-ignored):
//   index.json            names, titles, categories, tags, counts
//   icons/<style>.json    { name: svg } with #171729 -> currentColor, no width/height
//   motion.json           { name: motion spec } for animated tiles
//   illustrations.json    templates ({{primary}} etc.) + motion per illustration
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

const iconDir = path.join(ASSETS, 'icons');
const names = fs.readdirSync(iconDir).filter((n) => fs.existsSync(path.join(iconDir, n, 'meta.json')));
const order = new Map(taxonomy.categories.map((c, i) => [c.id, i]));
const icons = [];
const byStyle = Object.fromEntries(STYLES.map((s) => [s, {}]));
const motion = {};

for (const name of names) {
  const meta = JSON.parse(fs.readFileSync(path.join(iconDir, name, 'meta.json'), 'utf8'));
  let ok = true;
  for (const s of STYLES) {
    const f = path.join(iconDir, name, `${s}.svg`);
    if (!fs.existsSync(f)) { ok = false; break; }
    byStyle[s][name] = cleanIcon(fs.readFileSync(f, 'utf8'));
  }
  if (!ok) { for (const s of STYLES) delete byStyle[s][name]; continue; }
  if (meta.animation) motion[name] = meta.animation;
  icons.push({
    n: name,
    t: meta.title ?? name,
    c: meta.category,
    g: (meta.tags ?? []).join(' '),
    a: meta.animation ? 1 : 0,
    m: meta.animation ? motionKind(meta.animation) : undefined,
    b: batchOf[name],
  });
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

// Approved sample order from the Figma Illustrations board first.
const ILL_ORDER = ['server-stack', 'analytics', 'mobile-app', 'secure-vault', 'delivery'];
const illRank = (n) => (ILL_ORDER.includes(n) ? ILL_ORDER.indexOf(n) : 99);
illustrations.sort((a, b) => illRank(a.n) - illRank(b.n) || a.n.localeCompare(b.n));

fs.mkdirSync(path.join(OUT, 'icons'), { recursive: true });
const write = (f, d) => fs.writeFileSync(path.join(OUT, f), JSON.stringify(d));
write('index.json', {
  total: icons.length,
  styles: STYLES,
  tokens: { icon: tokens.icon, illustration: tokens.illustration },
  categories,
  icons,
  latest: Math.max(0, ...Object.values(batchOf)),
  batchDate,
});
for (const s of STYLES) write(`icons/${s}.json`, byStyle[s]);
write('motion.json', motion);
write('illustrations.json', illustrations);

const kb = (f) => Math.round(fs.statSync(path.join(OUT, f)).size / 1024);
console.log(
  `web data: ${icons.length} icons in ${categories.length} categories, ${Object.keys(motion).length} animated, ` +
    `${illustrations.length} illustrations (index ${kb('index.json')} KB, regular ${kb('icons/regular.json')} KB, motion ${kb('motion.json')} KB)`,
);
