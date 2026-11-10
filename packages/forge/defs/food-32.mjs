import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'food',
  icons: [
    icon('no-alcohol', 'No Alcohol', ['alcohol prohibited', 'dry', 'no drinking', 'prohibited', 'sign'], [line('M9.5 7h5c0 3-1 4.5-2.5 4.5S9.5 10 9.5 7ZM12 11.5v5M10 16.5h4'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
