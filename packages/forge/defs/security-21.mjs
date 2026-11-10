import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'security',
  icons: [
    icon('high-voltage', 'High Voltage', ['electric hazard', 'danger', 'shock', 'warning sign', 'electricity'], [body(poly([[12, 3.5], [21, 19.5], [3, 19.5]], 1.5, true)), accent(poly([[12.8, 9.5], [10.3, 13.6], [12.5, 13.6], [11.5, 17], [14, 12.6], [11.8, 12.6]], 0.3, true))]),
    icon('hot-surface', 'Hot Surface', ['heat warning', 'burn hazard', 'caution', 'warning sign', 'hot'], [body(poly([[12, 3.5], [21, 19.5], [3, 19.5]], 1.5, true)), accent(scaleD('M9.5 16.5c1-1.2 1-2.3 0-3.5s-1-2.3 0-3.5M12 16.5c1-1.2 1-2.3 0-3.5s-1-2.3 0-3.5M14.5 16.5c1-1.2 1-2.3 0-3.5s-1-2.3 0-3.5', 0.65, 12, 14.5))]),
  ],
};
