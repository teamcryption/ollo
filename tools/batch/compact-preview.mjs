// Node twin of compact-preview.py: round path coordinates (default 2 decimals, PREVIEW_DP to change) in preview icon JSONs
// (preview copy only; repo assets untouched). Usage: node compact-preview.mjs <file.json> [...]
import fs from 'node:fs';
const DP = +(process.env.PREVIEW_DP ?? 2);
const num = new RegExp(`-?\\d+\\.\\d{${DP + 1},}`, 'g');
const r = (m) => { const s = Number(m).toFixed(DP).replace(/0+$/, '').replace(/\.$/, ''); return s === '-0' || s === '' ? '0' : s; };
for (const p of process.argv.slice(2)) {
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const out = Object.fromEntries(Object.entries(d).map(([k, v]) => [k, typeof v === 'string' ? v.replace(num, r) : v]));
  fs.writeFileSync(p, JSON.stringify(out));
  console.log(p.split(/[\\/]/).pop(), (fs.statSync(p).size / 1048576).toFixed(1) + ' MB');
}
