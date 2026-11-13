// Container-variant batches (glyph inside a circle / rounded square) for button-type icons.
//   node cbatch.mjs pick <count> <outFile>   -> appends `{ containers: [...] } // vc` plan lines, writes new names
//   node cbatch.mjs prune <droppedFile>      -> removes dropped containers from // vc lines
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const PLAN = ROOT + 'packages/forge/src/variant-plan.mjs';
const ICONS = ROOT + 'packages/assets/icons';
const [cmd, arg, outArg] = process.argv.slice(2);
let s = fs.readFileSync(PLAN, 'utf8'); const nl = s.includes('\r\n') ? '\r\n' : '\n';
const KINDS = ['circle', 'square', 'hexagon'];
const CATS = new Set(['arrows', 'actions', 'interface', 'navigation', 'text', 'media', 'social', 'notifications', 'security', 'communication', 'files']);
if (cmd === 'pick') {
  const plan = (await import(pathToFileURL(PLAN).href + '?t=' + Date.now())).default;
  const names = fs.readdirSync(ICONS); const has = new Set(names.map((x) => x.replace(/-/g, ''))); const pick = [];
  // icons whose only plan entry is a status-badge line (// vb) can take containers too: the line is extended (// vbc)
  const vb = new Map([...s.matchAll(/^  '([^']+)': \{ badges: \[([^\]]*)\] \}, \/\/ vb\r?$/gm)].map((m) => [m[1], m[2]]));
  const ext = [];
  for (const n of names) {
    if (pick.length + ext.length >= +arg) break;
    if ((plan[n] && !vb.has(n)) || n.startsWith('no-') || /circle|square/.test(n) || /-(circle|square|off|add|check|close|remove|alert|search|clock|shield|gear|pin|bolt|heart|star|user|bell|cloud|chat|download|pencil|sparkle|trash|flag|calendar|question|bookmark|upload|crown|moon|leaf|fire|trophy|hourglass|cursor|camera|filter|stats|checkbox|lock|notice|pricing|addbox|bulb|wifi|percent|tag|eye|truck|music|key|pause|play)$/.test(n)) continue;
    let meta; try { meta = JSON.parse(fs.readFileSync(`${ICONS}/${n}/meta.json`, 'utf8')); } catch { continue; }
    if (meta.source !== 'forge' || meta.variant || (process.env.CB_ALL ? false : !CATS.has(meta.category))) continue;
    // an icon that already has any container (from its def) is skipped: a plan entry would replace the def's list
    if (KINDS.some((k) => has.has(`${n}${k}`.replace(/-/g, '')))) continue;
    const kinds = KINDS;
    if (!kinds.length) continue;
    (vb.has(n) ? ext : pick).push([n, kinds]);
  }
  const extSet = new Map(ext);
  s = s.split(nl).map((l) => {
    const m = l.match(/^  '([^']+)': \{ badges: \[([^\]]*)\] \}, \/\/ vb$/); if (!m || !extSet.has(m[1])) return l;
    return `  '${m[1]}': { badges: [${m[2]}], containers: [${extSet.get(m[1]).map((k) => `'${k}'`).join(', ')}] }, // vbc`;
  }).join(nl);
  const lines = pick.map(([n, ks]) => `  '${n}': { containers: [${ks.map((k) => `'${k}'`).join(', ')}] }, // vc`);
  const e = s.indexOf('export { OBJ'); const i = s.lastIndexOf('};', e);
  if (lines.length) s = s.slice(0, i) + lines.join(nl) + nl + s.slice(i);
  fs.writeFileSync(PLAN, s);
  const all = [...pick, ...ext];
  fs.writeFileSync(outArg, all.flatMap(([n, ks]) => ks.map((k) => `${n}-${k}`)).join('\n') + '\n');
  console.log('picked', all.length, 'icons ->', all.reduce((a, [, ks]) => a + ks.length, 0), 'variants');
} else if (cmd === 'prune') {
  const dropped = fs.existsSync(arg) ? fs.readFileSync(arg, 'utf8').split(/\s+/).filter(Boolean) : [];
  const by = {};
  for (const d of dropped) { const k = KINDS.find((x) => d.endsWith('-' + x)); if (k) (by[d.slice(0, -k.length - 1)] ??= new Set()).add(k); }
  let n = 0;
  s = s.split(nl).flatMap((l) => {
    const v = l.match(/^  '([^']+)': \{ badges: \[([^\]]*)\], containers: \[([^\]]*)\] \}, \/\/ vbc$/);
    if (v && by[v[1]]) {
      const keep = v[3].split(',').map((x) => x.trim().replace(/'/g, '')).filter((x) => x && !by[v[1]].has(x)); n++;
      return [keep.length ? `  '${v[1]}': { badges: [${v[2]}], containers: [${keep.map((x) => `'${x}'`).join(', ')}] }, // vbc` : `  '${v[1]}': { badges: [${v[2]}] }, // vb`];
    }
    const m = l.match(/^  '([^']+)': \{ containers: \[([^\]]*)\] \}, \/\/ vc$/); if (!m || !by[m[1]]) return [l];
    const keep = m[2].split(',').map((x) => x.trim().replace(/'/g, '')).filter((x) => x && !by[m[1]].has(x)); n++;
    return keep.length ? [`  '${m[1]}': { containers: [${keep.map((x) => `'${x}'`).join(', ')}] }, // vc`] : [];
  }).join(nl);
  fs.writeFileSync(PLAN, s); console.log('pruned', n, 'plan lines');
}
