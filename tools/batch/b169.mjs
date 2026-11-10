import { B } from './mods.mjs';
Object.assign(B, {
  pumpkin: `line('M9.5 6V3.8l1.5-.6'), body('M9.5 6.3c-1-.6-2.2-.8-3.3-.6C4.2 6.1 3 8.2 3 11.2s1.6 6 4.2 6.3c.9.1 1.6-.2 2.3-.5.7.3 1.4.6 2.3.5 2.6-.3 4.2-3.3 4.2-6.3S14.8 6.1 12.8 5.7c-1.1-.2-2.3 0-3.3.6Z'), line('M7.2 6.4c-1.2 3-1.2 7.8 0 10.8M11.8 6.4c1.2 3 1.2 7.8 0 10.8')`,
  watermelon: `body('M3 6.5h13a6.5 6.5 0 0 1-13 0Z'), line(D(7, 9) + D(9.5, 10.8) + D(12, 9))`,
  bread: `body('M5 17.5V9.3a3 3 0 0 1-.5-5.3c.6-.3 1.3-.5 2-.5h6c.7 0 1.4.2 2 .5a3 3 0 0 1-.5 5.3v8.2Z'), line('M7.5 8.5h4')`,
  cheese: `body(poly([[3.5, 9], [13.5, 4.5], [15.5, 9], [15.5, 16.5], [3.5, 16.5]], 0.8, true)), line(C(7.3, 12.6, 1.3)), line(D(11, 11.5))`,
  bowl: `line('M7.5 3.5c-.8 1 .8 2 0 3M11.5 3.5c-.8 1 .8 2 0 3'), body('M3 9h13a6.5 6.5 0 0 1-13 0Z'), line('M7 17.8h5')`,
  necktie: `body(poly([[8, 3.5], [11, 3.5], [10.6, 6], [8.4, 6]], 0.5, true)), body(poly([[8.3, 7.2], [10.7, 7.2], [12.5, 15], [9.5, 18], [6.5, 15]], 0.6, true))`,
  ladder: `line('M6 3.5v15M13 3.5v15'), line('M6.2 7h6.6M6.2 11h6.6M6.2 15h6.6')`,
  castle: `body(poly([[3.5, 18], [3.5, 5.5], [6, 5.5], [6, 7.5], [8.2, 7.5], [8.2, 5.5], [10.8, 5.5], [10.8, 7.5], [13, 7.5], [13, 5.5], [15.5, 5.5], [15.5, 18]], 0.5, true)), line('M8 17.8V15a1.5 1.5 0 0 1 3 0v2.8')`,
  pine: `body(poly([[9.5, 3], [14.5, 9.5], [12, 9.5], [15.5, 15], [3.5, 15], [7, 9.5], [4.5, 9.5]], 0.7, true)), line('M9.5 15.2v3')`,
  snowman: `body(C(9.5, 6, 2.6)), body(C(9.5, 13.6, 4.4)), line(D(9.5, 12) + D(9.5, 15))`,
  ghost: `body('M4.5 9.5a5 5 0 0 1 10 0v8.5l-1.7-1.3-1.6 1.3-1.7-1.3-1.7 1.3-1.6-1.3-1.7 1.3Z'), line(D(7.8, 9.5) + D(11.2, 9.5))`,
  snail: `body(C(10.5, 9.8, 4.6)), line('M10.5 9.8a1.6 1.6 0 1 1 1.6 1.6'), line('M3 16.2h12.5'), line('M4.5 16V12.6l-1-2M4.5 12.6l1.2-1.9')`,
  'paint-roller': `body(R(3.5, 3.5, 11, 4.5, 1.5)), line('M14.7 5.8h1.3v4H9.5v2.5'), body(R(8.3, 12.5, 2.4, 6, 1))`,
  clapperboard: `body(rotateD(R(3.5, 5, 12, 2.6, 0.6), -14, 3.5, 7.6)), body(R(3.5, 8.8, 12, 8.7, 1.5)), line('M3.7 11.6h11.6')`,
  popcorn: `body('M4.6 8.6a2 2 0 0 1 1.7-3 2.3 2.3 0 0 1 4.3-1.2 2.3 2.3 0 0 1 3.7 1.4 1.8 1.8 0 0 1 .1 2.8Z'), body(poly([[4.5, 9.4], [14.5, 9.4], [13, 18], [6, 18]], 0.6, true)), line('M8 9.6l.4 8.2M11 9.6l-.4 8.2')`,
  joystick: `body(C(9.5, 5.8, 2.5)), line('M9.5 8.5v4.8'), body(R(3.5, 13.5, 12, 4.5, 1.5)), line('M5.8 15.75h1')`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, {
  pumpkin: 'food', watermelon: 'food', bread: 'food', cheese: 'food', bowl: 'food', necktie: 'fashion', ladder: 'tools', lighthouse: 'buildings',
  castle: 'buildings', pine: 'nature', snowman: 'celebration', ghost: 'celebration', bee: 'animals', snail: 'animals', 'paint-roller': 'design',
  clapperboard: 'media', popcorn: 'food', joystick: 'gaming',
});
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { pine: 'Pine Tree', bowl: 'Soup', necktie: 'Tie', clapperboard: 'Clapperboard' });
export default {};
