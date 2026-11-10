import { B } from './mods.mjs';
Object.assign(B, {
  metronome: `body(poly([[7, 3.5], [12, 3.5], [15, 18], [4, 18]], 0.8, true)), line('M5.3 14.5h8.4'), line('M9.5 14.3l2.8-7.8')`,
  scroll: `body(R(3.5, 3, 12, 2.3, 1.15)), body(R(5, 5.8, 9, 9.4, 0.6)), body(R(3.5, 15.7, 12, 2.3, 1.15)), line('M7 8.5h5M7 11h5M7 13h3')`,
  'walkie-talkie': `line('M7 6V3'), body(R(5, 6, 9, 12.5, 2)), line('M7.5 9.5h4M7.5 11.5h4'), line(D(9.5, 15))`,
  domino: `body(R(5.5, 3, 8, 15.5, 2)), line('M5.7 10.75h7.6'), line(D(8, 5.8) + D(9.5, 7.3) + D(11, 8.8) + D(8, 13.5) + D(11, 13.5))`,
  cube: `body(poly([[9.5, 3], [16, 6.7], [16, 14.3], [9.5, 18], [3, 14.3], [3, 6.7]], 0.8, true)), line('M3.3 6.9l6.2 3.6 6.2-3.6M9.5 10.6v7.1')`,
  protractor: `body('M3 15.5a6.5 6.5 0 0 1 13 0Z'), line('M6.5 15.3a3 3 0 0 1 6 0'), line('M9.5 9.2v1.2M5.3 11.3l.9.8M13.7 11.3l-.9.8')`,
  'ceiling-light': `line('M9.5 3v4.3'), body('M4 13a5.5 5.5 0 0 1 11 0Z'), line('M8 15a1.5 1.5 0 0 0 3 0')`,
  fireplace: `line('M2.5 4h14'), body('M3 18V6h13v12h-3.5v-5a3 3 0 0 0-6 0v5Z')`,
  mop: `line('M13.5 3.5 9 12'), body('M5 12.5h7.5l1 5.5H4Z'), line('M6.5 15v2.8M8.8 15v2.8M11.1 15v2.8')`,
  'soap-dispenser': `line('M9.5 6V4h3.5'), body(R(8, 6, 3, 2, 0.5)), body(R(5, 8.7, 9, 9.3, 2.2)), line('M7.5 13h4')`,
  pillow: `body('M4 5.5c3.5 1 7.5 1 11 0-1 3.5-1 6.5 0 10-3.5-1-7.5-1-11 0 1-3.5 1-6.5 0-10Z')`,
  wardrobe: `body(R(4, 3.5, 11, 14, 1.5)), line('M9.5 3.7v13.6'), line('M8 9v2M11 9v2'), line('M5.5 17.7v1M13.5 17.7v1')`,
  flashlight: `body(R(6, 3.5, 7, 3, 1)), body('M6.5 7.6h6l-1 2.4v7.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V10Z'), line('M9.5 11.5V13')`,
  swing: `line('M3 18V5h13v13'), line('M7.5 5.2v8M11.5 5.2v8'), body(R(6.5, 13, 6, 2, 0.7))`,
  'cable-car': `line('M3 5l13-2'), line('M9.5 4.3v3.2'), body(R(4.5, 7.5, 10, 9.5, 2)), line('M6.5 10.5h6')`,
  sunrise: `line('M9.5 4v2M3.5 8.5l1.4 1M15.5 8.5l-1.4 1'), body('M4.5 13.5a5 5 0 0 1 10 0Z'), line('M2.5 16.5h14')`,
  wind: `line('M3 8h9a2.5 2.5 0 1 0-2.5-2.5M3 12h11.5a2.5 2.5 0 1 1-2.5 2.5M3 16h5')`,
  'pill-bottle': `body(R(5, 3.5, 9, 3, 1)), body(R(5.5, 7.5, 8, 10.5, 1.5)), line('M7.5 11h4M7.5 13.5h4')`,
  'test-tube': `line(rotateD('M7 3.5h5', 30, 9.5, 10.5)), body(rotateD('M8 3.7h3v11a1.5 1.5 0 0 1-3 0Z', 30, 9.5, 10.5)), line(rotateD('M8.2 10h2.6', 30, 9.5, 10.5))`,
  mortar: `line('M11.8 9.8 15.5 4'), body('M3.5 10.5h12a6 6 0 0 1-12 0Z'), line('M7 18.2h5')`,
  scale: `line('M9.5 3.5v14M6 17.8h7M5 6h9'), line('M5 6.2l-2 4.2M5 6.2l2 4.2M14 6.2l-2 4.2M14 6.2l2 4.2'), body('M2.8 10.6h4.4a2.2 2.2 0 0 1-4.4 0Z'), body('M11.8 10.6h4.4a2.2 2.2 0 0 1-4.4 0Z')`,
  gavel: `body(rotateD(R(7.5, 3, 7, 4, 1), 45, 11, 5)), line('M9.3 7.2 3.8 12.7'), body(R(3, 15.5, 8, 2.5, 0.8))`,
  'cash-register': `body(R(5, 3.5, 6, 4, 1)), line('M8 7.7V11'), body('M3.5 11h12v6a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1Z'), line(D(6, 13.3) + D(8.5, 13.3) + D(11, 13.3)), line('M3.7 15.5h11.6')`,
  projector: `body(R(3, 7, 13, 8, 2)), line(C(11.5, 11, 2)), line('M5.5 10h2'), line('M5 15.2v2M14 15.2v2')`,
  ram: `body(R(3, 6, 13, 7.5, 1)), line('M5.8 8.5v3M8.5 8.5v3M11.2 8.5v3'), line('M4.5 13.7v2M7 13.7v2M9.5 13.7v2M12 13.7v2M14.5 13.7v2')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, {
  metronome: 'media', scroll: 'text', 'walkie-talkie': 'communication', domino: 'gaming', cube: 'design', protractor: 'education',
  'ceiling-light': 'home', fireplace: 'home', mop: 'home', 'soap-dispenser': 'home', pillow: 'home', wardrobe: 'home',
  flashlight: 'tools', swing: 'people', 'cable-car': 'transport', sunrise: 'weather', wind: 'weather', 'pill-bottle': 'health',
  'test-tube': 'science', mortar: 'health', scale: 'business', gavel: 'business', 'cash-register': 'commerce', projector: 'devices', ram: 'devices',
});
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { cube: '3D Cube', scale: 'Justice Scale', mortar: 'Mortar and Pestle', ram: 'RAM', wind: 'Wind' });
export default {};
