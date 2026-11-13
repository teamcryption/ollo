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
}
