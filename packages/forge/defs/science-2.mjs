import { R, C, L, A, poly, D, E, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'science',
  icons: [
    icon('telescope', 'Telescope', ['astronomy', 'stars', 'observe', 'space', 'stargazing'], [body(rotateD(R(5, 7, 13, 5, 1.5), -25, 12, 9.5)), line(L(12, 12.5, 8, 20.5)), line(L(12, 12.5, 16, 20.5)), accent(D(4.5, 4.5))]),
    icon('petri-dish', 'Petri Dish', ['culture', 'lab', 'bacteria', 'sample', 'biology'], [line(E(12, 9.5, 8.5, 3)), body('M3.5 12.5v3c0 1.7 3.8 3 8.5 3s8.5-1.3 8.5-3v-3c0 1.7-3.8 3-8.5 3s-8.5-1.3-8.5-3Z')], { noAccent: true }),
    icon('molecule', 'Molecule', ['chemistry', 'compound', 'atoms', 'bond', 'chemical'], [body(C(7, 7, 2.5)), body(C(17, 9, 2)), body(C(10, 17, 3)), line(L(9.45, 7.49, 15.04, 8.61)), line(L(7.72, 9.39, 9.14, 14.13))], { noAccent: true }),
    icon('planet', 'Planet', ['saturn', 'space', 'astronomy', 'orbit', 'galaxy'], [body(C(12, 12, 5.5)), line(rotateD(E(12, 12, 9.3, 2.8), -20)), accent(D(19, 4.5))], { anim: 'wiggle' }),
    icon('satellite', 'Satellite', ['orbit', 'space', 'gps', 'signal', 'communication'], [body(R(3, 9.5, 6, 5, 0.6)), line(L(6, 9.7, 6, 14.3)), body(R(15, 9.5, 6, 5, 0.6)), line(L(18, 9.7, 18, 14.3)), line(L(9, 12, 10, 12)), line(L(14, 12, 15, 12)), body(R(10, 8.5, 4, 7, 1)), line(L(12, 8.5, 12, 5.5)), accent(D(12, 3.3))]),
    icon('prism', 'Prism', ['light', 'refraction', 'spectrum', 'optics', 'physics'], [body(poly([[12, 4], [19, 17], [5, 17]], 1, true)), line(L(3, 13, 8.3, 11.2)), line(L(15.7, 11, 21, 8.5)), line(L(16.3, 12, 21, 12)), line(L(16.7, 13, 21, 15.5))], { noAccent: true }),
    icon('goggles', 'Safety Goggles', ['goggles', 'lab safety', 'protection', 'eyewear'], [line(L(3, 12, 4.5, 12)), line(L(19.5, 12, 21, 12)), body(R(4.5, 8, 15, 8, 4)), line(C(8.5, 12, 2.3)), line(C(15.5, 12, 2.3))], { noAccent: true }),
  ],
};
