import { C, poly } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'home',
  icons: [
    icon('house-key', 'House Key', ['home key', 'property', 'real estate', 'move in', 'rent'], [body(poly([[3.5, 12.5], [8.5, 7.5], [13.5, 12.5], [13.5, 17.5], [3.5, 17.5]], 0.8, true)), accent(C(8.5, 13.5, 1.3)), line('M13.5 15h7M18 15v3M20.5 15v2.5')]),
  ],
};
