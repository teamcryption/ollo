// Derived compact bases: every standalone forge icon (object categories) shrunk into the top-left combo area
// (scale 0.72 around (3,3) keeps the 3-21 live area inside 3-16), so it can take the bulk badges bottom-right.
// Keys already drawn by hand in B (or earlier specs) win. Accent and tint elements are dropped (combos are accent-free).
import { B } from './mods.mjs';
import fs from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
const ROOT = fileURLToPath(new URL('../../packages/forge/', import.meta.url));
const { scaleD } = await import(pathToFileURL(ROOT + 'src/geo.mjs').href);
const SKIP_CATS = new Set(['ai', 'arrows', 'text', 'emoji', 'navigation', 'accessibility', 'actions', 'design', 'data', 'development', 'notifications', 'social']);
const MODS = 'search clock shield gear pin bolt heart star alert user bell cloud chat download pencil sparkle trash flag calendar question bookmark upload crown moon leaf fire trophy hourglass cursor camera filter stats checkbox lock add check close remove off notice pricing addbox bulb wifi percent tag eye truck music key pause play'.split(' ');
const cat = {}; const label = {}; let n = 0;
for (const f of fs.readdirSync(ROOT + 'defs').filter((x) => x.endsWith('.mjs')).sort()) {
  const mod = (await import(pathToFileURL(ROOT + 'defs/' + f).href)).default;
  if (SKIP_CATS.has(mod.category)) continue;
  for (const def of mod.icons) {
    const k = def.name;
    if (B[k] || k.startsWith('no-') || k.startsWith('ai-') || MODS.some((m) => k.endsWith('-' + m)) || def.extend) continue;
    const els = (def.els ?? []).filter((e) => e.role === 'body' || e.role === 'line');
    if (!els.length || els.length > 8) continue;
    try {
      B[k] = els.map((e) => `${e.role}('${scaleD(e.d, 0.72, 3, 3)}')`).join(', ');
    } catch { continue; }
    cat[k] = mod.category; label[k] = def.title; n++;
  }
}
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, cat);
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, label);
globalThis.DERIVED_BASES = n;
export default {};
