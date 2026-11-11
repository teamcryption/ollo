// Node twin of compact-preview.py: round path coordinates to 3 decimals in preview icon JSONs
// (preview copy only; repo assets untouched). Usage: node compact-preview.mjs <file.json> [...]
import fs from 'node:fs';
const num = /-?\d+\.\d{4,}/g;
const r = (m) => { const s = Number(m).toFixed(3).replace(/0+$/, '').replace(/\.$/, ''); return s === '-0' || s === '' ? '0' : s; };
for (const p of process.argv.slice(2)) {
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const out = Object.fromEntries(Object.entries(d).map(([k, v]) => [k, typeof v === 'string' ? v.replace(num, r) : v]));
  fs.writeFileSync(p, JSON.stringify(out));
  console.log(p.split(/[\\/]/).pop(), (fs.statSync(p).size / 1048576).toFixed(1) + ' MB');
}
