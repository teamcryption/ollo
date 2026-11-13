// Relevance search for icons, the way people type into an icon library:
// "home icon", "notification icons", "trash" (finds delete), "user profile".
// Filler words are dropped, plurals fold to singular, a few common synonyms widen each word,
// and results are ranked: exact name > name word > title > tags > category > partial match.
/** Anything with a name, title, category and tags: icons and illustrations alike. */
export type Searchable = { n: string; t: string; c: string; g: string };

const STOP = new Set([
  'icon', 'icons', 'svg', 'svgs', 'vector', 'vectors', 'symbol', 'symbols', 'glyph', 'glyphs', 'png',
  'free', 'image', 'images', 'logo', 'logos', 'a', 'an', 'the', 'for', 'of', 'and', 'with', 'in', 'to',
]);

// Words people search for -> words the library uses (both directions are added below).
const SYNONYMS: string[][] = [
  ['notification', 'bell', 'alert', 'alarm', 'reminder', 'notify'],
  ['home', 'house'],
  ['user', 'person', 'profile', 'account', 'avatar', 'people'],
  ['search', 'find', 'magnifier', 'lookup'],
  ['delete', 'trash', 'bin', 'remove', 'garbage'],
  ['settings', 'setting', 'gear', 'cog', 'preferences', 'options'],
  ['mail', 'email', 'envelope', 'inbox'],
  ['chat', 'message', 'comment', 'conversation', 'bubble'],
  ['heart', 'love', 'like', 'favourite', 'favorite'],
  ['star', 'rating', 'favourite', 'favorite'],
  ['calendar', 'date', 'schedule', 'event'],
  ['lock', 'padlock', 'secure', 'security', 'password'],
  ['edit', 'pencil', 'pen', 'write'],
  ['cart', 'basket', 'shopping', 'checkout'],
  ['money', 'cash', 'currency', 'dollar', 'payment'],
  ['phone', 'call', 'telephone'],
  ['camera', 'photo'],
  ['picture', 'photo', 'gallery'],
  ['folder', 'directory'],
  ['file', 'document', 'doc', 'page'],
  ['close', 'cancel', 'cross', 'x'],
  ['check', 'tick', 'done', 'success', 'confirm'],
  ['plus', 'add', 'new', 'create'],
  ['minus', 'subtract'],
  ['time', 'clock', 'watch'],
  ['location', 'pin', 'marker', 'map', 'place'],
  ['menu', 'hamburger', 'navigation'],
  ['share', 'send', 'forward'],
  ['download', 'save'],
  ['upload', 'import'],
  ['refresh', 'reload', 'sync'],
  ['info', 'information', 'about'],
  ['help', 'question', 'support', 'faq'],
  ['warning', 'caution', 'danger', 'error'],
  ['eye', 'view', 'visible', 'show', 'preview'],
  ['logout', 'exit', 'signout'],
  ['login', 'signin', 'enter'],
  ['dashboard', 'grid', 'overview'],
  ['analytics', 'chart', 'graph', 'stats', 'statistics'],
];
const SYN = new Map<string, Set<string>>();
for (const group of SYNONYMS) for (const w of group) {
  const set = SYN.get(w) ?? new Set<string>();
  for (const o of group) set.add(o);
  SYN.set(w, set);
}

/** Fold common English plurals: notifications -> notification, boxes -> box, batteries -> battery. */
export function singular(w: string) {
  if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.length > 4 && /(ches|shes|xes|sses|zes)$/.test(w)) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us')) return w.slice(0, -1);
  return w;
}

const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).map(singular);

type Prepared = { name: string; nameWords: string[]; titleWords: Set<string>; tags: Set<string>; cat: Set<string> };
const prepared = new WeakMap<Searchable, Prepared>();
function prep(i: Searchable, catTitles: Map<string, string>): Prepared {
  let p = prepared.get(i);
  if (!p) {
    p = {
      name: i.n,
      nameWords: words(i.n),
      titleWords: new Set(words(i.t)),
      tags: new Set(words(i.g)),
      cat: new Set(words(`${i.c} ${catTitles.get(i.c) ?? ''}`)),
    };
    prepared.set(i, p);
  }
  return p;
}

/** Best score of one query word (or a synonym, scored a little lower) against one icon. */
function wordScore(p: Prepared, w: string): number {
  const direct = (t: string, f: number) => {
    let s = 0;
    if (p.nameWords[0] === t) s = 100;
    else if (p.nameWords.includes(t)) s = 80;
    else if (p.titleWords.has(t)) s = 60;
    else if (p.tags.has(t)) s = 45;
    else if (p.cat.has(t)) s = 25;
    else if (t.length >= 3 && p.nameWords.some((n) => n.startsWith(t))) s = 35;
    else if (t.length >= 4 && p.name.includes(t)) s = 15;
    return s * f;
  };
  let best = direct(w, 1);
  for (const s of SYN.get(w) ?? []) if (s !== w) best = Math.max(best, direct(s, 0.7));
  return best;
}

/** Items (icons or illustrations) matching every meaningful word of the query, most relevant first. */
export function searchIcons<T extends Searchable>(icons: T[], query: string, catTitles: Map<string, string>): T[] {
  const raw = words(query);
  const terms = raw.filter((w) => !STOP.has(w));
  if (!terms.length) return icons;
  const joined = terms.join('-');
  const scored: { i: T; s: number; o: number }[] = [];
  icons.forEach((i, o) => {
    const p = prep(i, catTitles);
    let total = 0;
    for (const w of terms) {
      const s = wordScore(p, w);
      if (!s) return; // every word must match something
      total += s;
    }
    if (p.name === joined) total += 200; // "home icon" -> home first
    else if (p.name.startsWith(joined + '-')) total += 40; // then home-* variants
    total -= p.nameWords.length * 4; // base concepts before long variant names
    scored.push({ i, s: total, o });
  });
  scored.sort((a, b) => b.s - a.s || a.o - b.o);
  return scored.map((x) => x.i);
}
