// Imports raw Figma SVG exports into packages/assets as source files + meta.json.
//
// The raw exports live in packages/assets/figma-export/*.json and are produced with the
// Figma MCP server (use_figma -> node.exportAsync({ format: 'SVG_STRING' })) because the
// Figma REST API needs a personal token. See README "Re-exporting from Figma".
//
// Existing meta.json fields written by hand (tags, category, notes...) are preserved;
// only `styles`/`types`, `figma` and missing defaults are filled in.
import fs from 'node:fs';
import path from 'node:path';
import { ASSETS_DIR } from './paths.mjs';
import { ICON_DEFAULTS, ILLUSTRATION_DEFAULTS } from './catalog.mjs';

const FILE_KEY = 'NqyRMhIekr7P5eCV0kvX4m';
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function writeMeta(dir, base) {
  const file = path.join(dir, 'meta.json');
  const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  const meta = { ...base, ...existing, styles: base.styles, types: base.types, figma: base.figma };
  for (const k of Object.keys(meta)) if (meta[k] === undefined) delete meta[k];
  fs.writeFileSync(file, JSON.stringify(meta, null, 2) + '\n');
}

// ---- icons ----
const icons = JSON.parse(fs.readFileSync(path.join(ASSETS_DIR, 'figma-export/icons.json'), 'utf8'));
for (const [name, styles] of Object.entries(icons)) {
  const dir = path.join(ASSETS_DIR, 'icons', name);
  fs.mkdirSync(dir, { recursive: true });
  for (const [style, svg] of Object.entries(styles)) fs.writeFileSync(path.join(dir, `${style}.svg`), svg);
  const d = ICON_DEFAULTS[name] ?? {};
  writeMeta(dir, {
    name,
    title: d.title ?? name[0].toUpperCase() + name.slice(1),
    category: d.category ?? 'general',
    tags: d.tags ?? [],
    styles: Object.keys(styles),
    status: 'approved',
    figma: { fileKey: FILE_KEY, nodeId: d.nodeId },
    animation: d.animation ?? null,
    notes: d.notes,
  });
}

// ---- illustrations ----
const ills = JSON.parse(fs.readFileSync(path.join(ASSETS_DIR, 'figma-export/illustrations.json'), 'utf8'));
const byName = {};
for (const [key, svg] of Object.entries(ills)) {
  const [title, type] = key.split('/');
  (byName[title] ??= {})[type.toLowerCase()] = svg;
}
for (const [title, types] of Object.entries(byName)) {
  const name = slug(title);
  const dir = path.join(ASSETS_DIR, 'illustrations', name);
  fs.mkdirSync(dir, { recursive: true });
  for (const [type, svg] of Object.entries(types)) fs.writeFileSync(path.join(dir, `${type}.svg`), svg);
  const parts = [...types.stroke.matchAll(/<g id="([^"]+)"/g)].map((m) => m[1]).filter((id) => id !== `${title}/Stroke`);
  const d = ILLUSTRATION_DEFAULTS[name] ?? {};
  writeMeta(dir, {
    name,
    title,
    category: d.category ?? 'general',
    tags: d.tags ?? [],
    types: Object.keys(types),
    parts,
    status: 'approved',
    figma: { fileKey: FILE_KEY, nodeIds: d.nodeIds },
    animation: d.animation ?? null,
  });
}

console.log(`Imported ${Object.keys(icons).length} icons and ${Object.keys(byName).length} illustrations.`);
