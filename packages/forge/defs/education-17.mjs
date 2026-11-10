import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'education',
  icons: [
    icon('glue-stick', 'Glue Stick', ['glue', 'craft', 'school', 'stationery', 'stick'], [body(R(8, 3.5, 8, 4.5, 1.2)), body(R(8, 9, 8, 11.5, 1.5)), line('M8.2 13h7.6')], { noAccent: true }),
  ],
};
