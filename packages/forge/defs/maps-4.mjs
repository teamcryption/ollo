import { poly } from '../src/geo.mjs';
import { icon, body, accent } from '../src/dsl.mjs';

export default {
  category: 'maps',
  icons: [
    icon('north-arrow', 'North Arrow', ['north', 'orientation', 'map north', 'bearing', 'direction'], [body(poly([[12, 3.5], [17, 13], [12, 10.5], [7, 13]], 0.5, true)), accent('M9.5 20.5v-5l5 5v-5')]),
  ],
};
