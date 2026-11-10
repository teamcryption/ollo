import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'logistics',
  icons: [
    icon('keep-dry', 'Keep Dry', ['protect from rain', 'waterproof', 'shipping label', 'parcel', 'handling'], [line('M4.5 13a7.5 7.5 0 0 1 15 0ZM12 13v5.5a1.5 1.5 0 0 0 3 0'), line('M8 3.5V5M16 3.5V5')], { noAccent: true }),
  ],
};
