import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'nature',
  icons: [
    icon('mountain-star', 'Top Hike', ['best trail', 'scenic route', 'featured', 'mountain', 'mountain'], [body(poly([[2.5, 16.5], [7.5, 7], [10, 11], [12, 8], [16.5, 16.5]], 0.8, true)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('mountain-clock', 'Hike Duration', ['trail time', 'walking time', 'route length', 'mountain', 'mountain'], [body(poly([[2.5, 16.5], [7.5, 7], [10, 11], [12, 8], [16.5, 16.5]], 0.8, true)), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
  ],
};
