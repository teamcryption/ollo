import { B } from './mods.mjs';
Object.assign(B, {
  pear: `line('M9.5 5.5c0-1 .4-1.8 1.3-2.3'), body('M9.5 5.5c-1.8 0-2.6 1.4-2.6 3 0 1.3-.6 2-1.6 3.2C4.5 12.8 4 14 4 15c0 1.9 2.4 3 5.5 3s5.5-1.1 5.5-3c0-1-.5-2.2-1.3-3.3-1-1.2-1.6-1.9-1.6-3.2 0-1.6-.8-3-2.6-3Z')`,
  grapes: `line('M9.5 6V3.5l1.5-.5'), body(C(5.3, 8, 1.9)), body(C(9.5, 8, 1.9)), body(C(13.7, 8, 1.9)), body(C(7.4, 11.7, 1.9)), body(C(11.6, 11.7, 1.9)), body(C(9.5, 15.4, 1.9))`,
  strawberry: `line('M6.5 5 9.5 6.3 12.5 5M9.5 6.3V3.5'), body('M9.5 6.8c3.4 0 6 1.2 6 3.8 0 3.4-3.5 6.9-6 7.4-2.5-.5-6-4-6-7.4 0-2.6 2.6-3.8 6-3.8Z'), line(D(7.5, 10.3) + D(11.5, 10.3) + D(9.5, 12.8))`,
  banana: `line('M4.6 4.9 5.4 3.4'), body('M4 6.5c.5 6 4.5 10 11 10.3.6 0 .8-.7.3-1C10 13.5 7.5 10 7 5.5c-.1-.8-3-.8-3 1Z')`,
  lollipop: `body(C(9.5, 7.5, 4.5)), line('M9.5 7.5a1.5 1.5 0 0 1 3 0 3 3 0 0 1-6 0'), line('M9.5 12.3v6')`,
  soda: `line('M10.5 7.3 11.5 3.5h2.5'), line('M4.5 7.5h10'), body(poly([[5.2, 8.6], [13.8, 8.6], [12.8, 18], [6.2, 18]], 0.8, true)), line('M5.7 12h7.6')`,
  'chef-hat': `body('M5.5 13V10a3.2 3.2 0 0 1-.3-6.1A3.5 3.5 0 0 1 9.5 3a3.5 3.5 0 0 1 4.3.9A3.2 3.2 0 0 1 13.5 10v3Z'), body(R(5.5, 14.3, 8, 3.2, 0.8))`,
  owl: `body('M4.5 5l2.5 1.8h5L14.5 5v7.5a5 5 0 0 1-10 0Z'), line(C(7.5, 10, 1.6) + C(11.5, 10, 1.6)), line('M9.5 12.4v.8')`,
  volcano: `line('M8.5 5.5c-.5-1 .5-1.5 0-2.5M11 5.5c.5-1-.5-1.5 0-2.5'), body(poly([[3, 17.5], [7, 7.5], [12, 7.5], [16, 17.5]], 0.8, true)), line('M7.3 8l1.2 2.6 1-1.2 1 1.2 1.2-2.6')`,
  'palm-tree': `line('M9.5 8.5c.9 3 .9 6.3-.4 9.7'), line('M9.5 8.5C8.5 6 6.5 5 3.5 5.5M9.5 8.5c1-2.5 3-3.5 6-3M9.5 8.5C7.5 8 5.5 9 4.5 11M9.5 8.5c2-.5 4 .5 5 2.5'), line('M4.5 18.5h10')`,
  planet: `body(C(9.5, 10.5, 4.3)), line(rotateD(E(9.5, 10.5, 7, 2), -25, 9.5, 10.5))`,
  ufo: `line('M6.6 8.4a2.9 2.9 0 0 1 5.8 0'), body('M3 11.5c0-1.7 2.9-3 6.5-3s6.5 1.3 6.5 3-2.9 3-6.5 3-6.5-1.3-6.5-3Z'), line('M7 15.8l-1.5 2.7M12 15.8l1.5 2.7')`,
  brain: `body('M9.5 4.5a2.8 2.8 0 0 0-4.6 1.4A2.8 2.8 0 0 0 3.5 10.5a2.8 2.8 0 0 0 1.6 4.4 2.8 2.8 0 0 0 4.4 1.6 2.8 2.8 0 0 0 4.4-1.6 2.8 2.8 0 0 0 1.6-4.4 2.8 2.8 0 0 0-1.4-4.6 2.8 2.8 0 0 0-4.6-1.4Z'), line('M9.5 4.8v11.4'), line('M6 9.5h1.5M11.5 12.5H13')`,
  campfire: `body('M9.5 3.5c2 2 3.5 3.7 3.5 6a3.5 3.5 0 0 1-7 0c0-1.3.7-2.4 1.6-3.3.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3.2.5-4.6Z'), line('M4 18l11-3.4M4 14.6 15 18')`,
  'hot-air-balloon': `body('M9.5 3a5.5 5.5 0 0 1 5.5 5.5c0 2.6-2.3 4.5-3.5 6h-4C6.3 13 4 11.1 4 8.5A5.5 5.5 0 0 1 9.5 3Z'), line('M9.5 3.4c-1.6 2.2-1.6 8.8 0 11'), line('M7.6 14.7l.3 1.2M11.4 14.7l-.3 1.2'), body(R(7.5, 16.2, 4, 2.3, 0.6))`,
  parachute: `body('M3 10a6.5 6.5 0 0 1 13 0Z'), line('M3.4 10.3l5.6 6M15.6 10.3l-5.6 6M9.5 10.3v5.8'), line(D(9.5, 17.8))`,
  whistle: `line('M5.6 9.4 4 6'), body('M8.5 8.5h7V12h-3.4A3.8 3.8 0 1 1 8.5 8.5Z'), line(D(8.3, 12.3))`,
  speaker: `body(R(4.5, 3.5, 10, 15, 2)), line(C(9.5, 12.5, 2.8)), line(D(9.5, 6.8))`,
  cassette: `body(R(3, 5.5, 13, 10, 1.5)), line(C(7, 9.5, 1.3) + C(12, 9.5, 1.3)), line('M6 15.3l1-2.3h5l1 2.3')`,
  faucet: `line('M7 7V4.5M5 4.5h4'), body('M3.5 7h7a4 4 0 0 1 4 4v1.5h-3V11a1 1 0 0 0-1-1h-7Z'), line(D(13, 15.5))`,
  broom: `line('M15 3.5 10 9.6'), body('M8.2 8.7l3.5 2.8-2.2 6-6-4.6Z'), line('M6 14.4l1.6-2M8.2 16l1.6-2')`,
  iron: `line('M8 9V6.5h6.5V9'), body('M3 15.5c0-3.6 2.5-6.5 6-6.5h5.5v6.5Z'), line(D(6.5, 12.5))`,
  spool: `body(R(4, 3.5, 11, 2.5, 1)), body(R(4, 15.5, 11, 2.5, 1)), line('M5.5 6.2v9.1M13.5 6.2v9.1'), line('M5.8 8.6l7.4 2M5.8 11.4l7.4 2')`,
  safe: `body(R(3.5, 3.5, 12, 13, 2)), line(C(9.5, 10, 2.5)), line('M5.5 16.7v1.5M13.5 16.7v1.5'), line('M9.5 7.5v1')`,
  stamp: `body(C(9.5, 5, 1.8)), line('M9.5 6.9v2.6'), body(R(4, 9.6, 11, 4, 1.2)), line('M4 16.8h11')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, {
  pear: 'food', grapes: 'food', strawberry: 'food', banana: 'food', lollipop: 'food', soda: 'food', 'chef-hat': 'food', owl: 'animals', penguin: 'animals',
  volcano: 'nature', 'palm-tree': 'travel', planet: 'science', ufo: 'science', brain: 'health', campfire: 'travel', 'hot-air-balloon': 'travel',
  parachute: 'sports', whistle: 'sports', speaker: 'devices', cassette: 'media', faucet: 'home', broom: 'home', iron: 'home',
  spool: 'design', safe: 'finance', stamp: 'communication',
});
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { soda: 'Soda', spool: 'Thread', iron: 'Iron', stamp: 'Stamp', safe: 'Safe' });
export default {};
