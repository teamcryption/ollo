import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'sports',
  icons: [
    icon('weight', 'Weight', ['kilogram', 'heavy', 'mass', 'gym', 'load'], [body(poly([[7.5, 9.5], [16.5, 9.5], [19.5, 20.5], [4.5, 20.5]], 1.5, true)), line('M9.5 9.5V7a2.5 2.5 0 0 1 5 0v2.5'), line('M10 15.5h4')], { noAccent: true }),
  ],
};
