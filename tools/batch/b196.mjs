import { B } from './mods.mjs';
Object.assign(B, {
  trumpet: `line('M3 10.5h7.5M5 10.5V8.5M7.5 10.5V8.5'), body('M10.5 10.5 16 6v9Z')`,
  croissant: `body('M3 13c1.5-5 11.5-5 13 0-2 1.5-4 2-6.5 2S5 14.5 3 13Z'), line('M7 9.8 8 13.5M12 9.8 11 13.5')`,
  eggplant: `body('M12.5 6c2 2 1.5 5.5-1 8s-6 3.5-7.5 2 .5-5 3-7.5S10.5 4 12.5 6Z'), line('M12.5 6l1.8-2.2')`,
  'trash-bag': `body('M5 8h9l-1 9.5a1 1 0 0 1-1 .9H7a1 1 0 0 1-1-.9Z'), line('M7 8 6.5 5.5 9.5 7l3-1.5L12 8')`,
  plunger: `line('M9.5 3.5v8.5'), body('M5 16a4.5 4 0 0 1 9 0Z'), line('M4 16h11')`,
  sponge: `body(R(3.5, 7, 12, 8, 2)), line(D(6.5, 10) + D(9.5, 12) + D(12.5, 10))`,
  'cowboy-hat': `body('M6.5 11c0-3 1-5.5 3-5.5s3 2.5 3 5.5Z'), line('M3 11.5c1.5 2 4 2.5 6.5 2.5S14.5 13.5 16 11.5')`,
  trousers: `body('M5 3.5h9l.5 14.5h-3.3L9.5 9 8.3 18H5Z'), line('M5.2 6h8.6')`,
  wheat: `line('M9.5 18V6'), line('M9.5 8.5c-2-.5-3-2-3-3.5 2 .5 3 2 3 3.5ZM9.5 12.5c-2-.5-3-2-3-3.5 2 .5 3 2 3 3.5ZM9.5 12.5c2-.5 3-2 3-3.5-2 .5-3 2-3 3.5ZM9.5 8.5c2-.5 3-2 3-3.5-2 .5-3 2-3 3.5Z')`,
  igloo: `body('M3 16a6.5 6.5 0 0 1 13 0Z'), line('M7.8 16v-2.3a1.7 1.7 0 0 1 3.4 0V16M4.3 12.5h3.2M11.5 12.5h3.2')`,
  warehouse: `body('M3 8l6.5-4L16 8v10H3Z'), line('M6 18v-6h7v6M6 14.5h7')`,
  motorbike: `line(C(5, 15, 2.5)), line(C(14, 15, 2.5)), line('M5 15l3-5h4l2 5M10.5 10l1-3h2')`,
  ambulance: `body(R(3, 7, 10, 8, 1.2)), body('M13 9.5h1.5l1.5 2.5V15h-3Z'), line('M8 9v4M6 11h4'), line(D(6, 16.8) + D(13.5, 16.8))`,
  airship: `body(E(9, 9.5, 6, 3.5)), line('M7.5 13l.5 2h3l.5-2'), body('M14.8 9.5l1.7-2.3v4.6Z')`,
  'bike-helmet': `body('M3 13a6.5 6.5 0 0 1 13 0Z'), line('M3 13h13'), line('M7 7.5l1.5 2.5M11 7l.5 3M14 15.5 15 13')`,
  signature: `line('M3.5 13c2-5 4-7 5-6s-2 6-.5 6.5 3-3 4-2.5 1 2 3.5 1.5'), line('M3.5 16.5h12')`,
  shuttlecock: `body('M7 13.5h5l2.5-9.5h-10Z'), line('M7.6 9h3.8'), body(C(9.5, 15.8, 2))`,
  pancakes: `body(R(3.5, 12.5, 12, 3, 1.5)), body(R(4.5, 9.5, 10, 3, 1.5)), line('M8 6.5c1-.6 2-.6 3 0')`,
  pie: `body('M3 12h13l-1.5 4.5a1 1 0 0 1-1 .7H5.5a1 1 0 0 1-1-.7Z'), line('M3.5 12c1-3 3.3-4.5 6-4.5s5 1.5 6 4.5'), line('M7 9.8l1 2.2M11.5 9.5l.5 2.5')`,
  drill: `body('M4 6h8.5A1.5 1.5 0 0 1 14 7.5v1A1.5 1.5 0 0 1 12.5 10H10l-.5 7.5h-3L7 10H4Z'), line('M14 8h2.5')`,
  rake: `line('M9.5 3.5v9'), line('M5 12.5h9M5 12.5v4M7.3 12.5v4M9.5 12.5v4M11.7 12.5v4M14 12.5v4')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, {
  trumpet: 'media', croissant: 'food', corn: 'food', eggplant: 'food', 'pepper-mill': 'food', 'trash-bag': 'home',
  plunger: 'home', sponge: 'home', 'cowboy-hat': 'fashion', trousers: 'fashion', penguin: 'animals', wheat: 'nature',
  igloo: 'buildings', warehouse: 'logistics', motorbike: 'transport', ambulance: 'health', canoe: 'sports', airship: 'transport',
  'bike-helmet': 'sports', satellite: 'science', signature: 'business', golf: 'sports', shuttlecock: 'sports', 'jump-rope': 'sports',
  pancakes: 'food', pie: 'food', pacifier: 'people', tissues: 'home', towel: 'home', rug: 'home', drill: 'tools',
  pliers: 'tools', rake: 'nature', 'sleeping-bag': 'travel', 'fishing-rod': 'sports',
});
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { golf: 'Golf', canoe: 'Canoe', 'bike-helmet': 'Helmet', pie: 'Pie', rug: 'Rug' });
export default {};
