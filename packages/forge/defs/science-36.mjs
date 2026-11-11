import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'science',
  icons: [
    icon('petri-dish-pencil', 'Edit Petri Dish', ['edit', 'write', 'modify', 'petri dish', 'petri-dish'], [line(E(9.5, 10, 6.5, 3)), body('M3 10v3c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3v-3'), line(D(7.5, 9.5) + D(10.5, 10.6) + D(12, 9.2)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('beaker-pencil', 'Edit Beaker', ['edit', 'write', 'modify', 'beaker', 'beaker'], [line('M5 3.5h9'), body('M6 3.7h7V16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2Z'), line('M6.2 10h3M6.2 13h2'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
