import { B } from './mods.mjs';
Object.assign(B, {
  camera: `body(R(3, 6.5, 13, 10, 2)), line('M7 6.5 8 4.5h3l1 2'), line(C(9.5, 11.5, 2.5))`,
  rocket: `body('M9.5 3c2.2 1.6 3.3 4 3.3 7v4.5H6.2V10c0-3 1.1-5.4 3.3-7Z'), line('M6.2 11.5 4 14v3l2.2-1.5M12.8 11.5 15 14v3l-2.2-1.5'), line(C(9.5, 8.5, 1.3))`,
  anchor: `line(C(9.5, 4.8, 1.4)), line('M9.5 6.2V18M6.5 9h6'), line('M4 13.5c0 2.8 2.5 4.5 5.5 4.5s5.5-1.7 5.5-4.5')`,
  lamp: `body('M6 3.5h7l2 6H4Z'), line('M9.5 9.7V17M6 17.5h7')`,
  calculator: `body(R(4, 3.5, 11, 15, 2)), line('M6.5 6.5h6'), line(D(7, 10) + D(9.5, 10) + D(12, 10) + D(7, 13) + D(9.5, 13) + D(7, 15.5))`,
  compass: `line(C(9.5, 10.5, 6.5)), body('M12 8l-1.3 3.7L7 13l1.3-3.7Z')`,
  hourglass: `line('M5.5 3.5h8M5.5 17.5h8'), body('M6.5 3.7h6v2.3l-3 4.5 3 4.5v2.3h-6V15l3-4.5-3-4.5Z')`,
  magnet: `body('M4.5 4h3.3v6.5a1.7 1.7 0 0 0 3.4 0V4h3.3v6.5a5 5 0 0 1-10 0Z'), line('M4.7 7.3h2.9M11.4 7.3h2.9')`,
  puzzle: `body('M4 7h3a2.5 2.5 0 1 1 5 0h3v3.3a2.5 2.5 0 1 1 0 4.4V18H4Z')`,
  wine: `body('M8 3.5h3V7c1.5.8 2 2 2 3.5v6.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-6.5c0-1.5.5-2.7 2-3.5Z'), line('M6.2 12h6.6')`,
  fish: `body('M5 10.5c1.8-2.8 4.2-4.3 7-4.3 1.8 0 3.2 1.4 4 4.3-.8 2.9-2.2 4.3-4 4.3-2.8 0-5.2-1.5-7-4.3Z'), line('M5 10.5 3 8M5 10.5 3 13'), line(D(12.8, 9.6))`,
  sun: `body(C(9.5, 10.5, 3.2)), line('M9.5 3.5V5M9.5 16v1.5M2.5 10.5H4M15 10.5h1.5M4.6 5.6l1 1M13.4 14.4l1 1M14.4 5.6l-1 1M5.6 14.4l-1 1')`,
  moon: `body('M14 13.8A6.5 6.5 0 0 1 8.2 3.5a7 7 0 1 0 5.8 10.3Z')`,
  globe: `line(C(9.5, 10.5, 6.5)), line('M3 10.5h13M9.5 4c-2.4 3.8-2.4 9.2 0 13M9.5 4c2.4 3.8 2.4 9.2 0 13')`,
  music: `line('M8 15.5V5.5l7-2v9.5'), body(C(6, 15.5, 2)), body(C(13, 13, 2))`,
  server: `body(R(3.5, 4, 12, 5.5, 1.5)), body(R(3.5, 11.5, 12, 5.5, 1.5)), line(D(6.5, 6.8) + D(6.5, 14.3))`,
  brush: `line('M15.5 3.5 10 9'), body('M8.8 9.4l1.8 1.8c0 2.6-2 4.6-5.6 4.6.6-1 .4-2.3 1.1-3.8.6-1.3 1.6-2.4 2.7-2.6Z')`,
  pill: `body(R(3, 7.5, 13, 6, 3)), line('M9.5 7.7v5.6')`,
  thermometer: `body('M8 4.5a1.5 1.5 0 0 1 3 0v7.3a3 3 0 1 1-3 0Z'), line('M9.5 8v5.5')`,
  tree: `body('M9.5 3c3 0 5 2.3 5 5 0 2.5-2 4.5-5 4.5s-5-2-5-4.5c0-2.7 2-5 5-5Z'), line('M9.5 12.5V18M7 18h5')`,
  flower: `body(C(9.5, 7, 3.5)), line(C(9.5, 7, 1.2)), line('M9.5 10.5v7.5M9.5 15c-1.3-1.6-2.8-2-4.3-1.8')`,
  flame: `body('M9.5 3.5c3 2.8 5 5.3 5 8.5a5 5 0 0 1-10 0c0-2 1-3.5 2.3-4.8.3 1.5 1 2.5 2 2.8-.4-2.5.2-4.6.7-6.5Z')`,
  target: `line(C(9.5, 10.5, 6.5)), line(C(9.5, 10.5, 3.5)), line(D(9.5, 10.5))`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, {
  camera: 'media', rocket: 'business', anchor: 'travel', lamp: 'home', calculator: 'finance', compass: 'maps', hourglass: 'interface',
  magnet: 'science', puzzle: 'gaming', wine: 'food', fish: 'animals', sun: 'nature', moon: 'nature', globe: 'maps', music: 'media',
  server: 'development', brush: 'tools', pill: 'health', thermometer: 'health', tree: 'nature', flower: 'nature', flame: 'nature', target: 'business',
});
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { wine: 'Wine', brush: 'Paint Brush', flame: 'Fire', hourglass: 'Timer', lamp: 'Lamp' });
export default {};
