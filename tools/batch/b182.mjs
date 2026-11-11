import { B } from './mods.mjs';
Object.assign(B, {
  hedgehog: `body('M3 15c0-4.5 3-8 7-8 2.5 0 4.5 1.5 5.5 3.5l1.5 1v1.5l-2 .5c-.5 1-1.5 1.5-2.5 1.5Z'), line('M6 8.5 5 6.5M8.5 7.3 8 5M11 7.1l.5-2.1'), line(D(13.8, 10.8))`,
  koala: `body(C(4.8, 7, 2.3)), body(C(14.2, 7, 2.3)), body(E(9.5, 11, 5, 5.5)), body(E(9.5, 12.5, 1.5, 2)), line(D(7.3, 9.5) + D(11.7, 9.5))`,
  elephant: `body('M4 15V9.5a5.5 5.5 0 0 1 11 0V14c0 2-1 3.5-2.5 3.5S10 16.5 10 15v-1.5H8V15Z'), line(D(7, 9)), line('M10.5 6.5a3 3 0 0 1 3 3')`,
  giraffe: `body('M10 3.5h3l.5 2.5-2 1V18H7v-6.5c0-1.5.8-2.3 2-2.5l.5-1.5Z'), line(D(8.5, 14) + D(10, 12)), line('M10.5 3.5V2.6M12.5 3.5V2.6')`,
  pig: `body(E(9.5, 11, 6, 5)), body(E(9.5, 12.3, 2.2, 1.6)), line(D(8.6, 12.3) + D(10.4, 12.3) + D(7, 9) + D(12, 9)), line('M5 6.8 4.5 4.5 7 5.8M14 6.8l.5-2.3L12 5.8')`,
  muffin: `body('M4.5 9.5c-1-3 1.5-5.5 5-5.5s6 2.5 5 5.5Z'), body(poly([[4.5, 10.8], [14.5, 10.8], [13.3, 18], [5.7, 18]], 0.6, true)), line('M8 11.2l.4 6.4M11 11.2l-.4 6.4')`,
  'sushi-roll': `body(E(9.5, 6.5, 6, 2.6)), line(E(9.5, 6.5, 2.8, 1.1)), body('M3.5 7.2v7c0 1.5 2.7 2.7 6 2.7s6-1.2 6-2.7v-7')`,
  'ice-cube': `body(poly([[9.5, 3.5], [15.5, 6.5], [15.5, 14], [9.5, 17.5], [3.5, 14], [3.5, 6.5]], 1.2, true)), line('M6 9.5l2-1')`,
  'soap-bar': `body(R(3.5, 8.5, 12, 7, 3)), line('M6.5 11.5h4'), line(C(13.5, 5, 1.3) + C(9.5, 4.5, 0.8))`,
  'laundry-basket': `body(poly([[4, 8], [15, 8], [13.8, 18], [5.2, 18]], 0.8, true)), line('M3.5 8h12'), line('M7.5 11v4M11.5 11v4'), line('M6.5 7.8c.5-2.5 1.5-3.8 3-3.8s2.5 1.3 3 3.8')`,
  'paint-bucket': `line('M4.5 7.5a5 5 0 0 1 10 0'), body(poly([[3.5, 7.8], [15.5, 7.8], [14.5, 18], [4.5, 18]], 0.8, true)), line('M9 7.9c0 2.5 1.5 3 1.5 4.5')`,
  'nail': `body(R(5.5, 3.5, 8, 2.5, 1)), body('M8 6.5h3v8.5l-1.5 3.5L8 15Z')`,
  sickle: `line('M5 18l3-3'), body('M8 15C4.5 11 5 5 10 3.5c3.8-1.2 6.5 1.3 6.5 4.5-1.3-1.8-3.2-2.5-5.2-2-3.5.8-4.8 4.4-2.6 8.2Z')`,
  'roller-skate': `body('M5 3.5h4v6l4.5 1.5a2 2 0 0 1 1.5 2V15H5Z'), line('M5.2 6.5h3.6'), line(C(6.8, 17, 1.3) + C(12.8, 17, 1.3))`,
  donut: `body(C(9.5, 10.5, 6.5)), line(C(9.5, 10.5, 2.2)), line('M6 7.3l.8.5M12.5 6.5l-.6.7M13.6 12.8l-.8-.3')`,
  sandwich: `body(poly([[3, 9], [9.5, 4], [16, 9]], 0.8, true)), line('M3 11.5c1.3-.8 2.2.8 3.3 0s2.2.8 3.2 0 2.2.8 3.2 0 2.2.8 3.3 0'), body(R(3, 13.5, 13, 3.5, 1.2))`,
  'steering-wheel': `body(C(9.5, 10.5, 6.5)), line(C(9.5, 10.5, 1.7)), line('M3.2 9.5h4.6M11.2 9.5h4.6M9.5 12.2v4.6')`,
  'bubble-tea': `line('M10.5 6.5 12.5 2.5'), line('M4.5 6.5h10'), body(poly([[5.2, 7.6], [13.8, 7.6], [12.8, 18], [6.2, 18]], 0.8, true)), line(D(7.8, 15) + D(9.8, 15.8) + D(11.2, 14.5))`,
  yoyo: `line('M9.5 3v4'), body(C(9.5, 12, 5.5)), line(C(9.5, 12, 1.6))`,
  'garlic': `line('M9.5 3.5V6'), body('M9.5 6c3 1.5 6 3.8 6 7.3 0 2.6-2.5 4.2-6 4.2s-6-1.6-6-4.2C3.5 9.8 6.5 7.5 9.5 6Z'), line('M7.6 9.5c-.8 2.4-.8 5 0 7.6M11.4 9.5c.8 2.4.8 5 0 7.6')`,
  'hot-sauce': `body(R(8, 3, 3, 3, 0.6)), body('M7.5 6.8h4c.8 1 1.5 2.3 1.5 4V17a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-6.2c0-1.7.7-3 1.5-4Z'), line('M8.5 12.5c.5-1.3 1.5-1.8 2-1.3')`,
  ramen: `line('M11 7.8 15.5 3M12.8 8 16.3 4.3'), body('M3 9h13a6.5 6.5 0 0 1-13 0Z'), line('M5.5 11.3c1.3-.8 2.5.8 4 0s2.7.8 4 0')`,
  glove: `body('M5.5 18v-7.5L4 8.5a1 1 0 0 1 1.6-1.2L7 9V5a1 1 0 0 1 2 0V4a1 1 0 0 1 2 0v1a1 1 0 0 1 2 0v1.5a1 1 0 0 1 2 0V13c0 2.5-1.3 4-3 5Z'), line('M5.8 15.5h7.4')`,
  wheelchair: `line(C(8.5, 4, 1.4)), line('M8.5 6.5V12h4.5l1.5 4.5h1.5'), line('M11.5 9H8.6'), line('M5.5 10.5a4.5 4.5 0 1 0 7 4')`,
  crutch: `line('M7 3.5h5M7.5 3.7l2 8M11.5 3.7l-2 8M9.5 11.7V18M8 7.5h3')`,
  violin: `line('M9.5 3v5'), body('M9.5 7.5c1.8 0 3 .8 3 2.2 0 .8-.6 1.3-.6 1.8s1.1 1.2 1.1 2.7c0 2.2-1.6 3.3-3.5 3.3S6 16.4 6 14.2c0-1.5 1.1-2.2 1.1-2.7s-.6-1-.6-1.8c0-1.4 1.2-2.2 3-2.2Z'), line('M9.5 10.5v5')`,
  hammock: `line('M3 5v13M16 5v13'), body('M3.3 8c2 4 4 5.5 6.2 5.5s4.2-1.5 6.2-5.5c-2 1.5-4 2.2-6.2 2.2S5.3 9.5 3.3 8Z')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, {
  hedgehog: 'animals', koala: 'animals', elephant: 'animals', giraffe: 'animals', pig: 'animals', violin: 'media', hammock: 'travel', garlic: 'food', 'hot-sauce': 'food', ramen: 'food', glove: 'fashion', wheelchair: 'accessibility', crutch: 'health', 'bubble-tea': 'food', yoyo: 'gaming', donut: 'food', sandwich: 'food', 'steering-wheel': 'transport', muffin: 'food', 'sushi-roll': 'food', 'ice-cube': 'food', 'soap-bar': 'home', 'laundry-basket': 'home', 'paint-bucket': 'design', nail: 'tools', sickle: 'tools', 'roller-skate': 'sports',
});
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { 'sushi-roll': 'Sushi', nail: 'Nail', yoyo: 'Yo-yo' });
export default {};
