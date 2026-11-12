import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'gaming',
  icons: [
    icon('building-blocks-bulb', 'Building Blocks Ideas', ['idea', 'tip', 'insight', 'building blocks', 'building-blocks'], [body(R(3, 11, 6, 6, 0.8)), body(R(10, 11, 6, 6, 0.8)), body(poly([[9.5, 3.5], [13, 9.5], [6, 9.5]], 0.6, true)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('stacking-rings-bulb', 'Stacking Rings Ideas', ['idea', 'tip', 'insight', 'stacking rings', 'stacking-rings'], [line('M9.5 3v14'), body(E(9.5, 15.5, 5, 1.6)), body(E(9.5, 12, 4, 1.4)), body(E(9.5, 8.8, 3, 1.2)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
  ],
};
