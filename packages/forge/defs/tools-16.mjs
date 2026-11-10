import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'tools',
  icons: [
    icon('gold-pan', 'Gold Pan', ['panning', 'gold rush', 'prospecting', 'mining', 'nuggets'], [body('M3.5 11h17l-2 5.5a2 2 0 0 1-1.9 1.5H7.4a2 2 0 0 1-1.9-1.5Z'), accent(D(10, 8) + D(13.5, 7))]),
  ],
};
