import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'business',
  icons: [
    icon('flag-star', 'Featured Goal', ['key milestone', 'important target', 'priority', 'flag', 'flag'], [line('M4.5 19V4'), body('M5 4.5h9l-1.5 3 1.5 3H5Z'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
  ],
};
