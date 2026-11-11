import { B } from './mods.mjs';
Object.assign(B, {
  'mug': `body('M4 6h9v8.5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z'), line('M13.2 8h1.3a2 2 0 0 1 0 4h-1.3'), line('M6.5 9.5v4')`,
  'french-press': `line('M9.5 3v4M7.5 3h4'), body(R(5, 6.5, 8, 11.5, 1.5)), line('M5.2 10h7.6'), line('M13.2 8.5h1.3v6h-1.3')`,
  'wine-glass': `body('M5.5 3.5h8c0 4-1.5 6.5-4 6.5s-4-2.5-4-6.5Z'), line('M9.5 10.2V17M6.5 17.5h6')`,
  'oven-mitt': `body('M5.5 17.5V8a4 4 0 0 1 8 0v1.5l1.5-1.5a1.2 1.2 0 0 1 1.7 1.7L13.5 13v4.5Z'), line('M5.7 15h7.6')`,
  'apron': `line('M7 3.5a2.5 2.5 0 0 0 5 0'), body('M6 6h7v3l2 1v8H4v-8l2-1Z'), line('M7.5 13h4')`,
  'tongs': `line('M8 3.5 5 16a1.5 1.5 0 0 0 3 .3L9.5 6M11 3.5 14 16a1.5 1.5 0 0 1-3 .3L9.5 6'), line('M7.5 3.5h4')`,
  'colander': `line('M2.5 9h14'), body('M3.5 9h12a6 6 0 0 1-12 0Z'), line(D(7, 12) + D(9.5, 13) + D(12, 12))`,
  'mixing-bowl': `body('M3 8h13a6.5 6.5 0 0 1-13 0Z'), line('M12 7.8 15 3.5'), line('M7 18h5')`,
  'egg-cracked': `body('M9.5 3.5c2.8 0 5 4.2 5 8a5 5 0 0 1-10 0c0-3.8 2.2-8 5-8Z'), line('M6 10l1.5 1.2L9 9.8l1.5 1.4 1.5-1.2')`,
  'tomato': `line('M7 5l2.5 1.5L12 5M9.5 6.5V3.5'), body('M9.5 6.8c3.5 0 6 2.3 6 5.4 0 3.4-2.7 5.8-6 5.8s-6-2.4-6-5.8c0-3.1 2.5-5.4 6-5.4Z')`,
  'potato': `body(rotateD(E(9.5, 10.5, 6.5, 4.5), -25, 9.5, 10.5)), line(D(7, 9) + D(11.5, 8.5) + D(10, 12.5))`,
  'lemon-slice': `body('M3 12a6.5 6.5 0 0 1 13 0Z'), line('M5.5 11.5a4 4 0 0 1 8 0M9.5 7.5v4M6.7 8.7l2.5 2.8M12.3 8.7l-2.5 2.8')`,
  'spaghetti': `line('M5 6.5c2-2 3-2 4.5 0s2.5 2 4.5 0M5 9c2-2 3-2 4.5 0s2.5 2 4.5 0'), body('M3 10h13a6.5 6.5 0 0 1-13 0Z'), line('M14.5 4 16.5 2.5')`,
  'jam-jar': `body(R(5, 3.5, 9, 2.5, 0.8)), body(R(4.5, 7, 10, 11, 2.5)), line('M7 11.5h5v3H7Z')`,
  'milkshake': `line('M10.5 5.5 12 2.5'), body('M5 6a4.5 2 0 0 1 9 0Z'), body(poly([[5.2, 7.2], [13.8, 7.2], [12.5, 17.5], [6.5, 17.5]], 0.6, true)), line('M5.6 10h7.8')`,
  'juice-box': `body(R(5, 5, 9, 13, 1)), line('M11 5 12 2.5h2'), line('M5.2 9h8.6'), line(C(9.5, 13, 1.8))`,
  'chocolate': `body(R(4.5, 3.5, 10, 14.5, 1)), line('M4.7 8.5h9.6M4.7 13.3h9.6M9.5 3.7v14.1')`,
  'food-truck': `body('M2.5 6.5h10v8.5h-10Z'), body('M12.7 9h2.5l1.8 2.5V15h-4.3Z'), line('M4.5 9h6M4.5 11.5h2'), line(C(5.5, 16.3, 1.3) + C(13.5, 16.3, 1.3))`,
  'serving-cloche': `line('M9.5 3.5v1.5'), line(C(9.5, 3.5, 0.01)), body('M3.5 13a6 6 0 0 1 12 0Z'), line('M2.5 15h14')`,
  'brick-wall': `body(R(3, 4, 13, 13, 1)), line('M3.2 8.3h12.6M3.2 12.7h12.6M7.5 4.2v4M11.5 8.5v4M7.5 12.9v4')`,
  'chisel': `body(rotateD(R(7.8, 3, 3.4, 8, 1.2), 40, 9.5, 10.5)), body(rotateD('M8.3 11.3h2.4v5l-1.2 1.5-1.2-1.5Z', 40, 9.5, 10.5))`,
  'sawhorse': `body(R(3, 6, 13, 2.5, 0.8)), line('M5 8.7 3.5 17.5M7 8.7l1.5 8.8M12 8.7l-1.5 8.8M14 8.7l1.5 8.8')`,
  'workbench': `body(R(2.5, 7, 14, 2.5, 0.8)), line('M4 9.7V18M15 9.7V18M4 14h11'), line('M6 7V4.5h3V7')`,
  'paint-can': `line('M5 7a4.5 2 0 0 1 9 0'), body('M4.5 7h10v9.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5Z'), line('M4.7 10.5h9.6')`,
  'ladder-step': `line('M5 18 8 3.5M14 18 11 3.5'), line('M7 9h5M6 14h7')`,
  'blueprint': `body(R(3, 4, 13, 12, 1.2)), line('M5.5 6.5v7h4v-4h4'), line('M13.5 13.5h-2'), line('M3.2 7h1.5')`,
  'firewood': `body(rotateD(R(3, 12.5, 13, 4, 2), -8, 9.5, 14.5)), line(rotateD(C(5, 14.5, 1), -8, 9.5, 14.5)), body(rotateD(R(3, 6, 13, 4, 2), 8, 9.5, 8)), line(rotateD(C(14, 8, 1), 8, 9.5, 8))`,
  'toolbox-open': `line('M7 7.5V5.5h5v2'), body(R(3, 7.5, 13, 9.5, 1.5)), line('M3.2 11h12.6M8 11v2h3v-2')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, { mug: 'food', 'french-press': 'food', 'wine-glass': 'food', 'oven-mitt': 'home', apron: 'food', tongs: 'food', colander: 'food', 'mixing-bowl': 'food', 'egg-cracked': 'food', tomato: 'food', potato: 'food', 'lemon-slice': 'food', spaghetti: 'food', 'jam-jar': 'food', milkshake: 'food', 'juice-box': 'food', chocolate: 'food', 'food-truck': 'transport', 'serving-cloche': 'food', 'brick-wall': 'buildings', chisel: 'tools', sawhorse: 'tools', workbench: 'tools', 'paint-can': 'design', 'ladder-step': 'tools', blueprint: 'buildings', firewood: 'nature', 'toolbox-open': 'tools' });
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { 'egg-cracked': 'Cracked Egg', 'serving-cloche': 'Serving Dish', 'lemon-slice': 'Citrus' });
export default {};
