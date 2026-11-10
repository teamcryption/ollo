import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'commerce',
  icons: [
    icon('basket-lock', 'Secure Basket', ['safe checkout', 'locked basket', 'payment', 'basket', 'basket'], [line('M6.5 8.5 9.5 4l3 4.5'), body(poly([[3, 8.5], [16, 8.5], [14.5, 16.5], [4.5, 16.5]], 1, true)), line('M7.5 11v3M11.5 11v3'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
  ],
};
