import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'finance',
  icons: [
    icon('bank-bolt', 'Instant Transfer', ['fast payment', 'instant banking', 'quick transfer', 'bank', 'bank'], [body(poly([[9.5, 3.5], [16, 7], [3, 7]], 0.8, true)), line('M5.5 9.5v5M9.5 9.5v5M13.5 9.5v5M3 17.5h12'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
