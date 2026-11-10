import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'logistics',
  icons: [
    icon('bubble-wrap', 'Bubble Wrap', ['packaging', 'protective wrap', 'fragile', 'shipping', 'padding'], [body(R(3.5, 4.5, 17, 15, 2.5)), line(C(8, 9.5, 1.6) + C(12, 9.5, 1.6) + C(16, 9.5, 1.6) + C(8, 14.5, 1.6) + C(12, 14.5, 1.6) + C(16, 14.5, 1.6))], { noAccent: true }),
  ],
};
