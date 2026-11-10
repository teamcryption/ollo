import { B } from './mods.mjs';
const oct = Array.from({ length: 8 }, (_, k) => [9.5 + 6 * Math.cos(((22.5 + 45 * k) * Math.PI) / 180), 9 + 6 * Math.sin(((22.5 + 45 * k) * Math.PI) / 180)].map((v) => Math.round(v * 100) / 100));
Object.assign(B, {
  helicopter: `line('M3.5 5h12M9.5 5.2v3.1'), line('M5 10.5H3V8.5'), body('M5 8.5h5.5a4 4 0 0 1 4 4v.5a2 2 0 0 1-2 2H8.5A3.5 3.5 0 0 1 5 11.5Z'), line('M7 17.8h7M8.5 15.3v2.3M12 15.3v2.3')`,
  frog: `body(C(6.5, 7.6, 2)), body(C(12.5, 7.6, 2)), body('M4 12.3a5.5 3.8 0 0 1 11 0v1.2a3.5 3.5 0 0 1-3.5 3.5h-4A3.5 3.5 0 0 1 4 13.5Z'), line(D(6.5, 7.6) + D(12.5, 7.6)), line('M7 13.8c1.5 1 3.5 1 5 0')`,
  tulip: `body('M5.5 4.5l2 1.8 2-2.3 2 2.3 2-1.8V8a4 4 0 0 1-8 0Z'), line('M9.5 12.2V18'), line('M9.5 16c-1.5-2-3.2-2.5-4.8-2.3')`,
  sprout: `body('M9.2 10.3C9.2 7 7.4 5 4 5c0 3.4 1.8 5.3 5.2 5.3Z'), body('M9.8 8.8c0-3 1.8-4.8 5.2-4.8 0 3-1.8 4.8-5.2 4.8Z'), line('M9.5 11v7M6 18h7')`,
  rainbow: `line('M3 15.5a6.5 6.5 0 0 1 13 0'), line('M5.5 15.5a4 4 0 0 1 8 0'), line('M8 15.5a1.5 1.5 0 0 1 3 0')`,
  mouse: `body(R(5, 3.5, 9, 15, 4.5)), line('M9.5 3.7v4.3')`,
  'sd-card': `body('M6.5 3.5h7A1.5 1.5 0 0 1 15 5v12a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 4 17V6Z'), line('M7.5 6v2.5M10 6v2.5M12.5 6v2.5')`,
  cpu: `body(R(5.5, 6, 8, 8, 1.5)), line(R(8, 8.5, 3, 3, 0.5)), line('M7.5 3.5V6M11.5 3.5V6M7.5 14v2.5M3 8h2.5M3 12h2.5M13.5 8H16')`,
  socket: `body(R(3.5, 4.5, 12, 12, 3)), line('M7.5 8.5v2M11.5 8.5v2'), line(D(9.5, 13))`,
  'stop-sign': `body(poly(${JSON.stringify(oct)}, 0.8, true)), line('M7 9h5'), line('M9.5 15.2v3.3')`,
  'fountain-pen': `body('M9.5 3.5l4.5 6-4.5 9-4.5-9Z'), line('M9.5 4v5'), line(D(9.5, 11.2))`,
  pushpin: `body('M7 3.5h5l-.7 4.5 2.7 3H4l2.7-3Z'), line('M9.5 11.2V18')`,
  'party-popper': `body(poly([[3.5, 17.5], [6.5, 8], [13, 14.5]], 0.8, true)), line('M9.5 6.5l1-3M12 8.5l3-1.5M13.8 11.5l2.4.3'), line(D(7.5, 4.5))`,
  candy: `body(poly([[5.9, 10.5], [3, 8], [3, 13]], 0.5, true)), body(poly([[13.1, 10.5], [16, 8], [16, 13]], 0.5, true)), body(E(9.5, 10.5, 3.4, 3))`,
  milk: `line('M7.2 4V3h4.6v1'), body(poly([[5, 8], [7, 4.5], [12, 4.5], [14, 8], [14, 18], [5, 18]], 0.8, true)), line('M5.2 8h8.6'), line('M7.5 12h4')`,
  avocado: `body('M9.5 3.5c2.5 0 3.5 2.5 4.3 5 .8 2 1.7 3.2 1.7 5a6 6 0 0 1-12 0c0-1.8.9-3 1.7-5 .8-2.5 1.8-5 4.3-5Z'), line(C(9.5, 13, 2.2))`,
  chili: `line('M12.5 5.5c.5-1 1.5-1.7 2.5-2'), body('M12.3 5.6c2 .8 2.4 3 1.2 5.2C11.8 14 8 17 4 17.5c-.5 0-.6-.7-.2-.9 3-1.6 5.3-4.8 5.9-8.4.3-2 1.2-3.3 2.6-2.6Z')`,
  crayon: `body(rotateD('M7.5 18V7.5l2-4 2 4V18Z', 40, 9.5, 10.5)), line(rotateD('M7.7 9.5h3.6M7.7 15h3.6', 40, 9.5, 10.5))`,
  'salt-shaker': `body('M6 8.5a3.5 3.5 0 0 1 7 0V17a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1Z'), line(D(8.5, 7) + D(10.5, 7) + D(9.5, 5.6)), line('M6.2 10.8h6.6')`,
  toothbrush: `body(R(7.5, 3.5, 4, 6, 1.2)), line('M5 4.8h1.5M5 6.5h1.5M5 8.2h1.5'), line('M9.5 9.7V18')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, {
  helicopter: 'transport', frog: 'animals', bat: 'animals', tulip: 'nature', sprout: 'nature', rainbow: 'weather', tornado: 'weather', mitten: 'fashion',
  boot: 'fashion', purse: 'fashion', 'vr-headset': 'devices', mouse: 'devices', 'sd-card': 'devices', cpu: 'devices', socket: 'energy',
  fan: 'home', bridge: 'buildings', 'stop-sign': 'transport', 'fountain-pen': 'text', pushpin: 'interface', 'party-popper': 'celebration', candy: 'food',
  milk: 'food', avocado: 'food', chili: 'food', crayon: 'design', 'salt-shaker': 'food', toothbrush: 'health',
});
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { mouse: 'Mouse', cpu: 'CPU', 'vr-headset': 'VR Headset', 'sd-card': 'SD Card', socket: 'Power Socket', milk: 'Milk', fan: 'Fan' });
export default {};
