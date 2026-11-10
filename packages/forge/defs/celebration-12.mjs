import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, star, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'celebration',
  icons: [
    icon('rabbit-hat', 'Magic Hat', ['magician', 'rabbit', 'trick', 'show', 'top hat'], [body(rotateD(E(9.8, 6.5, 1.3, 3.3), -12, 9.8, 6.5)), body(rotateD(E(14.2, 6.5, 1.3, 3.3), 12, 14.2, 6.5)), body(R(6.5, 9.5, 11, 8, 1), { cover: true }), body(R(3.5, 17.5, 17, 3, 1.5)), line('M6.7 14h10.6')], { noAccent: true }),
  ],
};
