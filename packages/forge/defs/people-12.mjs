import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'people',
  icons: [
    icon('sippy-cup', 'Sippy Cup', ['baby cup', 'toddler', 'feeding', 'drink', 'kids'], [body('M7 10c0-1.7 1.3-3 3-3h1l1-3.5h1.5L14 7c1.7 0 3 1.3 3 3Z'), body(R(7, 11, 10, 9.5, 2.5)), line('M7 13.5H5.5v3H7M17 13.5h1.5v3H17')], { noAccent: true }),
  ],
};
