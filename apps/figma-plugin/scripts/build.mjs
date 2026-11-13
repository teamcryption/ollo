// Builds dist/code.js (Figma side) and dist/ui.html (panel with its script inlined).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });

await build({
  entryPoints: [path.join(root, 'src/code.ts')],
  bundle: true,
  outfile: path.join(dist, 'code.js'),
  target: 'es2017',
  format: 'iife',
  logLevel: 'error',
});

const ui = await build({
  entryPoints: [path.join(root, 'src/ui.ts')],
  bundle: true,
  write: false,
  minify: true,
  target: 'es2020',
  format: 'iife',
  platform: 'browser',
  logLevel: 'error',
});
const js = ui.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const html = fs.readFileSync(path.join(root, 'src/ui.html'), 'utf8').replace('%SCRIPT%', () => js);
fs.writeFileSync(path.join(dist, 'ui.html'), html);
console.log(`figma plugin: dist/code.js ${Math.round(fs.statSync(path.join(dist, 'code.js')).size / 1024)} KB, dist/ui.html ${Math.round(html.length / 1024)} KB`);
