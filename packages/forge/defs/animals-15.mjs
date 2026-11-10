import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'animals',
  icons: [
    icon('dragonfly', 'Dragonfly', ['insect', 'bug', 'pond', 'wings', 'damselfly'], [body(rotateD(E(7.5, 9, 4, 1.5), 20, 7.5, 9)), body(rotateD(E(16.5, 9, 4, 1.5), -20, 16.5, 9)), body(rotateD(E(8, 13, 3.5, 1.3), -15, 8, 13)), body(rotateD(E(16, 13, 3.5, 1.3), 15, 16, 13)), body(R(11, 7.5, 2, 13, 1), { cover: true }), body(C(12, 5.5, 1.8), { cover: true })], { noAccent: true }),
  ],
};
