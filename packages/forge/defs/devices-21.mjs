import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'devices',
  icons: [
    icon('tablet-landscape', 'Tablet Landscape', ['ipad', 'landscape', 'device', 'screen', 'horizontal'], [body(R(3, 5.5, 18, 13, 2.5)), line(D(18.5, 12))], { noAccent: true }),
  ],
};
