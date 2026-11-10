import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'buildings',
  icons: [
    icon('water-well', 'Water Well', ['well', 'wishing well', 'village', 'water source', 'rural'], [line('M4 8.5 12 4l8 4.5M6 8.5V15M18 8.5V15M12 8.5V11'), body(R(10, 11, 4, 2.8, 0.8)), body(R(4, 15, 16, 5.5, 1.5)), line('M4.2 17.7h15.6')], { noAccent: true }),
  ],
};
