import { B } from './mods.mjs';
const add = {
  'slow-cooker': [`body(R(3, 9, 13, 8.5, 3)), body('M4 9c0-2 2.5-3 5.5-3S15 7 15 9Z'), line('M9.5 6V4.5'), line(C(9.5, 13, 1.5))`, 'home', 'Slow Cooker'],
  'space-heater': [`body(R(4, 7, 11, 11.5, 1.5)), line('M6.5 10.5h6M6.5 13h6M6.5 15.5h6'), line('M7 5.5c-.5-.7.5-1.3 0-2M10 5.5c-.5-.7.5-1.3 0-2M13 5.5c-.5-.7.5-1.3 0-2')`, 'home', 'Space Heater'],
  'tower-fan': [`body(R(7, 3.5, 5, 13.5, 2.5)), line('M8.5 7v6M10.5 7v6'), body(E(9.5, 18, 4, 1))`, 'home', 'Tower Fan'],
  sideboard: [`body(R(3, 7, 13, 8.5, 1)), line('M9.5 7v8.5'), line('M7.5 10.5V12M11.5 10.5V12'), line('M4.5 15.5v3M14.5 15.5v3')`, 'home', 'Sideboard'],
  'coffee-table': [`body(R(3, 8, 13, 2.5, 1)), line('M5 10.5v6M14 10.5v6'), line('M5 14h9'), body(R(8, 4.5, 3, 3.5, 0.6))`, 'home', 'Coffee Table'],
  daybed: [`line('M3 8v10.5M16 8v10.5'), body(R(3, 11, 13, 4, 1)), line('M3 8.5h13'), body(R(4.5, 8.5, 4, 2.5, 1))`, 'home', 'Daybed'],
  recliner: [`body('M3.5 5l2.5-.7 2.7 7.2h5.3l2 3H6.5Z'), line('M7 14.5v3h6v-3')`, 'home', 'Recliner'],
  'towel-rail': [`line('M3 5h13'), line('M4 4v2M15 4v2'), body('M5 5h9v12H5Z'), line('M5 8h9M5 14.5h9')`, 'home', 'Towel Rail'],
};
const cat = {}; const label = {};
for (const [k, [geo, c, l]] of Object.entries(add)) { if (B[k]) continue; B[k] = geo; cat[k] = c; label[k] = l; }
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, cat);
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, label);
export default {};
