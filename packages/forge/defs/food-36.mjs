import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'food',
  icons: [
    icon('coffee-bolt', 'Energy Boost', ['caffeine', 'espresso shot', 'pick me up', 'coffee', 'coffee'], [body('M4 7.5h9V12a4.5 4.5 0 0 1-9 0Z'), line('M13 8.5h1a2 2 0 0 1 0 4h-1M7 3.5v2M10 3.5v2'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
