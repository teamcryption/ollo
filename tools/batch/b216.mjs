import { B } from './mods.mjs';
Object.assign(B, {
  bear: `body(C(9.5, 11, 5.5)), body(C(5.3, 6.2, 1.8)), body(C(13.7, 6.2, 1.8)), line(D(7.8, 10) + D(11.2, 10)), line('M8.5 13.2h2')`,
  chick: `body(C(9.5, 11, 5)), line(D(8, 9.8)), body('M11.6 10.8l2.6 1-2.6 1Z'), line('M7.5 16l-.8 2M11.5 16l.8 2')`,
  nest: `body('M3.5 12h12a6 6 0 0 1-12 0Z'), body(E(7.5, 10, 1.6, 2)), body(E(11.5, 10, 1.6, 2))`,
  arcade: `body(R(5, 3.5, 9, 15, 1.5)), line('M5.2 9.5h8.6'), line(C(8, 13, 1)), line(D(11.5, 13))`,
  'bus-stop': `line('M5 18V5h9v6H5'), line('M14 18v-7'), line('M7.5 8h4')`,
  grass: `line('M4 17c1-3 1-6 0-9M7.5 17c0-4 1.5-7 3-9M12 17c0-3 1.5-5 3.5-7'), line('M3 17.5h13')`,
  rock: `body('M4 16l2-6 4-2 5 3 1 5Z'), line('M8 12l2 1.5')`,
  trowel: `body(poly([[9.5, 4], [14, 9], [9.5, 14], [5, 9]], 0.8, true)), line('M9.5 14v4.5')`,
  escalator: `line('M3 16h3l7-8h3'), line('M3 18.5h4l7-8h2.5'), line(C(6.5, 6, 1.3))`,
  elevator: `body(R(4, 3.5, 11, 15, 1)), line('M9.5 3.7v14.6'), line('M6 9l1-1 1 1M11 8l1 1 1-1')`,
  barrel: `body(R(5, 4, 9, 14, 2)), line('M5.2 8h8.6M5.2 14h8.6')`,
  infinity: `line('M5.5 8a2.5 2.5 0 1 0 0 5c2.5 0 5.5-5 8-5a2.5 2.5 0 1 1 0 5c-2.5 0-5.5-5-8-5')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, {
  bear: 'animals', chick: 'animals', snake: 'animals', nest: 'animals', arcade: 'gaming', 'bus-stop': 'transport', grass: 'nature',
  rock: 'nature', trowel: 'tools', escalator: 'buildings', elevator: 'buildings', barrel: 'logistics', infinity: 'interface',
});
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { arcade: 'Arcade', infinity: 'Infinity' });
export default {};
