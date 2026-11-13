import { B } from './mods.mjs';
const add = {
  squid: [`body('M9.5 3.5c2.5 2 3.5 4.5 3.5 7.5H6c0-3 1-5.5 3.5-7.5Z'), line('M7 11v5M9.5 11v6.5M12 11v5M8.2 11l-.5 6M10.8 11l.5 6')`, 'animals', 'Squid'],
  flamingo: [`line('M10 18v-5.5M10 12.5c-3.5 0-4.5-2.5-3.5-4.5s4-1.5 4-4a1.8 1.8 0 0 0-3.3-1'), body(E(11.5, 11, 3, 2))`, 'animals', 'Flamingo'],
  asparagus: [`line('M7 18 9 6M10 18V5M13 18 11 6'), line('M9 6 8.5 4M10 5V3M11 6l.5-2')`, 'food', 'Asparagus'],
  pomegranate: [`body(C(9.5, 12, 5.5)), line('M8 6.5 7.5 4.5l1.3.8.7-1.3.7 1.3 1.3-.8-.5 2'), line(D(9.5, 12))`, 'food', 'Pomegranate'],
  artichoke: [`body('M9.5 3.5c2.5 2 5 5 5 8.5 0 3-2.5 5-5 5s-5-2-5-5c0-3.5 2.5-6.5 5-8.5Z'), line('M6 10.5c2 1 5 1 7 0M5.5 13.5c2.5 1 5.5 1 8 0'), line('M9.5 17v1.5')`, 'food', 'Artichoke'],
  croissant: [`body('M3 13c1-4 3.5-6.5 6.5-6.5S15 9 16 13c-2 1.5-4 2-6.5 2S5 14.5 3 13Z')`, 'food', 'Croissant'],
  spoon: [`body(E(9.5, 7, 3, 4)), line('M9.5 11v7')`, 'food', 'Spoon'],
  wafer: [`body(R(3, 8, 13, 6, 1)), line('M5.5 8v6M8 8v6M10.5 8v6M13 8v6')`, 'food', 'Wafer'],
  'cheese-wheel': [`body(E(9.5, 9, 6.5, 3)), line('M3 9v4c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3V9'), line(D(9.5, 12.8))`, 'food', 'Cheese Wheel'],
  hornet: [`body(E(9.5, 12, 3.5, 5)), line('M6.2 11h6.6M6.2 14h6.6'), line('M8 7 5 4M11 7l3-3')`, 'animals', 'Hornet'],
  moth: [`body('M9.5 7 3.5 5c-.5 3 1 6 4 7l-3 4c3 1 5-1 5-4 0 3 2 5 5 4l-3-4c3-1 4.5-4 4-7Z'), line('M9.5 7v10')`, 'animals', 'Moth'],
  beetle: [`body(E(9.5, 11.5, 4.5, 6)), line('M9.5 5.5v12M5 9 3 8M5 12H3M5 15l-2 1M14 9l2-1M14 12h2M14 15l2 1')`, 'animals', 'Beetle'],
  goldfish: [`body('M4 11c1.5-2.5 4-4 6.5-4 2 0 3.5 1.5 4 4-.5 2.5-2 4-4 4-2.5 0-5-1.5-6.5-4Z'), body('M14.5 11 17 8v6Z'), line(D(7, 10.3))`, 'animals', 'Goldfish'],
  ostrich: [`line('M8 18v-5M11 18v-5M12 9V4.5a1.5 1.5 0 0 1 3 0'), body(E(9.5, 10.5, 4.5, 3))`, 'animals', 'Ostrich'],
};
const cat = {}; const label = {};
for (const [k, [geo, c, l]] of Object.entries(add)) { if (B[k]) continue; B[k] = geo; cat[k] = c; label[k] = l; }
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, cat);
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, label);
export default {};
