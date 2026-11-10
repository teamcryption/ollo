import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'sports',
  icons: [
    icon('soccer-search', 'Find a Match', ['fixtures search', 'games', 'football', 'sport', 'soccer'], [body(C(9.5, 10, 6.5)), line(poly([[9.5, 7.6], [11.8, 9.3], [10.9, 12], [8.1, 12], [7.2, 9.3]], 0.3, true)), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
  ],
};
