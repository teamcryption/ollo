// Dev entry for the preview launcher: rebuild data, then run `next dev` in apps/web.
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
await import('./build-data.mjs');
const next = path.join(web, 'node_modules/next/dist/bin/next');
const port = process.env.PORT ?? '3100';
const child = spawn(process.execPath, [next, 'dev', '-p', port], { cwd: web, stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
