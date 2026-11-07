import { R, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'commerce',
  icons: [
    icon('vending-machine', 'Vending Machine', ['snacks', 'dispenser', 'kiosk', 'drinks machine', 'automat'], [body(R(5, 3.5, 14, 17, 2)), line(R(7.5, 6, 6, 10, 1)), accent(L(16, 7, 16, 9.5)), line(L(7.5, 18, 13.5, 18))]),
  ],
};
