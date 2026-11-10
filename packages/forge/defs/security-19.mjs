import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'security',
  icons: [
    icon('dagger', 'Dagger', ['knife', 'blade', 'weapon', 'medieval', 'fantasy'], [body(poly([[12, 3.5], [13.8, 6], [13.8, 14], [10.2, 14], [10.2, 6]], 0.6, true)), body(R(7.5, 14.5, 9, 2, 1)), line('M12 16.5v4')], { noAccent: true }),
  ],
};
