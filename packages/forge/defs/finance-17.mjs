import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'finance',
  icons: [
    icon('no-cash', 'No Cash', ['cashless', 'card only', 'payments', 'prohibited', 'sign'], [body(R(7, 9, 10, 6, 1)), line(C(12, 12, 1.4)), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
    icon('no-cards', 'No Cards', ['cash only', 'cards not accepted', 'payments', 'prohibited', 'sign'], [body(R(7, 8.5, 10, 7, 1.2)), line('M7.2 11h9.6'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
