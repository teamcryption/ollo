import { B } from './mods.mjs';
Object.assign(B, {
  cupboard: `body(R(4, 3.5, 11, 15, 1.2)), line('M9.5 3.7v14.6M8 9.5v2M11 9.5v2')`,
  bench: `line('M3 10h13M3 13h13M5 13v4M14 13v4M5 10V7M14 10V7'), line('M3 7h13')`,
  microscope: `body(R(7.5, 3.5, 3, 7.5, 0.8)), line('M5 18h9M12 18a4.5 4.5 0 0 0-1.5-7.8M9 11v2.5M7 14h4')`,
  'envelope-open': `body('M3 9l6.5-5 6.5 5v8.5H3Z'), line('M3.3 9.3l6.2 4.2 6.2-4.2')`,
  postcard: `body(R(3, 5, 13, 10, 1.5)), line('M9.5 5.2v9.6M5.5 8.5h2M5.5 11h2'), line(R(11.5, 7, 2.5, 3, 0.4))`,
  trend: `line('M3.5 15l4-4 3 3 5.5-6'), line('M12.5 8H16v3.5')`,
  candlestick: `line('M6 4v13M13 4v13'), body(R(4.5, 7, 3, 6, 0.6)), body(R(11.5, 8.5, 3, 4.5, 0.6))`,
  toaster: `body(R(3, 8, 13, 9, 2.5)), line('M6.5 8V5.5H9V8M10 8V5.5h2.5V8'), line('M5.5 12.5h4')`,
  glass: `body('M5 4h9l-1.3 13a1.2 1.2 0 0 1-1.2 1H7.5a1.2 1.2 0 0 1-1.2-1Z'), line('M5.5 8.5h8')`,
  juice: `body(R(5, 6, 9, 12, 1.2)), line('M5.2 9.5h8.6'), line('M11.5 6V3.5l2-1')`,
  basketball: `body(C(9.5, 10.5, 6.5)), line('M3 10.5h13M9.5 4v13'), line('M5 5.5c2 2.5 2 7.5 0 10M14 5.5c-2 2.5-2 7.5 0 10')`,
  password: `body(R(3, 7, 13, 7, 2)), line(D(6, 10.5) + D(9.5, 10.5) + D(13, 10.5))`,
  hashtag: `line('M7.5 4 6 17M12.5 4 11 17M4 8h12M3.5 13h12')`,
  percent: `line('M4 17 15 4'), line(C(5.5, 6, 1.8)), line(C(13.5, 15, 1.8))`,
  'service-bell': `body('M3.5 14a6 6 0 0 1 12 0Z'), body(R(2.5, 14, 14, 2.5, 1)), line('M9.5 6V4.5M8 4.5h3')`,
  crate: `body(R(3.5, 5, 12, 12, 1)), line('M3.7 5.2l11.6 11.6M3.7 16.8 15.3 5.2')`,
  stethoscope: `line('M5.5 3.5v4.5a3.5 3.5 0 0 0 7 0V3.5'), line('M9 11.5v2a3 3 0 0 0 6 0V12'), line(C(15, 10.5, 1.5))`,
  soundwave: `line('M3.5 10v1M6 7.5v6M8.5 5v11M11 7.5v6M13.5 9v3M16 10v1')`,
  whisk: `line('M9.5 11v7'), line('M9.5 11c-3-1-3.5-7 0-7.5 3.5.5 3 6.5 0 7.5M9.5 11c-1.2-1.5-1.3-5.5 0-7.5 1.3 2 1.2 6 0 7.5')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, {
  cupboard: 'home', bench: 'buildings', microscope: 'science', 'envelope-open': 'communication', postcard: 'communication',
  trend: 'finance', candlestick: 'finance', toaster: 'home', glass: 'food', juice: 'food', basketball: 'sports',
  password: 'security', hashtag: 'social', percent: 'commerce', 'service-bell': 'travel', crate: 'logistics',
  stethoscope: 'health', scooter: 'transport', soundwave: 'media', virus: 'health', chocolate: 'food', whisk: 'food',
});
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { trend: 'Growth', candlestick: 'Stock Chart', 'envelope-open': 'Open Mail', juice: 'Juice', glass: 'Drink', percent: 'Percentage', soundwave: 'Audio' });
export default {};
