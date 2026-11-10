import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'nature',
  icons: [
    icon('mountain-pin', 'Summit Location', ['peak', 'trail head', 'hiking map', 'mountain', 'mountain'], [body(poly([[2.5, 16.5], [7.5, 7], [10, 11], [12, 8], [16.5, 16.5]], 0.8, true)), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('mountain-search', 'Find Trails', ['hiking search', 'routes', 'outdoors', 'mountain', 'mountain'], [body(poly([[2.5, 16.5], [7.5, 7], [10, 11], [12, 8], [16.5, 16.5]], 0.8, true)), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
  ],
};
