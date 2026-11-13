// Adds a planned batch to figures.json: every [name, category, title, tags] row whose <name>.js exists
// and was photographed by look.mjs (hairline-<name>-look.png), minus any names passed to --skip.
// Usage: node addbatch.mjs <batch.json> [--skip a,b,c]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const [batchFile, flag, list] = process.argv.slice(2);
const skip = new Set(flag === '--skip' && list ? list.split(',') : []);
const rows = JSON.parse(fs.readFileSync(batchFile, 'utf8'));
const figs = JSON.parse(fs.readFileSync(path.join(here, 'figures.json'), 'utf8'));
const have = new Set(figs.map((f) => f.file));
const added = [], missing = [];
for (const [name, c, t, g] of rows) {
  const file = `${name}.js`;
  if (have.has(file) || skip.has(name)) continue;
  if (fs.existsSync(path.join(here, file)) && fs.existsSync(path.join(here, `hairline-${name}-look.png`))) { figs.push({ file, c, t, g }); added.push(name); }
  else missing.push(name);
}
fs.writeFileSync(path.join(here, 'figures.json'), JSON.stringify(figs, null, 2) + '\n');
console.log(`added ${added.length}: ${added.join(' ')}`);
if (missing.length) console.log(`not ready ${missing.length}: ${missing.join(' ')}`);
console.log(`${figs.length} figures`);
