import { R, E, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'transport',
  icons: [
    icon('airship', 'Airship', ['blimp', 'zeppelin', 'dirigible', 'balloon', 'aircraft'], [body(E(12, 9.5, 8.5, 4.5)), line('M9 13.8 10 16M15 13.8 14 16'), body(R(9.5, 16, 5, 3, 1)), accent(L(8, 9.5, 16, 9.5))]),
  ],
};
