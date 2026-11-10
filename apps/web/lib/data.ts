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

export type IconEntry = { n: string; t: string; c: string; g: string; a: 0 | 1; m?: 'pop' | 'draw' | 'wiggle' | 'pulse'; b?: number };
export type Category = { id: string; title: string; count: number };
export type MotionSpec = { duration: number; loop?: boolean; tracks: unknown[] };
export type Index = {
  total: number;
  categories: Category[];
  icons: IconEntry[];
  /** Newest icon batch number (0 without git history) and batch → date. */
  latest: number;
  batchDate: Record<string, string>;
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
export const loadIndex = () => load<Index>(`${DATA}index.json`);
export const loadStyle = (s: IconStyle) => load<Record<string, string>>(`${DATA}icons/${s}.json`);
export const loadMotion = () => load<Record<string, MotionSpec>>(`${DATA}motion.json`);
export const loadIllustrations = () => load<Illustration[]>(`${DATA}illustrations.json`);

/** Every query word must appear in the name, title, tags or category title. */
export function searchIcons(icons: IconEntry[], query: string, catTitles: Map<string, string>) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return icons;
  return icons.filter((i) => {
    const hay = `${i.n} ${i.t} ${i.g} ${catTitles.get(i.c) ?? ''}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

const round = (n: number) => Math.round(n * 1000) / 1000;

/** Optical stroke multiplier per render size (tokens.json → icon.opticalStroke). */
export function opticalMultiplier(size: number, table: Record<string, number | string>) {
  const t = table[String(size)];
  return typeof t === 'number' ? t : Math.min(1.5, Math.max(0.75, Math.pow(24 / size, 0.55)));
}

/** The SVG a user gets when copying: real size, real colour, optically adjusted stroke. */
export function exportIconSvg(svg: string, size: number, colour: string, table: Record<string, number | string>) {
  const mult = opticalMultiplier(size, table);
  return svg
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
