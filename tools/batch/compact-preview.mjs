// Shrink the preview's icon JSONs (preview copy only; repo assets untouched). Usage: node compact-preview.mjs <file.json> [...]
// 1. rounds path coordinates (default 2 decimals, PREVIEW_DP to change);
// 2. minifies path data losslessly: drops leading zeros (0.5 -> .5) and separators the SVG path grammar does not need
//    (".5 -.3" -> ".5-.3", ".5 .3" -> ".5.3"); arc (A/a) arguments keep their separators.
import fs from 'node:fs';
const DP = +(process.env.PREVIEW_DP ?? 2);
const num = new RegExp(`-?\\d+\\.\\d{${DP + 1},}`, 'g');
const r = (m) => { const s = Number(m).toFixed(DP).replace(/0+$/, '').replace(/\.$/, ''); return s === '-0' || s === '' ? '0' : s; };
const TOK = /-?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?|[a-zA-Z]/g;
export function minPath(d) {
  let out = '', prev = '', cmd = '';
  for (let t of d.match(TOK) ?? []) {
    if (/^[a-zA-Z]$/.test(t)) { out += t; prev = t; cmd = t; continue; }
    t = t.replace(/^(-?)0\./, '$1.').replace(/\.$/, '');
    if (t === '-0' || t === '-.0') t = '0';
    const prevNum = prev !== "" && !/^[a-zA-Z]$/.test(prev);
    const glue = !prevNum || /[aA]/.test(cmd) || /[eE]/.test(prev) ? (prevNum ? ' ' : '') : t[0] === '-' || (t[0] === '.' && prev.includes('.')) ? '' : ' ';
    out += glue + t; prev = t;
  }
  return out;
}
export const minSvg = (s) => s.replace(num, r).replace(/ d="([^"]*)"/g, (_, d) => ` d="${minPath(d)}"`);
if (import.meta.url === `file://${process.argv[1]}`) {
  for (const p of process.argv.slice(2)) {
    const d = JSON.parse(fs.readFileSync(p, 'utf8'));
    const out = Object.fromEntries(Object.entries(d).map(([k, v]) => [k, typeof v === 'string' ? minSvg(v) : v]));
    fs.writeFileSync(p, JSON.stringify(out));
    console.log(p.split(/[\\/]/).pop(), (fs.statSync(p).size / 1048576).toFixed(1) + ' MB');
  }
}
