import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'fashion',
  icons: [
    icon('shirt-star', 'Trending Outfit', ['popular style', 'top fashion', 'featured', 'shirt', 'shirt'], [body(poly([[6, 3.5], [13, 3.5], [16, 6.5], [14, 9], [13, 8], [13, 16.5], [6, 16.5], [6, 8], [5, 9], [3, 6.5]], 0.8, true)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('shirt-pin', 'Boutique Nearby', ['clothes shop location', 'fashion store', 'map', 'shirt', 'shirt'], [body(poly([[6, 3.5], [13, 3.5], [16, 6.5], [14, 9], [13, 8], [13, 16.5], [6, 16.5], [6, 8], [5, 9], [3, 6.5]], 0.8, true)), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
  ],
};
