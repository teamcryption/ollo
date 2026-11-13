// Client-side data access for the static files written by scripts/build-data.mjs.
import { animateSvg } from '@library/build/src/motion.mjs';

export type IconStyle = 'light' | 'regular' | 'bold' | 'duotone' | 'fill';
export const ICON_STYLES: { id: IconStyle; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'regular', label: 'Regular' },
  { id: 'bold', label: 'Bold' },
  { id: 'fill', label: 'Fill' },
  { id: 'duotone', label: 'Duotone' },
];
export const ICON_SIZES = [16, 20, 24, 32] as const;

export type IconEntry = {
  n: string;
  t: string;
  c: string;
  g: string;
  /** animated (derived on load from mi) */
  a: 0 | 1;
  m?: 'pop' | 'draw' | 'wiggle' | 'pulse';
  b?: number;
  /** data chunk holding this icon's paths */
  k: number;
  /** index into motion.json */
  mi?: number;
};
export type Category = { id: string; title: string; count: number };
export type MotionSpec = { duration: number; loop?: boolean; tracks: unknown[] };
export type Index = {
  total: number;
  categories: Category[];
  icons: IconEntry[];
  /** Newest icon batch number (0 without git history) and batch → date. */
  latest: number;
  batchDate: Record<string, string>;
  /** Shared path attribute strings referenced by the chunk files. */
  attrs: string[];
  chunks: number;
  tokens: {
    icon: { opticalStroke: Record<string, number | string> };
    illustration: { primary: string; secondary: string; background: string; ink: string };
  };
};
export type IllustrationType = 'stroke' | 'fill' | 'duotone';
export type Illustration = {
  n: string;
  t: string;
  c: string;
  g: string;
  types: Partial<Record<IllustrationType, string>>;
  motion: MotionSpec | null;
};

/** Where the JSON lives: /data/ on the site, data/ next to the published preview page. */
const DATA = (typeof window !== 'undefined' && (window as unknown as { __OLLO__?: { data?: string } }).__OLLO__?.data) || '/data/';

const cache = new Map<string, Promise<unknown>>();
function load<T>(url: string): Promise<T> {
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url).then((r) => {
        if (!r.ok) throw new Error(`${url}: ${r.status}`);
        return r.json();
      }),
    );
  }
  return cache.get(url) as Promise<T>;
}
let indexPromise: Promise<Index> | null = null;
export const loadIndex = () =>
  (indexPromise ??= load<Index>(`${DATA}index.json`).then((d) => {
    for (const i of d.icons) i.a = i.mi === undefined ? 0 : 1;
    return d;
  }));

/* Icon paths live in chunk files (scripts/build-data.mjs): o<k>.json holds the shared paths and
   the light/regular/bold/duotone path lists, f<k>.json the fill paths. Only the chunks of the
   icons on screen are fetched. */
type PathRef = [number | string, number];
type OutlineChunk = Record<string, { d?: string[]; s?: Partial<Record<IconStyle, PathRef[]>>; x?: Partial<Record<IconStyle, string>> }>;
type FillChunk = Record<string, [string, number][] | string>;
const SVG_OPEN = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">';
const rendered = new Map<string, string>(); // `${style}:${name}` -> svg

function decode(name: string, style: IconStyle, attrs: string[], o: OutlineChunk, f: FillChunk | null) {
  if (style === 'fill') {
    const v = f?.[name];
    if (v == null) return undefined;
    if (typeof v === 'string') return v;
    return SVG_OPEN + v.map(([d, a]) => `<path d="${d}"${attrs[a]}/>`).join('') + '</svg>';
  }
  const rec = o[name];
  if (!rec) return undefined;
  if (rec.x?.[style]) return rec.x[style];
  const list = rec.s?.[style];
  if (!list) return undefined;
  return SVG_OPEN + list.map(([p, a]) => `<path d="${typeof p === 'number' ? rec.d![p] : p}"${attrs[a]}/>`).join('') + '</svg>';
}

/** SVGs of the given icons in one style; fetches only the chunks they live in. */
export async function loadIcons(icons: IconEntry[], style: IconStyle): Promise<Record<string, string>> {
  const index = await loadIndex();
  const chunks = [...new Set(icons.map((i) => i.k))];
  const kind = style === 'fill' ? 'f' : 'o';
  const loaded = new Map(
    await Promise.all(chunks.map(async (k) => [k, await load<OutlineChunk | FillChunk>(`${DATA}icons/${kind}${k}.json`)] as const)),
  );
  const out: Record<string, string> = {};
  for (const i of icons) {
    const key = `${style}:${i.n}`;
    let svg = rendered.get(key);
    if (svg === undefined) {
      const c = loaded.get(i.k);
      svg = c && (style === 'fill' ? decode(i.n, style, index.attrs, {}, c as FillChunk) : decode(i.n, style, index.attrs, c as OutlineChunk, null));
      if (svg) rendered.set(key, svg);
    }
    if (svg) out[i.n] = svg;
  }
  return out;
}

/** Motion spec per icon name (59k icons share a few hundred recipes in motion.json). */
let motionPromise: Promise<Record<string, MotionSpec>> | null = null;
export const loadMotion = () =>
  (motionPromise ??= Promise.all([loadIndex(), load<MotionSpec[]>(`${DATA}motion.json`)]).then(([index, table]) => {
    const out: Record<string, MotionSpec> = {};
    for (const i of index.icons) if (i.mi !== undefined) out[i.n] = table[i.mi];
    return out;
  }));
export const loadIllustrations = () => load<Illustration[]>(`${DATA}illustrations.json`);

/** Relevance search (lib/search.ts). */
export { searchIcons } from './search';

const round = (n: number) => Math.round(n * 1000) / 1000;

/** Optical stroke multiplier per render size (tokens.json → icon.opticalStroke). */
export function opticalMultiplier(size: number, table: Record<string, number | string>) {
  const t = table[String(size)];
  return typeof t === 'number' ? t : Math.min(1.5, Math.max(0.75, Math.pow(24 / size, 0.55)));
}

/** Root id = the asset's name, so Figma (and other tools) name the pasted layer after it. */
export const nameSvg = (svg: string, name: string) =>
  svg.replace(/<svg([^>]*?)s+id="[^"]*"/, '<svg$1').replace('<svg', `<svg id="${name.replace(/[^a-z0-9-]/gi, '-')}"`);

/** The SVG a user gets when copying: its name, real size, real colour, optically adjusted stroke. */
export function exportIconSvg(svg: string, size: number, colour: string, table: Record<string, number | string>, name?: string) {
  const mult = opticalMultiplier(size, table);
  return (name ? nameSvg(svg, name) : svg)
    .replace('<svg', `<svg width="${size}" height="${size}"`)
    .replace(/stroke-width="([\d.]+)"/g, (_, w) => `stroke-width="${round(+w * mult)}"`)
    .replace(/currentColor/g, colour);
}

/** Self-contained animated SVG (CSS keyframes) for an icon, coloured. */
export function animatedIconSvg(svg: string, spec: MotionSpec, colour: string, size?: number) {
  const sized = size ? svg.replace('<svg', `<svg width="${size}" height="${size}"`) : svg;
  return animateSvg(sized, spec).replace(/currentColor/g, colour);
}

export const svgDataUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/** Illustration template → SVG with the chosen colours. */
export function fillIllustration(template: string, colours: Record<string, string>) {
  return template.replace(/\{\{(\w+)\}\}/g, (m, k) => colours[k] ?? m);
}

export const fmt = (n: number) => n.toLocaleString('en-US');
