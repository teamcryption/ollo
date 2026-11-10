// Contact sheet of icon defs in all five styles, with QA errors (red) and warnings (amber).
// Usage (from the repo root):
//   node tools/sheet.mjs out.png <category | name,name,...> [big]
// Look at the PNG before shipping a batch; drop or redraw anything weak.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FORGE = path.join(ROOT, 'packages/forge');
const imp = (p) => import(pathToFileURL(path.join(FORGE, p)).href);
const { loadDefs } = await imp('src/generate.mjs');
const { renderIcon } = await imp('src/render.mjs');
const { checkGeometry } = await imp('src/qa.mjs');
const { Resvg } = createRequire(path.join(FORGE, 'package.json'))('@resvg/resvg-js');

const [out, sel, bigArg] = process.argv.slice(2);
let icons = await loadDefs();
if (sel) icons = icons.filter((i) => i.category === sel || sel.split(',').includes(i.name));
const cell = 60 * (bigArg ? 2 : 1), label = 150, cols = 5;
let y = 0, s = '';
for (const ic of icons) {
  const { svgs } = renderIcon(ic.els);
  const q = checkGeometry(ic);
  const col = q.errors.length ? '#c00' : q.warnings.length ? '#b70' : '#333';
  s += `<text x="6" y="${y + 34}" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="${col}">${ic.name}</text>`;
  Object.values(svgs).forEach((svg, i) => {
    s += svg.replace('<svg width="24" height="24"', `<svg x="${label + i * cell + 6}" y="${y + 6}" width="${cell - 12}" height="${cell - 12}"`);
  });
  y += cell;
}
const W = label + cols * cell;
fs.writeFileSync(out, new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${y}"><rect width="100%" height="100%" fill="#fff"/>${s}</svg>`, { font: { loadSystemFonts: true } }).render().asPng());
console.log(icons.length, 'icons');
for (const ic of icons) { const q = checkGeometry(ic); [...q.errors, ...q.warnings].forEach((m) => console.log(ic.name, m)); }
