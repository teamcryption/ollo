import { B } from './mods.mjs';
const add = {
  'baseball-glove': [`body('M5 17V9a1.5 1.5 0 0 1 3 0V5a1.5 1.5 0 0 1 3 0v4.5a1.5 1.5 0 0 1 3 .5v3l1.5-1.5a1.3 1.3 0 0 1 1.8 1.8L14 17Z'), line('M7.5 13.5h4')`, 'sports', 'Baseball Glove'],
  'bowler-hat': [`body('M5.5 12c0-4 1.8-6.5 4-6.5s4 2.5 4 6.5Z'), line('M3 12.5c2 1.5 4.5 2 6.5 2s4.5-.5 6.5-2')`, 'fashion', 'Bowler Hat'],
  'electric-guitar': [`body('M5 17.5c-1.5-1.5-1.5-4 .5-5.5l2.5-2 1.5 1.5 3-3 1.5 1.5-3 3 1.5 1.5-2 2.5c-1.5 2-4 2-5.5.5Z'), line('M12 8l4-4.5')`, 'media', 'Electric Guitar'],
  espresso: [`body('M5 9h8v4a4 4 0 0 1-8 0Z'), line('M13 10h1.5a1.5 1.5 0 0 1 0 3H13'), line('M4 18h10')`, 'food', 'Espresso'],
  'flag-pole': [`line('M5 3.5v15M3.5 18.5h3'), body('M5 4h10l-2 3 2 3H5Z')`, 'travel', 'Flag Pole'],
  fondue: [`body('M4 9h11v3a5.5 5 0 0 1-11 0Z'), line('M7 9 5 3.5M12 9l2-5.5M5.5 17.5h8')`, 'food', 'Fondue'],
  'gingerbread-house': [`body(poly([[3, 10], [9.5, 4], [16, 10], [16, 18], [3, 18]], 0.8, true)), line('M3.5 10.5l1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5'), line('M8 18v-3.5h3V18')`, 'celebration', 'Gingerbread House'],
  'golf-ball': [`body(C(9.5, 8.5, 5)), line(D(8, 7) + D(11, 7) + D(9.5, 9.5) + D(7.5, 10.5) + D(11.5, 10.5)), line('M8 14h3l-1 2v2.5')`, 'sports', 'Golf Ball'],
  gondola: [`body('M3 12c3 2 10 2 13 0l-1 3c-3 1.5-8 1.5-11 0Z'), line('M14 12 16 4M9 11.5V9h3v2.5')`, 'travel', 'Gondola'],
  'hat-stand': [`line('M9.5 4v13M6 18h7M6 6l3.5 1L13 6M7 9h5')`, 'home', 'Hat Stand'],
  jeans: [`body('M5 3.5h9v4l.5 10.5h-3.3l-1.7-9-1.7 9H4.5L5 7.5Z'), line('M5 6h9M9.5 3.5V6')`, 'fashion', 'Jeans'],
  jigsaw: [`body(R(5, 4, 9, 6, 1.5)), line('M8 10v3h3v-3M9.5 13v5'), line('M14 7h2.5')`, 'tools', 'Jigsaw'],
  maracas: [`body(E(6, 7, 2.5, 3.5)), body(E(13, 7, 2.5, 3.5)), line('M6 10.5v7M13 10.5v7')`, 'media', 'Maracas'],
  'mini-fridge': [`body(R(4.5, 5, 10, 13, 1.5)), line('M4.7 9h9.6M12 6.5v1.5M12 11v2')`, 'home', 'Mini Fridge'],
  pinata: [`body('M4 11l3-3 4 1 3-3 2 1-1 3 1 3-4 2-4-1-3 1Z'), line('M6 14v4M10 15v3M14 13v4')`, 'celebration', 'Piñata'],
  'rubber-duck': [`body('M5 10.5a3 3 0 1 1 6 0c3-1 5 0 5.5 2.5 0 3-3 4.5-6.5 4.5S4 16 4 13.5c0-1 .5-2 1-3Z'), body('M5 10l-2 .7L5 11.5Z'), line(D(8, 9.5))`, 'gaming', 'Rubber Duck'],
  'spinning-top': [`body(poly([[4, 9], [15, 9], [9.5, 17]], 0.8, true)), line('M9.5 9V4M8 4h3'), line('M4.2 11h10.6')`, 'gaming', 'Spinning Top'],
  'tea-kettle': [`body('M4 17a5.5 5.5 0 0 1 11 0Z'), line('M15 13l2-2M6.5 11.5c0-3 1.5-5 3-5s3 2 3 5'), line(D(9.5, 5))`, 'food', 'Tea Kettle'],
  'tote-bag': [`body('M4 9h11l-1 9H5Z'), line('M7 9V6a2.5 2.5 0 0 1 5 0v3'), line('M4.3 12h10.4')`, 'commerce', 'Tote Bag'],
  'toy-car': [`body('M3 12l2-4h7l3 4v3H3Z'), line(C(6, 15.5, 1.5)), line(C(12.5, 15.5, 1.5)), line('M8 8v4')`, 'gaming', 'Toy Car'],
  tuba: [`body('M6 6h7v8a3.5 3.5 0 0 1-7 0Z'), line('M3.5 6h12M9.5 6V3.5M4 17.5h11')`, 'media', 'Tuba'],
  turban: [`body('M3.5 13c0-5 2.5-8.5 6-8.5s6 3.5 6 8.5Z'), line('M3.7 10.5c3 1.5 9 1.5 11.6 0M7 5.5c1.5 2.5 3.5 4 6.5 5'), line(C(9.5, 7.5, 1))`, 'fashion', 'Turban'],
  tuxedo: [`body('M5 4h9v14H5Z'), line('M7.5 4l2 6 2-6'), body('M8 11.5l1.5-.8 1.5.8-1.5.8Z')`, 'fashion', 'Tuxedo'],
  ukulele: [`body('M7 10c2 0 3 .8 3 1.8s-.6 1-.6 1.6S11 14.6 11 16s-1.5 2.5-4 2.5S3 17.4 3 16s1.6-2.2 1.6-2.6S4 12.8 4 11.8 5 10 7 10Z'), line('M8 11 15 4M13.5 3.5l2 2')`, 'media', 'Ukulele'],
};
const cat = {}; const label = {};
for (const [k, [geo, c, l]] of Object.entries(add)) { if (B[k]) continue; B[k] = geo; cat[k] = c; label[k] = l; }
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, cat);
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, label);
export default {};
