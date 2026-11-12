import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'design',
  icons: [
    icon('layout-grid-bulb', 'Layout Grid Ideas', ['idea', 'tip', 'insight', 'layout grid', 'layout-grid'], [body(R(3, 3.5, 6, 6, 1)), body(R(10, 3.5, 6, 6, 1)), body(R(3, 11, 6, 6, 1)), body(R(10, 11, 6, 6, 1)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
  ],
};
