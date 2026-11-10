import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'food',
  icons: [
    icon('knife', 'Table Knife', ['cutlery', 'butter knife', 'dining', 'utensil', 'cut'], [body('M14.5 3.5c-2.5 1.5-4.5 5-4.5 9.5h4.5Z'), body(R(11.8, 14.2, 2.7, 6.3, 1.35))], { noAccent: true }),
    icon('glass-water', 'Glass of Water', ['water', 'drink', 'hydrate', 'tumbler', 'beverage'], [body(poly([[6.5, 4], [17.5, 4], [16, 20], [8, 20]], 1, true)), line('M7.2 10h9.6'), accent(D(11, 14) + D(13, 16.5))]),
    icon('pitcher', 'Pitcher', ['jug', 'water jug', 'lemonade', 'pour', 'serving'], [body('M7.5 4h9l-1.5 3.5c1.5 1.3 2.5 3.2 2.5 5.5v5.5A1.5 1.5 0 0 1 16 20H8a1.5 1.5 0 0 1-1.5-1.5V13c0-2.3 1-4.2 2.5-5.5Z'), line('M17.5 10.5h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1')], { noAccent: true }),
  ],
};
