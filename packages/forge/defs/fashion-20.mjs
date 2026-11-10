import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'fashion',
  icons: [
    icon('captain-hat', 'Captain Hat', ['sailor hat', 'skipper', 'nautical', 'pilot cap', 'navy'], [body('M4.5 13c0-4 3.4-7 7.5-7s7.5 3 7.5 7Z'), body(R(4, 14, 16, 3, 1.5)), accent(star(12, 9.7, 1.4, 0.6, 5, 0.2))]),
  ],
};
