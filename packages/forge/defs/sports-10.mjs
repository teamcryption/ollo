import { C, R } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'sports',
  icons: [
    icon('yoga-mat', 'Yoga Mat', ['yoga', 'exercise', 'fitness', 'stretch', 'pilates', 'mat'], [body(R(4, 16.5, 17, 3, 1.2)), body(C(8.5, 11, 4.5), { cover: true }), line(C(8.5, 11, 1.8))], { noAccent: true }),
  ],
};
