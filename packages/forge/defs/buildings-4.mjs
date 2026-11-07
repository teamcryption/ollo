import { R, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'buildings',
  icons: [
    icon('observatory', 'Observatory', ['astronomy', 'dome', 'stargazing', 'planetarium', 'telescope'], [body('M5 13.5a7 7 0 0 1 14 0Z'), body(R(4, 13.5, 16, 7, 1)), line('M10.5 20.5V17h3v3.5'), accent(L(12, 9, 12, 11.5))]),
  ],
};
