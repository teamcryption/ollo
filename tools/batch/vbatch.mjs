// Status-badge variant batches: node vbatch.mjs pick <count> | node vbatch.mjs prune <droppedFile>
// pick: gives the next <count> standalone forge icons (no badges, no plan entry) the OBJ badges, appends their plan
// lines (marked // vb) and writes the new variant names to /tmp/bulk-new.txt (for generate's DROP_FILE).
// prune: removes dropped variants from those plan lines (drops the line when no badge is left).
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const PLAN = ROOT + 'packages/forge/src/variant-plan.mjs';
const ICONS = ROOT + 'packages/assets/icons';
const [cmd, arg, outArg] = process.argv.slice(2);
let s = fs.readFileSync(PLAN, 'utf8'); const nl = s.includes('\r\n') ? '\r\n' : '\n';
const BADGES = ['add', 'check', 'close'];
const ALLB = ['add', 'check', 'close', 'remove', 'alert'];
const SKIP_CATS = new Set(['design', 'data', 'development', 'arrows', 'text', 'emoji', 'navigation', 'accessibility', 'actions', 'social', 'notifications', 'weather']);
const MODS = 'search clock shield gear pin bolt heart star alert user bell cloud chat download pencil sparkle trash flag calendar question bookmark upload crown moon leaf fire trophy hourglass cursor camera filter stats checkbox lock add check close remove off notice pricing addbox bulb wifi percent tag eye truck music key pause play'.split(' ');
if (cmd === 'pick') {
  const plan = (await import(pathToFileURL(PLAN).href + '?t=' + Date.now())).default;
  const names = fs.readdirSync(ICONS); const has = new Set(names.map((x) => x.replace(/-/g, ""))); const pick = [];
  for (const n of names) {
    if (pick.length >= +arg) break;
    if (plan[n] || n.startsWith('no-') || MODS.some((m) => n.endsWith('-' + m))) continue;
    let meta; try { meta = JSON.parse(fs.readFileSync(`${ICONS}/${n}/meta.json`, 'utf8')); } catch { continue; }
    if (meta.source !== 'forge' || meta.variant || SKIP_CATS.has(meta.category)) continue;
    if (BADGES.some((b) => has.has(`${n}${b}`.replace(/-/g, "")))) continue;
    pick.push(n);
  }
  const lines = pick.map((n) => `  '${n}': { badges: ['add', 'check', 'close'] }, // vb`);
  const e = s.indexOf('export { OBJ'); const i = s.lastIndexOf('};', e);
  s = s.slice(0, i) + lines.join(nl) + nl + s.slice(i); fs.writeFileSync(PLAN, s);
  fs.writeFileSync(outArg, pick.flatMap((n) => BADGES.map((b) => `${n}-${b}`)).join('\n') + '\n');
  console.log('picked', pick.length, 'icons ->', pick.length * BADGES.length, 'variants');
} else if (cmd === 'extend') {
  // extend <count> <outFile>: adds remove + alert to the next <count> vb lines that do not have them yet.
  const has = new Set(fs.readdirSync(ICONS).map((n) => n.replace(/-/g, ''))); const names = []; let left = +arg;
  s = s.split(nl).map((l) => {
    const m = l.match(/^  '([^']+)': \{ badges: \[([^\]]*)\] \}, \/\/ vb$/); if (!m || left <= 0 || m[2].includes('remove')) return l;
    // never reuse a name that already exists (e.g. a bulk combo `<base>-alert`): dropping it would delete the original
    const extra = ['remove', 'alert'].filter((b) => !has.has(`${m[1]}${b}`.replace(/-/g, '')) && !m[2].includes(`'${b}'`));
    if (!extra.length) return l;
    left--; extra.forEach((b) => names.push(`${m[1]}-${b}`));
    return `  '${m[1]}': { badges: [${m[2]}${extra.map((b) => `, '${b}'`).join('')}] }, // vb`;
  }).join(nl);
  fs.writeFileSync(PLAN, s); fs.writeFileSync(outArg, names.join('\n') + '\n');
  console.log('extended', names.length / 2, 'icons ->', names.length, 'variants');
} else if (cmd === 'prune') {
  const dropped = fs.existsSync(arg) ? fs.readFileSync(arg, 'utf8').split(/\s+/).filter(Boolean) : [];
  const byName = {};
  for (const d of dropped) { const b = ALLB.find((x) => d.endsWith('-' + x)); if (b) (byName[d.slice(0, -b.length - 1)] ??= new Set()).add(b); }
  let n = 0;
  s = s.split(nl).flatMap((l) => {
    const m = l.match(/^  '([^']+)': \{ badges: \[([^\]]*)\] \}, \/\/ vb$/); if (!m || !byName[m[1]]) return [l];
    const keep = m[2].split(',').map((x) => x.trim().replace(/'/g, '')).filter((x) => x && !byName[m[1]].has(x)); n++;
    return keep.length ? [`  '${m[1]}': { badges: [${keep.map((x) => `'${x}'`).join(', ')}] }, // vb`] : [];
  }).join(nl);
  fs.writeFileSync(PLAN, s); console.log('pruned', n, 'plan lines');
}
