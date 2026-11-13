import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'commerce',
  icons: [
    icon('cart-2', 'Cart Alt', ['shopping', 'basket', 'checkout', 'buy'], [line('M3 4h2.5l2.2 10.5h10l2-7.5H6.4'), line(C(9, 18.5, 1.5)), line(C(16.5, 18.5, 1.5)), accent(L(10.5, 10.5, 15.5, 10.5))]),
    icon('cart-3', 'Cart Basket', ['shopping', 'basket', 'checkout', 'store'], [body('M3.5 9.5h17l-1.8 9a1.5 1.5 0 0 1-1.5 1.2H6.8a1.5 1.5 0 0 1-1.5-1.2Z'), line('M8 9.5 10.5 4M16 9.5 13.5 4'), accent(L(9.5, 14.5, 14.5, 14.5))]),
  ],
};
