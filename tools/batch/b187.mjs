import { B } from './mods.mjs';
Object.assign(B, {
  'bird-cage': `line('M9.5 2.5v1.5'), body('M4 17V9a5.5 5 0 0 1 11 0v8Z'), line('M7.5 4.8 7 17M11.5 4.8 12 17'), line('M3 17.5h13')`,
  'dragonfly': `line('M9.5 6v12'), body(C(9.5, 4.5, 1.5)), body(E(5.5, 8, 4, 1.6)), body(E(13.5, 8, 4, 1.6)), body(E(6, 11.5, 3.5, 1.4)), body(E(13, 11.5, 3.5, 1.4))`,
  'caterpillar': `body(C(4.5, 13, 2)), body(C(8, 14, 2)), body(C(11.5, 13.5, 2)), body(C(14.5, 11, 2.2)), line('M14 8.8 13 6.5M15.5 8.8l1-2.3')`,
  'server-rack': `body(R(4.5, 3, 10, 15.5, 1.5)), line('M4.7 7.5h9.6M4.7 11.5h9.6M4.7 15h9.6'), line(D(7, 5.3) + D(7, 9.5) + D(7, 13.3))`,
  'robot-arm': `body(R(4, 15.5, 7, 2.5, 0.6)), line('M7.5 15.3V11l5-4.5'), body(C(7.5, 11, 1.4)), body(C(12.5, 6.5, 1.4)), line('M13.8 5.5 15.5 3.5M13.8 7.3l2.2.5')`,
  'circuit': `line('M3 6h5l2 2v4l2 2h4M3 15h4M10 3v3M16 6h-3'), line(C(7.5, 15, 0.01)), body(C(8.5, 15, 1.3)), body(C(12, 6, 1.3))`,
  'antenna-tower': `line('M9.5 3.5v2'), line('M9.5 5.5 6 18M9.5 5.5 13 18M7.3 13h4.4M8.3 9h2.4'), line('M5.5 4.5a5 5 0 0 0 0 4M13.5 4.5a5 5 0 0 1 0 4')`,
  'face-id': `line('M3.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2M12 3.5h2A1.5 1.5 0 0 1 15.5 5v2M15.5 14v2a1.5 1.5 0 0 1-1.5 1.5h-2M7 17.5H5A1.5 1.5 0 0 1 3.5 16v-2'), line(D(7, 8.5) + D(12, 8.5)), line('M9.5 8.5v2.5h-.7M7 13.5c1.5 1 3.5 1 5 0')`,
  'ballot-box': `body(R(3.5, 9, 12, 9, 1.2)), line('M6.5 12h6'), body(rotateD(R(7, 3.5, 5, 6, 0.6), 10, 9.5, 6.5))`,
  'siren': `line('M9.5 3v1.5M4 5.5l1 1M15 5.5l-1 1'), body('M5.5 14v-3.5a4 4 0 0 1 8 0V14Z'), body(R(3.5, 14.5, 12, 3, 0.8))`,
  'key-card': `body(R(4.5, 3, 10, 15, 1.5)), line('M8 5.5h3'), line('M7 10.5a2.5 2.5 0 0 1 5 0M7.8 13a1.7 1.7 0 0 1 3.4 0')`,
  'intercom': `body(R(4.5, 3, 10, 15, 1.5)), line(D(7.5, 6) + D(9.5, 6) + D(11.5, 6) + D(7.5, 8) + D(9.5, 8) + D(11.5, 8)), line(C(9.5, 13, 2))`,
  'safety-vest': `body('M5.5 3.5h2.5l1.5 4 1.5-4h2.5l2 3V18H3.5V6.5Z'), line('M3.7 11.5h11.6M3.7 14.5h11.6')`,
  'exit-sign': `body(R(3, 5, 13, 9, 1.5)), line(C(7.5, 7.5, 0.01)), line('M7.5 8.5v2.5l-1.5 1.5M7.5 11l1.5 1.5M6 9.5h3M11 9.5l2 1-2 1')`,
  'gift-card': `body(R(3, 5.5, 13, 9.5, 1.5)), line('M7 5.7v9.1M3.2 9.5h12.6'), line('M7 9.5c-1-2-2.5-2.3-3-1.3M7 9.5c1-2 2.5-2.3 3-1.3')`,
  'coupon': `body('M3 6h13v3a1.5 1.5 0 0 0 0 3v3H3v-3a1.5 1.5 0 0 0 0-3Z'), line('M7.5 12.5l4-4'), line(D(8, 9) + D(11, 12))`,
  'parcel-locker': `body(R(3, 3.5, 13, 15, 1.2)), line('M9.5 3.7v14.6M3.2 8.5h6.1M3.2 13.5h6.1M9.7 11h6.1'), line('M7.8 6v.5M7.8 11v.5M7.8 16v.5M14.3 6.5v.5')`,
  'scoreboard': `body(R(3, 5, 13, 9, 1.2)), line('M9.5 5.2v8.6'), line('M5.5 8v3.5M12 8h2l-2 3.5h2'), line('M6 14.2v3M13 14.2v3')`,
  'tennis-racket': `body(rotateD(E(9.5, 7.5, 4, 5), -35, 9.5, 10.5)), line(rotateD('M9.5 12.5v6', -35, 9.5, 10.5)), line(rotateD('M7.5 5v5M11.5 5v5M6 7.5h7', -35, 9.5, 10.5))`,
  'rugby-ball': `body(rotateD(E(9.5, 10.5, 7.5, 4.5), -35, 9.5, 10.5)), line(rotateD('M5.5 10.5h8M7.5 9.5v2M9.5 9.5v2M11.5 9.5v2', -35, 9.5, 10.5))`,
  'volleyball': `body(C(9.5, 10.5, 6.5)), line('M9.5 4c0 3.5 1.5 6 4.5 7.8M3.3 12c3-1.5 5.5-1.5 7.5.5M13 15.8c-2.5-1-4-3-4.5-5.5')`,
  'rain-gauge': `body('M6.5 3.5h6l-1 14.5h-4Z'), line('M7.5 7h2M7.5 10h2M7.5 13h2'), line('M5 18.5h9')`,
  'barometer': `body(C(9.5, 10.5, 6.5)), line('M9.5 10.5l3-3'), line('M5.5 11.5h1M12.5 11.5h1M9.5 6v1'), body(C(9.5, 10.5, 1))`,
  'paper-shredder': `body(R(3, 4, 13, 7, 1.5)), line('M6 7.5h7'), line('M5 11.2V17M7.5 11.2V18M10 11.2V16.5M12.5 11.2V18M14.5 11.2V17')`,
  'binder': `body(R(4.5, 3, 10, 15, 1.5)), line('M7.5 3.2v14.6'), line('M3 7h3M3 10.5h3M3 14h3')`,
  'desk': `line('M2.5 8.5h14M4 8.7V18M15 8.7V18'), body(R(9.5, 9, 5, 4, 0.6)), line('M11 11h2')`,
  'office-chair': `body(R(6, 3, 7, 7.5, 2)), body(R(4.5, 11, 10, 2.5, 1)), line('M9.5 13.7v2.5M6 18l3.5-1.8L13 18')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, { 'bird-cage': 'animals', 'dragonfly': 'animals', 'caterpillar': 'animals', 'server-rack': 'development', 'robot-arm': 'ai', 'circuit': 'development', 'antenna-tower': 'communication', 'face-id': 'security', 'ballot-box': 'business', 'siren': 'security', 'key-card': 'security', 'intercom': 'home', 'safety-vest': 'tools', 'exit-sign': 'buildings', 'gift-card': 'commerce', 'coupon': 'commerce', 'parcel-locker': 'logistics', 'scoreboard': 'sports', 'tennis-racket': 'sports', 'rugby-ball': 'sports', 'volleyball': 'sports', 'rain-gauge': 'weather', 'barometer': 'weather', 'paper-shredder': 'business', 'binder': 'business', 'desk': 'business', 'office-chair': 'business' });
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { 'face-id': 'Face ID', 'key-card': 'Key Card', 'exit-sign': 'Exit', 'rain-gauge': 'Rain Gauge', 'parcel-locker': 'Parcel Locker', 'robot-arm': 'Robot Arm', 'server-rack': 'Server Rack' });
export default {};
