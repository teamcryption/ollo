import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'celebration',
  icons: [
    icon('stocking', 'Christmas Stocking', ['christmas', 'stocking', 'gifts', 'holiday', 'fireplace'], [body('M8 3.5h7v9.5l-4.5 5.5c-1.3 1.6-3.8 1.8-5.3.4s-1.5-3.7-.1-5.2L8 10Z'), line('M8.2 7h6.6')], { noAccent: true }),
  ],
};
