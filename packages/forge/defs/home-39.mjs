import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'home',
  icons: [
    icon('water-search', 'Leak Detection', ['find leak', 'water inspection', 'plumbing', 'water', 'water'], [body('M9.5 3.5c2.5 3 4.5 5.5 4.5 8.3a4.5 4.5 0 0 1-9 0c0-2.8 2-5.3 4.5-8.3Z'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
  ],
};
