import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'development',
  icons: [
    icon('code-clock', 'Build Time', ['compile time', 'ci duration', 'pipeline', 'code', 'code'], [body(R(3, 4, 12, 15, 2)), line('M7.2 9 5.5 11l1.7 2M10.8 9l1.7 2-1.7 2'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('code-bolt', 'Fast Build', ['quick compile', 'hot reload', 'performance', 'code', 'code'], [body(R(3, 4, 12, 15, 2)), line('M7.2 9 5.5 11l1.7 2M10.8 9l1.7 2-1.7 2'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
