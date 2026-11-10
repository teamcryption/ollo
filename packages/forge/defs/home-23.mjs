import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'home',
  icons: [
    icon('spice-jar', 'Spice Jar', ['seasoning', 'shaker', 'pepper', 'herbs', 'kitchen'], [body(R(7.5, 3.5, 9, 4, 1)), line(D(10, 5.5) + D(12, 5.5) + D(14, 5.5)), body(R(6.5, 8, 11, 12.5, 2.5)), line(R(8.5, 11.5, 7, 5, 1))], { noAccent: true }),
    icon('pendant-lamp', 'Pendant Lamp', ['ceiling light', 'hanging lamp', 'lighting', 'chandelier', 'interior'], [line('M12 3v4'), body('M5 13.5a7 6.5 0 0 1 14 0Z'), accent('M10.5 16a1.5 1.5 0 0 0 3 0')]),
  ],
};
