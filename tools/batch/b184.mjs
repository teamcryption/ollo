import { B } from './mods.mjs';
Object.assign(B, {
  camel: `body('M3 12c0-2 1-3.5 2.5-3.5S7.5 6 9 6s2 2.5 3 2.5 1.5-2 3-2c1 0 1.5 1 1.5 2v3.5H15V18h-1.5v-4.5h-7V18H5v-4.5Z')`,
  deer: `line('M6.5 7 5 4.5M5 4.5 3.5 5M5 4.5l.5-1.5M12.5 7 14 4.5M14 4.5l1.5.5M14 4.5l-.5-1.5'), body('M6 7.5h7L12 14a2.5 2.5 0 0 1-5 0Z'), line(D(8.2, 10) + D(10.8, 10))`,
  'ice-cream-cone': `body('M6 9h7l-3.5 9Z'), body('M5.5 8.5a4 4 0 0 1 8 0Z'), line('M7.5 10.3l2.5 3')`,
  waffle: `body(R(3.5, 4.5, 12, 12, 2.5)), line('M7.5 4.7v11.6M11.5 4.7v11.6M3.7 8.5h11.6M3.7 12.5h11.6')`,
  'wine-bottle': `body(R(8, 3, 3, 4, 0.6)), body('M8 7.3h3c1.5 1.2 2.2 2.5 2.2 4.2V17a1 1 0 0 1-1 1H6.8a1 1 0 0 1-1-1v-5.5c0-1.7.7-3 2.2-4.2Z'), line('M6 12.5h7')`,
  spoon: `body(rotateD(E(9.5, 6.5, 2.5, 3.5), 35, 9.5, 10.5)), line(rotateD('M9.5 10v8', 35, 9.5, 10.5))`,
  'fork': `line('M8 3.5V7a1.5 1.5 0 0 0 3 0V3.5M9.5 3.5V7M9.5 8.5V18')`,
  chopsticks: `line('M5 18 12 3.5M8.5 18l7.5-14')`,
  'umbrella-beach': `body('M3 9.5a6.5 6.5 0 0 1 13 0Z'), line('M9.5 9.7V17'), line('M4 18h11')`,
  'pool-ladder': `line('M6 18V6a2 2 0 0 1 4 0M12 18V6a2 2 0 0 1 4 0M6.2 11h5.6M6.2 15h5.6')`,
  'life-jacket': `body('M6 3.5h2l1.5 3 1.5-3h2l2.5 3V17a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1V6.5Z'), line('M9.5 8.5V18M5.5 12.5h2.5M11 12.5h2.5')`,
  'rv': `body('M3 6.5A1.5 1.5 0 0 1 4.5 5H13l3 4.5V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z'), line('M5.5 8h3.5v3H5.5Z'), line(C(6, 16.3, 1.5) + C(12.5, 16.3, 1.5))`,
  'ski': `line('M4 18 14.5 3.5M7.5 18 18 3.5'), line('M4 14.5l3 2M7.5 14.5l3 2')`,
  'curling-stone': `line('M7 6.5V4.5h5'), body('M3.5 12a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3Z'), line('M3.7 13h11.6')`,
  'hockey-stick': `line('M12.5 3.5 7 15'), body('M6.8 14.2 11 15l-.3 2.5H5a1.5 1.5 0 0 1 0-3Z'), body(R(12, 15.5, 4, 2, 1))`,
  'jersey': `body(poly([[6, 3.5], [8, 3.5], [9.5, 5], [11, 3.5], [13, 3.5], [16, 6], [14.5, 8.5], [13.5, 8], [13.5, 18], [5.5, 18], [5.5, 8], [4.5, 8.5], [3, 6]], 0.6, true)), line('M8.5 10.5v4.5M10.5 10.5v4.5')`,
  'graphics-card': `body(R(3, 6, 13, 8, 1.2)), line(C(7.5, 10, 2.2)), line('M11.5 8.5h2.5M11.5 11.5h2.5'), line('M5 14.2v2.3h5v-2.3')`,
  'touchscreen': `body(R(5, 3, 9, 15.5, 2)), line('M8 13.5V9.5a1 1 0 0 1 2 0V12l2 .5a1 1 0 0 1 .7 1.1l-.4 2.4H9.3Z')`,
  'barcode-scanner': `body('M3 6.5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 2 2V9a2 2 0 0 1-2 2H9.5l-1 7h-3l1-7H5a2 2 0 0 1-2-2Z'), line('M14.7 6.3 17 5M14.7 9.2 17 10.5')`,
  'pos-terminal': `body(R(5, 3, 9, 15.5, 1.8)), line(R(6.8, 5, 5.4, 3.5, 0.6)), line(D(7.5, 11.5) + D(9.5, 11.5) + D(11.5, 11.5) + D(7.5, 14) + D(9.5, 14) + D(11.5, 14))`,
  'hanging-sign': `line('M4 3.5h11M6.5 3.7 5.5 7.5M12.5 3.7l1 3.8'), body(R(3.5, 7.5, 12, 7, 1.5)), line('M6.5 11h6')`,
  'pipe': `line('M3 6.5h6.5a3.5 3.5 0 0 1 3.5 3.5v8.5M3 10h6.5V18.5'), body(R(2.5, 5, 2, 6.5, 0.6)), body(R(8, 16, 6.5, 2.5, 0.6))`,
  'valve': `line('M9.5 3.5v4M6.5 3.5h6'), body('M3 9h3l3.5 2.5L13 9h3v6h-3l-3.5-2.5L6 15H3Z')`,
  'conveyor': `body(R(3, 11, 13, 4, 2)), line(D(5, 13) + D(9.5, 13) + D(14, 13)), body(R(6, 5, 7, 5, 0.8))`,
  'forklift': `line('M14 4v13.5M14 17.5h2.5'), body('M3.5 10.5V7a1.5 1.5 0 0 1 1.5-1.5h3l2.5 5V15h-7Z'), line(C(5.5, 16.5, 1.5) + C(10.5, 16.5, 1.5))`,
  'pallet': `body(R(4, 4, 11, 8, 1)), line('M3 13.5h13M3 17h13M4.5 13.7v3.1M9.5 13.7v3.1M14.5 13.7v3.1')`,
  'tollbooth': `body(R(3.5, 6, 5.5, 12, 1)), line('M2.5 5.5l4-2 4 2'), line('M5 9.5h2.5'), line('M9.2 12.5H16.5'), body(R(15, 11.3, 1.8, 2.4, 0.6))`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, { 'camel': 'animals', 'deer': 'animals', 'ice-cream-cone': 'food', 'waffle': 'food', 'wine-bottle': 'food', 'spoon': 'food', 'fork': 'food', 'chopsticks': 'food', 'umbrella-beach': 'travel', 'pool-ladder': 'sports', 'life-jacket': 'travel', 'rv': 'transport', 'ski': 'sports', 'curling-stone': 'sports', 'hockey-stick': 'sports', 'jersey': 'sports', 'graphics-card': 'devices', 'touchscreen': 'devices', 'barcode-scanner': 'commerce', 'pos-terminal': 'commerce', 'hanging-sign': 'commerce', 'pipe': 'tools', 'valve': 'tools', 'conveyor': 'logistics', 'forklift': 'logistics', 'pallet': 'logistics', 'tollbooth': 'transport' });
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { 'rv': 'Camper Van', 'umbrella-beach': 'Beach Umbrella', 'pos-terminal': 'Card Terminal', 'jersey': 'Sports Jersey', 'ski': 'Skiing' });
export default {};
