import { B } from './mods.mjs';
Object.assign(B, {
  teddy: `body(C(5.5, 5, 1.8)), body(C(13.5, 5, 1.8)), body(C(9.5, 10, 5)), line(E(9.5, 12, 2, 1.5)), line(D(7.5, 8.8) + D(11.5, 8.8))`,
  'spinning-top': `line('M9.5 5.5V3'), body('M4 9a5.5 3.5 0 0 1 11 0Z'), body('M3.5 10.2h12l-6 7.8Z')`,
  'lego-brick': `body(R(5, 4, 3, 2.5, 0.6)), body(R(11, 4, 3, 2.5, 0.6)), body(R(3.5, 7, 12, 8, 1.2))`,
  spatula: `body(rotateD(R(7, 3, 5, 6.5, 1.2), 30, 9.5, 10.5)), line(rotateD('M8.7 4.5V8M10.3 4.5V8', 30, 9.5, 10.5)), line(rotateD('M9.5 9.7V18', 30, 9.5, 10.5))`,
  ladle: `line('M10.5 12V5a1.5 1.5 0 0 1 3 0'), body('M3.5 12h7a3.5 3.5 0 0 1-7 0Z')`,
  grater: `line('M8 5V3.5h3V5'), body(poly([[6, 5], [13, 5], [15, 18], [4, 18]], 0.8, true)), line(D(7.5, 9) + D(9.5, 9) + D(11.5, 9) + D(7, 12.2) + D(9.5, 12.2) + D(12, 12.2))`,
  'measuring-cup': `body('M4 6h9.5v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z'), line('M13.6 8h1.9a1.5 1.5 0 0 1 0 3h-1.9'), line('M4.2 9h2.5M4.2 12h2.5M4.2 15h2.5')`,
  toothpaste: `line('M3.5 7v6'), body('M5 7h8.5l2 1.8v2.4l-2 1.8H5Z'), line('M7.5 10h3')`,
  'drawing-compass': `body(C(9.5, 4.5, 1.5)), line('M8.8 5.9 4.5 17.5M10.2 5.9l4.3 11.6'), line('M5.6 14.4c2.5 1.3 5.3 1.3 7.8 0')`,
  gingerbread: `body(C(9.5, 5, 2.2)), body('M6.5 8h6l2.5 2-1 1.5-1.5-.8V14l1.5 3.5-1.7.8-2.3-3.3-2.3 3.3-1.7-.8L7 14v-3.3l-1.5.8-1-1.5Z'), line(D(9.5, 10) + D(9.5, 12.2))`,
  'witch-hat': `body(poly([[5.5, 14.6], [9, 3.5], [13.5, 14.6]], 0.8, true)), line('M6.4 12.3h6.3'), body(R(3, 15.4, 13, 2.3, 1.15))`,
  'party-hat': `body(C(9.5, 3.2, 1.1)), body(poly([[4.5, 17], [9.5, 4.6], [14.5, 17]], 0.8, true)), line('M7.2 11.5l4.6-2M6 15l7-3')`,
  lips: `body('M3 10.5c1.5-2.5 3.5-4 5-4 .6 0 1 .4 1.5.8.5-.4.9-.8 1.5-.8 1.5 0 3.5 1.5 5 4-2 3-4 4.5-6.5 4.5S5 13.5 3 10.5Z'), line('M3.4 10.5h12.2')`,
  pinecone: `body('M9.5 3.5c3 2 5 5 5 8 0 3.5-2.2 6-5 6s-5-2.5-5-6c0-3 2-6 5-8Z'), line('M6.2 9.5l3.3 2 3.3-2M5.2 13l4.3 2.5 4.3-2.5')`,
  waves: `line('M3 7c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0M3 11c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0M3 15c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0')`,
  hook: `line(C(10.5, 4, 1.3)), line('M10.5 5.4V14a3.5 3.5 0 0 1-7 0v-1.5l1.6 1.2')`,
  ribbon: `line('M9.5 9.5c-2-2.5-2.5-4-2.5-4.8a2.5 2.5 0 0 1 5 0c0 .8-.5 2.3-2.5 4.8'), line('M9.5 9.5 5 17.5M9.5 9.5l4.5 8')`,
  polaroid: `body(R(4, 3.5, 11, 14, 1.5)), line(R(5.8, 5.3, 7.4, 7.4, 0.6))`,
  'traffic-barrier': `body(R(3, 5, 13, 5.5, 1)), line('M6.5 5.2l-2.8 5.1M10.5 5.2l-2.8 5.1M14.5 5.2l-2.8 5.1'), line('M5.5 10.7v7.3M13.5 10.7v7.3M4 18h3M12 18h3')`,
  'hard-hat': `body('M4 13.5V12a5.5 5.5 0 0 1 11 0v1.5Z'), line('M9.5 6.5v3.5'), body(R(2.8, 14.2, 13.4, 2.3, 1.15))`,
  microwave: `body(R(3, 4.5, 13, 10.5, 1.5)), line(R(5, 6.5, 6.5, 6.5, 1)), line('M13.8 7v.5M13.8 9.5v.5'), line('M5 17.5v1M14 17.5v1')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, {
  teddy: 'gaming', 'spinning-top': 'gaming', 'lego-brick': 'gaming', spatula: 'food', ladle: 'food', grater: 'food',
  'measuring-cup': 'food', toothpaste: 'health', 'drawing-compass': 'education',
  gingerbread: 'celebration', 'witch-hat': 'celebration', 'party-hat': 'celebration', lips: 'people', pinecone: 'nature', waves: 'nature', hook: 'tools',
  ribbon: 'health', polaroid: 'media', 'traffic-barrier': 'transport', 'hard-hat': 'tools', microwave: 'home',
});
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { teddy: 'Teddy Bear', 'lego-brick': 'Toy Brick', 'drawing-compass': 'Drawing Compass', waves: 'Waves', hook: 'Hook', ribbon: 'Awareness Ribbon', polaroid: 'Instant Photo', lips: 'Lips' });
export default {};
