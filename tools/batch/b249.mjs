import { B } from './mods.mjs';
const add = {
  'cuckoo-clock': [`body(poly([[3, 9], [9.5, 3.5], [16, 9], [14.5, 9], [14.5, 16], [4.5, 16], [4.5, 9]], 0.6, true)), line(C(9.5, 11.5, 2.5)), line('M8 16v2.5M11 16v2.5')`, 'time', 'Cuckoo Clock'],
  'grandfather-clock': [`body('M6 3.5h7v15H6Z'), line(C(9.5, 7.5, 2)), line('M9.5 11v4M8.5 15.5h2')`, 'time', 'Grandfather Clock'],
  syrup: [`body('M6 8.5h6v9a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1Z'), line('M7.5 8.5V6h3v2.5M12 10h1.5a1.5 1.5 0 0 1 0 3H12'), line('M6.2 12.5h5.6')`, 'food', 'Syrup'],
  orange: [`body(C(9.5, 11.5, 5.5)), body('M9.5 6c.3-1.8 1.8-2.5 3.5-2.2-.3 1.6-1.7 2.4-3.5 2.2Z'), line(D(9.5, 11.5))`, 'food', 'Orange'],
  radish: [`body('M9.5 8c3 0 4.5 2 4.5 4.5 0 3-2.5 5-4.5 6.5-2-1.5-4.5-3.5-4.5-6.5C5 10 6.5 8 9.5 8Z'), line('M9.5 8 7 3.5M9.5 8l2.5-4.5M9.5 8V4')`, 'food', 'Radish'],
  crossbow: [`line('M3 9c4-3 9-3 13 0M9.5 7.2V17M3 9l6.5 5 6.5-5'), line('M8 17h3')`, 'sports', 'Crossbow'],
  'block-tower': [`body(R(4, 14, 11, 3.5, 0.6)), body(R(6, 10.5, 7, 3.5, 0.6)), body(R(5, 7, 9, 3.5, 0.6)), body(R(7, 3.5, 5, 3.5, 0.6))`, 'gaming', 'Block Tower'],
  breastplate: [`body('M5 4h9l1.5 4-1 8.5L9.5 18l-5-1.5-1-8.5Z'), line('M9.5 4v14M5 8h9')`, 'gaming', 'Armor'],
  catapult: [`line('M3 17.5h13M6 17.5l3-6 3 6M9 11.5 15 4'), body(E(15, 4.5, 1.5, 1))`, 'gaming', 'Catapult'],
  'race-car': [`body('M3 14v-2l3-1 2-3h4l1 3h2.5l.5 3Z'), line(C(6, 15.5, 1.5)), line(C(13, 15.5, 1.5)), line('M14 8.5h2.5')`, 'transport', 'Race Car'],
  'snow-shovel': [`line('M9.5 3.5v9M7.5 3.5h4'), body('M5 12.5h9l-1 5.5H6Z')`, 'weather', 'Snow Shovel'],
  'water-slide': [`line('M4 18V5h3v13M4 8h3M4 12h3M7 5c4 0 4 6 9 6v3c-5 0-6-6-9-6')`, 'travel', 'Water Slide'],
};
const cat = {}; const label = {};
for (const [k, [geo, c, l]] of Object.entries(add)) { if (B[k]) continue; B[k] = geo; cat[k] = c; label[k] = l; }
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, cat);
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, label);
export default {};
