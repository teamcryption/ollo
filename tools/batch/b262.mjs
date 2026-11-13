import { B } from './mods.mjs';
const add = {
  limousine: [`body('M3 14.5V12l1.5-1.5h2.5L8.5 9h4l1.5 1.5h2v4Z'), line(C(5.5, 15, 1.5) + C(13.5, 15, 1.5)), line('M10.5 9v1.5')`, 'transport', 'Limousine'],
  'street-sweeper': [`body('M6 14V7.5A1.5 1.5 0 0 1 7.5 6h4l2 3H16v5Z'), line(C(13, 16, 1.5)), line(C(5, 15.5, 2)), line('M3.5 18l-.5.6M5 18.4v.6M6.5 18l.5.6')`, 'transport', 'Street Sweeper'],
  'semi-truck': [`body(R(3, 6, 9, 8, 0.8)), body('M12 14V8.5h2.5L16 11v3Z'), line(C(5.5, 15.5, 1.5) + C(9, 15.5, 1.5) + C(14, 15.5, 1.5))`, 'transport', 'Semi Truck'],
  'dune-buggy': [`line('M5 11 7 6h5l2 5'), body(R(3, 11, 13, 2.5, 1)), line(C(5.5, 15.8, 2.3) + C(13.5, 15.8, 2.3))`, 'transport', 'Dune Buggy'],
  handcar: [`body(R(3, 12, 13, 3, 0.8)), line(C(5.5, 16.8, 1.5) + C(13.5, 16.8, 1.5)), line('M9.5 12V8M5 6l9 4')`, 'transport', 'Handcar'],
  trolleybus: [`body(R(3, 9, 13, 7, 1.5)), line('M5 9 8 4M7.5 9l3-5'), line('M5 11.5h9'), line(C(6, 16.8, 1.3) + C(13, 16.8, 1.3))`, 'transport', 'Trolleybus'],
  'double-decker': [`body(R(3, 4, 13, 12.5, 1.5)), line('M3 10.2h13'), line('M5 7h9M5 13h9'), line(C(6, 17.3, 1.2) + C(13, 17.3, 1.2))`, 'transport', 'Double-Decker Bus'],
  overalls: [`body('M5 8h9v10.5h-3.5V14h-2v4.5H5Z'), line('M6 8V3.5M13 8V3.5'), line(R(7.5, 9.5, 4, 2.5, 0.5))`, 'fashion', 'Overalls'],
  corset: [`body('M6 4c1.5 1 5.5 1 7 0-.5 3-1.5 5-1.5 7.5S12.5 16 13 19c-1.5-1-5.5-1-7 0 .5-3 1.5-5 1.5-7.5S6.5 7 6 4Z'), line('M8.5 7l2 1.5M10.5 7l-2 1.5M8.5 11l2 1.5M10.5 11l-2 1.5M8.5 15l2 1.5M10.5 15l-2 1.5')`, 'fashion', 'Corset'],
  fedora: [`body('M5.5 11c0-3.5 1-6 4-6s4 2.5 4 6Z'), line('M9.5 5.5v2'), body(E(9.5, 12, 6.5, 1.5)), line('M5.7 9.5h7.6')`, 'fashion', 'Fedora'],
};
const cat = {}; const label = {};
for (const [k, [geo, c, l]] of Object.entries(add)) { if (B[k]) continue; B[k] = geo; cat[k] = c; label[k] = l; }
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, cat);
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, label);
export default {};
