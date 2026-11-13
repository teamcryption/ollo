import { B } from './mods.mjs';
const add = {
  parrot: [`body('M8 4.5c3 0 5 2.5 5 5.5v8H8c-2 0-3-1.5-3-3.5v-5c0-3 1-5 3-5Z'), body('M13 7.5l2.5 1.5-2.5 1.5Z'), line(D(10.5, 7.5))`, 'animals', 'Parrot'],
  stingray: [`body('M9.5 4 16 10l-6.5 3L3 10Z'), line('M9.5 13v5.5'), line(D(8, 8.5) + D(11, 8.5))`, 'animals', 'Stingray'],
  clam: [`body('M3 12a6.5 6.5 0 0 1 13 0Z'), line('M9.5 5.5V12M6.5 6.5l1.5 5.5M12.5 6.5 11 12'), line('M3 12.5c2 2.5 4.5 3.5 6.5 3.5s4.5-1 6.5-3.5')`, 'animals', 'Clam'],
  'oak-leaf': [`body('M9.5 3.5c1 1.5 2.5 1 3 2.5s-1 2 0 3 2.5.5 2.5 2-2 1.5-2 3-1 2.5-3.5 3c-2.5-.5-3.5-1.5-3.5-3S4 12.5 4 11s1.5-1 2.5-2-1-1.5 0-3 2-1 3-2.5Z'), line('M9.5 6v12.5')`, 'nature', 'Oak Leaf'],
  cattail: [`line('M7 18V10M12 18V8'), body(R(5.8, 5, 2.4, 5, 1.2)), body(R(10.8, 3, 2.4, 5, 1.2)), line('M3 18h13')`, 'nature', 'Cattail'],
  'gelato-cup': [`body('M5 11h9l-1 7H6Z'), body('M5 11a4.5 4 0 0 1 9 0Z'), line('M12 7.5 14 4')`, 'food', 'Gelato Cup'],
};
const cat = {}; const label = {};
for (const [k, [geo, c, l]] of Object.entries(add)) { if (B[k]) continue; B[k] = geo; cat[k] = c; label[k] = l; }
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, cat);
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, label);
export default {};
