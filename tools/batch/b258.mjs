import { B } from './mods.mjs';
const add = {
  trampoline: [`body(E(9.5, 9, 6.5, 2)), line('M4 10v6.5M15 10v6.5M9.5 11v5.5'), line(D(9.5, 4.5))`, 'sports', 'Trampoline'],
  'yo-yo': [`body(C(9.5, 13, 5)), line(C(9.5, 13, 1.5)), line('M9.5 8V3.5')`, 'gaming', 'Yo-Yo'],
  'puzzle-cube': [`body(poly([[9.5, 3.5], [16, 7], [16, 15], [9.5, 18.5], [3, 15], [3, 7]], 1, true)), line('M3 7l6.5 3.5L16 7M9.5 10.5v8'), line('M3 10.5l6.5 3.5 6.5-3.5')`, 'gaming', 'Puzzle Cube'],
  'hole-punch': [`body(R(3, 13, 13, 4.5, 1)), body('M4.5 13c0-3 2-5.5 5-6l5.5-1.5V13Z'), line(D(7, 15.3) + D(12, 15.3))`, 'business', 'Hole Punch'],
  gimbal: [`body(R(3, 3.5, 9, 4.5, 1)), line('M7.5 8v2.5H14V5.8'), body(R(11.5, 12, 4, 7, 1.5)), line('M13.5 10.5V12')`, 'media', 'Gimbal'],
  'water-jug': [`body('M5 8c0-1.5 1-2.5 2.5-2.5h4c1.5 0 2.5 1 2.5 2.5v10.5H5Z'), line('M8 5.5V3.5h3v2'), line('M5.2 11h8.6')`, 'home', 'Water Jug'],
  decanter: [`body('M8 3.5h3v4c3 1 5 3.5 5 6.5 0 3-2 5-6.5 5S3 17 3 14c0-3 2-5.5 5-6.5Z'), line('M4.5 13h10')`, 'food', 'Decanter'],
  'window-blind': [`body(R(3, 3.5, 13, 2, 1)), line('M4 8h11M4 10.5h11M4 13h11M4 15.5h11'), line('M14.5 5.5V18.5')`, 'home', 'Window Blind'],
  'pogo-stick': [`line('M9.5 3.5v15'), line('M6.5 5.5h6'), line('M6 12h7'), line('M8 14.5l3 .8-3 .8 3 .8')`, 'sports', 'Pogo Stick'],
  sandbox: [`body(R(3, 13, 13, 4.5, 1)), body('M4 13c1.5-2.5 3.5-3.5 5.5-3.5s4 1 5.5 3.5Z'), line('M12 9.5 14 4')`, 'home', 'Sandbox'],
  'butter-churn': [`body('M5 8h9l-1 10.5H6Z'), line('M9.5 8V3.5M8 3.5h3'), line('M5.3 11h8.4')`, 'food', 'Butter Churn'],
  lute: [`body('M3 16c0-4 3-7 7-7 1.5 0 2.5 1 2.5 2.5 0 4-3 7-7 7-1.5 0-2.5-1-2.5-2.5Z'), line('M11.5 10 15 5.5l1-1'), line(C(7.2, 14.3, 1.3))`, 'media', 'Lute'],
  bagpipe: [`body(E(8, 12, 5, 4)), line('M5 8.5 3.5 4M8.5 8 9 3.5M11.5 9 14 4'), line('M10 15.5l1.5 3.5')`, 'media', 'Bagpipe'],
  panpipe: [`line('M4.5 4v14.5M7 4v12.5M9.5 4v10.5M12 4v8.5M14.5 4v6.5'), line('M3.5 7h12')`, 'media', 'Panpipe'],
  sextant: [`line('M4 15a8 8 0 0 0 11 0'), line('M9.5 4 4 15M9.5 4 15 15'), body(R(8, 3, 3, 2.2, 0.6)), line('M9.5 5.2v8.3')`, 'travel', 'Sextant'],
  'geiger-counter': [`body(R(3, 9, 9, 9, 1.5)), line('M5 9V6.5h5V9'), line('M5 13.5a2.5 2.5 0 0 1 5 0'), line('M7.5 13.5l1-1.5'), line('M12 14h2l1.5-6')`, 'science', 'Geiger Counter'],
  'salad-spinner': [`body('M3 9h13l-1 7.5a2 2 0 0 1-2 1.5H6a2 2 0 0 1-2-1.5Z'), line('M9.5 9V5.5h4v2'), line('M4.5 12h10')`, 'food', 'Salad Spinner'],
  'can-opener': [`line('M6 18.5 8.5 10M13 18.5 10.5 10'), body(C(9.5, 7.5, 3)), line('M12.5 7.5H16')`, 'food', 'Can Opener'],
  cleaver: [`body('M3 5h10.5v8H5a2 2 0 0 1-2-2Z'), line('M13.5 8.5H16'), line(D(5.5, 7.5))`, 'food', 'Cleaver'],
  'soap-dish': [`body('M3 12h13c0 2.5-2 4.5-4.5 4.5h-4C5 16.5 3 14.5 3 12Z'), body(R(5, 8, 9, 4, 2)), line(C(12, 5, 1.2))`, 'home', 'Soap Dish'],
  hairbrush: [`body(C(7.5, 8, 4.5)), line('M10.5 11.5 15.5 18'), line(D(6, 7) + D(9, 7) + D(6, 9.5) + D(9, 9.5))`, 'fashion', 'Hairbrush'],
  'nail-clipper': [`line('M5 8.5 15 5.5'), body(R(3, 9.5, 13, 3, 1.5)), line(D(13.5, 11))`, 'fashion', 'Nail Clipper'],
  rickshaw: [`line('M3 10V6a3 3 0 0 1 3-3h3'), body(R(3, 10, 7, 3, 1)), line(C(6, 16, 2.5)), line('M10 12h4l1.5 4')`, 'transport', 'Rickshaw'],
  monorail: [`body(R(3, 5, 13, 7, 3)), line('M5.5 8.5h2M9 8.5h2M12.5 8.5h2'), line('M3 13.5h13'), line('M9.5 13.5v5')`, 'transport', 'Monorail'],
  blimp: [`body(E(9, 8.5, 6, 3.5)), body('M14.5 8.5 16 6v5Z'), line('M7.5 12v1.5h3V12')`, 'transport', 'Blimp'],
  tugboat: [`body('M3 12h13l-1.5 4.5h-10Z'), body(R(5.5, 7.5, 5, 4.5, 0.8)), body(R(11.5, 5, 2.2, 3.5, 0.5)), line('M3.5 18.5c1.5-1 3-1 4.5 0s3 1 4.5 0')`, 'transport', 'Tugboat'],
  'log-raft': [`body(R(3, 12, 13, 5.5, 1)), line('M6.25 12v5.5M9.5 12v5.5M12.75 12v5.5'), line('M9.5 12V3.5'), body('M10 4 14 9h-4Z')`, 'transport', 'Log Raft'],
};
const cat = {}; const label = {};
for (const [k, [geo, c, l]] of Object.entries(add)) { if (B[k]) continue; B[k] = geo; cat[k] = c; label[k] = l; }
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, cat);
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, label);
export default {};
