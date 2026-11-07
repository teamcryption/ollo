// Expands every definition in defs/ into concrete icons, renders the five styles,
// attaches default motion, runs QA, and writes packages/assets/icons/<name>/.
//
//   node src/generate.mjs           generate + QA (fails on QA errors)
//   node src/generate.mjs --check   QA only, writes nothing
//   node src/generate.mjs --only=arrows,files
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BADGES, CONTAINERS, withBadge, withSlash, inContainer, turnEls, mirrorEls } from './dsl.mjs';
import PLAN from './variant-plan.mjs';
import { renderIcon, STYLES } from './render.mjs';
import { motionFor, turnDir } from './motion.mjs';
import { checkGeometry, checkFill, checkInk, checkMeta, fingerprint, nearDuplicates } from './qa.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ICONS_DIR = path.resolve(ROOT, '../assets/icons');
const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')).map(([k, v]) => [k, v ?? true]));
const CHECK = !!args.check;
const ONLY = args.only ? new Set(String(args.only).split(',')) : null;

const taxonomy = JSON.parse(fs.readFileSync(path.join(ROOT, 'taxonomy.json'), 'utf8'));
const categories = new Set(taxonomy.categories.map((c) => c.id));
const accentFree = new Set(taxonomy.categories.filter((c) => c.accent === false).map((c) => c.id));
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const uniq = (a) => [...new Set(a)];

/** Base definition -> concrete icons (base, direction turns, mirror, variants, badges). */
export function expand(def, category) {
  const base = { ...def, category, variant: null };
  const out = def.extend ? [] : [base];
  for (const [dir, deg] of Object.entries(def.turns ?? {})) {
    const from = def.dir;
    if (!from || !def.name.includes(from)) throw new Error(`${def.name}: turns need opts.dir naming the direction word in the name`);
    const anim = def.anim && typeof def.anim === 'object' && def.anim.dir ? { ...def.anim, dir: turnDir(def.anim.dir, deg) } : def.anim;
    out.push({
      ...def, category, anim,
      name: def.name.replace(from, dir),
      title: def.title.replace(cap(from), cap(dir)).replace(from, dir),
      tags: uniq([...def.tags.filter((t) => t !== from), dir]),
      els: turnEls(def.els, deg),
      variant: { kind: 'direction', of: def.name, value: dir },
    });
  }
  if (def.mirror) {
    const m = def.mirror;
    const anim = def.anim && typeof def.anim === 'object' && def.anim.dir ? { ...def.anim, dir: [-def.anim.dir[0], def.anim.dir[1]] } : def.anim;
    out.push({ ...def, category, anim, name: m.name, title: m.title, tags: m.tags ?? def.tags, els: mirrorEls(def.els, m.axis ?? 'x'), variant: { kind: 'mirror', of: def.name } });
  }
  for (const v of def.variants ?? []) {
    out.push({ ...def, category, ...v, tags: uniq([...(v.tags ?? []), ...def.tags]), variant: { kind: 'variant', of: def.name } });
  }
  if (def.off) {
    out.push({
      ...def, category, anim: 'pop-draw',
      name: `${def.name}-off`, title: `${def.title} Off`,
      tags: uniq([...def.tags, 'off', 'disabled']),
      els: withSlash(def.els), noAccent: true,
      variant: { kind: 'off', of: def.name },
    });
  }
  for (const k of def.containers ?? []) {
    out.push({
      ...def, category,
      name: `${def.name}-${k}`, title: `${def.title} ${CONTAINERS[k].title}`,
      tags: uniq([...def.tags, k]),
      els: inContainer(def.els, k),
      variant: { kind: 'container', of: def.name, value: k },
    });
  }
  for (const id of def.badges ?? []) {
    const b = BADGES[id];
    out.push({
      ...def, category, anim: 'pop-draw',
      name: `${def.name}-${id}`,
      title: `${def.title} ${b.title}`,
      tags: uniq([...def.tags, ...b.tags]),
      els: withBadge(def.els, id),
      variant: { kind: 'badge', of: def.name, value: id },
    });
  }
  return out;
}

export async function loadDefs() {
  const dir = path.join(ROOT, 'defs');
  const all = [];
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.mjs')).sort()) {
    const mod = (await import(path.join(dir, f))).default;
    if (ONLY && !ONLY.has(mod.category)) continue;
    for (const def of mod.icons) {
      const p = PLAN[def.name];
      const merged = p ? { ...def, ...p, badges: uniq([...(def.badges ?? []), ...(p.badges ?? [])]) } : def;
      all.push(...expand(merged, mod.category));
    }
  }
  return all;
}

function readExisting() {
  const map = new Map();
  if (!fs.existsSync(ICONS_DIR)) return map;
  for (const name of fs.readdirSync(ICONS_DIR)) {
    const f = path.join(ICONS_DIR, name, 'meta.json');
    if (fs.existsSync(f)) map.set(name, JSON.parse(fs.readFileSync(f, 'utf8')));
  }
  return map;
}

async function main() {
  const t0 = Date.now();
  const icons = await loadDefs();
  const existing = readExisting();
  const report = { generatedAt: new Date().toISOString(), icons: icons.length, files: icons.length * STYLES.length, errors: [], warnings: [], duplicates: [] };
  const seen = new Set();
  const hashes = [];

  for (const icon of icons) {
    const where = icon.name;
    const err = (m) => report.errors.push(`${where}: ${m}`);
    if (seen.has(icon.name)) err('duplicate name');
    seen.add(icon.name);
    const prior = existing.get(icon.name);
    if (prior && prior.source !== 'forge') err('name is taken by a Figma-sourced icon');
    checkMeta(icon, categories).forEach(err);
    const g = checkGeometry(icon, { requireAccent: !accentFree.has(icon.category) });
    g.errors.forEach(err);
    g.warnings.forEach((w) => report.warnings.push(`${where}: ${w}`));
    const { svgs, paths } = renderIcon(icon.els);
    checkFill(svgs.fill).forEach(err);
    checkInk(svgs).forEach(err);
    icon.svgs = svgs;
    icon.animation = motionFor(icon.anim, paths);
    hashes.push({ name: icon.name, ...fingerprint(svgs.regular), family: icon.variant?.of ?? icon.name });
  }
  // Figma-sourced icons take part in the duplicate check too (in their forge family, if a def claims them).
  const siblingOf = new Map(icons.flatMap((i) => (i.siblings ?? []).map((s) => [s, i.variant?.of ?? i.name])));
  for (const i of icons) if (i.extend) siblingOf.set(i.variant?.of ?? i.name, i.variant?.of ?? i.name);
  for (const [name, meta] of existing) {
    if (meta.source === 'forge') continue;
    const f = path.join(ICONS_DIR, name, 'regular.svg');
    if (fs.existsSync(f)) hashes.push({ name, ...fingerprint(fs.readFileSync(f, 'utf8')), family: siblingOf.get(name) ?? name });
  }
  report.duplicates = nearDuplicates(hashes).map(([a, b, d]) => ({ a, b, distance: d }));
  for (const d of report.duplicates) {
    const fa = hashes.find((h) => h.name === d.a).family;
    const fb = hashes.find((h) => h.name === d.b).family;
    // Within one family (e.g. arrow-left vs arrow-left-circle) it's a warning; across families, an error.
    (fa === fb || fa === d.b || fb === d.a ? report.warnings : report.errors).push(`duplicate: ${d.a} ~ ${d.b} (shape distance ${d.distance}px)`);
  }

  if (!CHECK && !report.errors.length) {
    const keep = new Set(icons.map((i) => i.name));
    for (const [name, meta] of existing) {
      if (meta.source === 'forge' && !keep.has(name) && (!ONLY || ONLY.has(meta.category))) fs.rmSync(path.join(ICONS_DIR, name), { recursive: true });
    }
    for (const icon of icons) {
      const dir = path.join(ICONS_DIR, icon.name);
      fs.mkdirSync(dir, { recursive: true });
      for (const s of STYLES) fs.writeFileSync(path.join(dir, `${s}.svg`), icon.svgs[s]);
      const meta = {
        name: icon.name, title: icon.title, category: icon.category, tags: icon.tags, styles: STYLES,
        status: 'review', source: 'forge', family: icon.variant?.of ?? icon.name,
        ...(icon.variant ? { variant: icon.variant } : {}),
        animation: icon.animation,
      };
      fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');
    }
  }

  const byCat = {};
  for (const i of icons) byCat[i.category] = (byCat[i.category] ?? 0) + 1;
  report.byCategory = byCat;
  fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'reports', 'qa.json'), JSON.stringify(report, null, 2) + '\n');

  console.log(`${CHECK ? 'Checked' : 'Generated'} ${icons.length} icons (${report.files} SVGs) in ${Date.now() - t0}ms`);
  console.log(Object.entries(byCat).map(([k, v]) => `  ${k}: ${v}`).join('\n'));
  if (report.warnings.length) console.warn(`${report.warnings.length} warnings:\n  ` + report.warnings.join('\n  '));
  if (report.errors.length) {
    console.error(`${report.errors.length} QA errors${CHECK ? '' : ' - nothing written'}:\n  ` + report.errors.join('\n  '));
    process.exitCode = 1;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
