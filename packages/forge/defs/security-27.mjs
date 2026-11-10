import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'security',
  icons: [
    icon('eye-search', 'Search Visibility', ['search', 'find', 'lookup', 'visibility', 'eye'], [body('M2.5 10c1.8-3.2 4.2-5 7-5s5.2 1.8 7 5c-1.8 3.2-4.2 5-7 5s-5.2-1.8-7-5Z'), line(C(9.5, 10, 2)), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('eye-pin', 'Visibility Location', ['location', 'place', 'map', 'visibility', 'eye'], [body('M2.5 10c1.8-3.2 4.2-5 7-5s5.2 1.8 7 5c-1.8 3.2-4.2 5-7 5s-5.2-1.8-7-5Z'), line(C(9.5, 10, 2)), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('eye-bolt', 'Instant Visibility', ['quick', 'fast', 'instant', 'visibility', 'eye'], [body('M2.5 10c1.8-3.2 4.2-5 7-5s5.2 1.8 7 5c-1.8 3.2-4.2 5-7 5s-5.2-1.8-7-5Z'), line(C(9.5, 10, 2)), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
