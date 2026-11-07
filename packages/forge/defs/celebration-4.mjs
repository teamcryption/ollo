import { C, poly } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'celebration',
  icons: [
    icon('cupcake', 'Cupcake', ['muffin', 'birthday', 'dessert', 'treat', 'bakery'], [body(poly([[6.5, 13], [17.5, 13], [16, 20.5], [8, 20.5]], 0.5, true)), line('M10 13.5l.5 6.5M14 13.5l-.5 6.5'), body('M5.5 13a2 2 0 0 1 .5-2.5 6 2.5 0 0 1 12 0 2 2 0 0 1 .5 2.5Z'), accent(C(12, 4.5, 1.2))]),
  ],
};
