import { B } from './mods.mjs';
const add = {
  peephole: [`body(R(4.5, 3.5, 10, 15.5, 1)), line(C(9.5, 8, 1.6)), line(D(12, 12.5))`, 'home', 'Peephole'],
  'mail-slot': [`body(R(3, 6, 13, 10, 1.5)), line(R(5.5, 9, 8, 2.5, 1.2)), line('M7 13.5h5')`, 'home', 'Mail Slot'],
  weathervane: [`line('M9.5 6v12.5M7 18.5h5'), line('M3.5 6h11'), body('M16 6l-2.5-2v4Z'), line('M3.5 4.5 5 6l-1.5 1.5'), line('M6.5 11h6')`, 'weather', 'Weathervane'],
  chimney: [`line('M3 17.5 16 11'), body('M7.5 7h4v6.3l-4 1.95Z'), line('M7 7h5'), line('M9.5 5.5c-1-.8-.4-1.8.6-2.2')`, 'buildings', 'Chimney'],
  'garden-gnome': [`body(poly([[9.5, 3.5], [13, 10], [6, 10]], 0.8, true)), body('M6.5 10h6v1.5c0 2.5-1.3 4-3 4.5-1.7-.5-3-2-3-4.5Z'), body(R(6, 15.5, 7, 3, 1.2))`, 'nature', 'Garden Gnome'],
  aquarium: [`body(R(3, 5, 13, 11, 1.5)), line('M3 8h13'), line('M5.5 12c1-1.3 2.5-1.3 3.5 0-1 1.3-2.5 1.3-3.5 0ZM9 12l1-1v2Z'), line(D(12.5, 10.5))`, 'animals', 'Aquarium'],
  'dog-leash': [`line(E(6, 6.5, 2.5, 3)), line('M6 9.5c0 4 6 3 6 6.5'), body(R(10.8, 15.5, 2.4, 3.5, 1))`, 'animals', 'Dog Leash'],
  'scratching-post': [`body(R(4.5, 3.5, 10, 2, 1)), body(R(7.5, 5.5, 4, 10.5, 0.5)), line('M7.5 8l4 1.5M7.5 11l4 1.5'), body(R(3, 16, 13, 2.5, 1))`, 'animals', 'Scratching Post'],
  obelisk: [`body('M8 5.5l1.5-2 1.5 2 1 11.5H7Z'), body(R(5, 17, 9, 2, 0.5)), line('M9.5 7.5v2')`, 'buildings', 'Obelisk'],
  aqueduct: [`body('M3 6h13v12.5h-1.5V12a2.25 2.25 0 0 0-4.5 0v6.5H9V12a2.25 2.25 0 0 0-4.5 0v6.5H3Z'), line('M3.5 8.5h12')`, 'buildings', 'Aqueduct'],
  portcullis: [`line('M3.5 18.5V9.5a6 6 0 0 1 12 0v9'), line('M6.5 5v13.5M9.5 3.5v15M12.5 5v13.5M3.5 10.5h12M3.5 14.5h12')`, 'buildings', 'Portcullis'],
  trebuchet: [`line('M4 18.5 8 9l4 9.5M3 18.5h11'), line('M6 11 15 4'), body(R(3.5, 11.5, 3, 3, 0.5)), line('M15 4l1 3')`, 'gaming', 'Trebuchet'],
  scythe: [`line('M5 18.5 11 4'), body('M11 4c-3 0-6 1-8 3.5 3-1 5.5-1.3 7.8-.8Z'), line('M7 13l2.5 1')`, 'tools', 'Scythe'],
  rasp: [`body(R(7.5, 3.5, 4, 11, 1)), line('M9.5 14.5v4'), line('M8.5 6l2 1M8.5 8.5l2 1M8.5 11l2 1')`, 'tools', 'Rasp'],
  'music-box': [`body(R(3, 10, 11, 8, 1)), line('M14 14h2'), line('M8 7V3.5l3 1'), body(C(7, 7, 1))`, 'media', 'Music Box'],
  'jack-in-the-box': [`body(R(3, 12, 10, 7, 1)), line('M8 12l-2-.8 4-.8-4-.8 4-.8'), body(C(8, 6, 2)), line('M13 12l3-2')`, 'gaming', 'Jack-in-the-Box'],
  'bell-tower': [`body(poly([[9.5, 3.5], [13.5, 8], [5.5, 8]], 0.5, true)), body(R(6, 8, 7, 10.5, 0.5)), line('M8 14v-2a1.5 1.5 0 0 1 3 0v2')`, 'buildings', 'Bell Tower'],
  'lifeguard-tower': [`body(R(5, 4.5, 9, 4.5, 0.5)), line('M4 4.5h11'), line('M6 9 4 18.5M13 9l2 9.5M5 14h9')`, 'travel', 'Lifeguard Tower'],
};
const cat = {}; const label = {};
for (const [k, [geo, c, l]] of Object.entries(add)) { if (B[k]) continue; B[k] = geo; cat[k] = c; label[k] = l; }
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, cat);
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, label);
export default {};
