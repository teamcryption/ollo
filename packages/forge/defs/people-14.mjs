import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'people',
  icons: [
    icon('no-strollers', 'No Strollers', ['pushchairs prohibited', 'prams', 'baby', 'prohibited', 'sign'], [line('M8 8h2.5l1 4H16a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3Z'), line(D(9.5, 16.8) + D(14.5, 16.8)), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
