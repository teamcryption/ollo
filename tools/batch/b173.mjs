import { B } from './mods.mjs';
Object.assign(B, {
  'satellite-dish': `body('M4.5 5.5l9 9a6.4 6.4 0 0 1-9-9Z'), line('M9 10l3-3'), line(D(12.8, 6.2)), line('M7.2 15.3 5.5 18.5h5')`,
  antenna: `line('M6.5 4.5a4.2 4.2 0 0 0 0 6M12.5 4.5a4.2 4.2 0 0 1 0 6'), body(C(9.5, 7.5, 1.5)), line('M9.5 9.2v9.3M6.5 18.5h6')`,
  vase: `body('M7 3.5h5V5c0 1-.5 1.8-1 2.5 2.5 1 4 3 4 6A4.5 4.5 0 0 1 10.5 18h-2A4.5 4.5 0 0 1 4 13.5c0-3 1.5-5 4-6-.5-.7-1-1.5-1-2.5Z'), line('M4.6 12h9.8')`,
  window: `body(R(4, 3.5, 11, 13, 1.5)), line('M9.5 3.7v12.6M4.2 10h10.6'), line('M3 18.5h13')`,
  stairs: `body(poly([[3.5, 18], [3.5, 14], [7, 14], [7, 10.5], [10.5, 10.5], [10.5, 7], [14, 7], [14, 3.5], [16, 3.5], [16, 18]], 0.5, true))`,
  shower: `line('M4.5 18V6a2.5 2.5 0 0 1 5 0v.8'), body('M6.5 9.5a3 3 0 0 1 6 0Z'), line(D(7.5, 12) + D(9.5, 12.8) + D(11.5, 12) + D(8.5, 15) + D(10.5, 15.5))`,
  pot: `line('M8.5 5.3h2'), line('M3 7.3h13'), body('M3.5 9h12v6a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3Z'), line('M3.3 11H2.5')`,
  'rolling-pin': `body(rotateD(R(5.5, 8.5, 8, 4, 1.5), -40, 9.5, 10.5)), line(rotateD('M2.8 10.5h2.4M13.8 10.5h2.4', -40, 9.5, 10.5))`,
  blender: `body(poly([[5, 3.5], [14, 3.5], [12.5, 11.5], [6.5, 11.5]], 0.6, true)), line('M7.5 6.5h3'), body(R(5.5, 12.8, 8, 5.2, 1.5)), line(D(9.5, 15.4))`,
  ear: `line('M5 7.5a4.5 4.5 0 0 1 9 0c0 2.5-2 3.5-2.5 5.5S10.5 18 8 18'), line('M7.5 8a2 2 0 0 1 4 0c0 1.2-1.3 1.6-1.6 2.7')`,
  turtle: `body(C(9.5, 3.9, 1.3)), line('M5.6 7.6 3.8 6.3M13.4 7.6l1.8-1.3M5.6 13.5l-1.8 1.3M13.4 13.5l1.8 1.3'), body(E(9.5, 10.5, 4.5, 5)), line('M7.6 8.6h3.8l1 1.9-1 1.9H7.6l-1-1.9Z')`,
  fox: `body(poly([[3.5, 4], [7.5, 7], [11.5, 7], [15.5, 4], [14.5, 10], [9.5, 16], [4.5, 10]], 0.8, true)), line(D(7.5, 10) + D(11.5, 10))`,
  hotdog: `body(R(3, 7, 13, 3.5, 1.75)), line('M5 8.75l1.5-.8 1.5.8 1.5-.8 1.5.8 1.5-.8 1.5.8'), body('M3 12h13a3.5 3.5 0 0 1-3.5 3.5h-6A3.5 3.5 0 0 1 3 12Z')`,
  honey: `body(R(5, 3.8, 9, 2.2, 0.8)), body(R(4, 7.2, 11, 11, 2.5)), line('M6.5 11.5h6')`,
  ketchup: `body(R(8.3, 3, 2.4, 3, 0.6)), body('M7.5 7h4L13 9.5V17a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9.5Z'), line('M5.5 12h7')`,
  champagne: `body('M7.5 3.5h4l-.3 5a1.7 1.7 0 0 1-3.4 0Z'), line(D(9, 6)), line('M9.5 10.4v7M7 17.8h5')`,
  teacup: `line('M8.5 3.3c-.6.8.6 1.5 0 2.4'), body('M3.5 7.5h10V11a5 5 0 0 1-10 0Z'), line('M13.5 8.5h.8a1.8 1.8 0 0 1 0 3.6h-1'), line('M3 17.5h11')`,
  firework: `line('M9.5 3.5v3M9.5 12.5v3M3.5 9.5h3M12.5 9.5h3M5.3 5.3l2.1 2.1M11.6 11.6l2.1 2.1M13.7 5.3l-2.1 2.1M5.3 13.7l2.1-2.1'), line(D(9.5, 9.5))`,
  stroller: `body('M4 9.5A5.5 5.5 0 0 1 9.5 4v5.5Z'), body('M3.5 10.5h12a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4Z'), line('M15.5 10.5l1-4'), line(C(6, 17, 1.5) + C(13, 17, 1.5))`,
  'magic-wand': `line('M4 17.5 12.5 9'), body(rotateD(R(11.6, 6.3, 2.6, 4.8, 0.8), 45, 12.9, 8.7)), line('M5.5 5v2.5M4.25 6.25h2.5M15.5 3.5v1.6M14.7 4.3h1.6')`,
  tram: `line('M7 3.5h5M9.5 3.7V6'), body(R(4.5, 6, 10, 10.5, 2)), line('M6.5 9h6'), line(D(7, 13.5) + D(12, 13.5)), line('M6.5 16.7 5.5 18.5M12.5 16.7l1 1.8')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, {
  'satellite-dish': 'communication', antenna: 'communication', vase: 'home', window: 'home', stairs: 'buildings', shower: 'home', pot: 'food',
  'rolling-pin': 'food', blender: 'home', ear: 'health',
  turtle: 'animals', fox: 'animals', hotdog: 'food', honey: 'food', ketchup: 'food', champagne: 'celebration',
  teacup: 'food', firework: 'celebration', stroller: 'people', 'magic-wand': 'design', tram: 'transport',
});
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { pot: 'Cooking Pot', hotdog: 'Hot Dog', honey: 'Honey', ketchup: 'Ketchup', window: 'Window', ear: 'Hearing' });
export default {};
