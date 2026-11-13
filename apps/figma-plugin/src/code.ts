// Figma side of the ollo plugin. The panel (ui.ts) sends one icon's SVGs per style; this turns
// them into a component set named after the icon, with a Style variant property
// (Light, Regular, Bold, Fill, Duotone), keeps the sets on an "ollo icons" page, and drops an
// instance of the chosen style where the user is looking.

type InsertMsg = {
  type: 'insert';
  name: string;
  title: string;
  /** style id -> svg (real colour, no currentColor) */
  svgs: Record<string, string>;
  /** style to place on the canvas */
  pick: string;
  size: number;
};
type Msg = InsertMsg | { type: 'get-plan' } | { type: 'set-plan'; pro: boolean } | { type: 'notify'; text: string };

const STYLE_LABEL: Record<string, string> = { light: 'Light', regular: 'Regular', bold: 'Bold', fill: 'Fill', duotone: 'Duotone' };
// Regular first: Figma uses the first variant as the default.
const ORDER = ['regular', 'light', 'bold', 'fill', 'duotone'];
const LIBRARY_PAGE = 'ollo icons';

figma.showUI(__html__, { width: 380, height: 600, themeColors: true });

async function libraryPage(): Promise<PageNode> {
  let page = figma.root.children.find((p) => p.name === LIBRARY_PAGE);
  if (!page) {
    page = figma.createPage();
    page.name = LIBRARY_PAGE;
  }
  await page.loadAsync();
  return page;
}

/** Next free spot on the library page, laid out in rows. */
function nextSpot(page: PageNode) {
  const sets = page.children;
  if (!sets.length) return { x: 0, y: 0 };
  const last = sets[sets.length - 1];
  const rowStart = sets.filter((n) => Math.abs(n.y - last.y) < 1);
  const right = Math.max(...rowStart.map((n) => n.x + n.width));
  if (rowStart.length < 6) return { x: right + 40, y: last.y };
  const bottom = Math.max(...sets.map((n) => n.y + n.height));
  return { x: 0, y: bottom + 40 };
}

async function insert(msg: InsertMsg) {
  const page = await libraryPage();
  const styles = ORDER.filter((s) => msg.svgs[s]);
  // Reuse the set if this icon was inserted before; add any styles it does not have yet.
  let set = page.children.find((n): n is ComponentSetNode => n.type === 'COMPONENT_SET' && n.name === msg.name) ?? null;
  const have = new Set(set ? set.children.map((c) => c.name.replace('Style=', '').toLowerCase()) : []);
  const fresh: ComponentNode[] = [];
  for (const s of styles) {
    if (have.has(s)) continue;
    const frame = figma.createNodeFromSvg(msg.svgs[s]);
    frame.resize(msg.size, msg.size);
    const comp = figma.createComponentFromNode(frame);
    comp.fills = []; // createNodeFromSvg leaves a hidden white fill; keep icons transparent
    comp.name = `Style=${STYLE_LABEL[s]}`;
    comp.description = `${msg.title} icon, ${STYLE_LABEL[s]} style. ollo icon library.`;
    for (const v of comp.findAll((n) => n.type === 'VECTOR')) v.name = msg.name;
    fresh.push(comp);
  }
  if (!set) {
    const spot = nextSpot(page);
    for (const c of fresh) page.appendChild(c);
    set = figma.combineAsVariants(fresh, page);
    set.name = msg.name;
    set.description = `${msg.title} icon from the ollo library. Switch the Style property for Light, Regular, Bold, Fill or Duotone.`;
    set.layoutMode = 'HORIZONTAL';
    set.itemSpacing = 16;
    set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 16;
    set.primaryAxisSizingMode = 'AUTO';
    set.counterAxisSizingMode = 'AUTO';
    set.x = spot.x;
    set.y = spot.y;
  } else {
    for (const c of fresh) set.appendChild(c);
  }

  const variant =
    set.children.find((c): c is ComponentNode => c.type === 'COMPONENT' && c.name === `Style=${STYLE_LABEL[msg.pick]}`) ??
    (set.children.find((c) => c.type === 'COMPONENT') as ComponentNode);
  const instance = variant.createInstance();
  instance.name = msg.name;
  const target = figma.currentPage;
  const center = figma.viewport.center;
  instance.x = Math.round(center.x - instance.width / 2);
  instance.y = Math.round(center.y - instance.height / 2);
  target.appendChild(instance);
  target.selection = [instance];
  figma.notify(`${msg.title} added as a component (${styles.map((s) => STYLE_LABEL[s]).join(', ')})`);
}

figma.ui.onmessage = async (msg: Msg) => {
  try {
    if (msg.type === 'insert') await insert(msg);
    else if (msg.type === 'get-plan') figma.ui.postMessage({ type: 'plan', pro: (await figma.clientStorage.getAsync('ollo-pro')) === true });
    else if (msg.type === 'set-plan') await figma.clientStorage.setAsync('ollo-pro', msg.pro);
    else if (msg.type === 'notify') figma.notify(msg.text);
  } catch (e) {
    figma.notify(`ollo: ${(e as Error).message}`, { error: true });
  }
};
