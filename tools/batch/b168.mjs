import { B } from './mods.mjs';
Object.assign(B, {
  kite: `body(poly([[9.5, 3], [15, 8.5], [9.5, 14], [4, 8.5]], 1, true)), line('M9.5 3.4v10.2M4.4 8.5h10.2'), line('M9.5 14.2c-1.2 1.3.2 2.5-1 4')`,
  sailboat: `body(poly([[9, 3.5], [9, 12], [3.5, 12]], 0.8, true)), body(poly([[10.6, 5.5], [14.8, 12], [10.6, 12]], 0.6, true)), body('M3 14h13l-1.8 3.5H4.8Z')`,
  axe: `line('M4.5 18 12.5 4.5'), body('M10.3 5.2 13 3.3c1.8 1.6 2.6 4 2.3 6.6l-3.7-1.4Z')`,
  shovel: `line('M9.5 3.5v8M7.5 3.5h4'), body('M6.5 11.5h6v2.5a3 3 0 0 1-6 0Z')`,
  screwdriver: `body(R(7.3, 3.5, 4.4, 7.5, 1.6)), line('M9.5 5.5v3.5'), line('M9.5 11.2v5.3l-.8 1.5h1.6l-.8-1.5')`,
  carrot: `body('M11.6 6.3a2.8 2.8 0 0 1 4.1 3.8L5.4 17.6a.9.9 0 0 1-1.2-1.2Z'), line('M14.6 5.6 15.8 3.5M15.6 6.7l2.1-.6'), line('M8.4 11.6l1.2 1.1M10.4 9.3l1.1 1.1')`,
  egg: `body('M9.5 3.5c2.8 0 5 4.2 5 8a5 5 0 0 1-10 0c0-3.8 2.2-8 5-8Z'), line('M5.2 11.5l1.6 1.4 1.6-1.4 1.6 1.4 1.6-1.4 1.6 1.4')`,
  cupcake: `body('M4.5 9.5a5 5 0 0 1 10 0Z'), body('M5 10.8h9l-1.2 6.7H6.2Z'), line(D(9.5, 3)), line('M8 11.2l.4 5.8M11 11.2l-.4 5.8')`,
  teapot: `line('M7 8.5a2.5 2.5 0 0 1 5 0'), body('M5 9h9v5.5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3Z'), line('M5 11 3 9.3'), line(D(9.5, 4.8))`,
  door: `body(R(5, 3.5, 9, 14.5, 1.5)), line(D(11.3, 11)), line('M3 18.5h3')`,
  bathtub: `line('M5 10.5V6a2 2 0 0 1 4 0'), body('M3 10.5h13v2.5a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z'), line('M5.5 17l-.8 1.5')`,
  dress: `body(poly([[7.5, 3.5], [11.5, 3.5], [11, 7.5], [15, 17.5], [4, 17.5], [8, 7.5]], 0.8, true)), line('M8.3 7.6h2.4')`,
  sock: `body('M7 3.5h5v7.5l-3.6 5.3a2.4 2.4 0 0 1-4-2.7L7 10.2Z'), line('M7.2 6.2h4.6')`,
  bowtie: `body(poly([[3.5, 7], [8.3, 9.3], [8.3, 11.7], [3.5, 14]], 0.8, true)), body(poly([[15.5, 7], [10.7, 9.3], [10.7, 11.7], [15.5, 14]], 0.8, true)), line(D(9.5, 10.5))`,
  lipstick: `body('M7.5 9.5V5.7l4-2.2v6Z'), body(R(6.5, 10.5, 6, 7.5, 1))`,
  perfume: `line('M8.5 5.2V3.5h2'), body(R(7.5, 5.5, 4, 2.3, 0.6)), body(R(4.5, 8.5, 10, 9.5, 2.5)), line('M7.5 12.5h4')`,
  yarn: `body(C(9.5, 10, 6)), line('M5 7.2c3.2 0 6.6 2.3 8.7 6M4.2 11c3 0 6.2 1.7 8 5M7.8 4.3c2.6 1.4 4.6 3.8 5.9 6.8')`,
  feather: `body('M15 3.5c-5 0-9 4-9 9.5v2h2.3c5.7 0 6.7-5.6 6.7-11.5Z'), line('M3.8 17.8 11.5 8')`,
  rabbit: `body(E(7.5, 6.2, 1.4, 3.2)), body(E(11.5, 6.2, 1.4, 3.2)), body(C(9.5, 13.2, 4.6)), line(D(8, 12.5) + D(11, 12.5))`,
  bone: `body(rotateD('M7 9.2h5a1.9 1.9 0 1 1 1.6 1.3 1.9 1.9 0 1 1-1.6 1.3H7a1.9 1.9 0 1 1-1.6-1.3A1.9 1.9 0 1 1 7 9.2Z', -45, 9.5, 10.5))`,
  bandage: `body(rotateD(R(2.5, 7.3, 14, 6.4, 3.2), -45, 9.5, 10.5)), line(rotateD(R(7.3, 8.3, 4.4, 4.4, 1), -45, 9.5, 10.5))`,
  'traffic-light': `body(R(6.3, 3, 6.4, 15.5, 3.2)), line(C(9.5, 6.6, 1.3) + C(9.5, 10.7, 1.3) + C(9.5, 14.8, 1.3))`,
  'traffic-cone': `body(poly([[8, 4], [11, 4], [14, 16], [5, 16]], 0.8, true)), line('M7.2 8.5h4.6M6.3 12.3h6.4'), line('M3.5 17.8h12')`,
  lantern: `line('M7.5 4.5a2 2 0 0 1 4 0'), body(R(6, 6.5, 7, 10, 2)), line('M5 6.5h9M5 16.5h9'), line('M9.5 9.5c1 1 1 2 0 3-1-1-1-2 0-3Z')`,
  binoculars: `body(R(3.5, 8, 5, 9.5, 2)), body(R(10.5, 8, 5, 9.5, 2)), line('M8.7 10.5h1.6'), line('M4.5 8V5h3v3M11.5 8V5h3v3')`,
  'solar-panel': `body(poly([[5, 4], [14, 4], [15.5, 13], [3.5, 13]], 0.8, true)), line('M4.2 8.5h11M9.5 4.2v8.6'), line('M9.5 13.2v4.3M6.5 17.8h6')`,
  'wind-turbine': `line('M9.5 9.3v9M7 18.3h5'), line('M9.5 6.8V3M10.6 8.6l3.3 1.9M8.4 8.6l-3.3 1.9'), body(C(9.5, 8, 1.3))`,
  signpost: `line('M9.5 3.5v15'), body(poly([[4, 5], [13.5, 5], [15.5, 6.75], [13.5, 8.5], [4, 8.5]], 0.6, true)), body(poly([[15, 10.5], [5.5, 10.5], [3.5, 12.25], [5.5, 14], [15, 14]], 0.6, true))`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, {
  kite: 'celebration', sailboat: 'travel', axe: 'tools', shovel: 'tools', screwdriver: 'tools', 'watering-can': 'nature', carrot: 'food', egg: 'food',
  cupcake: 'food', teapot: 'food', chair: 'home', door: 'home', bathtub: 'home', dress: 'fashion', sock: 'fashion', bowtie: 'fashion', lipstick: 'fashion',
  perfume: 'fashion', yarn: 'design', feather: 'nature', rabbit: 'animals', bone: 'animals', bandage: 'health', 'traffic-light': 'transport',
  'traffic-cone': 'transport', lantern: 'home', binoculars: 'travel', mailbox: 'communication', 'solar-panel': 'energy', 'wind-turbine': 'energy', signpost: 'maps',
});
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { bowtie: 'Bow Tie', yarn: 'Yarn' });
export default {};
