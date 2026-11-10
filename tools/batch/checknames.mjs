// node checknames.mjs <spec> — exits 1 if any icon name (hyphens stripped) already exists.
import fs from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const spec = (await import(pathToFileURL(path.resolve(process.argv[2])).href)).default;
const all = new Set(fs.readdirSync('../assets/icons').map((n) => n.replace(/-/g, '')));
let bad = 0; for (const a of Object.values(spec)) for (const s of a) { const n = s.match(/icon\('([a-z0-9-]+)'/)[1]; if (all.has(n.replace(/-/g, ''))) { console.log('TAKEN', n); bad++; } }
process.exit(bad ? 1 : 0);
