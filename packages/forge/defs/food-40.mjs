import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'food',
  icons: [
    icon('pizza-star', 'Top Pizza', ['best pizzeria', 'rated', 'favourite', 'pizza', 'pizza'], [body(poly([[3, 4.5], [16, 7.5], [6.5, 17]], 1, true)), line('M3.4 7.5 13.5 9.6'), line(D(7, 10.5) + D(9.5, 13) + D(10.5, 10.5)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('coffee-search', 'Find a Cafe', ['coffee shop search', 'cafes', 'nearby', 'coffee', 'coffee'], [body('M4 7.5h9V12a4.5 4.5 0 0 1-9 0Z'), line('M13 8.5h1a2 2 0 0 1 0 4h-1M7 3.5v2M10 3.5v2'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
  ],
};
