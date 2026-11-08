import { icon, body, accent } from '../src/dsl.mjs';
import { R, C } from '../src/geo.mjs';

export default {
  category: 'nature',
  icons: [
    icon('hay-bale', 'Hay Bale', ['hay', 'straw', 'farm', 'harvest', 'bale'], [body(R(12, 8, 8.5, 11, 2)), body(C(8.5, 13.5, 5.5), { cover: true }), accent(C(8.5, 13.5, 1.6))]),
  ],
};
