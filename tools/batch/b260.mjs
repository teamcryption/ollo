import { B } from './mods.mjs';
const add = {
  chalet: [`body(poly([[3, 10], [9.5, 3.5], [16, 10]], 0.8, true)), body(R(4.5, 10, 10, 8.5, 0.5)), line('M4.5 13h10'), line('M6.5 13v-1.8M9.5 13v-1.8M12.5 13v-1.8')`, 'buildings', 'Chalet'],
  mansion: [`body('M3 18.5V10h3V7l3.5-3.5L13 7v3h3v8.5Z'), line('M8.5 18.5V15h2v3.5'), line(D(4.8, 13) + D(14.2, 13) + D(9.5, 8))`, 'buildings', 'Mansion'],
  palace: [`body(R(3, 11, 13, 7.5, 0.5)), body('M6.5 11a3 3 0 0 1 6 0Z'), line('M9.5 8V5.5M4.5 11V7.5M14.5 11V7.5'), line('M8.5 18.5V16a1 1 0 0 1 2 0v2.5')`, 'buildings', 'Palace'],
  hangar: [`body('M3 18.5V12a6.5 6.5 0 0 1 13 0v6.5Z'), line('M6 18.5v-5h7v5'), line('M6 15.8h7')`, 'buildings', 'Hangar'],
  planetarium: [`body('M4 10.5a5.5 5.5 0 0 1 11 0Z'), body(R(3, 10.5, 13, 8, 0.5)), line('M8 18.5v-3h3v3'), line(D(9.5, 8))`, 'buildings', 'Planetarium'],
  cinema: [`body(R(3, 9, 13, 9.5, 0.5)), body(R(4.5, 4.5, 10, 4.5, 0.8)), line('M6.5 6.8h6'), line('M8 18.5v-4h3v4')`, 'buildings', 'Cinema'],
  'gas-station': [`body(R(3, 4, 13, 3, 0.8)), line('M5 7v11.5M14 7v11.5'), body(R(7.5, 10, 4, 8.5, 1)), line('M8.5 12h2')`, 'transport', 'Gas Station'],
  guardhouse: [`line('M3 6.5h7'), body(R(3.5, 7, 6, 11.5, 0.5)), line(R(5, 9, 3, 3, 0.5)), line('M9.5 13H16')`, 'security', 'Guardhouse'],
  treehouse: [`line('M9.5 18.5V12'), body(R(5.5, 7, 8, 5, 0.5)), line('M4.5 7l5-3.5 5 3.5'), line('M5.5 12v6.5M7.5 12v6.5M5.5 15h2')`, 'buildings', 'Treehouse'],
  shed: [`body(poly([[3, 9], [16, 6], [16, 18.5], [3, 18.5]], 0.8, true)), line('M6 18.5V12h4v6.5'), line(D(9, 15.3))`, 'buildings', 'Shed'],
  outhouse: [`body(poly([[4.5, 7], [9.5, 3.5], [14.5, 7], [14.5, 18.5], [4.5, 18.5]], 0.8, true)), line('M10.5 9.3a1.6 1.6 0 1 0 0 2.6 1.9 1.9 0 0 1 0-2.6Z'), line('M7 18.5V14')`, 'buildings', 'Outhouse'],
  'advertising-column': [`body('M5 6l4.5-2.5L14 6Z'), body(R(6, 6, 7, 12.5, 1)), line(R(7.5, 9, 4, 5, 0.5))`, 'buildings', 'Advertising Column'],
  'subway-entrance': [`body(R(3, 3.5, 13, 4.5, 1)), line('M6.5 6.8V4.8l1.5 1.5 1.5-1.5v2'), line('M3 18.5h3v-2.5h3v-2.5h3V11h4')`, 'transport', 'Subway Entrance'],
  boathouse: [`body(poly([[3, 10], [9.5, 4.5], [16, 10], [16, 15], [3, 15]], 0.8, true)), line('M7 15v-3a2.5 2.5 0 0 1 5 0v3'), line('M3 18c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4 0')`, 'buildings', 'Boathouse'],
  cathedral: [`body('M3 18.5V8l2-4.5L7 8v2h5V8l2-4.5L16 8v10.5Z'), line(C(9.5, 13.5, 1.8)), line('M8 18.5v-1.5h3v1.5')`, 'buildings', 'Cathedral'],
  houseboat: [`body('M3 14h13l-1.5 3.5h-10Z'), body(poly([[5, 14], [5, 9], [9, 6], [13, 9], [13, 14]], 0.5, true)), line(R(7.5, 10, 3, 2.5, 0.4))`, 'transport', 'Houseboat'],
  'stilt-house': [`body(R(4.5, 8, 10, 5, 0.5)), line('M3 8.5 9.5 3.5 16 8.5'), line('M5.5 13v5.5M9.5 13v5.5M13.5 13v5.5'), line('M3 16.5h13')`, 'buildings', 'Stilt House'],
  glucometer: [`body(R(4, 6, 8, 12.5, 2)), line(R(5.5, 8, 5, 3.5, 0.6)), body(R(7, 3, 2, 3, 0.3)), body('M14 3.5c1 1.3 1.6 2.3 1.6 3a1.6 1.6 0 0 1-3.2 0c0-.7.6-1.7 1.6-3Z')`, 'health', 'Glucometer'],
};
const cat = {}; const label = {};
for (const [k, [geo, c, l]] of Object.entries(add)) { if (B[k]) continue; B[k] = geo; cat[k] = c; label[k] = l; }
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, cat);
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, label);
export default {};
