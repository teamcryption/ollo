import { B } from './mods.mjs';
const hex = Array.from({ length: 6 }, (_, k) => [9.5 + 6.3 * Math.cos((Math.PI / 3) * k), 10.5 + 6.3 * Math.sin((Math.PI / 3) * k)].map((v) => Math.round(v * 100) / 100));
Object.assign(B, {
  comet: `line('M9.7 9.4 3.5 15.6M11 11 6.3 15.7M8 8 3.3 12.7'), body(C(12, 7, 3))`,
  piano: `body(R(3, 4, 13, 12, 1.5)), line('M3.2 9h12.6'), line('M6.5 9.2v6.6M9.5 9.2v6.6M12.5 9.2v6.6')`,
  'basketball-hoop': `body(R(4, 3, 11, 7, 1)), line(R(7.5, 5.3, 4, 2.6, 0.5)), line('M6.3 11.3h6.4'), line('M7 11.5l1 5h3l1-5M9.5 11.5v5')`,
  goal: `line('M3 17.5V5.5h13v12'), line('M3.2 9.5h12.6M3.2 13.5h12.6M7.3 5.7v11.6M11.6 5.7v11.6')`,
  'baseball-cap': `body('M4 12a5.7 5.7 0 0 1 11.4 0Z'), line('M15.5 12.6H6c-1.6 0-2.8.8-3.5 2'), line(D(9.7, 6.8))`,
  skirt: `body(R(5.5, 4, 8, 2.2, 0.6)), body(poly([[6, 7.3], [13, 7.3], [16, 17.5], [3, 17.5]], 0.8, true)), line('M8.3 7.7 7.3 17M10.7 7.7l1 9.3')`,
  shorts: `body(poly([[4.5, 4], [14.5, 4], [15.5, 16.5], [11, 16.5], [9.5, 9.5], [8, 16.5], [3.5, 16.5]], 0.6, true)), line('M4.8 6.5h9.4')`,
  necklace: `line('M4.5 3.5c0 5 2.3 8.5 5 8.5s5-3.5 5-8.5'), body('M9.5 12.6l1.8 2.3-1.8 2.3-1.8-2.3Z')`,
  'nail-polish': `body(R(8, 3, 3, 6, 1)), body(R(5, 9.5, 9, 8.5, 2.5)), line('M7.5 13.6h4')`,
  comb: `body(R(3, 6, 13, 4, 1.2)), line('M4.5 10.2v4M6.5 10.2v4M8.5 10.2v4M10.5 10.2v4M12.5 10.2v4M14.5 10.2v4')`,
  barn: `body(poly([[3, 9], [5.5, 4.5], [13.5, 4.5], [16, 9], [16, 18], [3, 18]], 0.8, true)), line('M6.5 17.8V12h6v5.8M6.7 12.2l5.6 5.6M12.3 12.2l-5.6 5.6')`,
  windmill: `line('M5 3.5l9 9M14 3.5l-9 9'), body(poly([[7.6, 10.2], [11.4, 10.2], [13, 18], [6, 18]], 0.6, true)), body(C(9.5, 8, 1.3))`,
  'spray-can': `line(D(14.5, 3.5) + D(15.8, 5) + D(14.2, 6.2)), body(R(8, 3, 2.8, 2.5, 0.6)), body(R(6, 7, 7, 11, 2)), line('M6.2 11h6.6')`,
  'hex-nut': `body(poly(${JSON.stringify(hex)}, 0.8, true)), line(C(9.5, 10.5, 2.5))`,
  earbuds: `body('M6 4a2.5 2.5 0 0 1 2.5 2.5V9A2.5 2.5 0 0 1 6 11.5 2.5 2.5 0 0 1 3.5 9V6.5A2.5 2.5 0 0 1 6 4Z'), line('M7 11.3V16'), body('M13 4a2.5 2.5 0 0 1 2.5 2.5V9a2.5 2.5 0 0 1-5 0V6.5A2.5 2.5 0 0 1 13 4Z'), line('M12 11.3V16')`,
  jellyfish: `body('M3.5 10a6 6 0 0 1 12 0c-1 .8-2 .8-3 0-1 .8-2 .8-3 0-1 .8-2 .8-3 0-1 .8-2 .8-3 0Z'), line('M6.5 12c-.8 2 .8 3.5 0 6M9.5 12c-.8 2 .8 3.5 0 6M12.5 12c-.8 2 .8 3.5 0 6')`,
  shark: `body('M5 13.5c1.5-4 4.5-7.5 9-9-1 3-1.3 6-.5 9Z'), line('M3 16.5c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0 2.3-1 3.5 0')`,
  boombox: `line('M6 6V4h7v2'), body(R(3, 6, 13, 10, 2)), line(C(6.8, 11, 2) + C(12.2, 11, 2))`,
  'tennis-ball': `body(C(9.5, 10.5, 6.5)), line('M5 5.8c2.5 2.5 2.5 7 0 9.5M14 5.8c-2.5 2.5-2.5 7 0 9.5')`,
  'fire-hydrant': `line(D(9.5, 4.3)), body('M6.3 7a3.2 3.2 0 0 1 6.4 0Z'), body(R(5.5, 7.8, 8, 10.2, 1.2)), line('M5.3 11H3.5M13.7 11h1.8'), line('M4 18.6h11')`,
  'fire-extinguisher': `line('M7 4.5h4M10.5 5.5H13l1.5 2.5'), body(R(7.6, 4.8, 2.8, 2, 0.5)), body(R(6, 7.3, 6, 10.7, 2.5)), line('M6.2 11.3h5.6')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, {
  comet: 'science', piano: 'media', 'basketball-hoop': 'sports', goal: 'sports',
  'baseball-cap': 'fashion', skirt: 'fashion', shorts: 'fashion', necklace: 'fashion', 'nail-polish': 'fashion', comb: 'fashion',
  barn: 'buildings', windmill: 'buildings', 'spray-can': 'design', 'hex-nut': 'tools', earbuds: 'devices',
  jellyfish: 'animals', shark: 'animals', boombox: 'media', 'tennis-ball': 'sports', 'fire-hydrant': 'buildings', 'fire-extinguisher': 'security',
});
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { goal: 'Goal', 'hex-nut': 'Nut', comb: 'Comb' });
export default {};
