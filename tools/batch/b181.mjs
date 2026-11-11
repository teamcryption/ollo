import { B } from './mods.mjs';
Object.assign(B, {
  onigiri: `body('M9.5 4c1 0 1.7.5 2.3 1.4l3.6 6.3c1.3 2.3-.3 5.3-3 5.3H6.6c-2.7 0-4.3-3-3-5.3l3.6-6.3C7.8 4.5 8.5 4 9.5 4Z'), line(R(7.5, 12.3, 4, 4.5, 0.4))`,
  peanut: `body(rotateD('M9.5 3.5a3.3 3.3 0 0 1 3.3 3.3c0 1.1-.6 1.7-.6 2.9s.9 1.8.9 3.1a3.6 3.6 0 0 1-7.2 0c0-1.3.9-1.9.9-3.1s-.6-1.8-.6-2.9a3.3 3.3 0 0 1 3.3-3.3Z', 35, 9.5, 10.5))`,
  'coffee-bean': `body(rotateD(E(9.5, 10.5, 4.5, 6.3), 35, 9.5, 10.5)), line(rotateD('M9.5 4.6c-1.6 2-1.6 3.9 0 5.9s1.6 3.9 0 5.9', 35, 9.5, 10.5))`,
  stool: `body(R(4, 5, 11, 3, 1.5)), line('M5.5 8.2 4 18M13.5 8.2 15 18M9.5 8.2V18'), line('M5 13.5h9')`,
  curtains: `line('M3 4h13'), body('M4 4.5h4c0 4 0 8.5-1 13H4Z'), body('M15 4.5h-4c0 4 0 8.5 1 13h3Z')`,
  'spirit-level': `body(R(3, 7.5, 13, 6, 1.5)), line(R(7.5, 9.3, 4, 2.4, 1.2)), line('M5 10.5h1M13 10.5h1')`,
  pickaxe: `body('M3 8c3.5-4 9.5-4 13 0-4-1.8-9-1.8-13 0Z'), line('M9.5 6.6V18')`,
  screw: `body(R(5.5, 3.5, 8, 3, 1)), body('M7 7.2h5v6.8l-2.5 4L7 14Z'), line('M7.2 9.3l4.6-1M7.2 11.8l4.6-1')`,
  lotus: `body('M9.5 5c1.8 2 2.5 4.5 2 7.5-.4 1.6-1.1 3-2 4-.9-1-1.6-2.4-2-4-.5-3 .2-5.5 2-7.5Z'), line('M7.2 15.5C4.8 15 3.3 13 3 9.5c1.6.3 2.8 1 3.8 2M11.8 15.5c2.4-.5 3.9-2.5 4.2-6-1.6.3-2.8 1-3.8 2'), line('M4.5 17.8h10')`,
  crab: `line('M5 9.3 3.5 6.5l1-2.5M14 9.3l1.5-2.8-1-2.5'), line('M8 8.6V7M11 8.6V7'), body(E(9.5, 12, 5, 3.4)), line('M4.6 13.6l-1.5 1M5 15l-1.3 1.5')`,
  horseshoe: `body('M4 16.5V9.5a5.5 5.5 0 0 1 11 0v7h-3.2v-7a2.3 2.3 0 0 0-4.6 0v7Z'), line(D(5.6, 11) + D(5.6, 14))`,
  pennant: `line('M4 3v15.5'), body('M4.4 4h11L4.4 11.5Z')`,
  'bow-arrow': `line('M6 3.5a11 11 0 0 1 0 14'), line('M6 3.5v14'), line('M3 10.5h11.5M13 9l1.5 1.5L13 12')`,
  signal: `body(R(3.5, 13, 2.6, 4.5, 0.8)), body(R(7.7, 9.5, 2.6, 8, 0.8)), body(R(11.9, 6, 2.6, 11.5, 0.8))`,
  octopus: `body('M5 9.5a4.5 4.5 0 0 1 9 0v2H5Z'), line(D(7.8, 9) + D(11.2, 9)), line('M5.6 11.7c-.3 2.4-1.5 3.9-2.5 4.4M8 11.7c0 2.5-.5 4.5-1.5 6M11 11.7c0 2.5.5 4.5 1.5 6M13.4 11.7c.3 2.4 1.5 3.9 2.5 4.4')`,
  rook: `body(poly([[5, 4], [7, 4], [7, 5.5], [8.5, 5.5], [8.5, 4], [10.5, 4], [10.5, 5.5], [12, 5.5], [12, 4], [14, 4], [14, 8], [12.5, 9], [13, 14.5], [6, 14.5], [6.5, 9], [5, 8]], 0.4, true)), body(R(4, 15.5, 11, 2.5, 0.8))`,
  button: `body(C(9.5, 10.5, 6.5)), line(D(7.8, 8.8) + D(11.2, 8.8) + D(7.8, 12.2) + D(11.2, 12.2))`,
  typewriter: `body(R(6, 3, 7, 4.6, 0.6)), body('M3.5 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2Z'), line(D(6.5, 12.3) + D(9.5, 12.3) + D(12.5, 12.3) + D(6.5, 15) + D(9.5, 15))`,
  tripod: `body(R(5.5, 3.5, 8, 5, 1.2)), line(C(9.5, 6, 1.2)), line('M9.5 8.7V18M9.5 8.7 4.5 18M9.5 8.7l5 9.3')`,
  match: `line('M6 18 11.6 8.6'), body('M12.5 3c1.8 1.6 2.7 3 2.7 4.3a2.5 2.5 0 0 1-5 0c0-1 .5-2 1.3-2.8.1.7.4 1 .8 1.1 0-1 .1-1.8.2-2.6Z')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, {
  onigiri: 'food', peanut: 'food', 'coffee-bean': 'food',
  stool: 'home', curtains: 'home', 'spirit-level': 'tools', pickaxe: 'tools', screw: 'tools',
  lotus: 'nature', crab: 'animals', horseshoe: 'animals', pennant: 'sports', 'bow-arrow': 'sports', signal: 'communication',
  octopus: 'animals', rook: 'gaming', button: 'fashion', typewriter: 'text', tripod: 'media', match: 'home',
});
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { signal: 'Signal', 'bow-arrow': 'Bow and Arrow', screw: 'Screw' });
export default {};
