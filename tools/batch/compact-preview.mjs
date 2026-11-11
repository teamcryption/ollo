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
// 3. wraps runs of consecutive <path>s that carry identical attributes in one <g> holding those attributes, so they are
//    written once (each path stays its own element, so rendering is unchanged; the site's stroke-width/currentColor
//    regex edits still apply to the <g>). Runs with opacity, style, class, id, transform, clip-path, mask or filter are left as they are.
const PATH = /<path d="([^"]*)"((?: [a-z-]+="[^"]*")*)\s*\/>/g;
// Only inherited presentation attributes may move to the <g>; `opacity` (group-level compositing), style, class, id and
// transform stay on the path, so runs carrying them are never grouped.
const groupable = (attrs) => attrs !== '' && !/ (opacity|style|class|id|transform|clip-path|mask|filter)="/.test(attrs);
export function groupPaths(svg) {
  const out = []; let run = null; let i = 0; let m;
  const flush = () => {
    if (!run) return;
    out.push(run.ds.length > 1 ? `<g${run.attrs}>${run.ds.map((d) => `<path d="${d}"/>`).join('')}</g>` : `<path d="${run.ds[0]}"${run.attrs}/>`);
    run = null;
  };
  PATH.lastIndex = 0;
  while ((m = PATH.exec(svg))) {
    const [all, d, attrs] = m;
    const between = svg.slice(i, m.index);
    if (run && between === '' && run.attrs === attrs && groupable(attrs)) run.ds.push(d);
    else { flush(); out.push(between); run = { attrs, ds: [d] }; }
    i = m.index + all.length;
  }
  flush();
  out.push(svg.slice(i));
  return out.join('');
}
export const minSvg = (s) => groupPaths(s.replace(num, r).replace(/ d="([^"]*)"/g, (_, d) => ` d="${minPath(d)}"`));
import { pathToFileURL } from "node:url";
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const p of process.argv.slice(2)) {
    const d = JSON.parse(fs.readFileSync(p, 'utf8'));
    const out = Object.fromEntries(Object.entries(d).map(([k, v]) => [k, typeof v === 'string' ? minSvg(v) : v]));
    fs.writeFileSync(p, JSON.stringify(out));
    console.log(p.split(/[\\/]/).pop(), (fs.statSync(p).size / 1048576).toFixed(1) + ' MB');
  }
}
