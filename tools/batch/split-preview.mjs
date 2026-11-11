// Split preview data files that exceed the Artifact per-file limit, without touching web/ui.
// Usage: node split-preview.mjs <review-ui dir> [limitMB=15]
// Each data/**/*.json larger than the limit is split into name.part1.json, name.part2.json, ... (object keys divided
// evenly by size) and the original is deleted. A tiny fetch shim is injected into index.html: when the app fetches a
// split file it fetches the parts, merges them and returns one JSON response, so the app code is unchanged.
// Prints the published paths of the split parts and of the removed originals (publish those originals as null).
import fs from 'node:fs'; import path from 'node:path';
const [dir, limitArg] = process.argv.slice(2);
const LIMIT = (+limitArg || 15) * 1048576;
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const split = {}; const added = []; const removed = [];
for (const f of walk(path.join(dir, 'data')).filter((f) => f.endsWith('.json') && !/\.part\d+\.json$/.test(f))) {
  const size = fs.statSync(f).size;
  if (size <= LIMIT) continue;
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  const n = Math.ceil(size / LIMIT) + (size / LIMIT > 1.8 ? 1 : 0) || 2;
  const parts = Array.from({ length: n }, () => ({})); const fill = new Array(n).fill(0);
  for (const [k, v] of Object.entries(data)) { const len = JSON.stringify(v).length + k.length; let i = fill.indexOf(Math.min(...fill)); parts[i][k] = v; fill[i] += len; }
  const rel = path.relative(dir, f).split(path.sep).join('/');
  split[rel] = parts.map((_, i) => rel.replace(/\.json$/, `.part${i + 1}.json`));
  parts.forEach((p, i) => { fs.writeFileSync(path.join(dir, split[rel][i]), JSON.stringify(p)); added.push(split[rel][i]); });
  fs.unlinkSync(f); removed.push(rel);
}
const idx = path.join(dir, 'index.html');
let html = fs.readFileSync(idx, 'utf8').replace(/<script data-split-shim>[\s\S]*?<\/script>/, '');
if (Object.keys(split).length) {
  const shim = `<script data-split-shim>(()=>{const S=${JSON.stringify(split)},f=window.fetch.bind(window);window.fetch=(u,o)=>{const s=typeof u==='string'?u:u.url;const k=Object.keys(S).find(k=>s.endsWith(k));if(!k)return f(u,o);const base=s.slice(0,s.length-k.length);return Promise.all(S[k].map(p=>f(base+p,o).then(r=>{if(!r.ok)throw new Error(p+': '+r.status);return r.json()}))).then(a=>new Response(JSON.stringify(Object.assign({},...a)),{status:200,headers:{'Content-Type':'application/json'}}))}})()</script>`;
  html = html.replace('<div id="root"></div>', `<div id="root"></div>\n${shim}`);
}
fs.writeFileSync(idx, html);
for (const a of added) console.log('part', a, (fs.statSync(path.join(dir, a)).size / 1048576).toFixed(1) + ' MB');
console.log(JSON.stringify({ add: added, remove: removed }));
