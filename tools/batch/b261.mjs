import { B } from './mods.mjs';
const add = {
  'drive-in': [`body(R(3, 3.5, 13, 7, 0.8)), line('M5.5 10.5v3M13.5 10.5v3'), body('M4 18.5v-2l1.5-2h5l1.5 2v2Z')`, 'media', 'Drive-In'],
  'oil-rig': [`line('M9.5 3.5 6.5 10M9.5 3.5l3 6.5M7.5 7.5h4'), body(R(3, 10, 13, 2.5, 0.5)), line('M5 12.5v6M14 12.5v6'), line('M3 16h13')`, 'energy', 'Oil Rig'],
  pumpjack: [`line('M4.5 10.5 15.5 8'), body('M3 8.5c1.8-.3 3 1 3 3H3Z'), line('M8 18.5 10 9.5l2 9M4.5 11.5v7'), body(C(14, 14.5, 1.8))`, 'energy', 'Pumpjack'],
  refinery: [`body(R(3, 7, 3.5, 11.5, 1.7)), body(R(8, 4, 3, 14.5, 1.5)), body(R(12.5, 10, 3.5, 8.5, 1)), line('M6.5 12h1.5M11 14h1.5')`, 'energy', 'Refinery'],
  smokestack: [`body('M7.5 18.5 8.5 7h3l1 11.5Z'), line('M8.3 10h3.4M8 14h4'), line('M10.5 5.5c-.8-.8-.3-1.8.7-2.1')`, 'buildings', 'Smokestack'],
  'mine-cart': [`body('M3 8h13l-1.5 6.5h-10Z'), line(C(6.5, 16.5, 1.8) + C(12.5, 16.5, 1.8)), line('M5 8c1-2 2-2.5 3-1.5 1-1.5 2.5-1.5 3.5 0 1-1 2-.5 3 1.5')`, 'transport', 'Mine Cart'],
  'gantry-crane': [`line('M4 18.5V6M15 18.5V6M3 6h13'), body(R(8, 6, 3, 2.5, 0.5)), line('M9.5 8.5v4'), body(R(7, 12.5, 5, 3, 0.5))`, 'logistics', 'Gantry Crane'],
  'cruise-ship': [`body('M3 13h13l-2 4.5H5Z'), body('M5 13v-3h9v3Z'), body(R(7, 7, 5, 3, 0.5)), line('M11 7V4.5')`, 'transport', 'Cruise Ship'],
  trawler: [`body('M3 13h13l-2 4.5H5Z'), body(R(9.5, 8.5, 4, 4.5, 0.5)), line('M6 13V4.5M6 5l-3 6')`, 'transport', 'Trawler'],
  barge: [`body(R(3, 12, 13, 4.5, 1.5)), body('M4.5 12c1-2 2-3 3.5-3s2.5 1 3.5 3Z'), line('M3 18.5c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4 0')`, 'transport', 'Barge'],
  catamaran: [`line('M3 15h13'), body(R(3, 15, 5, 2.5, 1.2)), body(R(11, 15, 5, 2.5, 1.2)), line('M9.5 15V3.5'), body('M10 4l5 9.5h-5Z')`, 'transport', 'Catamaran'],
  'paddle-steamer': [`body('M3 13h13l-1.5 4H4.5Z'), line('M7 13a3 3 0 0 1 6 0'), body(R(6, 5, 1.8, 5, 0.5)), body(R(10, 5, 1.8, 5, 0.5)), line('M4.5 10h10')`, 'transport', 'Paddle Steamer'],
  'junk-boat': [`body('M3 14h13l-2 4H5Z'), body('M6 13V4.5c2 1 4 1 5 0V13Z'), line('M6 7.5h5M6 10.5h5')`, 'transport', 'Junk Boat'],
};
const cat = {}; const label = {};
for (const [k, [geo, c, l]] of Object.entries(add)) { if (B[k]) continue; B[k] = geo; cat[k] = c; label[k] = l; }
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, cat);
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, label);
export default {};
