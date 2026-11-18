// Dev entry for the preview launcher and "Start ollo site.cmd": rebuild data when needed, then run
// `next dev` in apps/web.
//
// Icons come from the main project checkout (C:\Users\USER\Documents\Library\library, where the
// batches land) when it exists, so the site and the Figma plugin show every icon built so far.
// Set LIBRARY_ROOT to use another checkout. The data is rebuilt only when that checkout's latest
// commit changed since the last build (public/data/.source records it).
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mainCheckout = path.resolve(web, '../../../library');
if (!process.env.LIBRARY_ROOT && fs.existsSync(path.join(mainCheckout, 'packages/assets/icons'))) {
  process.env.LIBRARY_ROOT = mainCheckout;
}
const root = process.env.LIBRARY_ROOT ?? path.resolve(web, '../..');
let head = 'unknown';
try {
  head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
} catch {}
const stampFile = path.join(web, 'public/data/.source');
const stamp = `${root}@${head}`;
const current = fs.existsSync(stampFile) ? fs.readFileSync(stampFile, 'utf8').trim() : '';

if (current === stamp && head !== 'unknown') {
  console.log(`ollo data is up to date (${root} @ ${head.slice(0, 8)})`);
} else {
  console.log(`Building ollo data from ${root} (this takes a few minutes after new batches)...`);
  await import('./build-data.mjs');
  fs.writeFileSync(stampFile, stamp + '\n');
}

const next = path.join(web, 'node_modules/next/dist/bin/next');
const port = process.env.PORT ?? '3100';
const child = spawn(process.execPath, [next, 'dev', '-p', port], { cwd: web, stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
