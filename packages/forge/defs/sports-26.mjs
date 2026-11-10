import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'sports',
  icons: [
    icon('barbell', 'Barbell', ['weightlifting', 'gym', 'powerlifting', 'strength', 'weights'], [line('M3 12h1.5M10.2 12h3.6M19.5 12H21'), body(R(4.5, 6.5, 2.5, 11, 1)), body(R(8.2, 8.5, 2, 7, 1)), body(R(13.8, 8.5, 2, 7, 1)), body(R(17, 6.5, 2.5, 11, 1))], { noAccent: true }),
  ],
};
