import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E } from '../src/geo.mjs';

export default {
  category: 'home',
  icons: [
    icon('pacifier', 'Pacifier', ['dummy', 'soother', 'baby', 'infant', 'nursery'], [body(E(12, 6, 2, 2.6)), body('M4.5 11c0-1.5 1.5-2.5 3-2.5h9c1.5 0 3 1 3 2.5s-1.5 2.5-3 2.5h-9c-1.5 0-3-1-3-2.5Z', { cover: true }), line(C(12, 17.3, 3.2))], { noAccent: true }),
    icon('baby-bottle', 'Baby Bottle', ['feeding bottle', 'milk', 'infant', 'formula', 'nursery'], [body('M10.5 6.5c0-2 .5-3.5 1.5-3.5s1.5 1.5 1.5 3.5Z'), body(R(8.5, 6.5, 7, 2.5, 0.8)), body(R(8, 9, 8, 11.5, 2.5)), accent('M11 12.5h2.5M11 15.5h2.5')]),
  ],
};
