// Panel of the ollo Figma plugin: same data, search and decoding as the site (apps/web/lib),
// so results match the website. Click an icon to insert it as a component with style variants.
import { loadIcons, loadIndex, searchIcons, type IconEntry, type IconStyle, type Index } from '../../web/lib/data';

const STYLES: { id: IconStyle; label: string; pro: boolean }[] = [
  { id: 'light', label: 'Light', pro: false },
  { id: 'regular', label: 'Regular', pro: false },
  { id: 'bold', label: 'Bold', pro: true },
  { id: 'fill', label: 'Fill', pro: true },
  { id: 'duotone', label: 'Duotone', pro: true },
];
const INK = '#171729';
const PAGE = 60;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const grid = $<HTMLUListElement>('grid');
const status = $<HTMLParagraphElement>('status');
const input = $<HTMLInputElement>('q');
const chips = $<HTMLDivElement>('styles');
const proSwitch = $<HTMLButtonElement>('pro');
const planNote = $<HTMLParagraphElement>('plan-note');

let index: Index | null = null;
let list: IconEntry[] = [];
let shown = PAGE;
let style: IconStyle = 'regular';
let pro = false;
let token = 0;
const catTitles = new Map<string, string>();

const post = (msg: unknown) => parent.postMessage({ pluginMessage: msg }, '*');
const allowed = () => STYLES.filter((s) => pro || !s.pro).map((s) => s.id);

function renderChips() {
  chips.innerHTML = '';
  for (const s of STYLES) {
    const b = document.createElement('button');
    b.className = 'chip';
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', String(style === s.id));
    b.innerHTML = `${s.label}${s.pro ? '<span class="badge-pro">PRO</span>' : ''}`;
    b.onclick = () => {
      if (s.pro && !pro) {
        post({ type: 'notify', text: `${s.label} is a Pro style. Free includes Light and Regular.` });
        return;
      }
      style = s.id;
      renderChips();
      renderGrid();
    };
    chips.appendChild(b);
  }
  proSwitch.setAttribute('aria-checked', String(pro));
  planNote.textContent = pro
    ? 'Pro: icons insert with Light, Regular, Bold, Fill and Duotone variants.'
    : 'Free: icons insert with Light and Regular variants. Pro adds Bold, Fill and Duotone.';
}

async function renderGrid() {
  const my = ++token;
  const visible = list.slice(0, shown);
  status.textContent = index
    ? `${list.length.toLocaleString('en-US')} icons${input.value.trim() ? ` for “${input.value.trim()}”` : ''}`
    : 'Loading…';
  const svgs = await loadIcons(visible, style);
  if (my !== token) return;
  grid.innerHTML = '';
  for (const i of visible) {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.className = 'tile';
    b.title = `${i.t}: insert as component`;
    b.innerHTML = svgs[i.n] ?? '';
    b.onclick = () => insert(i, b);
    li.appendChild(b);
    grid.appendChild(li);
  }
  if (!list.length) grid.innerHTML = '<li class="empty">No icons match.</li>';
}

async function insert(i: IconEntry, tile: HTMLButtonElement) {
  tile.classList.add('is-busy');
  const svgs: Record<string, string> = {};
  for (const s of allowed()) {
    const got = (await loadIcons([i], s))[i.n];
    if (got) svgs[s] = got.replace(/currentColor/g, INK).replace('<svg', `<svg id="${i.n}"`);
  }
  post({ type: 'insert', name: i.n, title: i.t, svgs, pick: style, size: 24 });
  tile.classList.remove('is-busy');
  tile.classList.add('is-done');
  setTimeout(() => tile.classList.remove('is-done'), 1200);
}

function applySearch() {
  if (!index) return;
  list = searchIcons(index.icons, input.value, catTitles);
  shown = PAGE;
  grid.parentElement!.scrollTop = 0;
  renderGrid();
}

let timer = 0;
input.addEventListener('input', () => {
  clearTimeout(timer);
  timer = window.setTimeout(applySearch, 150);
});
grid.parentElement!.addEventListener('scroll', (e) => {
  const el = e.currentTarget as HTMLElement;
  if (el.scrollTop + el.clientHeight > el.scrollHeight - 300 && shown < list.length) {
    shown += PAGE;
    renderGrid();
  }
});
proSwitch.onclick = () => {
  pro = !pro;
  if (!pro && STYLES.find((s) => s.id === style)?.pro) style = 'regular';
  post({ type: 'set-plan', pro });
  renderChips();
  renderGrid();
};
window.onmessage = (e) => {
  const m = e.data?.pluginMessage;
  if (m?.type === 'plan') {
    pro = !!m.pro;
    renderChips();
  }
};

renderChips();
post({ type: 'get-plan' });
loadIndex()
  .then((d) => {
    index = d;
    for (const c of d.categories) catTitles.set(c.id, c.title);
    list = d.icons;
    renderGrid();
  })
  .catch(() => {
    status.innerHTML =
      'Can’t reach the ollo icon data. Start the site first: <code>pnpm --filter @library/web dev</code> (http://localhost:3100), then reopen the plugin.';
  });
