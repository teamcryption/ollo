import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'sports',
  icons: [
    icon('soccer-pencil', 'Edit Soccer', ['edit', 'write', 'modify', 'soccer', 'soccer'], [body(C(9.5, 10, 6.5)), line(poly([[9.5, 7.6], [11.8, 9.3], [10.9, 12], [8.1, 12], [7.2, 9.3]], 0.3, true)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('pool-pencil', 'Edit Pool', ['edit', 'write', 'modify', 'pool', 'pool'], [line('M6.5 3.5v8.5M11.5 3.5v8.5M6.5 6h5M6.5 9h5'), line('M3 14.5c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0 2.3-1 3.5 0'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('medal-pencil', 'Edit Medal', ['edit', 'write', 'modify', 'medal', 'medal'], [line('M6.5 3.5l2 5M12.5 3.5l-2 5'), body(C(9.5, 13, 4.5)), line(C(9.5, 13, 1.8)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
