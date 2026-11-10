import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('no-parking', 'No Parking', ['parking prohibited', 'tow away', 'sign', 'ban', 'street'], [line('M10 16.5v-9h2.5a2.5 2.5 0 0 1 0 5H10'), line('M6 6l12 12', { cover: true }), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
