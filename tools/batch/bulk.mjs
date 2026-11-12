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
  sparkle: `body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })`,
  trash: `body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')`,
  flag: `body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')`,
  eye: `body('M12.8 16.5c1.2-2 2.6-3 4.2-3s3 1 4.2 3c-1.2 2-2.6 3-4.2 3s-3-1-4.2-3Z', { cover: true }), line(C(17, 16.5, 1.1))`,
  tag: `body('M13.5 13h3.8l3.6 3.6-3.9 3.9-3.5-3.5Z', { cover: true }), line(D(15.2, 14.8))`,
  calendar: `body(R(13, 13.3, 8, 7.2, 1.3), { cover: true }), line('M13.2 15.9h7.6M15 12.4v1.8M19 12.4v1.8')`,
  plus: `body(poly([[16, 12.5], [18, 12.5], [18, 15.5], [21, 15.5], [21, 17.5], [18, 17.5], [18, 20.5], [16, 20.5], [16, 17.5], [13, 17.5], [13, 15.5], [16, 15.5]], 0.5, true), { cover: true })`,
  upload: `body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })`,
  wifi: `body('M17 20.5 13 15.6a6 6 0 0 1 8 0Z', { cover: true }), line('M14.6 14.2a4 4 0 0 1 4.8 0')`,
  percent: `body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 18.3l3.6-3.6'), line(D(15.4, 14.7) + D(18.6, 18.1))`,
  bookmark: `body('M14.5 12.5h5v8l-2.5-1.8-2.5 1.8Z', { cover: true })`,
  question: `body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.7 15.4a1.3 1.3 0 1 1 1.9 1.2c-.4.2-.6.5-.6.9'), line(D(17, 18.9))`,
  crown: `body(poly([[13, 20], [13, 14], [15.3, 16.3], [17, 13], [18.7, 16.3], [21, 14], [21, 20]], 0.6, true), { cover: true })`,
  moon: `body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })`,
  pause: `body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })`,
  leaf: `body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')`,
  hourglass: `body(poly([[13.5, 12.5], [20.5, 12.5], [17.6, 16.5], [20.5, 20.5], [13.5, 20.5], [16.4, 16.5]], 0.6, true), { cover: true })`,
  trophy: `body('M14 12.8h6v2.7a3 3 0 0 1-6 0Z', { cover: true }), line('M17 18.5v1.7M15 20.6h4M14 13.8h-1v.6a1.6 1.6 0 0 0 1.4 1.6M20 13.8h1v.6a1.6 1.6 0 0 1-1.4 1.6')`,
  music_disabled: `body(C(15.2, 19, 1.8), { cover: true }), body(R(16.2, 12.4, 1.5, 6.6, 0.5), { cover: true }), body('M16.5 12.4l3.8 1v2l-3.8-1Z', { cover: true })`,
  fire: `body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })`,
  cursor: `body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })`,
  key_disabled: `body(C(15.2, 15.2, 2.4), { cover: true }), body(poly([[16.6, 16.1], [17.6, 15.1], [21, 18.5], [20.3, 19.2], [19.4, 18.3], [18.7, 19], [17.8, 18.1], [18.5, 17.4], [16.6, 16.1]], 0.3, true), { cover: true }), line(D(14.7, 14.7))`,
  camera: `body('M13 15.2a1.2 1.2 0 0 1 1.2-1.2h1.2l.8-1.2h2.6l.8 1.2h1.2a1.2 1.2 0 0 1 1.2 1.2v4.1a1.2 1.2 0 0 1-1.2 1.2h-5.6a1.2 1.2 0 0 1-1.2-1.2Z', { cover: true }), line(C(17, 17.2, 1.4))`,
  filter: `body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })`,
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
  sparkle: (l) => [`AI ${l}`, 'ai, smart, magic'],
  trash: (l) => [`Delete ${l}`, 'delete, remove, trash'],
  flag: (l) => [`Report ${l}`, 'report, flag, mark'],
  eye: (l) => [`View ${l}`, 'view, preview, visible'],
  tag: (l) => [`${l} Price`, 'price, sale, label'],
  calendar: (l) => [`${l} Booking`, 'booking, date, appointment'],
  plus: (l) => [`Add ${l}`, 'add, new, plus'],
  upload: (l) => [`Upload ${l}`, 'upload, send, export'],
  wifi: (l) => [`Connected ${l}`, 'wireless, smart, connected'],
  percent: (l) => [`${l} Sale`, 'sale, discount, offer'],
  bookmark: (l) => [`Save ${l}`, 'save, bookmark, later'],
  question: (l) => [`${l} Help`, 'help, question, support'],
  crown: (l) => [`Premium ${l}`, 'premium, pro, vip'],
  moon: (l) => [`${l} Night Mode`, 'night, dark mode, sleep'],
  pause: (l) => [`Pause ${l}`, 'pause, hold, stop'],
  leaf: (l) => [`Eco ${l}`, 'eco, green, sustainable'],
  hourglass: (l) => [`${l} Timer`, 'timer, waiting, countdown'],
  trophy: (l) => [`${l} Award`, 'award, winner, achievement'],
  music: (l) => [`${l} Audio`, 'audio, music, sound'],
  fire: (l) => [`Trending ${l}`, 'trending, hot, popular'],
  cursor: (l) => [`Select ${l}`, 'select, click, pointer'],
  key: (l) => [`${l} Access`, 'access, key, unlock'],
  camera: (l) => [`${l} Photo`, 'photo, camera, picture'],
  filter: (l) => [`Filter ${l}`, 'filter, sort, refine'],
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
