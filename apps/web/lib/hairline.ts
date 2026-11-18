// Live illustrations: runs Hairline figures (packages/hairline-figures) inside the site's cards and popup.
// The kernel and each figure arrive as code in data/hairline.json and are started once, as scripts,
// so a figure is exactly what its own page runs. Three ways to run one:
//   animated     it plays its own tour on a loop (a hand can still take over)
//   interactive  it answers the pointer only
//   scroll       its tour is walked by how far it has scrolled through its scroll box (the window by default)
import { loadHairline } from './data';
import { mix } from './colour';
import { THEME_BG, THEME_INK, type IllTheme } from './illustration';

type Stop = [number, number] | null;
type Figure = {
  name: string;
  means: string;
  range: [number, number, number];
  tour: Stop[] | null;
  mount: (host: { stage: HTMLElement; svg: SVGSVGElement; read: { textContent: string } }, value: number) => { set: (v: number) => void; destroy: () => void };
};
type Kernel = {
  inject: (root: Document) => void;
  mk: (tag: string, attrs: Record<string, string>, parent: Element) => Element;
  tour: (stage: HTMLElement, stops: Stop[], onStop?: (i: number) => void) => { stop: () => void };
  LAP: Stop[];
};
type W = Window & { HL?: Kernel; __hlFigs?: Record<string, Figure> };

export type LiveMode = 'animated' | 'interactive' | 'scroll';
export type LiveStyle = 'stroke' | 'fill' | 'duotone';

let ready: Promise<Record<string, Figure>> | null = null;

function run(code: string) {
  const s = document.createElement('script');
  s.textContent = code;
  document.head.appendChild(s);
  s.remove();
}

/** Starts the kernel and every figure once; resolves to the figures by name. */
export function hairlineFigures() {
  return (ready ??= loadHairline().then((data) => {
    const w = window as W;
    if (!w.HL) run(data.kernel);
    w.__hlFigs ??= {};
    for (const [name, f] of Object.entries(data.figures)) {
      if (w.__hlFigs[name]) continue;
      // each figure in its own scope; its closing hairline({...}) call registers it
      run(`(() => { const hairline = (fig) => { window.__hlFigs[${JSON.stringify(name)}] = fig; };\n${f.code}\n})();`);
    }
    w.HL!.inject(document);
    return w.__hlFigs;
  }));
}

/**
 * The kernel's palette for a style, as the CSS variables it reads (--hairline-*):
 * Stroke = ground-filled faces and ink lines at four strengths; Fill = ink faces parted by
 * ground-coloured lines; Duotone = tinted faces with ink lines. Same mixes as the still templates.
 */
export function liveStyle(style: LiveStyle, theme: IllTheme, colour: string | null): Record<string, string> {
  const bg = THEME_BG[theme], ink = colour ?? THEME_INK[theme];
  const lines = { hi: ink, edge: mix(bg, ink, 0.5), mid: mix(bg, ink, 0.32), lo: mix(bg, ink, 0.16) };
  const p =
    style === 'fill'
      ? { plate: ink, hi: mix(ink, bg, 0.55), edge: bg, mid: bg, lo: bg }
      : style === 'duotone'
        ? { plate: mix(bg, ink, 0.35), ...lines }
        : { plate: bg, ...lines };
  const out: Record<string, string> = { background: bg };
  for (const [k, v] of Object.entries(p)) out[`--hairline-${k}`] = v;
  return out;
}

/** Mounts figure `name` into `stage`. `root` is the scroll box for scroll mode (default: the window). */
export async function mountLive(stage: HTMLElement, name: string, mode: LiveMode, onRead: (t: string) => void, root?: HTMLElement | null) {
  const figs = await hairlineFigures();
  const fig = figs[name], HL = (window as W).HL!;
  if (!fig) return () => {};
  stage.setAttribute('data-hairline', fig.name);
  stage.setAttribute('role', 'img');
  stage.setAttribute('aria-label', fig.means);
  const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage) as SVGSVGElement;
  let text = '';
  const read = { get textContent() { return text; }, set textContent(v: string) { text = String(v ?? ''); onRead(text); } };
  const handle = fig.mount({ stage, svg, read }, fig.range[1]);
  if (!text) read.textContent = 'rest';
  const lap = mode === 'animated' ? HL.tour(stage, fig.tour || HL.LAP) : null;
  const stops = (fig.tour || HL.LAP).filter(Boolean) as [number, number][];
  const me: Scroller = { stage, stops, inside: false, root: root ?? null };
  if (mode === 'scroll') { scrollers.add(me); onScroll(); }
  return () => {
    lap?.stop();
    scrollers.delete(me);
    handle.destroy();
    svg.remove();
  };
}

/* Scroll: each figure's tour is walked by how far it has moved through its scroll box. */
type Scroller = { stage: HTMLElement; stops: [number, number][]; inside: boolean; root: HTMLElement | null };
const scrollers = new Set<Scroller>();
const along = (stops: [number, number][], t: number): [number, number] => {
  if (stops.length === 1) return stops[0];
  const k = Math.min(stops.length - 1.0001, t * (stops.length - 1)), i = Math.floor(k), f = k - i;
  return [stops[i][0] + (stops[i + 1][0] - stops[i][0]) * f, stops[i][1] + (stops[i + 1][1] - stops[i][1]) * f];
};
function drive() {
  for (const s of scrollers) {
    const r = s.stage.getBoundingClientRect();
    const box = s.root?.getBoundingClientRect() ?? { top: 0, height: innerHeight };
    const t = ((box.top + box.height - r.top) / (box.height + r.height) - 0.15) / 0.7;
    if (!r.height || t < 0 || t > 1) {
      if (s.inside) { s.inside = false; s.stage.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse', pointerId: 1 })); }
      continue;
    }
    s.inside = true;
    const [x, y] = along(s.stops, t);
    s.stage.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', pointerId: 1, bubbles: true, clientX: r.left + (x / 400) * r.width, clientY: r.top + (y / 320) * r.height }));
  }
}
let queued = false;
function onScroll() { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; drive(); }); } }
if (typeof window !== 'undefined') {
  // capture: the site scrolls inside its own panes as well as the window
  addEventListener('scroll', onScroll, { passive: true, capture: true });
  addEventListener('resize', onScroll);
}
export const nudgeScroll = onScroll;
