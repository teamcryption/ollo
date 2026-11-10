import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'security',
  icons: [
    icon('skeleton-key', 'Skeleton Key', ['old key', 'vintage key', 'master key', 'unlock', 'antique'], [line(C(6.5, 12, 3)), line('M9.5 12h11M17 12v3M20 12v2.5')], { noAccent: true }),
  ],
};
