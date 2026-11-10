import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'people',
  icons: [
    icon('baby-monitor', 'Baby Monitor', ['nursery camera', 'baby cam', 'parent unit', 'infant', 'monitor'], [line('M15 8V4'), body(R(6, 8, 12, 12.5, 2.5)), line(R(8.5, 10.5, 7, 5, 1)), line(D(12, 18))], { noAccent: true }),
  ],
};
