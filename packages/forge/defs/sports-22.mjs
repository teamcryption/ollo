import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, star, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));


export default {
  category: 'sports',
  icons: [
    icon('golf-tee', 'Golf Tee', ['golf ball', 'tee off', 'golf', 'drive', 'course'], [body(C(12, 7, 3.5)), line(D(11, 6) + D(13, 7.5)), body(poly([[8.5, 11.5], [15.5, 11.5], [13, 13.5], [12.5, 20.5], [11.5, 20.5], [11, 13.5]], 0.5, true))], { noAccent: true }),
  ],
};
