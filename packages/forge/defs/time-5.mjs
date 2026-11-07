import { E, L, poly } from '../src/geo.mjs';
import { icon, body, accent } from '../src/dsl.mjs';

export default {
  category: 'time',
  icons: [
    icon('sundial', 'Sundial', ['ancient clock', 'shadow clock', 'sun time', 'garden clock'], [body(E(12, 16.5, 8.5, 3.5)), body(poly([[12, 16.5], [12, 7], [16.5, 16.5]], 0.4, true)), accent(L(6, 16.5, 10, 16.5))]),
  ],
};
