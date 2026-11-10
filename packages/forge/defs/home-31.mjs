import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'home',
  icons: [
    icon('urn', 'Urn', ['vase', 'amphora', 'pottery', 'decor', 'antique'], [body(R(9.5, 3.5, 5, 2, 1)), body('M9 6.5h6l-.5 2.5c2 1.3 3 3.3 3 5.5 0 3-2 5.5-5.5 5.5s-5.5-2.5-5.5-5.5c0-2.2 1-4.2 3-5.5Z'), line('M7.5 10.5c-1.5 0-2.5 1-2.5 2.5M16.5 10.5c1.5 0 2.5 1 2.5 2.5')], { noAccent: true }),
    icon('bookend', 'Bookend', ['books', 'shelf', 'library', 'reading', 'organiser'], [body(poly([[13, 5], [16, 5], [16, 17.5], [20, 17.5], [20, 20.5], [13, 20.5]], 0.8, true)), body(R(4.5, 8, 3, 12.5, 0.6)), body(R(8.5, 10, 3, 10.5, 0.6))], { noAccent: true }),
  ],
};
