// Loads and validates everything in packages/assets.
import fs from 'node:fs';
import path from 'node:path';
import { ASSETS_DIR } from './paths.mjs';

const ICON_STYLES = ['light', 'regular', 'bold', 'duotone', 'fill'];
const ILL_TYPES = ['stroke', 'fill', 'duotone'];
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MOTION_PROPS = ['scale', 'rotate', 'translateX', 'translateY', 'opacity', 'draw'];

export function loadTokens() {
  return JSON.parse(fs.readFileSync(path.join(ASSETS_DIR, 'tokens.json'), 'utf8'));
}

function readDir(kind, variantsKey, allowed) {
  const base = path.join(ASSETS_DIR, kind);
  const out = [];
  const errors = [];
  for (const name of fs.readdirSync(base).sort()) {
    const dir = path.join(base, name);
    if (!fs.statSync(dir).isDirectory()) continue;
    const metaFile = path.join(dir, 'meta.json');
    if (!fs.existsSync(metaFile)) { errors.push(`${kind}/${name}: missing meta.json`); continue; }
    const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
    const where = `${kind}/${name}`;
    if (meta.name !== name) errors.push(`${where}: meta.name "${meta.name}" must equal folder name`);
    if (!NAME_RE.test(name)) errors.push(`${where}: name must be kebab-case`);
    for (const k of ['title', 'category']) if (typeof meta[k] !== 'string' || !meta[k]) errors.push(`${where}: missing ${k}`);
    if (!Array.isArray(meta.tags)) errors.push(`${where}: tags must be an array`);
    const variants = meta[variantsKey] ?? [];
    if (!variants.length) errors.push(`${where}: no ${variantsKey}`);
    const svgs = {};
    for (const v of variants) {
      if (!allowed.includes(v)) { errors.push(`${where}: unknown ${variantsKey} "${v}"`); continue; }
      const f = path.join(dir, `${v}.svg`);
      if (!fs.existsSync(f)) { errors.push(`${where}: missing ${v}.svg`); continue; }
      svgs[v] = fs.readFileSync(f, 'utf8');
    }
    if (meta.animation) errors.push(...validateMotion(meta.animation, where, meta.parts));
    out.push({ ...meta, svgs });
  }
  return { items: out, errors };
}

function validateMotion(m, where, parts) {
  const e = [];
  if (!(m.duration > 0)) e.push(`${where}: animation.duration must be > 0`);
  for (const [i, t] of (m.tracks ?? []).entries()) {
    const w = `${where}: animation.tracks[${i}]`;
    if (!MOTION_PROPS.includes(t.property)) e.push(`${w}: unknown property ${t.property}`);
    if (!Array.isArray(t.times) || t.times.length !== t.values?.length) e.push(`${w}: times/values length mismatch`);
    if (t.ease && t.ease.length !== t.times.length - 1) e.push(`${w}: ease needs ${t.times.length - 1} entries`);
    if (t.times?.some((x, j) => j && x < t.times[j - 1])) e.push(`${w}: times must be ascending`);
    if (typeof t.target === 'string' && t.target !== 'root' && parts && !parts.includes(t.target)) e.push(`${w}: unknown part "${t.target}"`);
  }
  return e;
}

export function loadAll() {
  const icons = readDir('icons', 'styles', ICON_STYLES);
  const illustrations = readDir('illustrations', 'types', ILL_TYPES);
  return {
    tokens: loadTokens(),
    icons: icons.items,
    illustrations: illustrations.items,
    errors: [...icons.errors, ...illustrations.errors],
  };
}
