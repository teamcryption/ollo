// Builds the ollo Figma plugin:
//   dist/code.js  Figma side (src/code.ts)
//   dist/ui.html  the panel: the ollo website itself (apps/web, Library UI) bundled into one page
//                 in plugin mode, so it looks and works like the site; clicks insert into Figma.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const web = path.resolve(root, '../web');
const dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });
// Icon data comes from the ollo site. Override with OLLO_DATA=https://<site>/data/ once hosted.
const DATA = process.env.OLLO_DATA ?? 'http://localhost:3100/data/';

await build({
  entryPoints: [path.join(root, 'src/code.ts')],
  bundle: true,
  outfile: path.join(dist, 'code.js'),
  target: 'es2017',
  format: 'iife',
  logLevel: 'error',
});

const ui = await build({
  entryPoints: [path.join(web, 'preview/entry.tsx')],
  bundle: true,
  minify: true,
  write: false,
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
  jsx: 'automatic',
  tsconfig: path.join(web, 'tsconfig.json'),
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'error',
});
const js = ui.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');

const read = (f) => fs.readFileSync(path.join(web, 'app', f), 'utf8');
const tokens = read('tokens.css');
const css = [
  ":root { --font-bricolage: 'Bricolage Grotesque'; --font-figtree: 'Figtree'; --font-jetbrains: 'JetBrains Mono'; }",
  tokens,
  read('globals.css'),
  read('modal.css'),
  read('subscribe.css'),
].join('\n');
const fonts =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700' +
  '&family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap';

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ollo Icons</title>
<link rel="stylesheet" href="${fonts}">
<style>
${css}
</style>
</head>
<body>
<div id="root"></div>
<script>window.__OLLO__ = { data: ${JSON.stringify(DATA)}, figma: true, start: 'all' };</script>
<script>${js}</script>
</body>
</html>
`;
fs.writeFileSync(path.join(dist, 'ui.html'), html);
console.log(`figma plugin: dist/code.js ${Math.round(fs.statSync(path.join(dist, 'code.js')).size / 1024)} KB, dist/ui.html ${Math.round(html.length / 1024)} KB (data: ${DATA})`);
