import { L, D, poly } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'weather',
  icons: [
    icon('icicles', 'Icicles', ['icicle', 'freeze', 'winter', 'ice', 'frost'], [line(L(3.5, 4.5, 20.5, 4.5)), body(poly([[4.5, 4.5], [8.5, 4.5], [6.5, 14]], 0.7, true)), body(poly([[10, 4.5], [14, 4.5], [12, 19.5]], 0.7, true)), body(poly([[15.5, 4.5], [19.5, 4.5], [17.5, 11.5]], 0.7, true)), accent(D(17.5, 14.8))]),
  ],
};
