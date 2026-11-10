import { icon, body, accent } from '../src/dsl.mjs';
import { C, D, poly } from '../src/geo.mjs';

export default {
  category: 'weather',
  icons: [
    icon('snow-globe', 'Snow Globe', ['snowglobe', 'souvenir', 'winter', 'christmas', 'decoration'], [body(C(12, 10, 6.5)), body(poly([[6.5, 15.5], [17.5, 15.5], [19, 20.5], [5, 20.5]], 1, true), { cover: true }), accent(D(9.5, 8) + D(14, 7.5) + D(12, 11) + D(15, 11.5))]),
  ],
};
