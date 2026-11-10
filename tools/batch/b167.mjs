import { B } from './mods.mjs';
Object.assign(B, {
  guitar: `line('M10.5 8.5 15.5 3.5'), body('M8.7 7.3a2.6 2.6 0 0 1 3.7 3.7c-.6.6-1 1.1-.9 2a3.6 3.6 0 1 1-4.8-4.8c.9.1 1.4-.3 2-.9Z'), line(D(7.6, 13))`,
  palette: `body('M9.5 3.5a7 7 0 0 0 0 14c1.2 0 1.6-.9 1.2-1.8-.5-1-.1-2.2 1.3-2.2h2a2.5 2.5 0 0 0 2.5-2.5c0-4.2-3.1-7.5-7-7.5Z'), line(D(6.5, 8.5) + D(9.5, 6.8) + D(12.5, 8.5) + D(6.2, 12))`,
  hammer: `body('M4 5.5h8.5l2 2v2h-3.5V8H4Z'), line('M8.5 8.3v9.5')`,
  candle: `line('M9.5 3.5c-1 1.2-1 2.2 0 3 1-.8 1-1.8 0-3Z'), body(R(6.5, 8, 6, 10, 1.2))`,
  telescope: `body(poly([[3.5, 10], [12.5, 5], [14, 8], [5, 13]], 0.8, true)), line('M8.5 11.5 6 18M9.5 11 12 18')`,
  drum: `body('M3.5 8.5v6c0 1.7 2.7 3 6 3s6-1.3 6-3v-6'), line(E(9.5, 8.5, 6, 2.5)), line('M3 3.5l5 4M16 3.5l-5 4')`,
  backpack: `line('M7.5 5.5V5a2 2 0 0 1 4 0v.5'), body('M4.5 9a3.5 3.5 0 0 1 3.5-3.5h3A3.5 3.5 0 0 1 14.5 9v8a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 17Z'), line('M7.5 12h4v3')`,
  diamond: `body(poly([[6, 4.5], [13, 4.5], [16, 8.5], [9.5, 17], [3, 8.5]], 0.8, true)), line('M3.3 8.5h12.4')`,
  ring: `line(C(9.5, 12.5, 5)), body(poly([[7.5, 3.5], [11.5, 3.5], [12.8, 5.3], [9.5, 7.6], [6.2, 5.3]], 0.6, true))`,
  cat: `body('M4.5 4.5l3 2.5h4l3-2.5v7a5 5 0 0 1-10 0Z'), line(D(7.5, 10.5) + D(11.5, 10.5)), line('M8.5 13.5h2')`,
  bird: `body('M4 11c0-3.5 2.5-6 5.5-6 2 0 3.5 1.2 4 3l2 .8-2 .9c-.3 4.2-3 7.3-6.5 7.3H4Z'), line(D(11.3, 8)), line('M6.5 11.5c1.5 1.5 3.5 1.5 5 0')`,
  butterfly: `body('M9.2 9.5C8 6 5.8 4 4 4.2c-1.6.2-1.4 2.8-.3 4.3.8 1 2.2 1.4 3.3 1.5-1.3.6-2.3 1.6-2 3.2.3 1.4 2 1.6 3 .6.8-.8 1.1-2.4 1.2-4.3Z'), body('M9.8 9.5C11 6 13.2 4 15 4.2c1.6.2 1.4 2.8.3 4.3-.8 1-2.2 1.4-3.3 1.5 1.3.6 2.3 1.6 2 3.2-.3 1.4-2 1.6-3 .6-.8-.8-1.1-2.4-1.2-4.3Z'), line('M9.5 9.5v7')`,
  snowflake: `line('M9.5 3.5v14M3.4 7l12.2 7M3.4 14l12.2-7'), line('M7.8 4.7l1.7 1.6 1.7-1.6M7.8 16.3l1.7-1.6 1.7 1.6')`,
  dice: `body(R(3.5, 4.5, 12, 12, 2.5)), line(D(6.8, 7.8) + D(9.5, 10.5) + D(12.2, 13.2) + D(12.2, 7.8) + D(6.8, 13.2))`,
  pawn: `line(C(9.5, 5.5, 2)), body('M7.5 9h4l-.8 1.5c0 2 .8 3.5 2.3 5h-7c1.5-1.5 2.3-3 2.3-5Z'), line('M4.5 18h10')`,
  medal: `line('M6.5 3.5l2 5M12.5 3.5l-2 5'), body(C(9.5, 13, 4.5)), line(C(9.5, 13, 1.8))`,
  paperclip: `line('M13 9.5 8.3 14.2a2.2 2.2 0 0 1-3.1-3.1l6-6a3.4 3.4 0 0 1 4.8 4.8l-6 6')`,
  bucket: `line('M4.5 8a5 5 0 0 1 10 0'), body('M3.5 8.5h12l-1.4 8.2a1.5 1.5 0 0 1-1.5 1.3H6.4a1.5 1.5 0 0 1-1.5-1.3Z'), line('M4 11.5h11')`,
  lifebuoy: `body(C(9.5, 10.5, 6.5)), line(C(9.5, 10.5, 2.8)), line('M5 6l2.4 2.4M14 6l-2.4 2.4M5 15l2.4-2.4')`,
  radio: `line('M5 7 12.5 3.5'), body(R(3, 7, 13, 10, 2)), line(C(7.5, 12, 2.2)), line('M12 10h1.5M12 12.5h1.5')`,
  balloon: `body('M9.5 3.5c3 0 5 2.4 5 5.5 0 3.3-2.4 6-5 6s-5-2.7-5-6c0-3.1 2-5.5 5-5.5Z'), line('M9.5 15c0 1.5-1.5 1.8-1.5 3.5'), line('M7.3 7a2.6 2.6 0 0 1 1.6-1.5')`,
  burger: `body('M3.5 8.5C3.5 5.5 6 3.5 9.5 3.5s6 2 6 5Z'), line('M3 11.5h13'), body('M3.5 14h12v1.5a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2Z')`,
  apple: `line('M9.5 6.5c0-1.5.6-2.5 2-3'), body('M9.5 7c-1-.8-2-1-3-1C4.5 6 3.5 8 3.5 10.3c0 3.7 2.5 7.2 4.5 7.2.6 0 1-.3 1.5-.3s.9.3 1.5.3c2 0 4.5-3.5 4.5-7.2C15.5 8 14.5 6 12.5 6c-1 0-2 .2-3 1Z')`,
  cactus: `body('M8 18V5.5a1.5 1.5 0 0 1 3 0V18Z'), line('M8 12H6a1.5 1.5 0 0 1-1.5-1.5V8.5M11 10h2a1.5 1.5 0 0 0 1.5-1.5V7'), line('M5 18h9')`,
  mushroom: `body('M3.5 10.5a6 6 0 0 1 12 0Z'), body('M7.5 10.7h4v5.3a2 2 0 0 1-4 0Z'), line(D(7, 7.5) + D(11.5, 6.8))`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, {
  guitar: 'media', palette: 'design', hammer: 'tools', candle: 'home', microscope: 'science', telescope: 'science', drum: 'media',
  backpack: 'travel', diamond: 'commerce', ring: 'fashion', hat: 'fashion', dog: 'animals', cat: 'animals', bird: 'animals', butterfly: 'animals',
  snowflake: 'weather', dice: 'gaming', pawn: 'gaming', medal: 'sports', paperclip: 'files', bucket: 'tools', lifebuoy: 'travel', radio: 'media',
  helmet: 'sports', sneaker: 'fashion', balloon: 'celebration', burger: 'food', icecream: 'food', apple: 'food', cactus: 'nature', mushroom: 'nature', kettle: 'home',
});
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { icecream: 'Ice Cream', pawn: 'Chess', lifebuoy: 'Lifebuoy', drum: 'Drum', palette: 'Colour Palette', paperclip: 'Attachment' });
export default {};
