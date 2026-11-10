// Bulk combo spec: every unused base x modifier pair, templated titles/tags, category from the base's existing icons.
// env: BULK_MODS (comma list), BULK_MAX (number), BULK_DROP (file with names to skip, one per line)
import { B, M, combos } from './mods.mjs';
import fs from 'node:fs';
const here = new URL('.', import.meta.url);
for (const f of fs.readdirSync(here).filter((f) => /^b1\d\d[a-z]?\.mjs$/.test(f))) await import(new URL(f, here).href);
import { fileURLToPath } from 'node:url';
const ICONS = fileURLToPath(new URL('../../packages/assets/icons', import.meta.url));
const names = fs.readdirSync(ICONS);
import { execSync } from 'node:child_process';
const tracked = [...new Set(execSync('git ls-files ' + ICONS, { maxBuffer: 1e8 }).toString().split(/\r?\n/).filter(Boolean).map((p) => p.split('/').slice(-2)[0]))];
const taken = new Set(tracked.map((n) => n.replace(/-/g, '')));

Object.assign(M, {
  add: `body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v3.8M15.1 16.5h3.8')`,
  check: `body(C(17, 16.5, 4), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')`,
  close: `body(C(17, 16.5, 4), { cover: true }), line('M15.6 15.1l2.8 2.8M18.4 15.1l-2.8 2.8')`,
  remove: `body(C(17, 16.5, 4), { cover: true }), line('M15.1 16.5h3.8')`,
  user: `body(C(17, 14.2, 2.1), { cover: true }), body('M13.1 20.6a3.9 3.9 0 0 1 7.8 0Z', { cover: true })`,
  bell: `body('M17 12.3a3 3 0 0 1 3 3v2.4l1 1.6h-8l1-1.6v-2.4a3 3 0 0 1 3-3Z', { cover: true }), line('M16 20.9h2')`,
  cloud: `body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })`,
  chat: `body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })`,
  download: `body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')`,
  pencil: `body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })`,
  alert: `body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))`,
});

const LABEL = { atm: 'ATM', tv: 'TV', dna: 'DNA', ev: 'EV Charger', idcard: 'ID Card', firstaid: 'First Aid', piggy: 'Piggy Bank', cap: 'Graduation', gamepad: 'Game', 'baby-bottle': 'Baby Bottle', paw: 'Pet', bed: 'Hotel', fuel: 'Fuel Station', pool: 'Pool', water: 'Water', branch: 'Branch', bug: 'Bug', code: 'Code', router: 'Router', plug: 'Power Plug', chart: 'Chart', edit: 'Document', eye: 'Visibility', user: 'User', users: 'Team', message: 'Message', dashboard: 'Dashboard', link: 'Link', key: 'Key', cart: 'Cart', bag: 'Bag' };
const label = (b) => globalThis.BULK_LABEL?.[b] ?? LABEL[b] ?? b.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
const T = {
  search: (l) => [`Search ${l}`, 'search, find, lookup'],
  clock: (l) => [`${l} Schedule`, 'schedule, time, history'],
  shield: (l) => [`${l} Protection`, 'protected, secure, safety'],
  gear: (l) => [`${l} Settings`, 'settings, configure, preferences'],
  pin: (l) => [`${l} Location`, 'location, place, map'],
  lock: (l) => [`Locked ${l}`, 'locked, private, secure'],
  bolt: (l) => [`Instant ${l}`, 'quick, fast, instant'],
  heart: (l) => [`Favourite ${l}`, 'favourite, saved, like'],
  star: (l) => [`Featured ${l}`, 'featured, top rated, best'],
  add: (l) => [`Add ${l}`, 'add, new, create'],
  check: (l) => [`${l} Confirmed`, 'confirmed, done, verified'],
  close: (l) => [`Cancel ${l}`, 'cancel, close, dismiss'],
  remove: (l) => [`Remove ${l}`, 'remove, delete, minus'],
  user: (l) => [`${l} Account`, 'user, account, profile'],
  bell: (l) => [`${l} Notification`, 'notification, reminder, alert'],
  cloud: (l) => [`Cloud ${l}`, 'cloud, sync, online'],
  chat: (l) => [`${l} Chat`, 'chat, support, message'],
  download: (l) => [`Download ${l}`, 'download, save, export'],
  pencil: (l) => [`Edit ${l}`, 'edit, write, modify'],
  alert: (l) => [`${l} Alert`, 'alert, warning, problem'],
};
// category: most common category among existing icons named <base>-*
const catOf = {};
for (const b of Object.keys(B)) {
  const counts = {};
  for (const n of names) if (n.startsWith(b + '-')) {
    try { const c = JSON.parse(fs.readFileSync(`${ICONS}/${n}/meta.json`, 'utf8')).category; counts[c] = (counts[c] ?? 0) + 1; } catch {}
  }
  catOf[b] = globalThis.BULK_CAT?.[b] ?? Object.entries(counts).sort((x, y) => y[1] - x[1])[0]?.[0] ?? 'interface';
}
const mods = (process.env.BULK_MODS ?? 'search,clock,shield,gear,pin,lock,bolt,heart,star').split(',');
const max = +(process.env.BULK_MAX ?? 250);
const drop = new Set(process.env.BULK_DROP && fs.existsSync(process.env.BULK_DROP) ? fs.readFileSync(process.env.BULK_DROP, 'utf8').split(/\s+/).filter(Boolean) : []);
const rows = [];
outer: for (const m of mods) for (const b of Object.keys(B)) {
  const name = `${b}-${m}`;
  if (['key', 'coins', 'truck', 'puzzle', 'pill'].includes(b) || b === m || (b === 'users' && m === 'user') || (b === 'message' && m === 'chat')) continue;
  if (taken.has(name.replace(/-/g, '')) || drop.has(name)) continue;
  const [title, tags] = T[m](label(b));
  rows.push([b, m, title, `${tags}, ${label(b).toLowerCase()}`, catOf[b]]);
  if (rows.length >= max) break outer;
}
export default combos(rows);
