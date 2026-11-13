// Plugin mode: the site runs inside the ollo Figma plugin panel (apps/figma-plugin). There,
// clicking an icon or illustration inserts it into the Figma file as a component with variants
// instead of copying or downloading it. Messages go to the plugin's code.ts.

type Ollo = { figma?: boolean };
export const IN_FIGMA = typeof window !== 'undefined' && !!(window as unknown as { __OLLO__?: Ollo }).__OLLO__?.figma;

export type FigmaVariant = { label: string; svg: string };
export type FigmaInsert = {
  name: string;
  title: string;
  /** variant property name: Style for icons, Type for illustrations */
  prop: 'Style' | 'Type';
  variants: FigmaVariant[];
  /** label of the variant to place on the canvas */
  pick: string;
  size: number;
  kind: 'icon' | 'illustration';
};

const post = (msg: unknown) => parent.postMessage({ pluginMessage: msg }, '*');

export function figmaInsert(m: FigmaInsert) {
  post({ type: 'insert', ...m });
}

/** Pro plan flag kept by the plugin (figma.clientStorage). Until sign-in exists it is a test switch. */
let pro = false;
const listeners = new Set<(pro: boolean) => void>();
export const figmaPro = () => pro;
export function onFigmaPlan(fn: (pro: boolean) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
export function setFigmaPro(v: boolean) {
  pro = v;
  post({ type: 'set-plan', pro: v });
  listeners.forEach((f) => f(v));
}

if (IN_FIGMA) {
  window.addEventListener('message', (e) => {
    const m = e.data?.pluginMessage;
    if (m?.type === 'plan') {
      pro = !!m.pro;
      listeners.forEach((f) => f(pro));
    }
  });
  post({ type: 'get-plan' });
  // Follow Figma's light/dark theme (themeColors adds .figma-dark to <html>).
  const sync = () => {
    document.documentElement.dataset.theme = document.documentElement.classList.contains('figma-dark') ? 'dark' : 'light';
  };
  sync();
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // Figma injects its own panel stylesheet into Figma-hosted plugins (fig-* components). It resets
  // buttons and selects, which squashed the icon tiles and the sort menu. Keep only ollo's styles.
  const ours = (el: Element) =>
    el.hasAttribute('data-ollo') ||
    /fonts\.googleapis|plugin\/panel\.css/.test(el.getAttribute('href') ?? '') ||
    (el.textContent ?? '').includes('#offline');
  const strip = () => {
    for (const el of document.querySelectorAll('style, link[rel="stylesheet"]')) if (!ours(el)) el.remove();
    try {
      if (document.adoptedStyleSheets?.length) document.adoptedStyleSheets = [];
    } catch {}
  };
  strip();
  new MutationObserver(strip).observe(document.documentElement, { childList: true, subtree: true });

  // No visible scrollbars in the plugin window (scrolling still works).
  const css = document.createElement('style');
  css.setAttribute('data-ollo', '');
  css.textContent =
    'html,body,*{scrollbar-width:none}::-webkit-scrollbar{display:none;width:0;height:0}' +
    '.ollo-resize{position:fixed;right:0;bottom:0;z-index:100;width:16px;height:16px;cursor:nwse-resize;color:var(--color-text-tertiary);touch-action:none}' +
    '.ollo-resize:hover{color:var(--color-text-primary)}';
  document.head.appendChild(css);

  // Drag the bottom-right corner to resize the plugin window; code.ts applies and remembers it.
  const corner = document.createElement('div');
  corner.className = 'ollo-resize';
  corner.title = 'Drag to resize';
  corner.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"><path d="M14 6 6 14M14 10l-4 4"/></svg>';
  const move = (e: PointerEvent) =>
    post({ type: 'resize', width: Math.max(360, Math.round(e.clientX + 6)), height: Math.max(420, Math.round(e.clientY + 6)) });
  corner.addEventListener('pointerdown', (e) => {
    corner.setPointerCapture(e.pointerId);
    corner.addEventListener('pointermove', move);
  });
  corner.addEventListener('pointerup', (e) => {
    corner.releasePointerCapture(e.pointerId);
    corner.removeEventListener('pointermove', move);
  });
  const addCorner = () => document.body.appendChild(corner);
  if (document.body) addCorner();
  else document.addEventListener('DOMContentLoaded', addCorner);
}
