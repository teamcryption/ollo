// Figma side of the ollo plugin. The panel is the ollo website (apps/web, plugin mode): clicking an
// icon or illustration sends its variants here. Each becomes a component set named after the asset,
// with a variant property (Style for icons, Type for illustrations), kept on an "ollo icons" page;
// an instance of the chosen variant is placed where the user is looking and selected.

type InsertMsg = {
  type: 'insert';
  name: string;
  title: string;
  prop: 'Style' | 'Type';
  variants: { label: string; svg: string }[];
  pick: string;
  size: number;
  kind: 'icon' | 'illustration';
};
type Msg =
  | InsertMsg
  | { type: 'get-plan' }
  | { type: 'set-plan'; pro: boolean }
  | { type: 'notify'; text: string }
  | { type: 'resize'; width: number; height: number };

const LIBRARY_PAGE = 'ollo icons';
// The panel is the website's tablet layout (834 px wide, Figma frame 38:10171): logo, Icons/Illustrations,
// search, category chips, Filters and a 6-column grid.
// Opens at the size the user last dragged it to (resize corner in the panel), else 834 x 800.
const DEFAULT_SIZE = { width: 834, height: 800 };

async function libraryPage(): Promise<PageNode> {
  let page = figma.root.children.find((p) => p.name === LIBRARY_PAGE);
  if (!page) {
    page = figma.createPage();
    page.name = LIBRARY_PAGE;
  }
  await page.loadAsync();
  return page;
}

/** Next free spot on the library page, laid out in rows of six. */
function nextSpot(page: PageNode) {
  const sets = page.children;
  if (!sets.length) return { x: 0, y: 0 };
  const last = sets[sets.length - 1];
  const row = sets.filter((n) => Math.abs(n.y - last.y) < 1);
  if (row.length < 6) return { x: Math.max(...row.map((n) => n.x + n.width)) + 40, y: last.y };
  return { x: 0, y: Math.max(...sets.map((n) => n.y + n.height)) + 40 };
}

async function insert(msg: InsertMsg) {
  const page = await libraryPage();
  // Default variant first (Figma uses the first one as the default).
  const ordered = [...msg.variants].sort((a, b) => (a.label === msg.pick ? -1 : b.label === msg.pick ? 1 : 0));
  // Reuse the set if this asset was inserted before; add only the variants it does not have yet.
  let set = page.children.find((n): n is ComponentSetNode => n.type === 'COMPONENT_SET' && n.name === msg.name) ?? null;
  const have = new Set(set ? set.children.map((c) => c.name.split('=')[1]) : []);
  const fresh: ComponentNode[] = [];
  for (const v of ordered) {
    if (have.has(v.label)) continue;
    const frame = figma.createNodeFromSvg(v.svg);
    frame.resize(msg.size, msg.size);
    const comp = figma.createComponentFromNode(frame);
    comp.fills = []; // createNodeFromSvg leaves a hidden white fill; keep assets transparent
    comp.name = `${msg.prop}=${v.label}`;
    comp.description = `${msg.title} ${msg.kind}, ${v.label}. ollo library.`;
    if (msg.kind === 'icon') for (const n of comp.findAll((x) => x.type === 'VECTOR')) n.name = msg.name;
    fresh.push(comp);
  }
  if (!set) {
    const spot = nextSpot(page);
    for (const c of fresh) page.appendChild(c);
    set = figma.combineAsVariants(fresh, page);
    set.name = msg.name;
    set.description = `${msg.title} from the ollo library. Switch ${msg.prop} to change the variant.`;
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
    set.children.find((c): c is ComponentNode => c.type === 'COMPONENT' && c.name === `${msg.prop}=${msg.pick}`) ??
    (set.children.find((c) => c.type === 'COMPONENT') as ComponentNode);
  const instance = variant.createInstance();
  instance.name = msg.name;
  const center = figma.viewport.center;
  instance.x = Math.round(center.x - instance.width / 2);
  instance.y = Math.round(center.y - instance.height / 2);
  figma.currentPage.appendChild(instance);
  figma.currentPage.selection = [instance];
}

async function start() {
  const saved = (await figma.clientStorage.getAsync('ollo-size')) as { width: number; height: number } | undefined;
  figma.showUI(__html__, { ...(saved ?? DEFAULT_SIZE), themeColors: true });
  figma.ui.onmessage = onMessage;
}

let saveTimer = 0;
async function onMessage(msg: Msg) {
  try {
    if (msg.type === 'resize') {
      const size = { width: Math.max(360, Math.min(1600, msg.width)), height: Math.max(420, Math.min(1200, msg.height)) };
      figma.ui.resize(size.width, size.height);
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => figma.clientStorage.setAsync('ollo-size', size), 300) as unknown as number;
    } else if (msg.type === 'insert') await insert(msg);
    else if (msg.type === 'get-plan') figma.ui.postMessage({ type: 'plan', pro: (await figma.clientStorage.getAsync('ollo-pro')) === true });
    else if (msg.type === 'set-plan') await figma.clientStorage.setAsync('ollo-pro', msg.pro);
    else if (msg.type === 'notify') figma.notify(msg.text);
  } catch (e) {
    figma.notify(`ollo: ${(e as Error).message}`, { error: true });
  }
}

start();
