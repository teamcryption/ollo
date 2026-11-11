import { B } from './mods.mjs';
Object.assign(B, {
  boot: `body('M6 3.5h5v8l4 2.5a1.5 1.5 0 0 1 .8 1.3V17H6Z'), line('M6.2 14.5h9.4')`,
  jar: `body(R(5.5, 3.5, 8, 2.5, 0.8)), body(R(5, 6.5, 9, 11.5, 2)), line('M5.2 10.5h8.6')`,
  taco: `body('M3 15a6.5 6.5 0 0 1 13 0Z'), line('M5.5 12.5c1-1 2-1 3 0s2 1 3 0')`,
  cherry: `line('M7 11.5V9c0-3 2-5 5-5.5M12 11.5V8'), body(C(6.5, 14, 2.5)), body(C(12.5, 14, 2.5))`,
  brick: `body(R(3, 6, 13, 9, 1)), line('M3.2 10.5h12.6M8 6.2v4.3M11 10.7V15')`,
  fingerprint: `line('M5 8a5 5 0 0 1 9 0v3M7 15v-4a2.5 2.5 0 0 1 5 0v5M9.5 11v6M5 11v2')`,
  network: `line(C(9.5, 5, 1.8)), line(C(5, 15, 1.8)), line(C(14, 15, 1.8)), line('M9.5 6.8v3.7M5 13.2v-1.5h9v1.5')`,
  layers: `body(poly([[9.5, 4], [16, 7.5], [9.5, 11], [3, 7.5]], 0.8, true)), line('M3 11l6.5 3.5L16 11M3 14.5l6.5 3.5 6.5-3.5')`,
  list: `line('M7 6h8.5M7 10.5h8.5M7 15h8.5'), line(D(4, 6) + D(4, 10.5) + D(4, 15))`,
  table: `body(R(3, 4.5, 13, 12, 1.5)), line('M3.2 8.5h12.6M3.2 12.5h12.6M8 8.7v7.6')`,
  'pie-chart': `body('M9 4.5a6.5 6.5 0 1 0 6.5 6.5H9Z'), line('M11 3a6 6 0 0 1 5 5h-5Z')`,
  gauge: `line('M3.5 14a6 6 0 0 1 12 0'), line('M9.5 14l3-3.5'), line('M3.5 17h12')`,
  funnel: `body('M3.5 4.5h12l-4.5 6v6l-3 1.5v-7.5Z')`,
  toggle: `body(R(3, 7.5, 13, 7, 3.5)), line(C(12.5, 11, 2))`,
  browser: `body(R(3, 4.5, 13, 12, 1.8)), line('M3.2 8h12.6'), line(D(5.5, 6.2) + D(7.5, 6.2))`,
  webcam: `body(C(9.5, 8.5, 4.5)), line(C(9.5, 8.5, 1.5)), line('M6.5 17.5h6M9.5 13v4.5')`,
  receipt: `body('M4.5 3.5h10v15l-2-1.3-1.7 1.3-1.3-1.3-1.7 1.3-1.6-1.3-1.7 1.3Z'), line('M7 7.5h5M7 10.5h5M7 13.5h3')`,
  'dollar-coin': `body(C(9.5, 10.5, 6.5)), line('M9.5 6.5v8M11.3 8.3c-.5-.6-1.1-.8-1.8-.8-1 0-1.8.6-1.8 1.4 0 1.9 3.6 1 3.6 3 0 .8-.8 1.4-1.8 1.4-.8 0-1.4-.3-1.9-.9')`,
  presentation: `body(R(3, 3.5, 13, 9, 1.2)), line('M9.5 12.5V15M6.5 18l3-3 3 3'), line('M6 9.5l2.5-2.5 2 2L13 6.5')`,
  'sticky-note': `body('M4 4h11v7.5L11.5 15H4Z'), line('M11.5 14.8v-3.3h3.3'), line('M6.5 7.5h5')`,
  books: `body(R(4, 5, 2.5, 12, 0.6)), body(R(7.5, 4, 2.5, 13, 0.6)), body(poly([[11, 6], [13.3, 5.4], [15.8, 16.4], [13.5, 17]], 0.5, true)), line('M3.5 18.5h12')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, {
  'sticky-note': 'interface', books: 'education', boot: 'fashion', jar: 'food', taco: 'food',
  cherry: 'food', log: 'nature', tornado: 'weather', 'face-mask': 'health', 'tape-measure': 'tools', 'spirit-level': 'tools',
  brick: 'buildings', fingerprint: 'security', network: 'development', layers: 'design', list: 'interface', table: 'data',
  'pie-chart': 'data', gauge: 'data', funnel: 'data', toggle: 'interface', browser: 'interface', webcam: 'devices',
  receipt: 'commerce', 'dollar-coin': 'finance', presentation: 'business', bridge: 'buildings',
});
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { 'face-mask': 'Face Mask', 'dollar-coin': 'Coin', toggle: 'Toggle', log: 'Firewood' });
export default {};
