import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'food',
  icons: [
    icon('no-cooking', 'No Cooking', ['cooking prohibited', 'no stoves', 'kitchen', 'prohibited', 'sign'], [body(C(10.5, 12.5, 3)), line('M13.5 12.5H18'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
    icon('no-food', 'No Food', ['no eating', 'food prohibited', 'snacks', 'prohibited', 'sign'], [line('M9.5 7.5v9M8.3 7.5v3a1.2 1.2 0 0 0 2.4 0v-3M14.5 7.5c-1 0-1.5 1.5-1.5 3.5h1.5v5.5'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
