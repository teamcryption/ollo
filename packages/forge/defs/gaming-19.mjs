import { icon, body } from '../src/dsl.mjs';
import { poly } from '../src/geo.mjs';

export default {
  category: 'gaming',
  icons: [
    icon('boomerang', 'Boomerang', ['throw', 'return', 'outback', 'toy', 'comeback'], [body(poly([[3.8, 6.2], [6.2, 3.8], [13.5, 12.3], [20, 12], [20.3, 15.7], [11.5, 17]], 1.6, true))], { noAccent: true }),
  ],
};
