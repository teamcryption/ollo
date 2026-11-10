// Builds the icon preview page (the page Abdur reviews after every batch) from the real site UI.
// Usage: node apps/web/scripts/build-preview.mjs <out-dir>
// Writes <out-dir>/index.html (UI + CSS inlined, fonts from Google Fonts) and <out-dir>/data/*.json,
// then prints the `files` list to publish with the Artifact tool (root=<out-dir>).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(here, '..');
const out = path.resolve(process.argv[2] ?? path.join(WEB, '.preview'));

await import('./build-data.mjs');

const bundle = await build({
  entryPoints: [path.join(WEB, 'preview/entry.tsx')],
  bundle: true,
  minify: true,
  write: false,
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
  jsx: 'automatic',
  tsconfig: path.join(WEB, 'tsconfig.json'),
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'error',
});
const js = bundle.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');

const read = (f) => fs.readFileSync(path.join(WEB, 'app', f), 'utf8');
const tokens = read('tokens.css');
// Viewer "system" theme: no data-theme attribute, so mirror the dark tokens under the OS setting.
const darkBlock = tokens.match(/:root\[data-theme='dark'\] \{([\s\S]*?)\n\}/)[1];
const css = [
  ":root { --font-bricolage: 'Bricolage Grotesque'; --font-figtree: 'Figtree'; --font-jetbrains: 'JetBrains Mono'; }",
  tokens,
  `@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) {${darkBlock}\n} }`,
  read('globals.css'),
  read('modal.css'),
].join('\n');

const fonts =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700' +
  '&family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap';

// Respect a theme the viewer already chose (data-theme on <html>); otherwise the OS setting.
const boot = `window.__OLLO__={data:'data/',preview:true,start:'latest'};try{var d=document.documentElement;if(d.dataset.theme!=='light'&&d.dataset.theme!=='dark'){d.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}}catch(e){}`;

const html = `<title>Library Icons</title>
<meta name="description" content="Every icon in the library, in the real site UI, opening on the newest batch.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
<style>
${css}
</style>
<div id="root"></div>
<script>${boot}</script>
<script>${js}</script>
`;

fs.rmSync(path.join(out, 'data'), { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'data/icons'), { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
const src = path.join(WEB, 'public/data');
const files = ['index.json', 'motion.json', 'illustrations.json', ...fs.readdirSync(path.join(src, 'icons')).map((f) => `icons/${f}`)];
for (const f of files) fs.copyFileSync(path.join(src, f), path.join(out, 'data', f));

const mb = (n) => (n / 1048576).toFixed(1);
const total = files.reduce((s, f) => s + fs.statSync(path.join(out, 'data', f)).size, 0);
console.log(`preview: page ${Math.round(html.length / 1024)} KB + ${files.length} data files ${mb(total)} MB -> ${out}`);
console.log('publish files:', JSON.stringify(Object.fromEntries(files.map((f) => [`data/${f}`, `data/${f}`]))));
