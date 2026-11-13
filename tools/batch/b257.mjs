import { B } from './mods.mjs';
const add = {
  saddle: [`body('M3 9.5c2 0 3.5 1.5 6.5 1.5s4.5-1.5 6.5-1.5c0 2.8-2.5 4.5-6.5 4.5S3 12.3 3 9.5Z'), line('M5 9.2c0-2 .8-3.7 2.2-4.2'), line('M9.5 14v3M8 18.5h3')`, 'animals', 'Saddle'],
  sickle: [`body('M8.5 14.5c3.5-1.2 6-4 6-7.5 0-2.3-1.4-3.8-3.5-3.8 1.2 1.2 1.6 2.6 1.6 4 0 3-1.7 5.3-4.1 7.3Z'), line('M4 18.5 8 14.5')`, 'tools', 'Sickle'],
  wok: [`body('M6 10h10c0 3.6-2.2 6-5 6s-5-2.4-5-6Z'), line('M6 10.5 3 9'), line('M9 12.5h4')`, 'food', 'Wok'],
  cowbell: [`body('M7 6.5h5l2.5 10.5h-10Z'), line('M8 6.5V4.5h3v2'), line(D(9.5, 18.6))`, 'media', 'Cowbell'],
  amplifier: [`body(R(3, 5.5, 13, 13, 1.5)), line('M7.5 5.5V3.5h4v2'), line(D(6, 8) + D(8.5, 8) + D(11, 8)), line('M5.5 11.5h8M5.5 14h8M5.5 16.5h8')`, 'media', 'Amplifier'],
  'step-stool': [`body(R(4, 4, 11, 2.8, 1)), line('M5.2 6.8 3.5 18.5M13.8 6.8l1.7 11.7'), line('M4.5 12.5h10')`, 'home', 'Step Stool'],
  'fishing-lure': [`body('M4 10c2-2.5 5-3.5 8.5-3.5 1.6 0 2.7 1.1 2.7 2.5s-1.1 2.5-2.7 2.5C9 11.5 6 12.2 4 10Z'), line(D(12.8, 8.8)), line('M7.5 11.5v3a1.2 1.2 0 0 0 2.4 0M12 11.5v3a1.2 1.2 0 0 0 2.4 0')`, 'sports', 'Fishing Lure'],
  'propane-tank': [`body(R(4.5, 7, 10, 11.5, 4)), line('M7.5 7V5h4v2M8 3.5h3'), line('M4.8 12.5h9.4')`, 'home', 'Propane Tank'],
  'pruning-shears': [`line('M9.5 11 5.5 18.5M9.5 11l4 7.5'), body('M9.5 11c-1.5-2.5-1.5-5.5 0-7.5 2 1 3 3.5 2.5 5.5Z'), line('M8.3 10 6.5 6.5')`, 'tools', 'Pruning Shears'],
  'lip-balm': [`body(R(6, 9, 7, 9.5, 1.5)), body('M7 9V6.5c0-1.6 1.1-3 2.5-3s2.5 1.4 2.5 3V9Z'), line('M6.2 12h6.6')`, 'fashion', 'Lip Balm'],
  'lint-roller': [`body(R(3, 4, 13, 6, 3)), line('M5.5 7h8'), line('M9.5 10v8.5')`, 'home', 'Lint Roller'],
  'litter-box': [`body('M3 10h13l-1.5 7.5h-10Z'), line('M6 13.5h1M9 14.2h1M12 13.5h1'), line('M14 10 15.5 6')`, 'animals', 'Litter Box'],
  'meat-grinder': [`body('M6 3.5h7l-1.5 4h-4Z'), body(R(4.5, 7.5, 10, 6, 2)), line('M14.5 10.5H16M7 13.5l-.8 5h6.6l-.8-5')`, 'food', 'Meat Grinder'],
  'spray-nozzle': [`body('M4 5.5h9l2.5 1.5v2L13 10.5H9l-1.5 8h-3l1.5-8H4Z'), line('M9 12.5c1 0 2 .8 2 2')`, 'tools', 'Spray Nozzle'],
  'wax-seal': [`body(star(9.5, 10.5, 6.3, 5.4, 10, 0.8)), line(C(9.5, 10.5, 3))`, 'business', 'Wax Seal'],
  'floor-pump': [`line('M9.5 3.5V8M6.5 3.5h6'), body(R(7.5, 8, 4, 9.5, 1.5)), line('M4.5 18.5h10'), line('M11.5 14.5c2 0 3.5-1.5 3.5-4')`, 'sports', 'Floor Pump'],
  calipers: [`body(R(3, 4, 13, 3.5, 1)), body('M4 7.5h3v4L5.5 18 4 11.5Z'), body('M10 7.5h3v4L11.5 18 10 11.5Z'), line('M8.5 5.8h5')`, 'tools', 'Calipers'],
  cymbal: [`body(E(9.5, 8, 6.5, 1.8)), line('M9.5 6.2V4.5M9.5 9.8V17M9.5 17l-4 2M9.5 17l4 2')`, 'media', 'Cymbal'],
  dinghy: [`body(R(3, 10, 13, 6, 3)), line('M6 13h7'), line('M6.5 10 4.5 6M12.5 10l2 -4')`, 'transport', 'Dinghy'],
  earplugs: [`body(R(4, 4, 4, 6.5, 2)), body(R(11, 4, 4, 6.5, 2)), line('M6 10.5c0 5 7 5 7 0')`, 'health', 'Earplugs'],
  'egg-cup': [`body('M6.5 11c0-4 1.3-7 3-7s3 3 3 7Z'), body('M5 11h9c0 2.5-2 4-4.5 4S5 13.5 5 11Z'), line('M9.5 15v2.5M6.5 18.5h6')`, 'food', 'Egg Cup'],
  'face-shield': [`line('M3.5 6c3-2 9-2 12 0'), body('M4.5 7h10v6.5c0 2.5-2.2 4.5-5 4.5s-5-2-5-4.5Z'), line('M7 10v3')`, 'health', 'Face Shield'],
  'fire-blanket': [`body(R(4, 6, 11, 12, 1.5)), line('M5.5 3.5h2v2.5M11.5 3.5h2v2.5'), line('M7 12.5h5M7 15h3')`, 'security', 'Fire Blanket'],
  hubcap: [`body(C(9.5, 11, 6.5)), line('M9.5 9V4.8M11.4 10.4l4-1.3M10.7 12.6l2.4 3.4M8.3 12.6l-2.4 3.4M7.6 10.4l-4-1.3')`, 'transport', 'Hubcap'],
  'insulin-pen': [`body(R(3, 8.5, 10, 4, 1.5)), line('M13 10.5h2.5'), line('M6 8.5v4'), line(R(8.5, 9.5, 3, 2, 0.5))`, 'health', 'Insulin Pen'],
  'tent-peg': [`body('M7 4h5l-1.5 3v8.5L9.5 19l-1-3.5V7Z'), line('M12 4c2 0 3 1.5 3 3')`, 'travel', 'Tent Peg'],
  trellis: [`line('M4 19V8.5a5.5 5.5 0 0 1 11 0V19'), line('M4 12l5.5 5.5L15 12M4 17.5l5.5-5.5 5.5 5.5')`, 'nature', 'Trellis'],
  'swim-fin': [`body('M7 4h5l.5 5L16 18c-3 1.2-10 1.2-13 0l3.5-9Z'), line('M7 8h5'), line('M9.5 12v5')`, 'sports', 'Swim Fin'],
  'wet-floor-sign': [`body(poly([[6, 4], [13, 4], [16, 19], [3, 19]], 1, true)), line('M6.5 12c1-1 2-1 3 0s2 1 3 0'), line('M9.5 6.5v2.5')`, 'home', 'Wet Floor Sign'],
  shoehorn: [`body('M7 4h5c.5 3 0 5.5-1 8v6.5H8V12c-1-2.5-1.5-5-1-8Z'), line(D(9.5, 16.3))`, 'fashion', 'Shoehorn'],
  'suction-cup': [`body('M4 18c0-4 2.5-6.5 5.5-6.5S15 14 15 18Z'), line(C(9.5, 4.8, 1.5)), line('M9.5 6.3v5.2')`, 'home', 'Suction Cup'],
  't-square': [`body(R(3, 4, 3, 15, 1)), body(R(6, 9, 10, 3, 0.8)), line('M9 9v1.5M12 9v1.5M15 9v1.5')`, 'tools', 'T-Square'],
  'stud-finder': [`body(R(5, 3.5, 9, 15, 3)), line(R(7, 6, 5, 3, 0.8)), line('M9.5 12.5v1M7.5 15.5h4')`, 'tools', 'Stud Finder'],
  'nail-gun': [`body(R(3, 5, 13, 5, 2)), body('M10 10h3.5l-1 8h-3Z'), line('M4.5 10v6.5H8')`, 'tools', 'Nail Gun'],
  'shin-guard': [`body('M6 3.5h7c1 4 1 9.5-1 15H7c-2-5.5-2-11-1-15Z'), line('M6 8h7M6.5 14h6')`, 'sports', 'Shin Guard'],
  incubator: [`body('M3 11a6.5 5 0 0 1 13 0Z'), body(R(3, 11, 13, 5, 1)), line('M5 16v2.5M14 16v2.5'), line(D(8, 13.5) + D(11, 13.5))`, 'health', 'Incubator'],
};
const cat = {}; const label = {};
for (const [k, [geo, c, l]] of Object.entries(add)) { if (B[k]) continue; B[k] = geo; cat[k] = c; label[k] = l; }
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, cat);
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, label);
export default {};
