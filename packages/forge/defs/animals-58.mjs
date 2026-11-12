import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'animals',
  icons: [
    icon('paw-bulb', 'Pet Ideas', ['idea', 'tip', 'insight', 'pet', 'paw'], [body(C(9.5, 12.5, 2.8)), body(C(5.5, 9, 1.3)), body(C(8.3, 6.2, 1.3)), body(C(11.7, 6.2, 1.3)), body(C(13.5, 9, 1.3)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('snail-bulb', 'Snail Ideas', ['idea', 'tip', 'insight', 'snail', 'snail'], [body(C(10.5, 9.8, 4.6)), line('M10.5 9.8a1.6 1.6 0 1 1 1.6 1.6'), line('M3 16.2h12.5'), line('M4.5 16V12.6l-1-2M4.5 12.6l1.2-1.9'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('jellyfish-bulb', 'Jellyfish Ideas', ['idea', 'tip', 'insight', 'jellyfish', 'jellyfish'], [body('M3.5 10a6 6 0 0 1 12 0c-1 .8-2 .8-3 0-1 .8-2 .8-3 0-1 .8-2 .8-3 0-1 .8-2 .8-3 0Z'), line('M6.5 12c-.8 2 .8 3.5 0 6M9.5 12c-.8 2 .8 3.5 0 6M12.5 12c-.8 2 .8 3.5 0 6'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('horseshoe-bulb', 'Horseshoe Ideas', ['idea', 'tip', 'insight', 'horseshoe', 'horseshoe'], [body('M4 16.5V9.5a5.5 5.5 0 0 1 11 0v7h-3.2v-7a2.3 2.3 0 0 0-4.6 0v7Z'), line(D(5.6, 11) + D(5.6, 14)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('octopus-bulb', 'Octopus Ideas', ['idea', 'tip', 'insight', 'octopus', 'octopus'], [body('M5 9.5a4.5 4.5 0 0 1 9 0v2H5Z'), line(D(7.8, 9) + D(11.2, 9)), line('M5.6 11.7c-.3 2.4-1.5 3.9-2.5 4.4M8 11.7c0 2.5-.5 4.5-1.5 6M11 11.7c0 2.5.5 4.5 1.5 6M13.4 11.7c.3 2.4 1.5 3.9 2.5 4.4'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('dolphin-bulb', 'Dolphin Ideas', ['idea', 'tip', 'insight', 'dolphin', 'dolphin'], [body('M3 13c2-5 6.5-8 11-7.5l-1 2c2 1 3 2.5 3 4.5l-2.5-1c-2.5 1.8-6 2.5-10.5 2Z'), line('M7.5 13.3l-1 3 2.5-1.5'), line(D(12.5, 9)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('deer-bulb', 'Deer Ideas', ['idea', 'tip', 'insight', 'deer', 'deer'], [line('M6.5 7 5 4.5M5 4.5 3.5 5M5 4.5l.5-1.5M12.5 7 14 4.5M14 4.5l1.5.5M14 4.5l-.5-1.5'), body('M6 7.5h7L12 14a2.5 2.5 0 0 1-5 0Z'), line(D(8.2, 10) + D(10.8, 10)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('spider-bulb', 'Spider Ideas', ['idea', 'tip', 'insight', 'spider', 'spider'], [body(E(9.5, 12, 3, 3.6)), body(C(9.5, 7.3, 1.8)), line('M6.6 10.5 3.5 8 2.8 5M6.5 12.5H3.5L2.5 14.5M6.8 14.3 4.5 17M12.4 10.5 15.5 8l.7-3M12.5 12.5h3l1 2M12.2 14.3l2.3 2.7'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('bird-cage-bulb', 'Bird Cage Ideas', ['idea', 'tip', 'insight', 'bird cage', 'bird-cage'], [line('M9.5 2.5v1.5'), body('M4 17V9a5.5 5 0 0 1 11 0v8Z'), line('M7.5 4.8 7 17M11.5 4.8 12 17'), line('M3 17.5h13'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
  ],
};
