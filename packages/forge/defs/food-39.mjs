import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'food',
  icons: [
    icon('cake-pin', 'Bakery Nearby', ['cake shop location', 'patisserie', 'map', 'cake', 'cake'], [line('M9.5 9.5V6.5'), line(D(9.5, 4.8)), body(R(4, 10, 11, 7, 1.5)), line('M4.2 13c1.2 1 2.4 1 3.6 0s2.4-1 3.6 0 2.4 1 3.6 0'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('cake-clock', 'Order Ready Time', ['pickup time', 'cake order', 'bakery', 'cake', 'cake'], [line('M9.5 9.5V6.5'), line(D(9.5, 4.8)), body(R(4, 10, 11, 7, 1.5)), line('M4.2 13c1.2 1 2.4 1 3.6 0s2.4-1 3.6 0 2.4 1 3.6 0'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
  ],
};
