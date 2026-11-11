import { B } from './mods.mjs';
Object.assign(B, {
  'globe-stand': `line(C(9.5, 8, 5)), line('M4.5 8h10M9.5 3.2c-2 3-2 6.6 0 9.6'), line('M14.5 12a7 7 0 0 1-9.5 1.5M9.5 14.5v3M6.5 18h6')`,
  'bookshelf': `body(R(3.5, 3.5, 12, 15, 1)), line('M3.7 10.5h11.6'), line('M6 4v6.3M8 4v6.3M11 4.5l1.5 5.8M6 11v7.3M8.5 11v7.3')`,
  'test-paper': `body(R(4.5, 3.5, 10, 14.5, 1.5)), line('M7 7.5l1 1 2-2M11.5 7.5h1M7 11.5l1 1 2-2M11.5 11.5h1M7 15h5')`,
  'lab-coat': `body('M6.5 3.5h6L16 6.5V18H3V6.5Z'), line('M9.5 6v12M6.5 3.7l3 3 3-3'), line('M11.5 12.5h2.5')`,
  'molecule': `line(C(9.5, 10.5, 2.2) + C(4.5, 5, 1.6) + C(14.5, 5, 1.6) + C(9.5, 17, 1.6)), line('M5.6 6.2 8 8.8M13.4 6.2 11 8.8M9.5 12.7v2.7')`,
  'fossil': `body(C(9.5, 10.5, 6.5)), line('M9.5 10.5a1.3 1.3 0 0 1 2.6 0 2.6 2.6 0 0 1-5.2 0 3.9 3.9 0 0 1 7.8 0')`,
  'astronaut': `body(C(9.5, 7.5, 4.5)), body(R(6.8, 5.8, 5.4, 3.4, 1.4)), body('M4.5 18v-2a3.5 3.5 0 0 1 3.5-3.5h3a3.5 3.5 0 0 1 3.5 3.5v2Z')`,
  'gold-bar': `body(poly([[5, 10], [14, 10], [16, 16], [3, 16]], 0.6, true)), body(poly([[7, 4.5], [12, 4.5], [13.3, 9], [5.7, 9]], 0.6, true))`,
  'vault-door': `body(R(3, 3.5, 13, 13, 2)), line(C(9.5, 10, 3.5)), line('M9.5 6.5v7M6 10h7'), line('M5 16.7v1.5M14 16.7v1.5')`,
  'money-bag': `line('M7.5 6.5 6 3.5h7l-1.5 3'), body('M7.5 6.8h4c2.5 2 4.5 4.5 4.5 7.2 0 2.5-2 4-6.5 4S3 16.5 3 14c0-2.7 2-5.2 4.5-7.2Z'), line('M9.5 10v5.5M11 11c-.3-.6-.8-.8-1.5-.8-1 0-1.5.5-1.5 1.2 0 1.6 3 1 3 2.6 0 .7-.6 1.2-1.5 1.2-.7 0-1.2-.3-1.5-.8')`,
  'ledger': `body(R(4, 3, 11, 15, 1.5)), line('M4.2 7h10.6M4.2 10.5h10.6M4.2 14h10.6M8.5 3.2v14.6')`,
  'treasure-map': `body('M3.5 5.5 7.5 4l4 1.5 4-1.5v12.5l-4 1.5-4-1.5-4 1.5Z'), line('M10.5 9.5l2.5 2.5M13 9.5l-2.5 2.5'), line('M5.5 15c1-2 2.5-2.5 4-3')`,
  'ship-wheel': `line(C(9.5, 10.5, 4.5)), line(C(9.5, 10.5, 1.3)), line('M9.5 3.5v5.7M9.5 11.8v5.7M2.5 10.5h5.7M10.8 10.5h5.7M4.5 5.5l4 4M14.5 5.5l-4 4M4.5 15.5l4-4')`,
  'buoy': `line('M9.5 3v3'), body('M7 6.5h5l1.5 7h-8Z'), line('M6.2 10h6.6'), line('M3 16c1.3-1 2.7-1 4 0s2.7 1 4 0 2.7-1 4 0')`,
  'jet-ski': `body('M3 14h11.5l1.5-2.5H10L7.5 9H5Z'), line('M10.5 8.5 12 6h2'), line('M3 17c1.3-1 2.7-1 4 0s2.7 1 4 0 2.7-1 4 0')`,
  'container': `body(R(3, 6, 13, 9, 1)), line('M6 8v5M9 8v5M12 8v5')`,
  'cargo-ship': `line('M6 9V6.5h3V9M10 9V7h3v2'), body('M2.5 10h14l-2 5h-10Z'), line('M3 17.5c1.3-1 2.7-1 4 0s2.7 1 4 0 2.7-1 4 0')`,
  'paint-tube': `body('M6 3.5h7l-1 10H7Z'), body(R(7.5, 14, 4, 2, 0.5)), line('M8.5 16.2v2h2v-2'), line('M7 7h5')`,
  'picture-frame': `body(R(3.5, 3.5, 12, 15, 1.2)), line(R(6, 6, 7, 10, 0.5)), line('M6.3 13.5l2.3-2.5 1.8 1.8 1.2-1.3 1.2 1.5')`,
  'pen-tool': `body('M9.5 3 14 9.5 11.5 15.5h-4L5 9.5Z'), line('M9.5 3.5v5'), line(C(9.5, 9.7, 1.2)), body(R(7, 16.2, 5, 2, 0.5))`,
  'spotlight': `body(rotateD(R(5, 4, 8, 6, 1.2), 25, 9, 7)), line(rotateD('M13 5.5l2.5-1.5v6L13 8.5', 25, 9, 7)), line('M9.5 10.5V18M6.5 18h6')`,
  'record-player': `body(R(3, 4.5, 13, 12, 1.5)), line(C(8.5, 10.5, 3.5)), line(D(8.5, 10.5)), line('M13.5 6.5V12l-2 2')`,
  'equalizer': `line('M5 4v13M9.5 4v13M14 4v13'), body(R(3.5, 11, 3, 2.3, 0.7)), body(R(8, 6, 3, 2.3, 0.7)), body(R(12.5, 13, 3, 2.3, 0.7))`,
  'cake-slice': `body(poly([[3, 10], [16, 6], [16, 16], [3, 16]], 0.8, true)), line('M3.2 12.5 15.8 9.5'), line('M13 3.5v2.5')`,
  'skewer': `line('M3.5 17.5 16 5'), body(rotateD(R(5.5, 9, 3.5, 3, 0.8), -45, 7.25, 10.5)), body(rotateD(R(9, 5.5, 3.5, 3, 0.8), -45, 10.75, 7))`,
  'mountain-flag': `body(poly([[2.5, 17.5], [8, 7.5], [10.5, 11], [12.5, 8.5], [16.5, 17.5]], 0.8, true)), line('M8 7.7V3.5l2.5 1L8 5.5')`,
  acorn: `line('M9.5 3.5V5'), body('M4 9a5.5 4 0 0 1 11 0Z'), body('M5 10.2h9v1c0 3.5-2 6-4.5 7-2.5-1-4.5-3.5-4.5-7Z')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, { 'globe-stand': 'education', 'bookshelf': 'education', 'test-paper': 'education', 'lab-coat': 'science', 'molecule': 'science', 'fossil': 'science', 'astronaut': 'science', 'gold-bar': 'finance', 'vault-door': 'finance', 'money-bag': 'finance', 'ledger': 'finance', 'treasure-map': 'gaming', 'ship-wheel': 'travel', 'buoy': 'travel', 'jet-ski': 'sports', 'container': 'logistics', 'cargo-ship': 'logistics', 'paint-tube': 'design', 'picture-frame': 'design', 'pen-tool': 'design', 'spotlight': 'media', 'record-player': 'media', 'equalizer': 'media', 'cake-slice': 'food', 'skewer': 'food', 'mountain-flag': 'nature', 'acorn': 'nature' });
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { 'globe-stand': 'Globe', 'test-paper': 'Exam', 'lab-coat': 'Lab Coat', 'vault-door': 'Vault', 'ledger': 'Ledger', 'container': 'Shipping Container', 'pen-tool': 'Pen Tool', 'equalizer': 'Equalizer', 'mountain-flag': 'Summit' });
export default {};
