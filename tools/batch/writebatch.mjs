// Usage: node writebatch.mjs <defsDir> <spec.mjs>
// spec default-exports { <category>: [ "icon(...)", ... ] }; each category gets a NEW file numbered max+1.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [DEFS, SPEC] = process.argv.slice(2);
const spec = (await import(pathToFileURL(path.resolve(SPEC)).href)).default;
const H = `import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));
`;
const existing = fs.readdirSync(DEFS);
let n = 0;
for (const [category, icons] of Object.entries(spec)) {
  const nums = existing.map((f) => f.match(new RegExp(`^${category}(?:-(\\d+))?\\.mjs$`))).filter(Boolean).map((m) => +(m[1] ?? 1));
  const file = `${category}-${Math.max(1, ...nums) + 1}.mjs`;
  fs.writeFileSync(path.join(DEFS, file), `${H}\nexport default {\n  category: '${category}',\n  icons: [\n${icons.map((i) => `    ${i},`).join('\n')}\n  ],\n};\n`);
  existing.push(file);
  n += icons.length;
  console.log(file, icons.length);
}
console.log(`total ${n}`);
