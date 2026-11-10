import { B } from './mods.mjs';
Object.assign(B, {
  submarine: `line('M10 6.3V4h1.5'), line('M8 9V6.5h3V9'), body('M3.5 12.5A3.5 3.5 0 0 1 7 9h6a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3H7a3.5 3.5 0 0 1-3.5-3.5Z'), line(D(7, 12.5) + D(10, 12.5))`,
  easel: `body(R(4.5, 3.5, 10, 8.5, 1)), line('M7 12.2l-2 6.3M12 12.2l2 6.3M9.5 12.2v3')`,
  remote: `body(R(6, 3, 7, 15.5, 2.5)), line(C(9.5, 7, 1.5)), line(D(8, 11.5) + D(11, 11.5) + D(8, 14) + D(11, 14))`,
  floppy: `body('M3.5 5A1.5 1.5 0 0 1 5 3.5h8.5L16 6v10a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 16Z'), line('M6.5 3.7V7H12V3.7'), line('M6.5 17.3v-4.8h6v4.8')`,
  barcode: `line('M4 5v11M6.2 5v11M7.8 5v11M10.4 5v11M12.6 5v11M14.8 5v11')`,
  banknote: `body(R(3, 6, 13, 8.5, 1.5)), line(C(9.5, 10.25, 2)), line(D(5.5, 8.3) + D(13.5, 12.2))`,
  podium: `body(poly([[3, 18], [3, 12], [7, 12], [7, 8.5], [12, 8.5], [12, 14], [16, 14], [16, 18]], 0.6, true)), line('M9.5 10.5v2')`,
  'playing-card': `body(R(4.5, 3.5, 10, 14, 1.8)), line('M9.5 7.5c1.5 1.4 2.8 2.4 2.8 3.6a1.4 1.4 0 0 1-2.5.9l.4 1.5H8.8l.4-1.5a1.4 1.4 0 0 1-2.5-.9c0-1.2 1.3-2.2 2.8-3.6Z')`,
  surfboard: `body(rotateD(E(9.5, 10.5, 2.8, 7.5), 35, 9.5, 10.5)), line(rotateD('M9.5 5v11', 35, 9.5, 10.5))`,
  'street-lamp': `line('M6.5 18V6A2.5 2.5 0 0 1 9 3.5h3'), body(poly([[10.5, 4], [14.5, 4], [15.8, 7], [9.2, 7]], 0.5, true)), line('M4.5 18h4'), line('M12.5 9.3v1')`,
  seashell: `body('M3.5 10a6 6 0 0 1 12 0c0 2.5-1.5 4.5-3.5 5.5H7C5 14.5 3.5 12.5 3.5 10Z'), line('M9.5 15.2V4.4M7.2 15 5.6 6.8M11.8 15l1.6-8.2'), body(R(7, 16.2, 5, 2, 0.8))`,
  whale: `line('M8 5V3.5M8 5 6.5 4M8 5l1.5-1'), body('M3 11c0-2.5 2.5-4 6-4 3 0 5 1.5 6 3.5l1.5-2.5v5l-1.8-.8C13.5 15 11.5 16 9 16c-3.5 0-6-2-6-5Z'), line(D(6, 10.5))`,
  duck: `body(C(7.5, 7, 3)), line('M4.4 7.6H3'), body('M3.5 13.2a3 3 0 0 1 3-3h5l3-1.5V12a6 6 0 0 1-6 6h-2a3 3 0 0 1-3-3Z'), line(D(8, 6.3))`,
  ladybug: `line('M7.5 5.8 6.5 4M11.5 5.8 12.5 4'), body(C(9.5, 11.5, 5.3)), line('M9.5 6.4v10.2'), line(D(7, 10) + D(12, 10) + D(7, 13.3) + D(12, 13.3))`,
  broccoli: `body('M5.5 10.2a2.6 2.6 0 0 1 .6-5.1A3.2 3.2 0 0 1 12 4.6a2.8 2.8 0 0 1 1.6 5.6Z'), body('M8 11.2h3l.6 6.8H7.4Z')`,
  onion: `line('M9.5 5V3'), body('M9.5 5.3c3.5 3 5.5 5.4 5.5 7.9a4.6 4.6 0 0 1-4.6 4.3H8.6A4.6 4.6 0 0 1 4 13.2c0-2.5 2-4.9 5.5-7.9Z'), line('M9.2 8c-1.4 2.3-1.8 5-1 8.2')`,
  popsicle: `body('M6 7.5a3.5 3.5 0 0 1 7 0V14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1Z'), line('M8.3 8v4M10.7 8v4'), line('M9.5 15.2v3')`,
  beer: `line('M4 5.5c0-1.2 1-2 2-2 .6-.6 1.3-.8 2.2-.5.8-.5 2-.4 2.7.3 1 0 1.6.8 1.6 2.2'), body(R(4, 6, 8.5, 12, 1.5)), line('M12.5 9H14a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 14 15h-1.5'), line('M6.5 9v6.5M10 9v6.5')`,
  cocktail: `line('M12.3 3 10.6 6.5'), body(poly([[3.5, 4.5], [15.5, 4.5], [9.5, 11]], 0.6, true)), line('M9.5 11.2v6.3M6.5 17.8h6')`,
  dumpling: `body('M3 12.5C3 9.5 6 7 9.5 7S16 9.5 16 12.5c0 1.5-1 2.5-2.5 2.5h-8C4 15 3 14 3 12.5Z'), line('M7 7.6l.5 2M9.5 7.1v2M12 7.6l-.5 2')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, {
  submarine: 'transport', easel: 'design', remote: 'devices', floppy: 'files', barcode: 'commerce', banknote: 'finance', podium: 'sports',
  'playing-card': 'gaming', surfboard: 'sports', 'street-lamp': 'buildings', seashell: 'nature', whale: 'animals',
  duck: 'animals', ladybug: 'animals', broccoli: 'food', onion: 'food', popsicle: 'food',
  beer: 'food', cocktail: 'food', dumpling: 'food',
});
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { remote: 'Remote', floppy: 'Floppy Disk', beer: 'Beer', cocktail: 'Cocktail' });
export default {};
