import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'finance',
  icons: [
    icon('calculator-pencil', 'Edit Calculator', ['edit', 'write', 'modify', 'calculator', 'calculator'], [body(R(4, 3.5, 11, 15, 2)), line('M6.5 6.5h6'), line(D(7, 10) + D(9.5, 10) + D(12, 10) + D(7, 13) + D(9.5, 13) + D(7, 15.5)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
