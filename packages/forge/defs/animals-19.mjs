import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'animals',
  icons: [
    icon('no-pets', 'No Pets', ['pets prohibited', 'no dogs', 'animals', 'prohibited', 'sign'], [body(C(12, 14, 2.6)), body(C(9, 10, 1.1)), body(C(12, 8.6, 1.1)), body(C(15, 10, 1.1)), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
