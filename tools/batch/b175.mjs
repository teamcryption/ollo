import { B } from './mods.mjs';
Object.assign(B, {
  sword: `body(rotateD('M8.6 2.8h1.8l.4 9.7H8.2Z', 45, 9.5, 10.5)), line(rotateD('M6.3 12.9h6.4', 45, 9.5, 10.5)), line(rotateD('M9.5 13.2v3.6', 45, 9.5, 10.5))`,
  'treasure-chest': `body('M3.5 9V7.5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9Z'), body(R(3.5, 10.2, 12, 7.8, 1.2)), line('M9.5 11.8v2.2')`,
  skull: `body('M9.5 3.5a6 6 0 0 1 6 6c0 2-1 3.3-2 4V16a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-2.5c-1-.7-2-2-2-4a6 6 0 0 1 6-6Z'), line(C(7.2, 9.6, 1.2) + C(11.8, 9.6, 1.2)), line('M8 14.5V16M11 14.5V16')`,
  bomb: `line('M12.3 8.2c.5-1.5 1.5-2.5 3-3'), body(C(8.5, 12.3, 5.5)), line('M6 10.2a3 3 0 0 1 2-2'), line('M16 3v1.2M17.3 4.5h-1.2')`,
  birdhouse: `body(poly([[9.5, 3], [16, 8.5], [3, 8.5]], 0.8, true)), body(R(4.5, 9.5, 10, 8.5, 1)), line(C(9.5, 12.6, 1.5))`,
  doghouse: `body(poly([[3.5, 9], [9.5, 3.5], [15.5, 9], [15.5, 18], [3.5, 18]], 0.8, true)), line('M7 17.8v-4.3a2.5 2.5 0 0 1 5 0v4.3')`,
  wheelbarrow: `line('M15.5 7.5l1-2'), body(poly([[3.5, 7.5], [15.5, 7.5], [13, 12.5], [6, 12.5]], 0.6, true)), line(C(7, 15.6, 2)), line('M12 12.7v4.5')`,
  barbecue: `line('M7.5 5.5c-.6-.8.6-1.5 0-2.3M11.5 5.5c-.6-.8.6-1.5 0-2.3'), body('M3.5 8h12a6 6 0 0 1-12 0Z'), line('M6.5 13.3 4.5 18M12.5 13.3l2 4.7M9.5 14.2V18')`,
  cookie: `body('M15.5 9.5A6.5 6.5 0 1 1 10 4a2 2 0 0 0 2.5 2.5 2 2 0 0 0 3 3Z'), line(D(7, 9) + D(9.5, 13) + D(6.5, 13.5) + D(11.5, 10.5))`,
  'fried-egg': `body('M5 6c2-2.5 6-2.5 8.5-.5s3 5.5 1 8-5 4-8 3-5-3.5-4.5-6S3.5 8 5 6Z'), line(C(9, 10, 2.2))`,
  thermos: `body(R(6.5, 3, 6, 2.5, 0.8)), body(R(6, 6.5, 7, 11.5, 2)), line('M6.2 9.5h6.6')`,
  'water-bottle': `body(R(7.5, 3, 4, 2, 0.6)), body('M7 5.8h5l1 2v9a1.2 1.2 0 0 1-1.2 1.2H7.2A1.2 1.2 0 0 1 6 16.8v-9Z'), line('M6.2 10h6.6M6.2 13.5h6.6')`,
  'qr-code': `line(R(3.5, 3.5, 5, 5, 1) + R(10.5, 3.5, 5, 5, 1) + R(3.5, 10.5, 5, 5, 1)), line(D(6, 6) + D(13, 6) + D(6, 13) + D(11.5, 11.5))`,
  ethernet: `body(R(3.5, 5, 12, 11, 2)), line('M6.5 9.5h6V13H11v1.5H8V13H6.5Z')`,
  cctv: `body(rotateD(R(3, 5, 10, 4.5, 1.2), 15, 8, 7.25)), line('M8 10.3v3.5H4')`,
  power: `line('M9.5 3.5v6'), line('M5.5 6.5a6 6 0 1 0 8 0')`,
  'paper-plane': `body(poly([[3, 9.5], [16, 3.5], [11.5, 17], [9, 11.5]], 0.6, true)), line('M9.2 11.3 15.8 3.8')`,
  archive: `body(R(3, 4, 13, 3.5, 1)), body('M4 8.7h11v8a1.3 1.3 0 0 1-1.3 1.3H5.3A1.3 1.3 0 0 1 4 16.7Z'), line('M7.5 11.5h4')`,
  road: `line('M7 3.5 4 18.5M12 3.5l3 15'), line('M9.5 4.5v2M9.5 9.5v2M9.5 14.5v2')`,
  potion: `line('M7.5 3.5h4'), line('M8 7.7V4h3v3.7'), body(C(9.5, 12.5, 5)), line('M5 12.5h9')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, {
  sword: 'gaming', 'treasure-chest': 'gaming', skull: 'celebration', bomb: 'gaming', birdhouse: 'nature', doghouse: 'animals', wheelbarrow: 'tools',
  barbecue: 'food', cookie: 'food', 'fried-egg': 'food', thermos: 'food', 'water-bottle': 'food', 'qr-code': 'commerce',
  ethernet: 'devices', cctv: 'security', power: 'interface', 'paper-plane': 'communication', archive: 'files', road: 'transport',
  potion: 'gaming',
});
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { 'qr-code': 'QR Code', cctv: 'CCTV', power: 'Power', archive: 'Archive', barbecue: 'Barbecue' });
export default {};
