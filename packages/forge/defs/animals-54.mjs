import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'animals',
  icons: [
    icon('spider-leaf', 'Eco Spider', ['eco', 'green', 'sustainable', 'spider', 'spider'], [body(E(9.5, 12, 3, 3.6)), body(C(9.5, 7.3, 1.8)), line('M6.6 10.5 3.5 8 2.8 5M6.5 12.5H3.5L2.5 14.5M6.8 14.3 4.5 17M12.4 10.5 15.5 8l.7-3M12.5 12.5h3l1 2M12.2 14.3l2.3 2.7'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('dragonfly-leaf', 'Eco Dragonfly', ['eco', 'green', 'sustainable', 'dragonfly', 'dragonfly'], [line('M9.5 6v12'), body(C(9.5, 4.5, 1.5)), body(E(5.5, 8, 4, 1.6)), body(E(13.5, 8, 4, 1.6)), body(E(6, 11.5, 3.5, 1.4)), body(E(13, 11.5, 3.5, 1.4)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('caterpillar-leaf', 'Eco Caterpillar', ['eco', 'green', 'sustainable', 'caterpillar', 'caterpillar'], [body(C(4.5, 13, 2)), body(C(8, 14, 2)), body(C(11.5, 13.5, 2)), body(C(14.5, 11, 2.2)), line('M14 8.8 13 6.5M15.5 8.8l1-2.3'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('rhino-moon', 'Rhino Night Mode', ['night', 'dark mode', 'sleep', 'rhino', 'rhino'], [body('M3 12c0-3 2.5-5 6-5h4l2.5-3v6.5c1 1 1 2.5 0 3.5H6c-2 0-3-.8-3-2Z'), line(D(10.5, 9.5)), line('M5.5 14v3.5M11.5 14v3.5'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
    icon('spider-moon', 'Spider Night Mode', ['night', 'dark mode', 'sleep', 'spider', 'spider'], [body(E(9.5, 12, 3, 3.6)), body(C(9.5, 7.3, 1.8)), line('M6.6 10.5 3.5 8 2.8 5M6.5 12.5H3.5L2.5 14.5M6.8 14.3 4.5 17M12.4 10.5 15.5 8l.7-3M12.5 12.5h3l1 2M12.2 14.3l2.3 2.7'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
    icon('bird-cage-moon', 'Bird Cage Night Mode', ['night', 'dark mode', 'sleep', 'bird cage', 'bird-cage'], [line('M9.5 2.5v1.5'), body('M4 17V9a5.5 5 0 0 1 11 0v8Z'), line('M7.5 4.8 7 17M11.5 4.8 12 17'), line('M3 17.5h13'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
    icon('dragonfly-moon', 'Dragonfly Night Mode', ['night', 'dark mode', 'sleep', 'dragonfly', 'dragonfly'], [line('M9.5 6v12'), body(C(9.5, 4.5, 1.5)), body(E(5.5, 8, 4, 1.6)), body(E(13.5, 8, 4, 1.6)), body(E(6, 11.5, 3.5, 1.4)), body(E(13, 11.5, 3.5, 1.4)), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
    icon('caterpillar-moon', 'Caterpillar Night Mode', ['night', 'dark mode', 'sleep', 'caterpillar', 'caterpillar'], [body(C(4.5, 13, 2)), body(C(8, 14, 2)), body(C(11.5, 13.5, 2)), body(C(14.5, 11, 2.2)), line('M14 8.8 13 6.5M15.5 8.8l1-2.3'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
  ],
};
