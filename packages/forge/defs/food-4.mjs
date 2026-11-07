import { E } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'food',
  icons: [
    icon('sushi', 'Sushi', ['maki', 'roll', 'japanese food', 'seaweed', 'fish'], [body('M5 9.5v6c0 2 3.1 3.5 7 3.5s7-1.5 7-3.5v-6'), line(E(12, 9.5, 7, 3.5)), accent(E(12, 9.5, 3, 1.3))]),
  ],
};
