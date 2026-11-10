import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'business',
  icons: [
    icon('label-maker', 'Label Maker', ['label printer', 'labels', 'organise', 'tape label', 'office'], [body(R(5, 4, 14, 13, 2.5)), line(R(7.5, 6.5, 9, 3.5, 0.8)), line(D(9, 13) + D(12, 13) + D(15, 13)), body(R(8, 18.5, 8, 2.5, 0.8))], { noAccent: true }),
  ],
};
