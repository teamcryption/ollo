import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'sports',
  icons: [
    icon('no-swimming', 'No Swimming', ['swimming prohibited', 'water', 'beach', 'prohibited', 'sign'], [line('M7 14.5c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0 2.3-1 3 0'), body(C(12, 10, 1.6)), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
