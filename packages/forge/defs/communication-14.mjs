import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'communication',
  icons: [
    icon('postmark', 'Postmark', ['postage', 'stamp', 'mail', 'cancelled', 'letter'], [line(C(8.5, 12, 4.5)), line('M14 9c1.2-1 2.3-1 3.5 0s2.3 1 3 .5M14 12c1.2-1 2.3-1 3.5 0s2.3 1 3 .5M14 15c1.2-1 2.3-1 3.5 0s2.3 1 3 .5')], { noAccent: true }),
  ],
};
